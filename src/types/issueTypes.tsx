export interface FetchIssueResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: IssueData;
  exception: any[];
}

export interface IssueData {
  totalIssues: number;
  responseGetIssues: IssueResponseGetIssue[];
}

export interface IssueResponseGetIssue {
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

export interface UpdateIssueRequest {
  issueId:                    string;
  name:                       string;
  type:                       string;
  description:                string;
  isOtherIssue:               boolean;
  requestAddCategoryIssue:    RequestCategoryIssue[];
  requestDeleteCategoryIssue: RequestCategoryIssue[];
}

export interface RequestCategoryIssue {
  productCategoryId:   string;
  productCategoryName: string;
}

export interface UpdateIssueResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}




