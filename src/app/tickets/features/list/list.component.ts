import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ListStore } from './list.store';

@Component({
  selector: 'app-list',
  template: `
    <h1 class="text-4xl">Tickets</h1>
    <div class="mt-4 grid grid-cols-4 gap-4">
      <ng-container *ngIf="vm$ | async as vm">
        <input
          type="text"
          class="col-span-3 border-gray-300 border rounded p-2"
          placeholder="Filter by description or assignee name..."
          [formControl]="queryControl"
        />
        <app-button (click)="toggleAdd()">Add Ticket</app-button>
        <input
          *ngIf="vm.isAdding"
          type="text"
          class="col-span-4 border-gray-300 border rounded p-2"
          placeholder="Ticket description. Press 'Enter' to add"
          [formControl]="ticketDescriptionControl"
          (keyup.enter)="add()"
        />
        <table
          *ngIf="vm.isSuccess"
          class="table-auto rounded-t-lg w-full bg-gray-200 text-gray-800 col-span-4"
        >
          <thead>
            <tr class="text-left border-b-2 border-gray-300">
              <th class="px-4 py-3">Task</th>
              <th class="px-4 py-3">Assignee</th>
              <th class="px-4 py-3">Completed</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let ticket of vm.data"
              class="bg-gray-100 border-b border-gray-200 hover:bg-gray-300 cursor-pointer"
              [routerLink]="[ticket.id]"
            >
              <td class="px-4 py-3">{{ ticket.description }}</td>
              <td class="px-4 py-3">
                {{ ticket.assignee?.name || 'No assignee' }}
              </td>
              <td class="px-4 py-3">{{ ticket.completed }}</td>
            </tr>
          </tbody>
        </table>
      </ng-container>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ListStore],
})
export class ListComponent implements OnInit {
  readonly vm$ = this.listStore.vm$;

  queryControl = new FormControl('');
  ticketDescriptionControl = new FormControl('');

  constructor(private readonly listStore: ListStore) {}

  ngOnInit(): void {
    this.listStore.getTicketsEffect();
    this.listStore.setQuery(
      this.queryControl.valueChanges.pipe(debounceTime(250)),
    );
  }

  toggleAdd() {
    this.listStore.patchState((state) => ({
      isAdding: !state.isAdding,
    }));
  }

  add() {
    const description = this.ticketDescriptionControl.value;
    if (!description) return;

    this.listStore.addTicketEffect(description);
    this.ticketDescriptionControl.reset();
  }
}
