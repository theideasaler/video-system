import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { comps } from './index';
import { OnHoverDirective } from './on-hover.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AppDragDropDirective } from './app-drag-drop.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FilesService } from '../../../services';
import { HttpClientModule } from '@angular/common/http';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatTooltipModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatSliderModule,
    IvyCarouselModule,
  ],
  declarations: [...comps, OnHoverDirective, AppDragDropDirective],
  exports: [
    ...comps,
    MatTooltipModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatSliderModule,
    IvyCarouselModule,
  ],
  providers: [FilesService],
})
export class SharedUiModule {}
