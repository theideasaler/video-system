import { VideoPlayerConfig, VideoPlayerThemes } from '@video-system/models';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vs-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit {
  @Input() options: VideoPlayerConfig = {
    theme: VideoPlayerThemes.dark,
    width: 960,
    height: 540,
  };

  constructor() {}

  ngOnInit(): void {}
}
