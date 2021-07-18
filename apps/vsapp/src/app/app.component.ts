import { Component } from '@angular/core';

@Component({
  selector: 'vs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'vsapp';
  url = '/assets/statics/starship.mp4';
  config = { width: '960px', height: '540px' };

  setUrl($event: string) {
    this.url = '';
    setTimeout(() => (this.url = $event));
  }
}
