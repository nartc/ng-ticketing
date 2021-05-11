import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ticketRoutes } from './ticket.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ticketRoutes)],
})
export class ShellModule {}
