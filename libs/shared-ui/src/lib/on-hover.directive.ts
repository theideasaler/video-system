import { Directive, EventEmitter, HostListener, Inject, InjectionToken, Input, Optional, Output } from '@angular/core';

export const COMPONENT_WITH_ON_HOVER = new InjectionToken<ComponentWithOnHover>(
  'COMPONENT_WITH_ON_HOVER'
);

export interface ComponentWithOnHover {
  [key: string]: boolean
}

@Directive({
  selector: '[vsOnHover]',
})
export class OnHoverDirective {
  @Input() hoverKey = 'onHover';
  constructor(
    @Optional()
    @Inject(COMPONENT_WITH_ON_HOVER)
    private component: ComponentWithOnHover
  ) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.component[this.hoverKey] = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.component[this.hoverKey] = false;
  }
}
