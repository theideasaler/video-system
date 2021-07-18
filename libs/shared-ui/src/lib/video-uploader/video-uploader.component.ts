import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilesService } from 'libs/services';

@Component({
  selector: 'vs-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.scss'],
})
export class VideoUploaderComponent implements OnInit {
  @Output() selected = new EventEmitter<string | null>();
  @Input() options =  { width: '960px' };
  file: any;
  base64Data!: string;
  fileProgress = 0;
  videoInfo = {};
  constructor(private snackBar: MatSnackBar, private fileSvc: FilesService) {}

  ngOnInit(): void {}

  uploadFile(target: any) {
    this.file = target?.files[0] ?? null;
    if (!this._isVideoFile()) return;

    this._loadProgress();
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      this._saveVideo(data);
    };
    reader.readAsDataURL(this.file);
  }

  deleteUpload() {
    this._clearUpload();
    this.selected.emit(null);
  }

  private _saveVideo(data: string) {
    const prefix = 'data:video/mp4;base64,';
    data = data.slice(prefix.length);
    this.base64Data = data;
    this.fileSvc.upload(this.file.name.replace(/\s+/g, '-'), data).subscribe(
      (response: any) => {
        // TODO
      },
      (err) => {
        // TODO
      }
    );
  }
  
  private _isVideoFile() {
    if (this.file && this.file.type === 'video/mp4') {
      return true
    } else {
      this._openSnackBar('Please upload a mp4 file');
      this._clearUpload();
      return false;
    }
  }

  private _loadProgress() {
    this.fileProgress = 0;
    const progressInterval = setInterval(() => {
      if (this.fileProgress === 100) {
        clearInterval(progressInterval);
      } else {
        this.fileProgress += 10;
      }
    }, 250);
  }

  private _clearUpload() {
    this.fileProgress = 0;
    this.file = undefined;
  }

  private _openSnackBar(
    message: string,
    action: string = 'close',
    duration: number = 1500
  ) {
    this.snackBar.open(message, action, { duration });
  }
}
