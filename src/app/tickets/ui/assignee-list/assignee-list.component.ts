import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ApiResponse } from '../../../shared/data-access/models/api-response.model';
import { User } from '../../data-access/backend.service';

@Component({
  selector: 'app-assignee-list',
  template: `
    <div class="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
      <div class="block text-gray-700 text-lg font-semibold py-2 px-2">
        Assignees
      </div>
      <ng-container *ngIf="usersResponse.status === 'success'">
        <div class="py-3 text-sm">
          <div
            *ngFor="let user of usersResponse.data"
            class="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2"
            (click)="assigneeSelect.emit(user.id)"
          >
            <div class="flex-grow font-medium px-2">{{ user.name }}</div>
            <div class="text-sm font-normal text-gray-500 tracking-wide">
              {{ user.id }}
            </div>
          </div>
        </div>
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
})
export class AssigneeListComponent {
  @Input() usersResponse!: ApiResponse<User[]>;
  @Output() assigneeSelect = new EventEmitter<number>();
}
