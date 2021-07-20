import { VideoPlayerConfig, VideoPlayerThemes } from '@video-system/models';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { COMPONENT_WITH_ON_HOVER } from '../on-hover.directive';
import { preloadVideoThumbs } from '@video-system/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';

export const defaults: VideoPlayerConfig = {
  theme: VideoPlayerThemes.dark,
  width: '960px',
  height: '540px',
  frontendPreload: true,
  autoplay: false,
  mute: true,
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
  @Output() progressBarHover = new EventEmitter<number>();
  @Input() options!: Partial<VideoPlayerConfig>;
  @Input() url = '/assets/statics/starship.mp4';
  @Input() thumb = '{}';
  private destroy$ = new Subject();
  private url$ = new BehaviorSubject<string>('');
  private ts: any[] = [];
  private sec = 0;
  get showActions() {
    return !!(this.vp?.nativeElement?.paused || this.vp?.nativeElement?.ended);
  }
  thumbs$ = new BehaviorSubject<any[]>([]);
  onHover = false;
  videoLoaded = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.options = { ...defaults, ...(this.options ?? {}) };
    this.thumbs$
      .pipe(
        filter((_) => !!this.options?.frontendPreload),
        take(1),
        switchMap((_) => this.url$.pipe(switchMap((_) => this.thumbs$))),
        takeUntil(this.destroy$)
      )
      .subscribe((ts) => {
        this.ts = ts;
        this.thumb = JSON.stringify(
          this.ts.find((t) => t.sec === this.sec) ?? {}
        );
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url && changes.url.previousValue !== changes.url.currentValue)
      this._reload(changes.url.currentValue);
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
  }

  onPbHovered(sec: number) {
    if (!this.options.frontendPreload) return this.progressBarHover.emit(sec);
    
    this.sec = Math.min(
      sec,
      parseInt(`${this.vp?.nativeElement?.duration - 1}`)
    );
    this.thumb = JSON.stringify(this.ts.find((t) => t.sec === this.sec) ?? {});
  }

  actionOnVideo(play?: boolean) {
    const video = this.vp.nativeElement;
    if (video.currentTime > 0 && !video.paused && !video.ended) {
      video.pause();
    } else {
      video.play();
    }
  }

  onDataLoaded() {
    this.videoLoaded = true;
    this._initPlay();
    this._initVolume();
    this._initFrontEndPreload();
  }

  private _initVolume() {
    if (this.options?.mute) this.vp.nativeElement.muted = 'muted';
    else this.vp.nativeElement.volume = 0.5;
  }

  private _initPlay() {
    if (this.options?.autoplay) this.vp.nativeElement.play();
  }

  private _initFrontEndPreload() {
    if (this.options?.frontendPreload) {
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

  private _reload(url: string) {
    this.thumbs$ = new BehaviorSubject<any[]>([]);
    this.url$.next(url);
    this.onHover = false;
    this.videoLoaded = false;
    this.ts = [];
    this.thumb = '{}';
    this.sec = 0;
    this.vp?.nativeElement?.load();
  }
}
