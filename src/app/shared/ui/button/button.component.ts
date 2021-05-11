import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      type="button"
      class="px-4 py-2 rounded bg-blue-400 hover:bg-blue-500 text-white w-full"
      (click)="$event.stopPropagation(); click.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Output() click = new EventEmitter<MouseEvent>();
}
