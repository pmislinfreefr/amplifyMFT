// == Interface for one flow (No multi source or dest)
export interface IFlow {
  flow_bId?: string; // business Id of the flow
  flow_modelName?: string; // Model used to create the flow
  flow_patternName?: string; // Pattern used to create the flow
  flow_name: string; // name of the flow
  flow_description?: string; // description
  contact_email?: string;
  contact_firstname?: string;
  contact_lastname?: string;
  contact_jobtitle?: string;
  contact_phone?: string;
  source_application_id?: string; // Case of source is an application
  source_application_product_id?: string; // Case of source is an application
  target_application_id?: string; // Case of target is an application
  target_application_product_id?: string; // Case of target is an application
  protocol_pesit_flow_idf?: string; // Idf (if Pesit used only)
  source_prop_transfer_action_after_transfer?: string;
  source_prop_file_file_type?: string;
  target_prop_file_target_file_name?: string;
  target_prop_file_file_type?: string;
}

// == Interface for the list of flows
export interface IFlowsList {
  nb_flows: number; // Count of the flows
  date_fetch: number; // Date of the last fetch
  flows?: IFlow[];
}

// == Description of the API response data
export interface IAPIFlowData {
  status: number;
  message?: string;
  data: [
    {
      flows: {
        businessId: string; // contact to be added after
        contact?: {
          email?: string;
          firstName?: string;
          lastName?: string;
          phone?: string;
        };
        description: string; // description of the flow
        name: string; // flow name
      };
      model?: {
        model_data?: {
          flow_name?: string; // name of the flow
          flow_description?: string; // description
          contact_email?: string;
          contact_firstname?: string;
          contact_lastname?: string;
          contact_jobtitle?: string;
          contact_phone?: string;
          source_application_id?: string; // Case of source is an application
          source_application_product_id?: string; // Case of source is an application
          target_application_id?: string; // Case of target is an application
          target_application_product_id?: string; // Case of target is an application
          protocol_pesit_flow_idf?: string; // Idf (if Pesit used only)
          source_prop_transfer_action_after_transfer?: string;
          source_prop_file_file_type?: string;
          target_prop_file_target_file_name?: string;
          target_prop_file_file_type?: string;
        };
        model_id?: string;
      };
      pattern?: {
        pattern_id?: string;
      };
    }
  ];
}

// == Interface for each flow model managed by this application
export interface IFlowModel {
  flow_modelName: string; // Model used to create the flow
  flow_modelNameToDisplay: string; // Model used to create the flow
  flow_modelDesc: string; // Description of the model
  // Allow to specify the required attributes for the model
  isflow_name: boolean; // name of the flow
  isflow_description?: boolean; // description
  iscontact_email?: boolean;
  iscontact_firstname?: boolean;
  iscontact_lastname?: boolean;
  iscontact_jobtitle?: boolean;
  iscontact_phone?: boolean;
  issource_application_id?: boolean; // Case of source is an application
  issource_application_product_id?: boolean; // Case of source is an application
  istarget_application_id?: boolean; // Case of target is an application
  istarget_application_product_id?: boolean; // Case of target is an application
  isprotocol_pesit_flow_idf?: boolean; // Idf (if Pesit used only)
  issource_prop_transfer_action_after_transfer?: boolean;
  issource_prop_file_file_type?: boolean;
  istarget_prop_file_target_file_name?: boolean;
  istarget_prop_file_file_type?: boolean;
}
