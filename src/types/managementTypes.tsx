// Note: Skills Types Start Here
export interface TotalSkillsCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: SkillsData;
  exception: any[];
}

export interface SearchSkillsResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: SkillsCategoriesIssue[];
  exception: any[];
}

export interface SkillsData {
  totalCount: number;
  skillsCategoriesIssue: SkillsCategoriesIssue[];
}

export interface SkillsCategoriesIssue {
  skillID: string;
  skillName: string;
  productCategories: SkillsProductCategory[];
}

export interface SkillsProductCategory {
  productCategoryID: string;
  productCategoryName: SkillsProductCategoryName;
  issueTypes: SkillsIssueType[];
}

export interface SkillsIssueType {
  issueID: SkillsProductCategoryName;
  issueName: SkillsProductCategoryName;
}

export enum SkillsProductCategoryName {
  Cooker = "COOKER",
  Dishwashers = "DISHWASHERS",
  String = "string",
}

// Note: sparepart Types Start Here
export interface TotalsparepartCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: sparepart;
  exception: any[];
}

export interface sparepart {
  totalCount: number;
  spareParts: sparepartData[];
}

export interface sparepartData {
  id: string;
  name: string;
  price: number;
  imageUrl: sparepartImageURL;
  prodCategoriesIssues: sparepartprodCategoriesIssues[];
  createdAt: Date;
}

export interface sparepartprodCategoriesIssues {
  issueId: string;
  issueName: string;
  productCategoryId: string;
  productCategoryName: string;
}

export enum sparepartImageURL {
  ImageURLString = "string",
  Stasdring = "stasdring",
  String = "String",
}

// Note: Services Types Start Here
export interface TotalServicesCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: ServicesData;
  exception: any[];
}

export interface SearchServicesResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: SearchServiceData[];
  exception: any[];
}

export interface SearchIssuesResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: SearchIssueData[];
  exception: any[];
}

export interface SearchIssueData {
  issueId: string;
  issueName: string;
  issueDescription: string;
  issueType: string;
  isOtherIssue: boolean;
  isActive: boolean;
  isArchived: boolean;
  createdDate: Date;
  createdBy: string;
  updatedBy: string;
  issueProductCategories: any[];
}

export interface SearchServiceData {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  prodCategoriesIssues: any[];
}

export interface ServicesData {
  totalCount: number;
  services: ServicesDataArray[];
}

export interface ServicesDataArray {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  prodCategoriesIssues: any[];
}

export interface AddSkillRequest {
  skills: Skill[];
}

export interface Skill {
  name: string;
  description: string;
  productCategories: ProductCategory[];
}

export interface ProductCategory {
  product_id: string;
  product_name: string;
  issues: Issue[];
}

export interface Issue {
  issue_id: string;
  issue_Name: string;
}

export interface AddSkillRequest { }

export interface AddSkillResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface AddSparePartsRequest {
  spareParts: SparePart[];
}

export interface SparePart {
  name: string;
  price: number;
  imageUrl: string;
}

export interface AddSparePartsResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface AddIssuesRequest { }

export interface AddIssuesResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface AddServiceRequest { }

export interface AddServiceResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface getIssueByProductResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: IssueByProduct;
  exception: any[];
}

export interface IssueByProduct {
  totalIssues: number;
  responseGetIssues: ResponseGetIssue[];
}

export interface ResponseGetIssue {
  issueId: string;
  issueName: string;
  issueDescription: string;
  issueType: string;
  isOtherIssue: boolean;
  isActive: boolean;
  isArchived: boolean;
  createdDate: Date;
  createdBy: string;
  updatedBy: string;
  issueProductCategories: IssueProductCategory[];
}

export interface IssueProductCategory {
  prodCategoryId: string;
  prodCategoryName: string;
}

// Note: Ticker List By Partner
export interface getTicketListByPartnerIDResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: TicketListByPartnerIDData;
  exception: any[];
}

export interface TicketListByPartnerIDData {
  totalTickets: number;
  tickets: Ticket[];
}

export interface Ticket {
  id: string;
  status: Status;
  priority: Priority;
  requiredDate: Date;
  requiredTime: string;
  createdDate: Date;
  updatedBy: string;
  createdBy: string;
  updatedDate: Date;
  technicianDetails: TechnicianDetails;
  customerDetails: CustomerDetails;
  productDetails: ProductDetail[];
  companyId: string;
}

export interface CustomerDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export enum Priority {
  High = "High",
  Low = "Low",
  Medium = "Medium",
}

export interface ProductDetail {
  id: string;
  name: string;
  productModel: string;
  productBrand: string;
  warrantyStatus: WarrantyStatus;
  brand: string;
  model: string;
  serialNum: string;
  description: string;
  type: string;
  address: string;
  productIssues: ProductIssue[];
}

export interface ProductIssue {
  id: string;
  name: string;
  description: string;
}

export enum WarrantyStatus {
  Empty = "",
  False = "False",
  True = "True",
}

export enum Status {
  Assigned = "Assigned",
  Completed = "Completed",
}

