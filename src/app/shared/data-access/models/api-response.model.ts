export enum ApiResponseStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Failure = 'failure',
}

export interface ApiResponse<TData> {
  data: TData;
  status: ApiResponseStatus;
  error: unknown;
}
