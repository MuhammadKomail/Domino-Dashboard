// Note: Response structure for the API data...!
export interface ListAllActionResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Action[];
  exception: string[];
}

export interface addActionData {
  name: string;
  tag: string;
}

export interface AddActionResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: boolean;
  exception: string[];
}

export interface Action {
  id: string;
  name: string;
  tags: string;
}