export interface TechnicianDetails {
  id: string;
  name: string | null;
  address: string;
  phone: string;
  email: string;
  franchiseId: string;
  assignedAt: Date;
}

// Note: TYPES FOR DELEING SKILL, SPARE PARTS, SERVICES, ISSUES...!
export interface RemoveSkillRequest {
  id: string;
}

export interface RemoveSkillResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface RemoveIssueRequest {
  issueId: string;
}

export interface RemoveIssueResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface RemoveSparePartRequest {
  id: string;
}

export interface RemoveSparePartResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface RemoveServiceRequest {
  id: string;
}

export interface RemoveServiceResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

// Note: Remove Ticker By ID
export interface RemoveTicketResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface RemoveTicketRequest {
  ticketId: string;
}

// Note: Ticket Details Types
export interface TotalTicketDetailsCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: TicketDetailsData;
  exception: any[];
}

export interface TicketDetailsData {
  jobId: string;
  jobStatus: string;
  isSparePartExist: boolean;
  sparePartRequestId: string;
  isTicketScheduled: boolean;
  id: string;
  status: string;
  priority: string;
  requiredDate: Date;
  requiredTime: string;
  createdDate: Date;
  updatedBy: string;
  createdBy: string;
  updatedDate: Date;
  companyId: string;
  companyName: string;
  technicianDetails: TicketDetailsTechnicianDetails;
  customerDetails: TicketDetailsCustomerDetails;
  productDetails: TicketDetailsProductDetail[];
  ticketTag: null;
  parentTicketId: null;
  orderId: null;
}

export interface TicketDetailsCustomerDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface TicketDetailsProductDetail {
  id: string;
  name: string;
  productModel: string;
  productBrand: string;
  warrantyStatus: string;
  brand: string;
  model: string;
  serialNum: string;
  description: string;
  type: string;
  address: string;
  productIssues: any[];
}

export interface TicketDetailsTechnicianDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  franchiseId: string;
  franchiseName: string;
  assignedAt: Date;
}

// Note: Ticket Log Types
export interface TotalTicketLogCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: TotalTicketLogData[];
  exception: any[];
}

export interface TotalTicketLogData {
  id: string;
  description: string;
  status: string;
  createdAt: Date;
  details: TotalTicketLogDetails | null;
}

export interface TotalTicketLogDetails {
  detailTag: string;
  imageUrls: string[];
  // data: TotalTicketLogDataDatum[] | TotalTicketLogDataClass;
  data: any;
}

export interface TotalTicketLogDataDatum {
  sparePartId: string;
  sparePartName: string;
  qty: number;
  vendorId: string;
  vendorSignature: string;
}

export interface TotalTicketLogDataClass {
  total: number;
  customerSignature: string;
}

export interface UpdateSkillRequest {
  id: string;
  name: string;
  description: string;
  categories: UpdateCategory[];
}

export interface UpdateCategory {
  id: string;
  name: string;
  issues: UpdateIssue[];
}

export interface UpdateIssue {
  id: string;
  name: string;
}

export interface UpdateSkillResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

export interface UpdateServiceRequest {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: ServiceCategory[];
}

export interface ServiceCategory {
  prodCategoryId: string;
  prodCategoryName: string;
  issues: ServiceIssue[];
}

export interface ServiceIssue {
  id: string;
  name: string;
}

export interface UpdateServiceResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
  traceId: string;
}

export interface UpdateSparePartsRequest {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categories: PartsCategories[];
}

export interface PartsCategories {
  id: string;
  name: string;
  issues: PartsIssue[];
}

export interface PartsIssue {
  id: string;
  name: string;
}

export interface UpdateSparePartsResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

// Note: Technician List By Franchise ID
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
  technicians: Technician[];
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  apartment: string;
  state: string;
  imageURL: string;
  franchiseID: string;
  franchiseName: string;
  spr: string;
  city: string;
  zipCode: string;
  createdBy: string;
  updatedBy: string;
  yearsOfExperience: number;
  updatedDate: Date;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  iqama: Iqama;
}

export interface Iqama {
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

export interface AssignTicketToTechnicianRequest {
  targetNamespace: string;
  tag: string;
  ticketId: string;
  priority: string;
  technicianDetails: TechnicianDetailsRequest;
}

export interface TechnicianDetailsRequest {
  technicianId: string;
  technicianName: string;
  franchiseId: string;
}

export interface AssignTicketToTechnicianResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: null;
  exception: any[];
  traceId: string;
}

export interface UpdateServiceRequest {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: ServiceCategory[];
}

export interface ServiceCategory {
  prodCategoryId: string;
  prodCategoryName: string;
  issues: ServiceIssue[];
}

export interface ServiceIssue {
  id: string;
  name: string;
}

export interface UpdateServiceResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

// Note: Assign Multiple Tickets To Technician
export interface AssignMultiplePendingTicketsToTechnicianRequest {
  ticketIds: string[];
}

export interface AssignMultiplePendingTicketsToTechnicianResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}