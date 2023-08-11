/*
 * This file is part of the INTO-CPS toolchain.
 *
 * Copyright (c) 2017-CurrentYear, INTO-CPS Association,
 * c/o Professor Peter Gorm Larsen, Department of Engineering
 * Finlandsgade 22, 8200 Aarhus N.
 *
 * All rights reserved.
 *
 * THIS PROGRAM IS PROVIDED UNDER THE TERMS OF GPL VERSION 3 LICENSE OR
 * THIS INTO-CPS ASSOCIATION PUBLIC LICENSE VERSION 1.0.
 * ANY USE, REPRODUCTION OR DISTRIBUTION OF THIS PROGRAM CONSTITUTES
 * RECIPIENT'S ACCEPTANCE OF THE OSMC PUBLIC LICENSE OR THE GPL 
 * VERSION 3, ACCORDING TO RECIPIENTS CHOICE.
 *
 * The INTO-CPS toolchain  and the INTO-CPS Association Public License 
 * are obtained from the INTO-CPS Association, either from the above address,
 * from the URLs: http://www.into-cps.org, and in the INTO-CPS toolchain distribution.
 * GNU version 3 is obtained from: http://www.gnu.org/copyleft/gpl.html.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without
 * even the implied warranty of  MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE, EXCEPT AS EXPRESSLY SET FORTH IN THE
 * BY RECIPIENT SELECTED SUBSIDIARY LICENSE CONDITIONS OF
 * THE INTO-CPS ASSOCIATION.
 *
 * See the full INTO-CPS Association Public License conditions for more details.
 *
 * See the CONTRIBUTORS file for author and contributor information. 
 */

import { FormControl, FormArray, FormGroup, AsyncValidatorFn, AbstractControl } from "@angular/forms";
import { Observable } from 'rxjs';

function isNumber(x: any): boolean {
	let number = Number(x);
	return !isNaN(number) && isFinite(number);
}

export function numberValidator(control: FormControl): { invalidNumber: boolean } | undefined {
	if (!isNumber(control.value))
		return { invalidNumber: true };
	return undefined;
}

export function integerValidator(control: FormControl): { invalidInteger: boolean } | undefined {
	if (!Number.isInteger(control.value))
		return { invalidInteger: true };
	return undefined;
}

export function lengthValidator(min: number | null = null, max: number | null = null) {
	return (control: FormControl): { invalidLength: boolean } | undefined => {
		let length = control.value.length;
		if (length === undefined || min !== null && length < min || max !== null && length > max)
			return { invalidLength: true };
		return undefined;
	}
}

export function uniqueGroupPropertyValidator(propertyName: string) {
	return (control: FormArray): { notUnique: boolean } | undefined => {
		for (let i = 0; i < control.length; i++) {
			let group: FormGroup = <FormGroup>control.at(i);
			let value = group.controls[propertyName].value;
			for (let j = i + 1; j < control.length; j++) {
				let other: FormGroup = <FormGroup>control.at(j);
				let otherValue = other.controls[propertyName].value;
				if (value === otherValue)
					return { notUnique: value };
			}
		}
		return undefined;
	}
}

export function uniqueValidator(control: FormControl): { notUnique: boolean } | undefined {
	const elements = control.value;
	for (let i = 0; i < elements.length; i++) {
		for (let j = i + 1; j < elements.length; j++) {
			if (elements[i] === elements[j])
				return { notUnique: true };
		}
	}
	return undefined;
}

export function uniqueControlValidator(control: FormArray): { notUnique: boolean } | undefined {
	for (let i = 0; i < control.length; i++) {
		for (let j = i + 1; j < control.length; j++) {
			if (control.at(i).value === control.at(j).value)
				return { notUnique: control.at(i).value };
		}
	}
	return undefined;
}

// from angular v6 there is a pending call which is new to abstractControls if problems should arise with this function look into that.
export function lessThanValidator(selfName: string, otherName: string): AsyncValidatorFn {
	return (group: AbstractControl): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> => {
		return new Promise((resolve, reject) => {
			let self = group.get(selfName);
			let other = group.get(otherName);
			if (self?.value && other?.value && Number(self.value) >= Number(other.value)) {
				resolve({ notLessThan: true });
			} else {
				resolve(null);
			}
		});
	}
}

export function lessThanValidator2(selfName: string, otherName: string) {
	return (group: FormGroup): { notLessThan: boolean } | undefined => {
		let self = group.get(selfName);
		let other = group.get(otherName);
		if (self?.value && other?.value && Number(self.value) >= Number(other.value))
			return { notLessThan: true };
		return undefined;
	}
}
