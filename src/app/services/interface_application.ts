// == Interface for one application
export interface IApplication {
  appli_name: string; // name of the application
  appli_description: string; // description
  appli_host: string;
  appli_product_name: string;
  appli_tags: string[];
  contact_email: string;
  contact_firstname: string;
  contact_lastname: string;
  contact_jobtitle: string;
  contact_phone: string;
  appli_group: string;
  appli_bId: string;
  appli_product_bId: string;
  appli_product_type: string;
}

// == Interface for the list of applications
export interface IApplicationsList {
  nb_application: number; // Count of the applications
  date_fetch: number; // Date of the last fetch
  applications?: IApplication[];
}

// == Description of the API response data
export interface IAPIApplicationData {
  status: number;
  data: [
    {
      applications: {
        businessId: string; // contact to be added after
        host: string;
        name: string;
        productTypes?: string[];
        products: [
          {
            businessId: string;
            name: string;
          }
        ];
      };
    }
  ];
}
