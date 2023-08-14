import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ZeroCrossingConstraint } from 'src/app/modules/shared/classes/co-simulation-config';
import { InstanceScalarPair } from 'src/app/modules/shared/classes/fmu';

@Component({
    selector: 'app-zero-crossing',
    templateUrl: './zero-crossing.component.html',
    styleUrls: ['./zero-crossing.component.scss']
})
export class ZeroCrossingComponent {

    //FIXME Non angular interface
    @Input()
    constraint!: ZeroCrossingConstraint;

    //FIXME Non angular interface
    @Input()
    ports: Array<InstanceScalarPair> = [];

    _formGroup!: FormGroup

    @Input()
    formGroup!: FormGroup;

    @Input()
    editing: boolean = false;

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
