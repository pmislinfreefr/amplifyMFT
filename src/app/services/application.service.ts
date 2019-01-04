/**********
 * Name: Application.service
 * Type: Angular Service
 * Description:
 *        This service handle the access to the server to get the applications list.
 *        The application list is stored in this class (ApplicationService) in the property currentApplicationsList.
 *        Any component can subscribe to this property to get the application list. As it is an observable, the component
 *        will be aware of any modification.
 *        HOW TO SUBSCRIBE (from a component which need to display the list):
 *          1)Add ApplicationService in the constructor of the component to inject the service
 *          2)Create a local property which will store the list ( myApplicationList: IApplicationsList )
 *          3)In the ngOnInit() method call
 *            this.applicationService.currentApplicationsList.subscribe(data => (this.myApplicationList = data));
 *        HOW TO REFRESH THE LIST FROM THE SERVER
 *          1)Add ApplicationService in the constructor of the component to inject the service
 *          2)call this.applicationService
                .getcurrentApplicationsList(false)
                .subscribe(
                data => this.applicationService.currentApplicationsList.next(data),
                err => {
                    console.log('ERRINHOME:', err);  // or any error management
                });
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  Observable,
  BehaviorSubject,
  of,
  throwError as observableThrowError,
} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  IApplication,
  IApplicationsList,
  IAPIApplicationData,
} from './interface_application';
// import { forEach } from '@angular/router/src/utils/collection';
import { ManageError } from '../common/common';
declare var require: any; // needed to use require() in TypeScript (or install typescript for nodejs functions)

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  currentApplicationsList = new BehaviorSubject<IApplicationsList>({
    nb_application: 0,
    date_fetch: 0,
    applications: null,
  });
  private isLoaded = false;

  constructor(private httpClient: HttpClient) {}

  getcurrentApplicationsList(
    isFake: boolean = environment.fakeLoadOfData
  ): Observable<IApplicationsList> {
    if (isFake) {
      return this.fetchApplicationListFromAPI_FAKE();
    } else {
      return this.fetchApplicationListFromAPI();
    }
  }

  getIsLoaded(): boolean {
    return this.isLoaded;
  }

  private fetchApplicationListFromAPI_FAKE(): Observable<IApplicationsList> {
    const fakeData: IAPIApplicationData = require('./FakeResponseListApp.json');
    return of(fakeData).pipe(
      map(dataFake => this.transformToIApplicationsList(dataFake))
    );
  }

  private fetchApplicationListFromAPI(): Observable<IApplicationsList> {
    return this.httpClient
      .get<IAPIApplicationData>(`${environment.baseUrl}applications`)
      .pipe(
        map(data => this.transformToIApplicationsList(data)),
        catchError(ManageError)
      );
  }

  private transformToIApplicationsList(data: IAPIApplicationData): IApplicationsList {
    let resultList: IApplicationsList;
    this.isLoaded = true;
    resultList = {
      nb_application: data.data.length,
      date_fetch: Date.now(),
      applications: [],
    };
    data.data.forEach(appli => {
      resultList.applications.push({
        appli_name: appli.applications.name,
        appli_description: '',
        appli_host: appli.applications.host,
        appli_product_name: appli.applications.products
          ? appli.applications.products[0].name
          : '',
        appli_tags: ['myTag'],
        contact_email: '',
        contact_firstname: '',
        contact_lastname: '',
        contact_jobtitle: '',
        contact_phone: '',
        appli_group: '',
        appli_bId: appli.applications.businessId,
        appli_product_bId: appli.applications.products
          ? appli.applications.products[0].businessId
          : '',
        appli_product_type: appli.applications.productTypes
          ? appli.applications.productTypes[0]
          : '',
      });
    });
    console.log('dataResult:', resultList);
    return resultList;
  }
}
