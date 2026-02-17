export interface TotalPartnerCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Data;
  exception: any[];
}

export interface Data {
  totalCount: number;
  partners: PartnerData[];
}

export interface PartnerData {
  partnerId: string;
  partnerName: string;
  partnerRegistrationNumber: string;
  vatNumber: string;
  emailAddress: string;
  phoneNumber: string;
  addressDetails: PartnerAddressDetail[];
  bankDetails: PartnerBankDetail[];
  createdBy: string;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  updatedBy: string;
  updatedDate: Date;
}
export interface PartnerAddressDetail {
  addressID: string;
  address: string;
  building: string;
  country: string;
  province: string;
  city: string;
  zipCode: string;
  longitude: number;
  latitude: number;
}

export interface PartnerBankDetail {
  bankId: string;
  name: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  createdBy: string;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  updatedBy: string;
  updatedDate: Date;
}

export interface DeletePartnerResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface DeletePartnerRequest {
  partnerId: string;
}


