export interface TotalFranchiseCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Data;
  exception: any[];
}

export interface Data {
  totalCount: number;
  franchises: FranchiseData[];
}

export interface FranchiseData {
  companyId: string;
  companyName: string;
  companyRegistrationNumber: string;
  vatNumber: string;
  emailAddress: string;
  phoneNumber: string;
  addressDetails: FranchiseAddressDetail[];
  bankDetails: FranchiseBankDetail[];
  createdBy: string;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  updatedBy: string;
  updatedDate: Date;
}

export interface FranchiseAddressDetail {
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

export interface FranchiseBankDetail {
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

// Note: Delete Franchise Type Start Here
export interface DeleteFranchiseResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface DeleteFranchiseRequest {
  companyId: string;
}