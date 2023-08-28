import { Component, Input, OnInit } from '@angular/core';
import  CoePageReact from './coe-page';

@Component({
  selector: 'app-coe-page',
  templateUrl: './coe-page.component.html',
  styleUrls: ['./coe-page.component.scss']
})
export class CoePageComponent {
  coePageComponent = CoePageReact; 
  coePageProps = this;

  @Input()
  path!: string;

}
