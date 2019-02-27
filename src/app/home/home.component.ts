import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { IApplication, IApplicationsList } from '../services/interface_application';
import { IPartner, IPartnersList } from '../services/partner/interface_partner';
import { PartnerService } from '../services/partner/partner.service';
import { UiService } from '../common/uiservice';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  myApplicationList: IApplicationsList;
  myPartnerList: IPartnersList;
  isLoadingData = true;

  constructor(
    private applicationService: ApplicationService,
    private partnerService: PartnerService,
    public uiservice: UiService
  ) {}

  ngOnInit() {
    // == Load list of applications
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
      data => (this.myApplicationList = data)
    );

    this.isLoadingData = true;
    // == Load list of partners
    if (this.partnerService.getIsLoaded() === false) {
      this.partnerService.getcurrentPartnersList().subscribe(
        data => {
          this.partnerService.currentPartnersList.next(data);
          this.isLoadingData = false;
        },
        err => {
          this.uiservice.showMsg(
            `An error occured when trying to call Partner API : ${err}`,
            'Close',
            'error'
          );
          this.isLoadingData = false;
        }
      );
    } else {
      this.isLoadingData = false;
    }
    this.partnerService.currentPartnersList.subscribe(
      data => (this.myPartnerList = data)
    );
  }
}
