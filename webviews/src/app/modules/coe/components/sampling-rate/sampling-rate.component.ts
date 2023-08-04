import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SamplingRateConstraint } from 'src/app/modules/shared/classes/configuration/co-simulation-config';

@Component({
  selector: 'app-sampling-rate',
  templateUrl: './sampling-rate.component.html',
  styleUrls: ['./sampling-rate.component.scss']
})
export class SamplingRateComponent {

  //FIXME This is nonangular interface
  @Input()
  constraint!: SamplingRateConstraint;

  @Input()
  editing: boolean = false;

  @Input()
  formGroup!: FormGroup;

}
