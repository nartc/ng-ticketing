import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AssigneeListComponent } from './assignee-list.component';

@NgModule({
  declarations: [AssigneeListComponent],
  imports: [CommonModule],
  exports: [AssigneeListComponent],
})
export class AssigneeListModule {}
