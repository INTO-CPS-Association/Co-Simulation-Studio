import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SamplingRateConstraint } from 'src/app/modules/shared/classes/co-simulation-config';
import inputcomponent_id from './_inputcomponent_id';
import inputcomponent_base from './_inputcomponent_base';
import inputcomponent_rate from './_inputcomponent_rate';
@Component({
  selector: 'app-sampling-rate',
  templateUrl: './sampling-rate.component.html',
  styleUrls: ['./sampling-rate.component.scss']
})
export class SamplingRateComponent {

  props = this
  _inputcomponent_rate = inputcomponent_rate
  _inputcomponent_base = inputcomponent_base;
  _inputcomponent_id = inputcomponent_id;
  //FIXME This is nonangular interface
  @Input()
  constraint!: SamplingRateConstraint;

  @Input()
  editing: boolean = false;

  @Input()
  formGroup!: FormGroup;

  setConstraintId(Input: string){
    
    this.constraint.id = Input
  }

  setConstraintBase(Input: string){
    let input_number = parseInt(Input, 10);
    console.log(input_number)
    this.constraint.base = input_number
  }

  setConstraintRate(input: string){
    let input_number = parseInt(input, 10);
    console.log(input)
    this.constraint.rate = input_number
  }
}
