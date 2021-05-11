import { of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { ApiResponseStatus } from '../../data-access/models/api-response.model';
import { toApiResponse } from './to-api-response.util';

describe('toApiResponse', () => {
  let scheduler: TestScheduler;
  const loadingResponseFactory = (data: unknown) => ({
    status: ApiResponseStatus.Loading,
    data,
    error: '',
  });

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should stream correctly', () => {
    scheduler.run(({ expectObservable }) => {
      const expectedMarble = '(ab|)';
      const expectedResponse = {
        a: loadingResponseFactory(''),
        b: { status: ApiResponseStatus.Success, data: 'foo', error: '' },
      };
      const apiResponse$ = of('foo').pipe(toApiResponse(''));
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should return error if sourceObs throws and rethrow is false', () => {
    scheduler.run(({ expectObservable }) => {
      const errorMessage = 'an error';
      const expectedMarble = '(ab|)';
      const expectedResponse = {
        a: loadingResponseFactory(null),
        b: {
          status: ApiResponseStatus.Failure,
          data: null,
          error: errorMessage,
        },
      };
      const apiResponse$ = throwError(new Error(errorMessage)).pipe(
        toApiResponse(null),
      );
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should rethrow error if sourceObs throws and rethrow is true', () => {
    scheduler.run(({ expectObservable }) => {
      const expectedMarble = '(a#)';
      const expectedResponse = {
        a: loadingResponseFactory(null),
      };
      const apiResponse$ = throwError('error').pipe(toApiResponse(null, true));
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should return error if sourceObs throws and errFactory is passed in', () => {
    scheduler.run(({ expectObservable }) => {
      const errorMessage = 'an error';
      const expectedMarble = '(ab|)';
      const expectedResponse = {
        a: loadingResponseFactory(null),
        b: {
          status: ApiResponseStatus.Failure,
          data: null,
          error: errorMessage + ' foo',
        },
      };
      const apiResponse$ = throwError(new Error(errorMessage)).pipe(
        toApiResponse(null, (err) => (err as Error).message + ' foo'),
      );
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });

  it('should return error if sourceObs throws and errObsFactory is passed in', () => {
    scheduler.run(({ expectObservable }) => {
      const errorMessage = 'an error';
      const expectedMarble = '(ab|)';
      const expectedResponse = {
        a: loadingResponseFactory(null),
        b: {
          status: ApiResponseStatus.Failure,
          data: null,
          error: errorMessage + ' foo',
        },
      };
      const apiResponse$ = throwError(new Error(errorMessage)).pipe(
        toApiResponse(null, (err) => of((err as Error).message + ' foo')),
      );
      expectObservable(apiResponse$).toBe(expectedMarble, expectedResponse);
    });
  });
});
