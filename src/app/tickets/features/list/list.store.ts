import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { forkJoin } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import {
  ApiResponse,
  ApiResponseStatus,
} from '../../../shared/data-access/models/api-response.model';
import { toApiResponse } from '../../../shared/utils/rx/to-api-response.util';
import {
  BackendService,
  TicketWithUser,
} from '../../data-access/backend.service';

export interface ListState {
  ticketsResponse: ApiResponse<TicketWithUser[]>;
  query: string;
  isAdding: boolean;
}

@Injectable()
export class ListStore extends ComponentStore<ListState> {
  readonly vm$ = this.select(
    ({ ticketsResponse: { status, error, data }, query, isAdding }) => ({
      error,
      data: this.filterTickets(query, data),
      isSuccess: status === ApiResponseStatus.Success,
      isLoading: status === ApiResponseStatus.Loading,
      isError: status === ApiResponseStatus.Failure,
      isAdding,
    }),
    {
      debounce: true,
    },
  );

  constructor(private readonly backend: BackendService) {
    super({
      ticketsResponse: { status: ApiResponseStatus.Idle, data: [], error: '' },
      query: '',
      isAdding: false,
    });
  }

  readonly setQuery = this.updater<string>((state, query) => ({
    ...state,
    query,
  }));

  readonly getTicketsEffect = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return forkJoin([this.backend.tickets(), this.backend.users()]).pipe(
          map(([tickets, users]) =>
            tickets.map((ticket) => ({
              ...ticket,
              assignee: users.find((user) => user.id === ticket.assigneeId),
            })),
          ),
          toApiResponse([] as TicketWithUser[]),
          tapResponse((response) => {
            this.patchState({ ticketsResponse: response });
          }, console.error),
        );
      }),
    ),
  );

  readonly addTicketEffect = this.effect<string>((description$) =>
    description$.pipe(
      concatMap((description) =>
        this.backend.newTicket({ description }).pipe(
          map((ticket) => ({ ...ticket, assignee: null })),
          tapResponse((newTicket) => {
            this.patchState((state) => ({
              ticketsResponse: {
                ...state.ticketsResponse,
                data: [...state.ticketsResponse.data, newTicket],
              },
            }));
          }, console.error),
        ),
      ),
    ),
  );

  private filterTickets(
    query: string,
    tickets: TicketWithUser[],
  ): TicketWithUser[] {
    if (!query) return tickets;
    const lowered = query.toLowerCase();
    return tickets.filter(
      (ticket) =>
        ticket.description.toLowerCase().startsWith(lowered) ||
        ticket.assignee?.name.toLowerCase().startsWith(lowered),
    );
  }
}
