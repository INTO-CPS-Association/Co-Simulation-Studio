import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BoundedDifferenceConstraint } from 'src/app/modules/shared/classes/co-simulation-config';
import { InstanceScalarPair } from 'src/app/modules/shared/classes/fmu';
import BoundedDifferenceReactComponent from './bounded-difference';

@Component({
    selector: 'app-bounded-difference',
    templateUrl: './bounded-difference.component.html',
    styleUrls: ['./bounded-difference.component.scss']
})


export class BoundedDifferenceComponent {
    BoundedDifferenceComponent = BoundedDifferenceReactComponent;
    BoundedDifferenceProps = this;

   
    
    //------------Inputs-----------
    // FIXME non-agular interface 
    @Input()
    constraint: BoundedDifferenceConstraint = new BoundedDifferenceConstraint();

    // FIXME non-agular interface 
    @Input()
    ports: Array<InstanceScalarPair> = [];
 
    @Input()
    formGroup!: FormGroup;

    @Input()
    editing: boolean = false;


    //-----------Methods-----------
    customTrackBy(index: number, obj: any): any {
        return index;
    }

    addPort() {
        this.constraint.ports.push(this.ports[0]);
        this.updatePortValidation();
    }

    removePort(port: InstanceScalarPair) {
        this.constraint.ports.splice(this.constraint.ports.indexOf(port), 1);
        this.updatePortValidation();
    }

    onPortChange(output: InstanceScalarPair, index: number) {
        this.constraint.ports[index] = output;
        this.updatePortValidation();
    }

    updatePortValidation() {
        let formControl = <FormControl>this.formGroup.get('ports');
        formControl.updateValueAndValidity();
    }
}
