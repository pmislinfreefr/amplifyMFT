// == Interface for one partner
export interface IPartner {
  part_name: string; // name of the partner
  part_description: string; // description
  contact_email: string;
  contact_firstname: string;
  contact_lastname: string;
  contact_jobtitle: string;
  contact_phone: string;
  part_bId: string;
  communicationProfiles?: [
    {
      businessId: string;
      clientAuthentication?: string;
      enabled?: boolean;
      fipsEnabled?: boolean;
      login?: string;
      name?: string;
      protocol?: string;
      type?: string;
    }
  ];
}

// == Interface for the list of applications
export interface IPartnersList {
  nb_partner: number; // Count of the applications
  date_fetch: number; // Date of the last fetch
  partners?: IPartner[];
}

// == Description of the API response data
export interface IAPIPartnerData {
  status: number;
  data: [
    {
      partners: {
        businessId: string; // contact to be added after
        name: string;
        description?: string;
        communicationProfiles?: [
          {
            businessId: string;
            clientAuthentication?: string;
            enabled?: boolean;
            fipsEnabled?: boolean;
            login?: string;
            name?: string;
            protocol?: string;
            type?: string;
          }
        ];
        contact?: {
          email?: string;
          firstName?: string;
          lastName?: string;
          phone?: string;
        };
      };
    }
  ];
}
