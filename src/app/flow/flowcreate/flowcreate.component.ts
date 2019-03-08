/**********
 * Name: flowcreate.component
 * Type: Angular Component
 * Description:
 *    This component allow to create a new flow based on a selected model
 *
 */
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { UiService } from '../../common/uiservice';
import { FlowService } from '../../services/flow/flow.service';
import { IFlowModel, IFlow } from '../../services/flow/interface_flow';
import { IApplication, IApplicationsList } from '../../services/interface_application';
import { ApplicationService } from '../../services/application.service';
import { PartnerService } from '../../services/partner/partner.service';
import { IPartnersList, IPartner } from '../../services/partner/interface_partner';

@Component({
  selector: 'app-flowcreate',
  templateUrl: './flowcreate.component.html',
  styleUrls: ['./flowcreate.component.scss'],
})
export class FlowcreateComponent implements OnInit {
  FILETYPE_LST = [
    { value: 'auto' },
    { value: 'Binary' },
    { value: 'Text' },
    { value: 'STREAM_TEXT' },
  ];
  FILEMODE_LST = [{ value: 'AUTODETECT' }, { value: 'BINARY' }, { value: 'ASCII' }];
  ACTIONAT_LST = [{ value: 'NONE' }, { value: 'ERASE' }, { value: 'DELETE' }];
  hideRequiredMarker = false;
  existingFlowModel: IFlowModel[] = this.flowService.getModelList();
  myApplicationList: IApplicationsList; // Store the list of application
  myPartnerList: IPartnersList;
  selectedModel: IFlowModel;
  selectedSourceApplication: IApplication;
  flowForm: FormGroup; // Form used to create the flow
  isFormReady = false;
  constructor(
    private applicationService: ApplicationService,
    private partnerService: PartnerService,
    private flowService: FlowService,
    private formBuilder: FormBuilder,
    public uiservice: UiService
  ) {}

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
  }

  // == Manage what to do when the user select a new model
  newModelSelected() {
    if (this.selectedModel) {
      this.buildFlowForm();
    }
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

  // == Cancel the form
  CancelFlowCreation() {
    this.isFormReady = false;
    this.selectedModel = null;
  }
  async submitFlowCreation() {
    let flowToCreate: IFlow;
    if (this.selectedModel.istarget_prop_file_target_file_name) {
      this.flowForm
        .get('target_prop_file_target_file_name')
        .setValue(
          this.flowForm.get('_target_cftdir').value +
            '/' +
            (this.flowForm.get('_target_cftfile').value
              ? this.flowForm.get('_target_cftfile').value
              : '.&FROOT') +
            (this.flowForm.get('_target_cftunique').value
              ? '.&IDTU'
              : this.flowForm.get('_target_cftunique').value)
        );
    }
    flowToCreate = Object.keys(this.flowForm.value).reduce(
      (obj, key) => {
        key.charAt(0) !== '_' ? (obj[key] = this.flowForm.value[key]) : null;
        return obj;
      },
      { flow_name: '' }
    );
    //console.log(flowToCreate);
    this.flowService.createFlow(flowToCreate).subscribe(
      res => {
        if (res.status == 201) {
          this.uiservice.showMsg(
            `The flow "${flowToCreate.flow_name}" has been create successfully`,
            'Close',
            'info'
          );
          this.isFormReady = false;
          this.selectedModel = null;
        } else {
          this.uiservice.showMsg(
            `The flow creation of "${flowToCreate.flow_name}" has failed. status=${
              res.status
            }, message=${res.message}`,
            'Close',
            'error'
          );
        }

        //console.log(res);
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

  // build the application form
  private buildFlowForm(flowInstance?: IFlow) {
    this.flowForm = this.formBuilder.group({
      flow_modelName: [
        {
          value: this.selectedModel.flow_modelName,
          disabled: false,
        },
      ],
      flow_name: [
        {
          value: (flowInstance && flowInstance.flow_name) || '',
          disabled: false,
        },
        Validators.required,
      ],
      flow_description: [
        {
          value: (flowInstance && flowInstance.flow_description) || '',
          disabled: !this.selectedModel.isflow_description,
        },
      ],
      protocol_pesit_flow_idf: [
        {
          value: (flowInstance && flowInstance.protocol_pesit_flow_idf) || '',
          disabled: !this.selectedModel.isprotocol_pesit_flow_idf,
        },
        this.selectedModel.isprotocol_pesit_flow_idf ? Validators.required : null,
      ],
      contact_firstname: [
        {
          value: (flowInstance && flowInstance.contact_firstname) || '',
          disabled: !this.selectedModel.iscontact_firstname,
        },
      ],
      contact_lastname: [
        {
          value: (flowInstance && flowInstance.contact_lastname) || '',
          disabled: !this.selectedModel.iscontact_lastname,
        },
      ],
      contact_email: [
        {
          value: (flowInstance && flowInstance.contact_email) || '',
          disabled: !this.selectedModel.iscontact_email,
        },
      ],
      contact_phone: [
        {
          value: (flowInstance && flowInstance.contact_phone) || '',
          disabled: !this.selectedModel.iscontact_phone,
        },
      ],
      contact_jobtitle: [
        {
          value: (flowInstance && flowInstance.contact_jobtitle) || '',
          disabled: !this.selectedModel.iscontact_jobtitle,
        },
      ],
      _selectedSourceApplication: [
        {
          value: '',
          disabled: !this.selectedModel.issource_application_id,
        },
        this.selectedModel.issource_application_id ? Validators.required : null,
      ],
      source_application_id: [
        {
          value: (flowInstance && flowInstance.source_application_id) || '',
          disabled: !this.selectedModel.issource_application_id,
        },
      ],
      source_application_product_id: [
        {
          value: (flowInstance && flowInstance.source_application_product_id) || '',
          disabled: !this.selectedModel.issource_application_product_id,
        },
      ],
      source_prop_file_file_type: [
        {
          value: (flowInstance && flowInstance.source_prop_file_file_type) || 'Text',
          disabled: !this.selectedModel.issource_prop_file_file_type,
        },
      ],
      source_prop_transfer_action_after_transfer: [
        {
          value:
            (flowInstance && flowInstance.source_prop_transfer_action_after_transfer) ||
            'DELETE',
          disabled: !this.selectedModel.issource_prop_transfer_action_after_transfer,
        },
      ],
      _selectedTargetApplication: [
        {
          value: '',
          disabled: !this.selectedModel.istarget_application_id,
        },
        this.selectedModel.istarget_application_id ? Validators.required : null,
      ],
      target_application_id: [
        {
          value: (flowInstance && flowInstance.target_application_id) || '',
          disabled: !this.selectedModel.istarget_application_id,
        },
      ],
      target_application_product_id: [
        {
          value: (flowInstance && flowInstance.target_application_product_id) || '',
          disabled: !this.selectedModel.istarget_application_product_id,
        },
      ],
      target_prop_file_file_type: [
        {
          value: (flowInstance && flowInstance.target_prop_file_file_type) || 'Text',
          disabled: !this.selectedModel.istarget_prop_file_file_type,
        },
      ],
      target_prop_file_target_file_name: [
        {
          value: (flowInstance && flowInstance.target_prop_file_target_file_name) || '',
          disabled: !this.selectedModel.istarget_prop_file_target_file_name,
        },
      ],
      _target_cftdir: [
        {
          value: 'pub',
          disabled: !this.selectedModel.istarget_prop_file_target_file_name,
        },
      ],
      _target_cftfile: [
        {
          value: '',
          disabled: !this.selectedModel.istarget_prop_file_target_file_name,
        },
      ],
      _target_cftunique: [
        {
          value: '',
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
          value: (flowInstance && flowInstance.source_partner_id) || '',
          disabled: !this.selectedModel.issource_partner_id,
        },
      ],
      source_protocol_transfer_mode: [
        {
          value: (flowInstance && flowInstance.source_protocol_transfer_mode) || 'ASCII',
          disabled: !this.selectedModel.issource_protocol_transfer_mode,
        },
      ],
      routing_base_directory: [
        {
          value: (flowInstance && flowInstance.routing_base_directory) || '',
          disabled: !this.selectedModel.isrouting_base_directory,
        },
        this.selectedModel.isrouting_base_directory ? Validators.required : null,
      ],
    });

    /* Another way to add dynalicaly field but require more code
    if (this.selectedModel.isflow_description) {
    this.flowForm.addControl(
      'flow_description',
      this.formBuilder.control( (flowInstance && flowInstance.flow_description) || '', Validators.required)
      );
    }
    */
    this.isFormReady = true;
  }
}
