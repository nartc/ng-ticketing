import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import { RouterModule } from '@angular/router';
import { ButtonModule } from '../../../shared/ui/button/button.module';
import { ListComponent } from './list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ListComponent }]),
    ButtonModule,
    ReactiveFormsModule,
  ],
})
export class ListModule {}
