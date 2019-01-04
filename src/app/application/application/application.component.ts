/**********
 * Name: Application.component
 * Type: Angular Component
 * Description:
 *    This component display the list of applications and allow to display the detail of one selected application.
 */

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  // myApplicationList: IApplicationsList;
  displayedColumns = [
    'appli_name',
    'appli_host',
    'appli_product_name',
    'appli_product_type',
    'id',
  ];
  dataSource = new MatTableDataSource();
  isLoadingData = true;
  hasError = false;
  errorText = '';
  isListDisplayed = true;
  SelectedApplication: IApplication;

  search = new FormControl('', []);

  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    private applicationService: ApplicationService,
    public uiservice: UiService
  ) {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayApplication(appli: IApplication) {
    this.SelectedApplication = appli;
    this.isListDisplayed = false;
  }

  closeApplicationDisplay() {
    this.isListDisplayed = true;
  }

  ngOnInit() {

    if (this.applicationService.getIsLoaded() === false) {
      this.applicationService.getcurrentApplicationsList().subscribe(
        data => {
          this.applicationService.currentApplicationsList.next(data);
          this.isLoadingData = false;
        },
        err => {
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
