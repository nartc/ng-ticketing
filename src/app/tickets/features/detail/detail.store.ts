import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { forkJoin } from 'rxjs';
import {
  concatMap,
  map,
  pluck,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  ApiResponse,
  ApiResponseStatus,
} from '../../../shared/data-access/models/api-response.model';
import { toApiResponse } from '../../../shared/utils/rx/to-api-response.util';
import {
  BackendService,
  TicketWithUser,
  User,
} from '../../data-access/backend.service';

export interface DetailState {
  ticketResponse: ApiResponse<TicketWithUser | null>;
  usersResponse: ApiResponse<User[]>;
  isAssigning: boolean;
}

interface ToggleTicketEffectParams {
  id: number;
  completed: boolean;
}

interface AssignTicketEffectParams {
  userId: number;
  ticketId: number;
}

@Injectable()
export class DetailStore extends ComponentStore<DetailState> {
  readonly vm$ = this.select(
    ({
      ticketResponse: { data, error, status },
      isAssigning,
      usersResponse,
    }) => ({
      error,
      data,
      isLoading: status === ApiResponseStatus.Loading,
      isSuccess: status === ApiResponseStatus.Success,
      usersResponse,
      isAssigning,
    }),
    { debounce: true },
  );

  constructor(
    private readonly backend: BackendService,
    private readonly route: ActivatedRoute,
  ) {
    super({
      ticketResponse: { status: ApiResponseStatus.Idle, data: null, error: '' },
      usersResponse: { status: ApiResponseStatus.Idle, data: [], error: '' },
      isAssigning: false,
    });

    this.getTicketEffect(this.route.params.pipe(pluck('id')));
  }

  readonly getTicketEffect = this.effect<string>((ticketId$) =>
    ticketId$.pipe(
      switchMap((ticketId) =>
        forkJoin([this.backend.ticket(+ticketId), this.backend.users()]).pipe(
          map(([ticket, users]) => {
            if (!ticket) return null;
            return {
              ...ticket,
              assignee: users.find((user) => user.id === ticket.assigneeId),
            };
          }),
          toApiResponse<TicketWithUser | null>(null),
          tapResponse((ticketResponse) => {
            this.patchState({ ticketResponse });
          }, console.error),
        ),
      ),
    ),
  );

  readonly toggleTicketStatusEffect = this.effect<ToggleTicketEffectParams>(
    (params$) =>
      params$.pipe(
        concatMap(({ id, completed }) =>
          this.backend.complete(id, completed).pipe(
            tapResponse((ticket) => {
              this.patchState((state) => ({
                ticketResponse: {
                  ...state.ticketResponse,
                  data: {
                    ...state.ticketResponse.data!,
                    completed: ticket.completed,
                  },
                },
              }));
            }, console.error),
          ),
        ),
      ),
  );

  readonly getUsersEffect = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.backend.users().pipe(
          toApiResponse([] as User[]),
          tapResponse((usersResponse) => {
            this.patchState({ usersResponse });
          }, console.error),
        ),
      ),
    ),
  );

  readonly toggleIsAssigningEffect = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.patchState((state) => ({ isAssigning: !state.isAssigning }));
      }),
    ),
  );

  readonly assignTicketEffect = this.effect<AssignTicketEffectParams>(
    (params$) =>
      params$.pipe(
        concatMap(({ userId, ticketId }) =>
          this.backend.assign(ticketId, userId).pipe(
            withLatestFrom(this.select((s) => s.usersResponse.data)),
            tapResponse(([ticket, users]) => {
              this.patchState((state) => ({
                isAssigning: false,
                ticketResponse: {
                  ...state.ticketResponse,
                  data: {
                    ...state.ticketResponse.data,
                    ...ticket,
                    assignee: users.find(
                      (user) => user.id === ticket.assigneeId,
                    ),
                  },
                },
              }));
            }, console.error),
          ),
        ),
      ),
  );
}
