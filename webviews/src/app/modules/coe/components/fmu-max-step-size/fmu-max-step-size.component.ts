import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FmuMaxStepSizeConstraint } from 'src/app/modules/shared/classes/co-simulation-config';

@Component({
  selector: 'app-fmu-max-step-size',
  templateUrl: './fmu-max-step-size.component.html',
  styleUrls: ['./fmu-max-step-size.component.scss']
})
export class FmuMaxStepSizeComponent {

  @Input()
  constraint!: FmuMaxStepSizeConstraint;

  @Input()
  formGroup!: FormGroup;

  @Input()
  editing: boolean = false;

  customTrackBy(index: number, obj: any): any {
    return index;
  }
  
}
