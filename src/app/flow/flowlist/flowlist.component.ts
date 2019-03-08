/**********
 * Name: Flow list.component
 * Type: Angular Component
 * Description:
 *    This component display the list of flows and allow to display the detail of one selected flow.
 *    Update of an application is possible
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { IFlow, IFlowsList, IFlowModel } from '../../services/flow/interface_flow';
import { FlowService } from '../../services/flow/flow.service';
import { UiService } from '../../common/uiservice';
import { IApplication, IApplicationsList } from '../../services/interface_application';
import { ApplicationService } from '../../services/application.service';
import { PartnerService } from '../../services/partner/partner.service';
import { IPartnersList, IPartner } from '../../services/partner/interface_partner';

@Component({
  selector: 'app-flowlist',
  templateUrl: './flowlist.component.html',
  styleUrls: ['./flowlist.component.scss'],
})
export class FlowlistComponent implements OnInit {
  displayedColumns = ['flow_name', 'flow_modelName', 'source', 'target', 'id'];
  myApplicationList: IApplicationsList; // Store the list of application
  myPartnerList: IPartnersList;
  FILETYPE_LST = [
    { value: 'auto' },
    { value: 'Binary' },
    { value: 'Text' },
    { value: 'STREAM_TEXT' },
  ];
  ACTIONAT_LST = [{ value: 'NONE' }, { value: 'ERASE' }, { value: 'DELETE' }];
  FILEMODE_LST = [{ value: 'AUTODETECT' }, { value: 'BINARY' }, { value: 'ASCII' }];
  hideRequiredMarker = false;
  existingFlowModel: IFlowModel[] = this.flowService.getModelList();
  selectedModel: IFlowModel;
  dataSource = new MatTableDataSource(); // dataSource for the display of the table
  isLoadingData = true; // allow to display a spinner during the load of data
  hasError = false; // identify if there was an error during the load of data (HTTP REST Call)
  errorText = '';
  isListDisplayed = true; // allow to switch between the view of the list to the view of the detail of one element
  SelectedFlow: IFlow; // item selected for detail display
  flowForm: FormGroup; // A form is used to display the detail of the item. It is then easy to allow update.
  canModifyForm = false; // Decide if it is view only or if update is allowed
  formCssClass = 'form-view'; // which css class to use: 'form-view' for view only, 'form-edit' for update

  search = new FormControl('', []); // input field to allow filtering

  @ViewChild(MatSort) // activate sorting by column
  sort: MatSort;

  constructor(
    private applicationService: ApplicationService,
    private partnerService: PartnerService,
    private flowService: FlowService,
    private formBuilder: FormBuilder,
    public uiservice: UiService
  ) {}

  // == called from the html to apply the new filter when the filter value change
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // == Manage what to do when the user select a source application
  newSpartSelected(valueSelected: IPartner) {
    this.flowForm.get('source_partner_id').setValue(valueSelected.part_bId);
  }

  // == Manage what to do when the user select a source application
  newSappliSelected(valueSelected: IApplication) {
    this.flowForm.get('source_application_id').setValue(valueSelected.appli_bId);
    this.flowForm
      .get('source_application_product_id')
      .setValue(valueSelected.appli_product_bId);
  }
  // == Manage what to do when the user select a taregt application
  newTappliSelected(valueSelected: IApplication) {
    this.flowForm.get('target_application_id').setValue(valueSelected.appli_bId);
    this.flowForm
      .get('target_application_product_id')
      .setValue(valueSelected.appli_product_bId);
  }

  // == called from the html, Transform businessID of application or partner to name
  fromBid2Name(appliBid: string, partBid: string): string {
    let result = '';
    if (appliBid) {
      const appliObj = this.myApplicationList.applications.find(
        app => app.appli_bId === appliBid
      );
      if (appliObj) {
        result = appliObj.appli_name;
      }
    }
    if (partBid) {
      const partObj = this.myPartnerList.partners.find(
        part => part.part_bId === partBid
      );
      if (partObj) {
        result = partObj.part_name;
      }
    }
    return result;
  }

  // == called from the html to display the selected item from the list
  //  This will hide the list and show the form
  displayFlow(flow: IFlow) {
    if (flow.flow_modelName) {
      this.SelectedFlow = flow;
      this.canModifyForm = false;
      this.formCssClass = 'form-view';
      this.selectedModel = this.existingFlowModel.find(
        model => model.flow_modelName === flow.flow_modelName
      );
      // Prepare the form
      this.buildFlowForm(flow);
      this.flowForm.disable();
      // activate the display
      this.isListDisplayed = false;
    } else {
      this.uiservice.showMsg(
        `Only flow associated to flow model can be displayed `,
        'Close',
        'info'
      );
    }
  }

  // == called from the html, hide the detail view of the item and display the list
  closeFlowDisplay() {
    this.isListDisplayed = true;
  }

  // == called from the html, move the form from view only to edit
  activateEdit() {
    this.canModifyForm = true;
    this.flowForm.enable();
    this.buildFlowForm(this.SelectedFlow);
    this.formCssClass = 'form-edit';
  }

  // == called from the html, update the flow (call flow provider)
  updateFlow(flow: IFlow) {
    let flowToUpdate: IFlow;
    flowToUpdate = Object.keys(this.flowForm.value).reduce(
      (obj, key) => {
        key.charAt(0) !== '_' ? (obj[key] = this.flowForm.value[key]) : null;
        return obj;
      },
      { flow_name: '' }
    );
    //console.log(flowToUpdate);
    this.flowService.updateFlow(flowToUpdate).subscribe(
      res => {
        if (res.status == 200 || res.status == 201) {
          this.uiservice.showMsg(
            `The flow "${flowToUpdate.flow_name}" has been updated successfully`,
            'Close',
            'info'
          );
          this.isListDisplayed = true;
          this.loadFlowList();
        } else {
          this.uiservice.showMsg(
            `The flow update of "${flowToUpdate.flow_name}" has failed. status=${
              res.status
            }, message=${res.message}`,
            'Close',
            'error'
          );
        }
      },
      err => {
        this.uiservice.showMsg(
          `An error occured when trying to create the flow : ${err}`,
          'Close',
          'error'
        );
      }
    );
  }

  ngOnInit() {
    // subscribe to application provider to get the latest application list &
    // request load of the list from server if not yet in memory
    this.applicationService.currentApplicationsList.subscribe(
      data => (this.myApplicationList = data)
    );
    this.applicationService.loadApplicationList();
    // subscribe to partner provider to get the latest partner list &
    // request load of the list from server if not yet in memory
    this.partnerService.currentPartnersList.subscribe(
      data => (this.myPartnerList = data)
    );
    this.partnerService.loadPartnerList();

    // Load the list of flow
    this.loadFlowList();
  }

  // == link the sort capability to the table datasource
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // == Load the list of flows
  private loadFlowList() {
    this.isLoadingData = true;
    this.flowService.getcurrentFlowsList().subscribe(
      data => {
        this.dataSource.data = data.flows;
        this.isLoadingData = false;
      },
      err => {
        this.hasError = true;
        this.errorText = err;
        this.uiservice.showMsg(
          `An error occured when trying to call Flow API : ${err}`,
          'Close',
          'error'
        );
        this.isLoadingData = false;
      }
    );
  }

  // build the application form
  private buildFlowForm(flow: IFlow) {
    this.selectedModel = this.existingFlowModel.find(
      o => o.flow_modelName === flow.flow_modelName
    );
    this.flowForm = this.formBuilder.group({
      flow_modelName: [
        {
          value: flow.flow_modelName,
          disabled: false,
        },
      ],
      flow_bId: [
        {
          value: flow.flow_bId,
          disabled: false,
        },
      ],
      flow_name: [
        {
          value: flow.flow_name,
          disabled: false,
        },
        Validators.required,
      ],
      flow_description: [
        {
          value: flow.flow_description || '',
          disabled: !this.selectedModel.isflow_description,
        },
      ],
      protocol_pesit_flow_idf: [
        {
          value: flow.protocol_pesit_flow_idf || '',
          disabled: !this.selectedModel.isprotocol_pesit_flow_idf,
        },
        this.selectedModel.isprotocol_pesit_flow_idf ? Validators.required : null,
      ],
      contact_firstname: [
        {
          value: flow.contact_firstname || '',
          disabled: !this.selectedModel.iscontact_firstname,
        },
      ],
      contact_lastname: [
        {
          value: flow.contact_lastname || '',
          disabled: !this.selectedModel.iscontact_lastname,
        },
      ],
      contact_email: [
        {
          value: flow.contact_email || '',
          disabled: !this.selectedModel.iscontact_email,
        },
      ],
      contact_phone: [
        {
          value: flow.contact_phone || '',
          disabled: !this.selectedModel.iscontact_phone,
        },
      ],
      contact_jobtitle: [
        {
          value: flow.contact_jobtitle || '',
          disabled: !this.selectedModel.iscontact_jobtitle,
        },
      ],
      _selectedSourceApplication: [
        {
          value:
            (flow.source_application_id &&
              this.myApplicationList.applications.find(
                app => app.appli_bId === flow.source_application_id
              )) ||
            '',
          disabled: !this.selectedModel.issource_application_id,
        },
        this.selectedModel.issource_application_id ? Validators.required : null,
      ],
      source_application_id: [
        {
          value: flow.source_application_id || '',
          disabled: !this.selectedModel.issource_application_id,
        },
      ],
      source_application_product_id: [
        {
          value: flow.source_application_product_id || '',
          disabled: !this.selectedModel.issource_application_product_id,
        },
      ],
      source_prop_file_file_type: [
        {
          value: flow.source_prop_file_file_type || 'Text',
          disabled: !this.selectedModel.issource_prop_file_file_type,
        },
      ],
      source_prop_transfer_action_after_transfer: [
        {
          value: flow.source_prop_transfer_action_after_transfer || 'DELETE',
          disabled: !this.selectedModel.issource_prop_transfer_action_after_transfer,
        },
      ],
      _selectedTargetApplication: [
        {
          value:
            (flow.target_application_id &&
              this.myApplicationList.applications.find(
                app => app.appli_bId === flow.target_application_id
              )) ||
            '',
          disabled: !this.selectedModel.istarget_application_id,
        },
        this.selectedModel.istarget_application_id ? Validators.required : null,
      ],
      target_application_id: [
        {
          value: flow.target_application_id || '',
          disabled: !this.selectedModel.istarget_application_id,
        },
      ],
      target_application_product_id: [
        {
          value: flow.target_application_product_id || '',
          disabled: !this.selectedModel.istarget_application_product_id,
        },
      ],
      target_prop_file_file_type: [
        {
          value: flow.target_prop_file_file_type || 'Text',
          disabled: !this.selectedModel.istarget_prop_file_file_type,
        },
      ],
      target_prop_file_target_file_name: [
        {
          value: flow.target_prop_file_target_file_name || '',
          disabled: !this.selectedModel.istarget_prop_file_target_file_name,
        },
      ],
      _selectedsource_partner_id: [
        {
          value: '',
          disabled: !this.selectedModel.issource_partner_id,
        },
        this.selectedModel.issource_partner_id ? Validators.required : null,
      ],
      source_partner_id: [
        {
          value: (flow && flow.source_partner_id) || '',
          disabled: !this.selectedModel.issource_partner_id,
        },
      ],
      source_protocol_transfer_mode: [
        {
          value: (flow && flow.source_protocol_transfer_mode) || 'ASCII',
          disabled: !this.selectedModel.issource_protocol_transfer_mode,
        },
      ],
      routing_base_directory: [
        {
          value: (flow && flow.routing_base_directory) || '',
          disabled: !this.selectedModel.isrouting_base_directory,
        },
        this.selectedModel.isrouting_base_directory ? Validators.required : null,
      ],
    });
  }
}
