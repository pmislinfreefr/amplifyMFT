/**********
 * Name: Application.component
 * Type: Angular Component
 * Description:
 *    This component display the list of applications and allow to display the detail of one selected application.
 *    Update of an application is possible but not active
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
import { IApplication, IApplicationsList } from '../../services/interface_application';
import { ApplicationService } from '../../services/application.service';
import { UiService } from '../../common/uiservice';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'appli_name',
    'appli_host',
    'appli_product_name',
    'appli_product_type',
    'id',
  ];
  dataSource = new MatTableDataSource(); // dataSource for the display of the table
  isLoadingData = true; // allow to display a spinner during the load of data
  hasError = false; // identify if there was an error during the load of data (HTTP REST Call)
  errorText = '';
  isListDisplayed = true; // allow to switch between the view of the list to the view of the detail of one element
  SelectedApplication: IApplication; // item selected for detail display
  appliForm: FormGroup; // A form is used to display the detail of the item. It is then easy to allow update.
  canModifyForm = false; // Decide if it is view only or if update is allowed
  formCssClass = 'form-view'; // which css class to use: 'form-view' for view only, 'form-edit' for update

  search = new FormControl('', []); // input field to allow filtering

  @ViewChild(MatSort) // activate sorting by column
  sort: MatSort;

  constructor(
    private applicationService: ApplicationService,
    private formBuilder: FormBuilder,
    public uiservice: UiService
  ) {}

  // == called from the html to apply the new filter when the filter value change
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // == called from the html to display the selected item from the list
  //  This will hide the list and show the form
  displayApplication(appli: IApplication) {
    this.SelectedApplication = appli;
    this.canModifyForm = false;
    this.formCssClass = 'form-view';
    // Prepare the form
    this.buildApplicationForm(appli);
    // activate the display
    this.isListDisplayed = false;
  }

  // == called from the html, hide the detail view of the item and display the list
  closeApplicationDisplay() {
    this.isListDisplayed = true;
  }

  // == called from the html, move the form from view only to edit
  activateEdit() {
    this.canModifyForm = true;
    this.buildApplicationForm(this.SelectedApplication);
    this.formCssClass = 'form-edit';
  }

  // load the data and subscibe to any data update
  ngOnInit() {
    
    if (this.applicationService.getIsLoaded() === false) {
      this.applicationService.getcurrentApplicationsList().subscribe(
        data => {
          this.applicationService.currentApplicationsList.next(data);
          this.isLoadingData = false;
        },
        err => {
          this.hasError = true;
          this.errorText = err;
          this.uiservice.showMsg(
            `An error occured when trying to call Application API : ${err}`,
            'Close',
            'error'
          );
          this.isLoadingData = false;
        }
      );
    } else {
      this.isLoadingData = false;
    }

    this.applicationService.currentApplicationsList.subscribe(
      data => (this.dataSource.data = data.applications)
    );
  }

  // == link the sort capability to the table datasource
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // build the application form
  private buildApplicationForm(appli: IApplication) {
    this.appliForm = this.formBuilder.group({
      appli_name: [
        {
          value: appli.appli_name,
          disabled: true,
        },
        Validators.required,
      ],
      appli_bId: [
        {
          value: appli.appli_bId,
          disabled: true,
        },
        Validators.required,
      ],
      appli_description: [
        {
          value: (appli.appli_description) || '',
          disabled: !this.canModifyForm,
        },
      ],
      appli_host: [
        {
          value: appli.appli_host,
          disabled: !this.canModifyForm,
        },
        Validators.required,
      ],
      appli_product_name: [
        {
          value: appli.appli_product_name,
          disabled: !this.canModifyForm,
        },
        Validators.required,
      ],
      appli_product_bId: [
        {
          value: appli.appli_product_bId,
          disabled: true,
        },
        Validators.required,
      ],
      appli_product_type: [
        {
          value: appli.appli_product_type,
          disabled: !this.canModifyForm,
        },
        Validators.required,
      ],
      appli_group: [
        {
          value: appli.appli_group,
          disabled: !this.canModifyForm,
        },
      ],
    });
  }
}
