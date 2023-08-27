import { Component, ElementRef, inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { ComponentProps, createElement, ElementType } from 'react';
import { createRoot } from "react-dom/client";

@Component({
  selector: 'app-react',
  template: '',
})
export class ReactComponent implements OnChanges, OnDestroy {

  @Input() component!: ElementType;
  @Input() props!: ComponentProps<ElementType>;
  private root;

  constructor() {
    this.root = createRoot(inject(ElementRef).nativeElement)
  }

  ngOnChanges() {
    this.root.render(createElement(this.component, this.props));
  }

  ngOnDestroy() {
    this.root.unmount();
  }

}
