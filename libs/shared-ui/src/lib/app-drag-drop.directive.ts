import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';


@Directive({
  selector: '[vsAppDragDrop]'
})
export class AppDragDropDirective {
  @Output() fileDropped = new EventEmitter<any>();
  @HostBinding('class.fileover') fileover!: boolean;

  constructor() {}

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover = true;
  }
  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover = false;
  }
  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover = false;
    const files = evt.dataTransfer.files;
    if (files.length === 1) {
      this.fileDropped.emit(files);
    }
  }
}
