/**********
 * Name: Partnerlist.component
 * Type: Angular Component
 * Description:
 *    This component display the list of partners and allow to display the detail of one selected partner.
 *    Update of an partner is possible but not active
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
import { IPartner, IPartnersList } from '../../services/partner/interface_partner';
import { PartnerService } from '../../services/partner/partner.service';
import { UiService } from '../../common/uiservice';


@Component({
  selector: 'app-partnerlist',
  templateUrl: './partnerlist.component.html',
  styleUrls: ['./partnerlist.component.scss'],
})
export class PartnerlistComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'part_name',
    'part_comm',
    'id',
  ];
  dataSource = new MatTableDataSource(); // dataSource for the display of the table
  isLoadingData = false; // allow to display a spinner during the load of data (not managed in this component)
  hasError = false; // identify if there was an error during the load of data (HTTP REST Call)
  errorText = '';
  isListDisplayed = true; // allow to switch between the view of the list to the view of the detail of one element
  SelectedPartner: IPartner; // item selected for detail display
  partForm: FormGroup; // A form is used to display the detail of the item. It is then easy to allow update.
  canModifyForm = false; // Decide if it is view only or if update is allowed
  formCssClass = 'form-view'; // which css class to use: 'form-view' for view only, 'form-edit' for update

  search = new FormControl('', []); // input field to allow filtering

  @ViewChild(MatSort) // activate sorting by column
  sort: MatSort;
  constructor(
    private partnerService: PartnerService,
    private formBuilder: FormBuilder,
    public uiservice: UiService
  ) {}

// == called from the html to apply the new filter when the filter value change
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

// == called from the html to display the selected item from the list
//  This will hide the list and show the form
displayPartner(part: IPartner) {
  this.SelectedPartner = part;
  this.canModifyForm = false;
  this.formCssClass = 'form-view';
  // Prepare the form
  this.buildApplicationForm(part);
  // activate the display
  this.isListDisplayed = false;
}

// == called from the html, hide the detail view of the item and display the list
closePartDisplay() {
  this.isListDisplayed = true;
}

// == called from the html, move the form from view only to edit
activateEdit() {
  this.canModifyForm = true;
  this.buildApplicationForm(this.SelectedPartner);
  this.formCssClass = 'form-edit';
}

//Display in a string, the list of comm profiles
listCommProf(part: IPartner): string {
  let result="";
  if (part.communicationProfiles) {
    result=part.communicationProfiles.reduce((res: string, cur: any) => res + " " + cur.type + "/" + cur.protocol, "");
  }
  return result;
}

// load the data and subscibe to any data update
  ngOnInit() {
    this.partnerService.currentPartnersList.subscribe(
      data => (this.dataSource.data = data.partners)
    );
    this.partnerService.loadPartnerList();
  }

  // == link the sort capability to the table datasource
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // build the application form
  private buildApplicationForm(part: IPartner) {
    this.partForm = this.formBuilder.group({
      part_name: [
        {
          value: part.part_name,
          disabled: true,
        },
        Validators.required,
      ],
      part_bId: [
        {
          value: part.part_bId,
          disabled: true,
        },
        Validators.required,
      ],
      part_description: [
        {
          value: part.part_description || '',
          disabled: !this.canModifyForm,
        },
      ],
      });
  }

}
