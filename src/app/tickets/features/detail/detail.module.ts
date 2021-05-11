import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ButtonModule} from "../../../shared/ui/button/button.module";
import {AssigneeListModule} from "../../ui/assignee-list/assignee-list.module";
import { DetailComponent } from './detail.component';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: DetailComponent }]),
    ButtonModule,
    AssigneeListModule,
  ],
})
export class DetailModule {}
