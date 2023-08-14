import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorMessage, WarningMessage } from 'src/app/modules/shared/classes/messages';
import { MultiModelConfig } from 'src/app/modules/shared/classes/multi-model-config';
import { CausalityType, Fmu, Instance, InstanceScalarPair, isCausalityCompatible, isTypeCompatiple, ScalarValuePair, ScalarVariable, ScalarVariableType } from 'src/app/modules/shared/classes/fmu';
import { IProject } from 'src/app/modules/shared/classes/project';
import { uniqueControlValidator } from 'src/app/modules/shared/classes/validators';
import { NavigationService } from 'src/app/modules/shared/services/navigation.service';
import * as Path from "path";
import IntoCpsApp from 'src/app/modules/shared/classes/into-cps-app';

@Component({
    selector: 'app-mm-configuration',
    templateUrl: './mm-configuration.component.html',
    styleUrls: ['./mm-configuration.component.scss']
})
export class MmConfigurationComponent {

    _path!: string;

    @Input()
    set path(path: string) {
        this._path = path;

        if (path)
            this.parseConfig();
    }
    get path(): string {
        return this._path;
    }

    @Output()
    change = new EventEmitter<string>();

    form?: FormGroup;
    editing: boolean = false;
    parseError: string | null = null;
    warnings: WarningMessage[] = [];
    config?: MultiModelConfig;

    selectedParameterInstance?: Instance;
    selectedOutputInstance?: Instance;
    selectedOutput?: ScalarVariable;
    selectedInputInstance?: Instance;
    selectedInstanceFmu?: Fmu;

    newParameter?: ScalarVariable;

    constructor(private zone: NgZone, private navigationService: NavigationService) {
        this.navigationService.registerComponent(this);
    }

    parseConfig() {
        let project: IProject | undefined | null = IntoCpsApp.getInstance()?.getActiveProject();

        MultiModelConfig
            .parse(this.path, project?.getFmusPath() ?? "")
            .then(config => {
                /* this.zone.run(() => { */
                this.parseError = null;

                this.config = config;

                // Create a form group for validation
                this.form = new FormGroup({
                    /*PL-TODO
                    Issue here is typing around uniqueControlValidator.
                    Ive used "<any>" instead of the original typing
                    */
                    fmus: new FormArray(this.config.fmus.map(fmu =>
                        new FormControl(this.getFmuName(fmu),
                            [Validators.required, Validators.pattern("[^{^}]*")])),
                            <any>uniqueControlValidator),
                    instances: new FormArray(this.config.fmus.map(fmu =>
                        new FormArray(this.getInstances(fmu)!.map(instance => //added ! exclamation mark as it is the non-null assertion operator in TypeScript. Otherwise it throws an error saying fmu can be undefined due to the ? optional operator.
                            new FormControl(instance.name, [Validators.required,
                            Validators.pattern("[^\.]*")])), <any>uniqueControlValidator)))
                            
                });
                this.warnings = this.config.validate();
                /*  }); */

            }, error => this.parseError = error).catch(err => console.log(err)); /*  this.zone.run(() => */
    }

    onNavigate(): boolean {
        if (!this.editing)
            return true;

        if (this.form?.valid) {
            if (confirm("Save your work before leaving?"))
                this.onSubmit();

            return true;
        } else {
            return confirm("The changes to the configuration are invalid and can not be saved. Continue anyway?");
        }
    }

    onSubmit() {
        if (!this.editing) return;

        this.warnings = this.config?.validate() ?? [];

        if (this.warnings.length > 0) return;
        this.config?.save()
            .then(() => {
                this.selectOutputInstance(null);
                this.selectParameterInstance(null);
                this.change.emit(this.path);
            }).catch(error => console.error("Error when submitting changes to mm: " + error));

        this.editing = false;
    }

    addFmu() {
        let fmu = this.config?.addFmu();

        let formArray = <FormArray>this.form?.get('fmus');
        let fmuArray = <FormArray>this.form?.get('instances');

        fmuArray.push(new FormArray([], <any>uniqueControlValidator)); //PL-TODO UniqueControlValidator threw same error down here previous fix (<any>) made this compile
        formArray.push(new FormControl(this.getFmuName(fmu), [Validators.required, Validators.pattern("[^{^}]*")]));
    }

    removeFmu(fmu: Fmu) {
        let fmuArray = <FormArray>this.form?.get('fmus');
        let index = this.config?.fmus.indexOf(fmu);

        if (this.selectedInstanceFmu === fmu)
            this.selectInstanceFmu(null);

        this.config?.fmuInstances
            .filter(instance => instance.fmu === fmu)
            .forEach(instance => this.removeInstanceFromForm(instance));

        if (index != null)
            fmuArray.removeAt(index);
        this.config?.removeFmu(fmu);
    }

    getScalarTypeName(type: number) {
        return ['Real', 'Bool', 'Int', 'String', 'Unknown'][type];
    }

    getFmuName(fmu: Fmu | null | undefined): string {
        if (fmu == null)
            return "";
        return fmu.name.substring(1, fmu.name.length - 1);
    }

    setFmuName(fmu: Fmu, name: string) {
        fmu.name = `{${name}}`;
    }

    setFmuPath(fmu: Fmu, path: string) {
        fmu
            .updatePath(path)
            .then(() => this.zone.run(() => { })).catch(error => console.error("Error in setting FMUpath: " + error));

        this.selectOutputInstance(null);
    }

    addInstance(fmu: Fmu) {
        let instance = this.config?.addInstance(fmu);

        let fmuIndex = this.config?.fmus.indexOf(fmu);
        let fmuArray = <FormArray>this.form?.get('instances');
        let instanceArray = <FormArray>fmuArray.controls[fmuIndex ?? 0];

        instanceArray.push(new FormControl(instance?.name, [Validators.required, Validators.pattern("[^\.]*")]));
    }

