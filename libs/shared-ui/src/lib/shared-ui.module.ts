import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { comps } from './index';
import { VideoUploaderComponent } from './video-uploader/video-uploader.component';
import { VideoLoaderComponent } from './video-loader/video-loader.component';

@NgModule({
  imports: [CommonModule],
  declarations: [...comps, VideoUploaderComponent, VideoLoaderComponent],
  exports: [...comps],
})
export class SharedUiModule {}
