// Note: Customer Types Start Here
export interface TotalCustomerCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Data;
  exception: any[];
}

export interface Data {
  totalCustomers: number;
  customers: Customer[];
}

export interface Customer {
  id: string;
  createdBy: string;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  name: string;
  updatedBy: string;
  updatedDate: Date;
  email: string;
  phone: string;
  companyName: string;
  address: Address;
}
export interface Address {
  addressId: string;
  address: string;
  block: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  default: boolean;
}

// Note: Delete Customer Start Here
export interface DeleteCustomerData {
  customerId: string;
}

export interface DeleteCustomerResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: boolean;
  exception: any[];
}



// Note: Country Types Start Here
export interface TotalCountryCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Country[];
  exception: any[];
}

export interface Country {
  countryId: string;
  countryName: string;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
  isArchived: boolean;
}

// Note: City Types Start Here
export interface TotalCityCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: City[];
  exception: any[];
}

export interface City {
  stateId: string;
  cityName: string;
  state: string;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
  isArchived: boolean;
}

// Note: States Types Start Here
export interface TotalStatesCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: States[];
  exception: any[];
}

export interface States {
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
  isArchived: boolean;
  stateId: string;
  stateName: string;
  countryId: string;
}

// Note: Add Customer Types Start Here
export interface TotalAddCustomerCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: CustomerData;
  exception: any[];
}

export interface CustomerData {
  totalCustomers: number;
  customers: Customer[];
}

export interface AddCustomer {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  customerAddress: CustomerAddress[];
}

export interface CustomerAddress {
  address: string;
  block: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

// Note: Upload Customers File Types Start Here
export interface UploadCustomersFile {
  customerDetails: AddCustomer[];
}

export interface TotalUploadCustomersFileCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: UploadCustomersFileData;
  exception: any[];
}

export interface UploadCustomersFileData {
  externalAPiResponse: ExternalAPiResponse[];
  isSuccess: boolean;
  data: DataData;
}

export interface DataData {
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
}

export interface ExternalAPiResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: ExternalAPiResponseData;
  exceptions: any[];
  responseBy: string;
  featureName: string;
}

export interface ExternalAPiResponseData {
  isAdded: boolean;
  userId: string;
}

export interface TotalCustomerAddressesByIdCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: CustomerAddressesById;
  exception: any[];
}

export interface CustomerAddressesById {
  totalAddress: number;
  customerAddresses: CustomerAddressList[];
}

export interface CustomerAddressList {
  addressId: string;
  address: string;
  block: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  customerId: string;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
  isArchived: boolean;
}

// Note: Update Customer Types
export interface UpdateCustomerInfoCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: null;
  exception: any[];
}

export interface UpdateCustomerInfo {
  customerId: string;
  name: string;
  phone: string;
  email: string;
}

export interface UpdateCustomerAddress {
  addressId: string;
  address: string;
  block: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
}
