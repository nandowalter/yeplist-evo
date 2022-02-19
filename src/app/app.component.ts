import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  message: string = '';
  title = 'yeplist-evo';

  
  displayMessage(message: string) {
    this.message = message;
  }
}
