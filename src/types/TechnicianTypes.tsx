export interface TotalTechnicianCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: TechnicianData;
  exception: any[];
}

export interface TechnicianData {
  totalCount: number;
  technicians: TechnicianTechnician[];
}

export interface TechnicianTechnician {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  apartment: TechnicianApartment;
  state: TechnicianState;
  imageURL: TechnicianApartment;
  companyName: string;
  companyID: string;
  franchiseID: TechnicianFranchiseID;
  franchiseName: string;
  spr: TechnicianSpr;
  city: string;
  zipCode: null | string;
  createdBy: string;
  updatedBy: string;
  yearsOfExperience: number;
  partnerName: string;
  updatedDate: Date;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  iqama: TechnicianIqama;
}

export enum TechnicianApartment {
  Apa = "APA",
  ApartmentString = "String",
  String = "string",
  We = "we",
}

export enum TechnicianFranchiseID {
  NA = "-",
  String = "string",
  The84Zmd0Rpic = "84zmd0rpic",
  The84Zmd0Rpic1 = "84zmd0rpic1",
}

export interface TechnicianIqama {
  iqamaNumber: string;
  iqamaExpiryDate: Date;
  fullName: string;
  placeOFIssue: TechnicianPlaceOFIssue;
  dateOfBirth: Date;
  profession: string;
  employerId: string;
  nationality: TechnicianNationality;
  placeOfWork: string;
  employerName: string;
  placeOfBirth: TechnicianPlaceOfBirth;
  religion: TechnicianReligion;
  imageUrl: string;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
  isArchived: boolean;
}

export enum TechnicianNationality {
  Arbaia = "Arbaia",
  NA = "-",
  Pakistani = "Pakistani",
  String = "string",
}

export enum TechnicianPlaceOFIssue {
  Empty = "",
  Riyadh = "Riyadh",
  SaudiArab = "Saudi Arab",
  SaudiArabia = "Saudi Arabia",
  String = "string",
}

export enum TechnicianPlaceOfBirth {
  Empty = "",
  Jeddah = "Jeddah",
  Srting = "Srting",
  String = "string",
}

export enum TechnicianReligion {
  Islam = "Islam",
  ReligionString = "string",
  String = "String",
}

export enum TechnicianSpr {
  Spr20250303_111200 = "spr_20250303_111200",
  Spr20250308_173344 = "spr_20250308_173344",
  Spr20250309_025023 = "spr_20250309_025023",
  Spr20250310_214414 = "spr_20250310_214414",
  String = "string",
}

export enum TechnicianState {
  SouthernRegion = "Southern Region",
  StateString = "String",
  String = "string",
}

// Note: Tickets By Technician ID Types Start Here
export interface TechnicianDetailsResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: TechnicianDetailsData;
  exception: any[];
}

export interface TechnicianDetailsData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  spr: string;
  city: string;
  zipCode: string;
  apartment: string;
  state: string;
  imageUrl: string;
  createdBy: string;
  updatedBy: string;
  franchiseID: string;
  franchiseName: string;
  yearsOfExperience: number;
  updatedDate: Date;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  iqama: TechnicianDetailsIqama;
  technicianHaveCategories: TechnicianDetailsHaveCategory[];
}

export interface TechnicianDetailsIqama {
  iqamaNumber: string;
  iqamaExpiryDate: Date;
  fullName: string;
  placeOFIssue: string;
  dateOfBirth: Date;
  profession: string;
  employerId: string;
  nationality: string;
  placeOfWork: string;
  employerName: string;
  placeOfBirth: string;
  religion: string;
  imageUrl: string;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
  isArchived: boolean;
}

export interface TechnicianDetailsHaveCategory {
  categoryId: string;
  categoryName: string;
  skills: TechnicianDetailsSkill[];
}

export interface TechnicianDetailsSkill {
  skillsId: string;
  skillName: string;
}

// Note: Tickets By Technician ID Types Start Here
export interface TechnicianTicketsResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: TechnicianTicketsDatum[];
  exception: any[];
}

