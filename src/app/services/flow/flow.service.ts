/**********
 * Name: Flow.service
 * Type: Angular Service
 * Description:
 *        This service handle the access to the server to get the flow list, create a new flow, update or delete a flow.
 */
import { Injectable } from '@angular/core';
import { IFlow, IFlowsList, IAPIFlowData, IFlowModel } from './interface_flow';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  of,
  throwError as observableThrowError,
} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ManageError } from '../../common/common';
import { environment } from '../../../environments/environment';
declare var require: any; // needed to use require() in TypeScript (or install typescript for nodejs functions)

const LSTMODELS = [
  {
    flow_modelName: '0000_OPENCFT2OPENCFT',
    flow_modelNameToDisplay: 'Exchange between 2 applications on distributed systems',
    flow_modelDesc:
      'Exchange between 2 applications based on CFT runing on distributed systems',
    isflow_name: true,
    isflow_description: true,
    iscontact_email: true,
    iscontact_firstname: true,
    iscontact_lastname: true,
    iscontact_jobtitle: true,
    iscontact_phone: true,
    issource_application_id: true,
    issource_application_product_id: true,
    istarget_application_id: true,
    istarget_application_product_id: true,
    isprotocol_pesit_flow_idf: true,
    issource_prop_transfer_action_after_transfer: true,
    issource_prop_file_file_type: true,
    istarget_prop_file_target_file_name: true,
    istarget_prop_file_file_type: true,
  },
  {
    flow_modelName: '0001_MVSCFT2OPENCFT',
    flow_modelNameToDisplay: 'Exchange from mainframe to distributed systems',
    flow_modelDesc:
      'Exchange between 2 applications based on CFT. Source run on mainframe, target run on distributed systems',
    isflow_name: true,
    isflow_description: true,
    iscontact_email: true,
    iscontact_firstname: true,
    iscontact_lastname: true,
    iscontact_jobtitle: true,
    iscontact_phone: true,
    issource_application_id: true,
    issource_application_product_id: true,
    istarget_application_id: true,
    istarget_application_product_id: true,
    isprotocol_pesit_flow_idf: true,
    issource_prop_transfer_action_after_transfer: true,
    issource_prop_file_file_type: true,
    istarget_prop_file_target_file_name: true,
    istarget_prop_file_file_type: true,
  },
];

@Injectable({
  providedIn: 'root',
})
export class FlowService {
  constructor(private httpClient: HttpClient) {}
  // ==
  // Desc - Provide the list of models available
  // ==
  public getModelList(): IFlowModel[] {
    return LSTMODELS;
  }
  // ==
  // Desc - Allow to load the flow list from the server and return an observable of IFlowsList
  //
  // Params
  //   isFake: true if you want to get data from fake local json (for testing purpose)
  // ==
  getcurrentFlowsList(
    isFake: boolean = environment.fakeLoadOfData
  ): Observable<IFlowsList> {
    if (isFake) {
      return this.fetchFlowListFromAPI_FAKE();
    } else {
      return this.fetchFlowListFromAPI();
    }
  }

  // ==
  // Desc - Allow to create a new flow
  //
  // Params
  //   isFake: true if you want to get data from fake local json (for testing purpose)
  // ==
  createFlow(flow: IFlow): Observable<IAPIFlowData> {
    const createResponse = this.httpClient
      .post<IAPIFlowData>(`${environment.baseUrl}/flows/${flow.flow_modelName}`, flow, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      })
      .pipe(catchError(ManageError));

    return createResponse;
  }
  // ==
  // Desc - Allow to update a new flow
  //
  // Params
  //   isFake: true if you want to get data from fake local json (for testing purpose)
  // ==
  updateFlow(flow: IFlow): Observable<IAPIFlowData> {
    const createResponse = this.httpClient
      .put<IAPIFlowData>(
        `${environment.baseUrl}/flows/${flow.flow_modelName}/${flow.flow_bId}`,
        flow,
        {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        }
      )
      .pipe(catchError(ManageError));

    return createResponse;
  }

  // =================== Private method below =========================

  private fetchFlowListFromAPI_FAKE(): Observable<IFlowsList> {
    const fakeData: IAPIFlowData = require('./FakeResponseListFlow.json');
    return of(fakeData).pipe(map(dataFake => this.transformToIFlowsList(dataFake)));
  }

  private fetchFlowListFromAPI(): Observable<IFlowsList> {
    return this.httpClient.get<IAPIFlowData>(`${environment.baseUrl}flows`).pipe(
      map(data => this.transformToIFlowsList(data)),
      catchError(ManageError)
    );
  }

  private transformToIFlowsList(data: IAPIFlowData): IFlowsList {
    let resultList: IFlowsList;
    resultList = {
      nb_flows: data.data.length,
      date_fetch: Date.now(),
      flows: [],
    };
    data.data.forEach(flow => {
      resultList.flows.push({
        flow_bId: flow.flows.businessId,
        flow_modelName: (flow.model && flow.model.model_id) || '',
        flow_patternName: (flow.pattern && flow.pattern.pattern_id) || '',
        flow_name:
          (flow.model && flow.model.model_data && flow.model.model_data.flow_name) ||
          flow.flows.name,
        flow_description:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.flow_description) ||
          flow.flows.description,
        contact_email:
          (flow.model && flow.model.model_data && flow.model.model_data.contact_email) ||
          (flow.flows.contact && flow.flows.contact.email) ||
          '',
        contact_firstname:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.contact_firstname) ||
          (flow.flows.contact && flow.flows.contact.firstName) ||
          '',
        contact_lastname:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.contact_lastname) ||
          (flow.flows.contact && flow.flows.contact.lastName) ||
          '',
        contact_phone:
          (flow.model && flow.model.model_data && flow.model.model_data.contact_phone) ||
          (flow.flows.contact && flow.flows.contact.phone) ||
          '',
        contact_jobtitle:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.contact_jobtitle) ||
          '',
        source_application_id:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.source_application_id) ||
          '',
        source_application_product_id:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.source_application_product_id) ||
          '',
        target_application_id:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.target_application_id) ||
          '',
        target_application_product_id:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.target_application_product_id) ||
          '',
        protocol_pesit_flow_idf:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.protocol_pesit_flow_idf) ||
          '',
        source_prop_transfer_action_after_transfer:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.source_prop_transfer_action_after_transfer) ||
          '',
        source_prop_file_file_type:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.source_prop_file_file_type) ||
          '',
        target_prop_file_target_file_name:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.target_prop_file_target_file_name) ||
          '',
        target_prop_file_file_type:
          (flow.model &&
            flow.model.model_data &&
            flow.model.model_data.target_prop_file_file_type) ||
          '',
      });
    });
    //console.log('dataResult:', resultList);
    return resultList;
  }
}