    removeInstance(instance: Instance) {
        this.removeInstanceFromForm(instance);
        this.config?.removeInstance(instance);
    }

    removeInstanceFromForm(instance: Instance) {
        let fmuIndex = this.config?.fmus.indexOf(instance.fmu);
        let fmuArray = <FormArray>this.form?.get('instances');
        let instanceArray = <FormArray>fmuArray.controls[fmuIndex ?? 0];
        let index = this.getInstances(instance.fmu)?.indexOf(instance);

        if (this.selectedInputInstance === instance)
            this.selectInputInstance(null);

        if (this.selectedOutputInstance === instance)
            this.selectOutputInstance(null);

        if (this.selectedParameterInstance === instance)
            this.selectParameterInstance(null);

        instanceArray.removeAt(index ?? 0);
    }

    getInstances(fmu: Fmu) {
        return this.config?.fmuInstances.filter(instance => instance.fmu === fmu);
    }

    getInstanceFormControl(fmu: Fmu, index: number): FormControl {
        let fmuIndex = this.config?.fmus.indexOf(fmu);
        let fmuArray = <FormArray>this.form?.get('instances');
        let instanceArray = <FormArray>fmuArray.controls[fmuIndex ?? 0];

        return <FormControl>instanceArray.controls[index];
    }

    selectInstanceFmu(fmu: Fmu | null) {
        if (fmu != null)
            this.selectedInstanceFmu = fmu;
    }

    selectParameterInstance(instance: Instance | null) {
        if (instance != null)
            this.selectedParameterInstance = instance;
        this.newParameter = this.getParameters()[0] ?? undefined;
    }

    selectOutputInstance(instance: Instance | null) {
        if (instance != null)
            this.selectedOutputInstance = instance;
        this.selectOutput(null);
    }

    selectOutput(variable: ScalarVariable | null) {
        if (variable != null)
            this.selectedOutput = variable;
        this.selectInputInstance(null);
    }

    selectInputInstance(instance: Instance | null) {
        this.selectedInputInstance = instance ?? undefined;
    }

    getInitialValues(): Array<ScalarValuePair> {
        let initialValues: Array<ScalarValuePair> = [];

        this.selectedParameterInstance?.initialValues.forEach((value, variable) => {
            initialValues.push(new ScalarValuePair(variable, value));
        });

        return initialValues;
    }

    addParameter() {
        if (!this.newParameter) return;

        this.selectedParameterInstance?.initialValues.set(this.newParameter, '');
        this.newParameter = this.getParameters()[0] ?? undefined;
    }

    isTypeBool(type: ScalarVariableType) {
        return type === ScalarVariableType.Bool;
    }

    setParameter(parameter: ScalarVariable, value: any) {
        if (parameter.type === ScalarVariableType.Real)
            value = parseFloat(value);
        else if (parameter.type === ScalarVariableType.Int)
            value = parseInt(value);
        else if (parameter.type === ScalarVariableType.Bool)
            value = !!value;

        this.selectedParameterInstance?.initialValues.set(parameter, value);
    }

    removeParameter(instance: Instance, parameter: ScalarVariable) {
        instance.initialValues.delete(parameter);
        this.newParameter = this.getParameters()[0] ?? undefined;
    }

    getParameters(): ScalarVariable[] {
        if (!this.selectedParameterInstance)
            return [];

        return this.selectedParameterInstance.fmu.scalarVariables
            .filter(variable => isCausalityCompatible(variable.causality, CausalityType.Parameter) && !this.selectedParameterInstance?.initialValues.has(variable));
    }

    getOutputs() {
        return this.selectedOutputInstance?.fmu.scalarVariables
            .filter(variable => isCausalityCompatible(variable.causality, CausalityType.Output));
    }

    getInputs() {
        return this.selectedInputInstance?.fmu.scalarVariables
            .filter(variable => isCausalityCompatible(variable.causality, CausalityType.Input) && this.selectedOutput?.type != null && isTypeCompatiple(variable.type, this.selectedOutput?.type));
    }

    isInputConnected(input: ScalarVariable) {
        if (this.selectedOutput == null)
            return false;

        let pairs = this.selectedOutputInstance?.outputsTo.get(this.selectedOutput);

        if (!pairs)
            return false;

        return pairs.filter(pair => pair.instance === this.selectedInputInstance && pair.scalarVariable === input).length > 0;
    }

    onConnectionChange(checked: boolean, input: ScalarVariable) {

        if (this.selectedOutput == null)
            return;

        let outputsTo: InstanceScalarPair[] | undefined = this.selectedOutputInstance?.outputsTo.get(this.selectedOutput);

        if (checked) {
            if (outputsTo == null) {
                outputsTo = [];
                this.selectedOutputInstance?.outputsTo.set(this.selectedOutput, outputsTo);
            }
            if (this.selectedInputInstance != null)
                outputsTo.push(new InstanceScalarPair(this.selectedInputInstance, input));
        } else {
            if (outputsTo != null)
                outputsTo.splice(outputsTo.findIndex(pair => pair.instance === this.selectedInputInstance && pair.scalarVariable === input), 1);

            if (outputsTo != null && outputsTo.length === 0)
                this.selectedOutputInstance?.outputsTo.delete(this.selectedOutput);
        }
    }


    createDisplayFmuPath(fmusRootPath: string, path: string): string {

        if (path.startsWith(fmusRootPath)) {
            return Path.basename(path);
        }
        else {
            return path;
        }
    }


    getWarnings() {
        return this.warnings.filter(w => !(w instanceof ErrorMessage));
    }

    getErrors() {
        return this.warnings.filter(w => w instanceof ErrorMessage);
    }

}
