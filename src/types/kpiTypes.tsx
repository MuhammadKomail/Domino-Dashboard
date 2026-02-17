export interface GetTicketStatsWeekWiseResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: GetTicketData;
  exception: any[];
}

export interface GetTicketData {
  data: Datum[];
  totaLTickets: number;
}

export interface Datum {
  id: string;
  priority: Priority;
  status: Status;
  isCancelled: boolean;
  createdDate: string;
  updatedDate: string;
  day: Day;
}

export enum Day {
  Tuesday = "Tuesday",
}

export enum Priority {
  High = "High",
  Low = "Low",
  Medium = "Medium",
}

export enum Status {
  Assigned = "Assigned",
  Completed = "Completed",
  InProgress = "InProgress",
  Pending = "Pending",
}

export interface GetTicketStatsMonthWiseResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: GetTickeDataMonthWise;
  exception: any[];
}

export interface GetTickeDataMonthWise {
  totalCount: number;
  monthlyTicketStatus: MonthlyTicketStatus[];
}

export interface MonthlyTicketStatus {
  status: string;
  count: number;
}

export interface GetCancelledTicketsResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: CancelledTicketCount[];
  exception: any[];
}

export interface CancelledTicketCount {
  count: number;
  day: string;
}

export interface FetchRescheduleAnalysisResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: FetchRescheduleData;
  exception: any[];
}
export interface FetchRescheduleData {
  totalReschedulingInstance: number;
  currentMonthRescheduleInstance: number;
  avgReschedulePerOrder: number;
  sameDayReschedulesPercentage: number;
  avgResolutionTime: number;
}
export interface FetchAverageDetailsResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Data;
  exception: any[];
}

export interface Data {
  avgRepeatedJobs: number;
  avgTurnAroundTime: number;
  avgLeadTime: number;
}


export interface FetchtechnicianProductivityResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: technicianProductivityData;
  exception: any[];
}

export interface technicianProductivityData {
  minimumTickets: number;
  avgDailyCompletedTickets: number;
  avgWeeklyCompletedTickets: number;
}

export interface FetchCustomerRetentionRateResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: CustomerRetentionRateData[];
  exception: any[];
}

export interface CustomerRetentionRateData {
  count: number;
  month: number;
}
