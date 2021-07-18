import { VideoPlayerConfig, VideoPlayerThemes } from '@video-system/models';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { COMPONENT_WITH_ON_HOVER } from '../on-hover.directive';
import { preloadVideoThumbs } from '@video-system/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const defaults: VideoPlayerConfig = {
  theme: VideoPlayerThemes.dark,
  width: '960px',
  height: '540px',
  autoplay: false,
  preloadThumbs: true,
};

@Component({
  selector: 'vs-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  providers: [
    { provide: COMPONENT_WITH_ON_HOVER, useExisting: VideoPlayerComponent },
  ],
})
export class VideoPlayerComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('videoPlayer') vp!: ElementRef;
  @Input() options!: any;
  @Input() url = '/assets/statics/starship.mp4';
  onHover = false;
  videoLoaded = false;
  thumbs$ = new BehaviorSubject<any[]>([]);
  ts!: any[];
  thumb: string = '{}';
  sec!: number;
  destroy$ = new Subject();
  get showActions() {
    return !!(this.vp?.nativeElement?.paused || this.vp?.nativeElement?.ended);
  }

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.options = {...defaults, ...(this.options ?? {})};
    this.thumbs$.pipe(takeUntil(this.destroy$)).subscribe((ts) => {
      this.ts = ts;
      this.thumb = JSON.stringify(
        (this.ts ?? []).find((t) => t.sec === this.sec) ?? {}
      );
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url && changes.url.previousValue !== changes.url.currentValue)
      this.thumbs$.next([]);
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
  }

  onDataLoaded() {
    this.videoLoaded = true;
    this.vp.nativeElement.muted = "muted";
    if (this.options.preloadThumbs) {
      const cloned = this.vp.nativeElement.cloneNode(true);
      cloned.setAttribute(
        'style',
        `width: ${this.options.width};height: ${this.options.height}; display: none`
      );
      preloadVideoThumbs(
        this.thumbs$,
        parseInt(this.vp.nativeElement.duration),
        cloned,
        this.options
      );
    }
  }

  onThumbChange(sec: number) {
    sec = Math.min(sec, 107);
    this.thumb = JSON.stringify(
      (this.ts ?? []).find((t) => t.sec === sec) ?? {}
    );
  }

  actionOnVideo(play?: boolean) {
    const video = this.vp.nativeElement;
    if (video.currentTime > 0 && !video.paused && !video.ended) {
      video.pause();
    } else {
      video.play();
    }
  }
}
