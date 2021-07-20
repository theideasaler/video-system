import { Component } from '@angular/core';
import { VideoPlayerConfig } from '@video-system/models';

@Component({
  selector: 'vs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'vsapp';
  url = '/assets/statics/starship.mp4';
  config: Partial<VideoPlayerConfig> = { width: '960px', height: '540px', autoplay: true, mute: false, borderRadius: '50px' };
}
