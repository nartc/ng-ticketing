import {
  isObservable,
  Observable,
  of,
  pipe,
  throwError,
  UnaryFunction,
} from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import {
  ApiResponse,
  ApiResponseStatus,
} from '../../data-access/models/api-response.model';

export function toApiResponse<TData>(
  initialValue: TData extends object ? Partial<TData> : TData,
  errObsFactoryOrRethrow?:
    | true
    | ((err: unknown) => unknown | Observable<unknown>),
): UnaryFunction<Observable<TData>, Observable<ApiResponse<TData>>> {
  return pipe(
    map<TData, ApiResponse<TData>>((data) => ({
      status: ApiResponseStatus.Success,
      data,
      error: '',
    })),
    startWith({
      status: ApiResponseStatus.Loading,
      data: initialValue as TData,
      error: '',
    }),
    catchError((err) => {
      const defaultFailureResponse = {
        status: ApiResponseStatus.Failure,
        data: initialValue as TData,
      };

      if (errObsFactoryOrRethrow == null) {
        return of<ApiResponse<TData>>({
          ...defaultFailureResponse,
          error: err.message || err.error || err.toString(),
        });
      }

      if (typeof errObsFactoryOrRethrow === 'function') {
        const error = errObsFactoryOrRethrow(err);
        if (isObservable(error)) {
          return error.pipe(
            map<unknown, ApiResponse<TData>>((e) => ({
              ...defaultFailureResponse,
              error: e,
            })),
          );
        }

        return of<ApiResponse<TData>>({
          ...defaultFailureResponse,
          error,
        });
      }

      return throwError(err);
    }),
  );
}
