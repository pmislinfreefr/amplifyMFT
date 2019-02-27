/**********
 * Name: Partner.service
 * Type: Angular Service
 * Description:
 *        This service handle the access to the server to get the partner list.
 *        The partner list is stored in this class (PartnerService) in the property currentPartnersList.
 *        Any component can subscribe to this property to get the partner list. As it is an observable, the component
 *        will be aware of any modification.
 *        HOW TO SUBSCRIBE (from a component which need to display the list):
 *          1)Add PartnerService in the constructor of the component to inject the service
 *          2)Create a local property which will store the list ( myPartnerList: IPartnersList )
 *          3)In the ngOnInit() method call
 *            this.partnerService.currentPartnersList.subscribe(data => (this.myPartnerList = data));
 *        HOW TO REFRESH/Load THE LIST FROM THE SERVER
 *          1)Add PartnerService in the constructor of the component to inject the service
 *          2a) Method a - provide more control in the component (to manage for exemple a load spinner
 *              call this.partnerService
                .getcurrentPartnersList()
                .subscribe(
                data => this.partnerService.currentPartnersList.next(data),
                err => {
                    console.log('ERRINHOME:', err);  // or any error management
                });
              2b) Method b - more easy but less control in the compnent
                call this.partnerService.loadPartnerList()
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Observable,
  BehaviorSubject,
  of,
  throwError as observableThrowError,
} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IPartner, IPartnersList, IAPIPartnerData } from './interface_partner';
// import { forEach } from '@angular/router/src/utils/collection';
import { ManageError } from '../../common/common';
import { UiService } from '../../common/uiservice';
declare var require: any; // needed to use require() in TypeScript (or install typescript for nodejs functions)

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  currentPartnersList = new BehaviorSubject<IPartnersList>({
    nb_partner: 0,
    date_fetch: 0,
    partners: [],
  });
  private isLoaded = false;

  constructor(private httpClient: HttpClient, public uiservice: UiService) {}

  // ==
  // Desc - Allow to load the application list and push the result in the observable currentPartnersList
  // Params
  //  isForced: true if you want to force the fetch of data from server even if a previous attempt already loaded the data
  //  isFake: true if you want to get data from fake local json (for testing purpose)
  // ==
  loadPartnerList(
    isForced: boolean = false,
    isFake: boolean = environment.fakeLoadOfData
  ) {
    if (this.isLoaded === false || isForced === true) {
      this.getcurrentPartnersList(isFake).subscribe(
        data => {
          this.currentPartnersList.next(data);
        },
        err => {
          this.uiservice.showMsg(
            `An error occured when trying to call Partner API : ${err}`,
            'Close',
            'error'
          );
        }
      );
    }
  }

  // ==
  // Desc - Allow to load the application list from the server and return an observable of IPartnersList
  //        When this method is called, it is advised, in the subscription to
  //        run "data => this.applicationService.currentPartnersList.next(data)" (to push the result)
  //        Use this method if you need more control in your component, otherwise call loadPartnerList()
  // Params
  //   isFake: true if you want to get data from fake local json (for testing purpose)
  // ==
  getcurrentPartnersList(
    isFake: boolean = environment.fakeLoadOfData
  ): Observable<IPartnersList> {
    if (isFake) {
      return this.fetchPartnerListFromAPI_FAKE();
    } else {
      return this.fetchPartnerListFromAPI();
    }
  }

  // ==
  // Desc - get value of attribut isLoaded
  //
  getIsLoaded(): boolean {
    return this.isLoaded;
  }

  // =================== Private method below =========================

  private fetchPartnerListFromAPI_FAKE(): Observable<IPartnersList> {
    const fakeData: IAPIPartnerData = require('./FakeResponseListPartner.json');
    return of(fakeData).pipe(map(dataFake => this.transformToIPartnersList(dataFake)));
  }

  private fetchPartnerListFromAPI(): Observable<IPartnersList> {
    return this.httpClient.get<IAPIPartnerData>(`${environment.baseUrl}partners`).pipe(
      map(data => this.transformToIPartnersList(data)),
      catchError(ManageError)
    );
  }

  private transformToIPartnersList(data: IAPIPartnerData): IPartnersList {
    let resultList: IPartnersList;
    this.isLoaded = true;
    resultList = {
      nb_partner: data.data.length,
      date_fetch: Date.now(),
      partners: [],
    };
    data.data.forEach(part => {
      resultList.partners.push({
        part_name: part.partners.name,
        part_description: part.partners.description || '',
        contact_email: part.partners.contact ? part.partners.contact.email || '' : '',
        contact_firstname: part.partners.contact
          ? part.partners.contact.firstName || ''
          : '',
        contact_lastname: part.partners.contact
          ? part.partners.contact.lastName || ''
          : '',
        contact_jobtitle: '',
        contact_phone: part.partners.contact ? part.partners.contact.phone || '' : '',
        communicationProfiles: part.partners.communicationProfiles,
        part_bId: part.partners.businessId,
      });
    });
    console.log('PartnerdataResult:', resultList);
    return resultList;
  }
}
