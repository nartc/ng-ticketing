import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DetailStore } from './detail.store';

@Component({
  selector: 'app-detail',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <h1 class="text-4xl">Ticket {{ vm.data?.id }}</h1>
      <ng-container *ngIf="vm.isSuccess">
        <div class="flex flex-col gap-4">
          <h4 class="text-2xl font-bold">{{ vm.data?.description }}</h4>
          <ng-container *ngIf="vm.data?.assignee; else noAssignee">
            <p>
              This task is assigned to {{ vm.data?.assignee?.name }}
              <span *ngIf="vm.data?.completed">and has been completed.</span>
            </p>
            <app-button
              *ngIf="!vm.data?.completed; else completed"
              (click)="complete(vm.data?.id)"
            >
              Complete the task
            </app-button>
            <ng-template #completed>
              <app-button (click)="revert(vm.data?.id)">Revert</app-button>
            </ng-template>
          </ng-container>
          <ng-template #noAssignee>
            <p>This task is not assigned to anyone</p>
            <app-button (click)="toggleAssigning(vm.isAssigning)">
              Assign
            </app-button>
            <ng-container *ngIf="vm.isAssigning">
              <app-assignee-list
                [usersResponse]="vm.usersResponse"
                (assigneeSelect)="assign($event, vm.data?.id)"
              ></app-assignee-list>
            </ng-container>
          </ng-template>
        </div>
      </ng-container>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DetailStore],
})
export class DetailComponent {
  readonly vm$ = this.detailStore.vm$;

  constructor(private readonly detailStore: DetailStore) {}

  complete(id: number | undefined) {
    if (!id) return;
    this.detailStore.toggleTicketStatusEffect({ id, completed: true });
  }

  revert(id: number | undefined) {
    if (!id) return;
    this.detailStore.toggleTicketStatusEffect({ id, completed: false });
  }

  toggleAssigning(isAssigning: boolean) {
    this.detailStore.toggleIsAssigningEffect();
    if (!isAssigning) {
      this.detailStore.getUsersEffect();
    }
  }

  assign(userId: number, ticketId: number | undefined) {
    if (!ticketId) return;
    this.detailStore.assignTicketEffect({ userId, ticketId });
  }
}
