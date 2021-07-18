import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'vs-video-loader',
  templateUrl: './video-loader.component.html',
  styleUrls: ['./video-loader.component.scss']
})
export class VideoLoaderComponent implements OnInit {
  @Output() selectedChange = new EventEmitter<string>();
  images = [
    {path: '/assets/statics/starship.png', url: '/assets/statics/starship.mp4'},
    {path: '/assets/statics/kitten.png', url: '/assets/statics/kitten.mp4'},
    {path: '/assets/statics/css-tricks.png', url: '/assets/statics/css-tricks.mp4'},
    {path: '/assets/statics/nsw-news.png', url: '/assets/statics/nsw-news.mp4'},
  ];
  constructor() { }

  ngOnInit(): void {
  }

  onClick(url: string) {
    this.selectedChange.emit(url);
  }
}