export interface TechnicianTicketsDatum {
  id: string;
  status: Status;
  priority: Priority;
  requiredDate: string;  // Changed from Date to string
  requiredTime: string;
  createdDate: string;  // Changed from Date to string
  updatedBy: string;
  createdBy: string;
  updatedDate: string;  // Changed from Date to string
  technicianDetails: TechnicianTicketsTechnicianDetails;
  customerDetails: TechnicianTicketsCustomerDetails;
  productDetails: TechnicianTicketsProductDetail[];
  companyId: string;  // Changed from CompanyID enum to string
  ticketTag: TicketTag;
  parentTicketId: null;
}

export interface TechnicianTicketsCustomerDetails {
  id: string;  // Changed from CustomerDetailsID enum to string
  name: string;  // Changed from CustomerDetailsName enum to string
  address: string;  // Changed from CustomerDetailsAddress enum to string
  phone: string;
  email: string;  // Changed from Email enum to string
}

export interface TechnicianTicketsProductDetail {
  id: string;
  name: string;  // Changed from ProductDetailName enum to string
  productModel: string;  // Changed from Brand enum to string
  productBrand: string;  // Changed from Brand enum to string
  warrantyStatus: string;  // Changed from WarrantyStatus enum to string
  brand: string;  // Changed from Brand enum to string
  model: string;  // Changed from Brand enum to string
  serialNum: string;
  description: string;  // Changed from EmailEnum to string
  type: string;  // Changed from Brand enum to string
  address: string;  // Changed from CustomerDetailsAddress enum to string
  productIssues: TechnicianTicketsProductIssue[];
}

export interface TechnicianTicketsProductIssue {
  id: string;
  name: string;  // Changed from ProductIssueName enum to string
  description: string;  // Changed from Brand enum to string
}

export interface TechnicianTicketsTechnicianDetails {
  id: string;  // Changed from TechnicianDetailsID enum to string
  name: null;
  address: string;  // Changed from EmailEnum to string
  phone: string;  // Changed from EmailEnum to string
  email: string;  // Changed from EmailEnum to string
  franchiseId: string;  // Changed from FranchiseID enum to string
  franchiseName: string;  // Changed from FranchiseName enum to string
  assignedAt: string;  // Changed from Date to string
}

// Enums remain the same but might not be necessary if you want to keep them
export enum Status {
  Assigned = "Assigned",
  Completed = "Completed",
  InProgress = "InProgress",
}

export enum Priority {
  High = "High",
}

export enum TicketTag {
  Installation = "Installation",
}

// Note: Get Ticket Stats Month Wise By Technician Id Type Start Here
export interface TicketStatsMonthWiseByTechnicianIdResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: TicketStatsMonthWiseByTechnicianIdData;
  exception: any[];
}

export interface TicketStatsMonthWiseByTechnicianIdData {
  totalCount: number;
  monthlyTicketStatus: MonthlyTicketStatus[];
}

export interface MonthlyTicketStatus {
  status: string;
  count: number;
}

// Note: Get Technician Productivity By ID Type Start Here
export interface TechnicianProductivityByIDResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: TechnicianProductivityByIDData;
  exception: any[];
}

export interface TechnicianProductivityByIDData {
  minimumTickets: number;
  completedTickets: number;
  weekly_Average: number;
}

// Note: Get Spare Parts Request By Team ID Type Start Here
export interface SparePartsRequestByTeamIDResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: SparePartsRequestByTeamIDDatum[];
  exception: any[];
}

export interface SparePartsRequestByTeamIDDatum {
  id: string;
  status: string;
  teamID: string;
  ticketID: string;
  jobID: null;
  requestedSpareParts: SparePartsRequestByTeamIDRequestedSparePart[];
  isActive: boolean;
  isArchived: boolean;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface SparePartsRequestByTeamIDRequestedSparePart {
  sparePartID: string;
  sparePartName: string;
  sparePartImage: string;
  sparePartPrice: number;
  qty: number;
}

// Note: Delete Technician Type Start Here
export interface DeleteTechnicianResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface DeleteTechnicianRequest {
  user_ID: string;
}

export interface AssignPartnerToTechnicianRequest {
  technicianId: string;
  companyId: string;
}

// Note: Assign Partner To Technician Type Start Here
export interface AssignPartnerToTechnicianResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

// Note: Get Signed URL Type Start Here
export interface GetSignedUrlRequest {
  originalUrl: string;
}

export interface GetSignedUrlResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: {
    url: string;
  };
  exception: any[];
}