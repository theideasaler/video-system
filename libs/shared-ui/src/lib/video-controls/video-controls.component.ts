import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { VideoControlConfig } from '@video-system/models';
import * as moment from 'moment';
import { COMPONENT_WITH_ON_HOVER } from '../on-hover.directive';

export const defaults: VideoControlConfig = {
  showThumbnail: true,
};

@Component({
  selector: 'vs-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.scss'],
  providers: [
    { provide: COMPONENT_WITH_ON_HOVER, useExisting: VideoControlsComponent },
  ],
})
export class VideoControlsComponent implements OnInit, OnChanges {
  @Output() stateChange = new EventEmitter<boolean>();
  @Output() pbOnHover = new EventEmitter<number>();
  @Input() target!: ElementRef<any>;
  @Input() thumb: any = {};
  @ViewChild('tooltip') tooltip!: MatTooltip;
  @ViewChild('progressBar') pb!: ElementRef;
  onHover = false;
  barLength = '0%';
  mouseLeft = '0%';
  totalTime = '00:00';
  currentTime = '0:00';
  mouseTime = '0:00';
  mouseSecs!: number;

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    if(!this.target) return;
    this.totalTime = this._formatTime(this.target.nativeElement.duration);
    this._updateStyles();
    this.target.nativeElement.ontimeupdate = (_: any) => {
      const video = this.target.nativeElement;
      this.barLength = (video.currentTime / video.duration) * 100 + '%';
      this.currentTime = this._formatTime(video.currentTime);
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.thumb &&
      changes.thumb.previousValue !== changes.thumb.currentValue
    ) {
      this.thumb = JSON.parse(changes.thumb.currentValue ?? '{}');
    }
  }

  onMouseMove($event: MouseEvent) {
    this.mouseSecs = this._getMouseTime(
      $event.clientX,
      this.pb.nativeElement.getBoundingClientRect().left,
      this.pb.nativeElement.offsetWidth,
      this.target.nativeElement.duration
    );
    this.mouseTime = this._formatTime(this.mouseSecs);
    this.pbOnHover.emit(parseInt(`${this.mouseSecs}`));
  }

  onProgressbarClick($event: MouseEvent) {
    const mouseSecs = this._getMouseTime(
      $event.clientX,
      this.pb.nativeElement.getBoundingClientRect().left,
      this.pb.nativeElement.offsetWidth,
      this.target.nativeElement.duration
    );
    this.target.nativeElement.currentTime = mouseSecs;
  }

  private _getMouseTime(
    mouseX: number,
    pbLeft: number,
    pbWidth: number,
    duration: number
  ) {
    this.mouseLeft = ((mouseX - pbLeft) / pbWidth) * 100 + '%';
    return ((mouseX - pbLeft) / pbWidth) * duration;
  }

  private _formatTime(secs: number) {
    return moment
      .utc(secs * 1000)
      .format('HH:mm:ss')
      .replace(/^0(?:0:0?)?/, '');
  }

  private _updateStyles() {
    this.elRef.nativeElement.style.setProperty(
      '--widthRatio',
      this.target?.nativeElement?.offsetHeight
        ? (this.target?.nativeElement?.offsetWidth ?? 0) /
            this.target.nativeElement.offsetHeight
        : 1.77
    );
  }
}