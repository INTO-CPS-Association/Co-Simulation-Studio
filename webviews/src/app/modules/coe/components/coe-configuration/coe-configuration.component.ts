import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BoundedDifferenceConstraint, CoSimulationConfig, FixedStepAlgorithm, FmuMaxStepSizeConstraint, ICoSimAlgorithm, LiveGraph, SamplingRateConstraint, VariableStepAlgorithm, VariableStepConstraint, ZeroCrossingConstraint } from 'src/app/modules/shared/classes/co-simulation-config';
import { WarningMessage } from 'src/app/modules/shared/classes/messages';
import { CausalityType, Fmu, Instance, InstanceScalarPair, ScalarVariable, ScalarVariableType } from 'src/app/modules/shared/classes/fmu';
import { lessThanValidator2, numberValidator, uniqueGroupPropertyValidator } from 'src/app/modules/shared/classes/validators';
import { NavigationService } from 'src/app/modules/shared/services/navigation.service';
import IntoCpsApp from 'src/app/modules/shared/classes/into-cps-app';
const dialog: any = {};

@Component({
	selector: 'app-coe-configuration',
	templateUrl: './coe-configuration.component.html',
	styleUrls: ['./coe-configuration.component.scss']
})
export class CoeConfigurationComponent {

	_path!: string;
	_allowChangingAlgorithm: boolean = true;
	_editing: boolean = false;

	// FIXME Fmu is non-angular interface
	public Fmu_x = Fmu;

	@Input()
	public set allow_changing_algorithm(allowChangingAlgorithm: boolean) {
		this._allowChangingAlgorithm = allowChangingAlgorithm;
		this.editAlgorithm = allowChangingAlgorithm;
	}

	public editAlgorithm: boolean = false;

	@Input()
	set path(path: string) {
		this._path = path;

		if (path) this.parseConfig();
	}
	get path(): string {
		return this._path;
	}

	@Output()
	change = new EventEmitter<string>();

	form!: FormGroup;
	// FIXME ICosimAlgorithm is a non-angular interface 
	algorithms: ICoSimAlgorithm[] = [];
	algorithmFormGroups = new Map<ICoSimAlgorithm, FormGroup>();
	//FIXME InstanceScalarPair Is a non-angular interface 
	outputPorts: Array<InstanceScalarPair> = [];
	//FIXME Instrance ScalarPair is a non-angular interface 
	newConstraint!: any /* new (...args: any[]) => VariableStepConstraint*/;

	set editing(editing: boolean) {
		this._editing = editing;
		this.editAlgorithm = this._allowChangingAlgorithm && this.editing;
	}

	get editing(): boolean {
		return this._editing;
	}

	isLoaded: boolean = false;
	logVariablesSearchName: string = "";
	parseError: string | null = null;
	// FIXME warningmessage is non-angular interface
	warnings: WarningMessage[] = [];
	loglevels: string[] = ["Not set", "ERROR", "WARN", "INFO", "DEBUG", "TRACE"];

	// liveGraphs: LiveGraph[];
	//The variable zeroCrossings is necessary to give different names to the radiobutton groups in the different zeroCrossing constraints.
	// Otherwise they will all be connected.
	zeroCrossings: number = 0;

	// FIXME CoSim is Non-angular interface 
	config!: CoSimulationConfig;

	//FIXME uses non-angluar interfaces
	algorithmConstructors = [FixedStepAlgorithm, VariableStepAlgorithm];

	//FIXME uses non-angluar interfaces
	constraintConstructors = [ZeroCrossingConstraint, BoundedDifferenceConstraint, SamplingRateConstraint, FmuMaxStepSizeConstraint];

	//FIXME Navigationservice non-angluar interfaces
	constructor(private zone: NgZone, private navigationService: NavigationService) {
		this.navigationService.registerComponent(this);
	}

	//FIXME uses non-angluar interfaces
	parseConfig() {
		let project = IntoCpsApp.getInstance()?.getActiveProject();
		if (project == null)
			return;
		CoSimulationConfig.parse(this.path, project.getRootFilePath(), project.getFmusPath())
			.then(
				(config) => {
					this.config = config;

					this.warnings = this.config.validate();

					this.parseError = null;

					// Create an array of the algorithm from the coe config and a new instance of all other algorithms
					this.algorithms = this.algorithmConstructors.map((constructor) => (config.algorithm instanceof constructor ? config.algorithm : new constructor()));
					// Create an array of formGroups for the algorithms
					this.algorithms.forEach((algorithm) => {
						this.algorithmFormGroups.set(algorithm, algorithm.toFormGroup());
					});
					// Create an array of all output ports on all instances
					this.outputPorts = <any>this.config.multiModel.fmuInstances
						.map((instance) =>
							instance.fmu.scalarVariables
								.filter((sv: any) => sv.type === ScalarVariableType.Real && (sv.causality === CausalityType.Output || sv.causality === CausalityType.Parameter))
								.map((sv: any) => this.config.multiModel.getInstanceScalarPair(instance.fmu.name, instance.name, sv.name))
						)
						.reduce((a, b) => a.concat(...b), []) ;

					// Create a form group for validation
					this.form = new FormGroup(
						{
							//PL-TODO these should be fixed in issue 78
							//startTime: new FormControl(config.startTime, [Validators.required, numberValidator]),
							//endTime: new FormControl(config.endTime, [Validators.required, numberValidator]),
							liveGraphs: new FormArray(
								config.liveGraphs.map((g) => g.toFormGroup()),
								//uniqueGroupPropertyValidator("id")
							), //, uniqueGroupPropertyValidator("id")
							//livestreamInterval: new FormControl(config.livestreamInterval, [Validators.required, numberValidator]),
							//liveGraphColumns: new FormControl(config.liveGraphColumns, [Validators.required, numberValidator]),
							//liveGraphVisibleRowCount: new FormControl(config.liveGraphVisibleRowCount, [Validators.required, numberValidator]),
							//FIXME Line below does not work 
							//algorithm: this.algorithmFormGroups.get(this.config.algorithm),
							//global_absolute_tolerance: new FormControl(config.global_absolute_tolerance, [Validators.required, numberValidator]),
							//global_relative_tolerance: new FormControl(config.global_relative_tolerance, [Validators.required, numberValidator]),
						},
						//FIXME need to be tested 
						lessThanValidator2("startTime", "endTime"),
						null
					);
					console.log("Parsing finished!");
					this.isLoaded = true;
				},
				(error) =>
					this.zone.run(() => {
						this.parseError = error;
					})
			)
			.catch((error) => console.error(`Error during parsing of config: ${error}`));
	}
	//FIXME uses non-angular interface 
	public setPostProcessingScript(config: CoSimulationConfig, path: string) {
		config.postProcessingScript = config.getProjectRelativePath(path);
	}

	//FIXME uses non-angular interface 
	onNavigate(): boolean {
		if (!this.editing) return true;

		if (this.form.valid) {
			if (confirm("Save your work before leaving?")) this.onSubmit();

			return true;
		} else {
			return confirm("The changes to the configuration are invalid and can not be saved. Continue anyway?");
		}
	}

	//FIXME uses non-angular interface 
	onAlgorithmChange(algorithm: ICoSimAlgorithm) {
		this.zone.run(() => {
			this.config.algorithm = algorithm;

			this.form.removeControl("algorithm");
			this.form.addControl("algorithm", this.algorithmFormGroups.get(algorithm));
		});
	}
	//FIXME uses non-angular interface 
	onSubmit() {
		if (!this.editing) return;

		this.warnings = this.config.validate();

		let override = false;

		if (this.warnings.length > 0) {
			let res = dialog.showMessageBoxSync({ title: "The multi-model for this configuration has changed!", message: "Do you want to override it?", buttons: ["No", "Yes"] });
			if (res == 1) {
				override = true;
				this.warnings = [];
			}
		}

		if (override) {
			this.config
				.saveOverride()
				.then(() => this.change.emit(this.path))
				.catch((error) => console.error("error when overriding save: " + error));
		} else {
			this.config
				.save()
				.then(() => this.change.emit(this.path))
				.catch((error) => console.error("error when saving: " + error));
		}

		this.editing = false;
	}
	//FIXME uses non-angular interface 
	getOutputs(scalarVariables: Array<ScalarVariable>) {
		return scalarVariables.filter((variable) => variable.causality === CausalityType.Output || variable.causality === CausalityType.Local);
	}

	//FIXME uses non-angular interface 
	getFilterTypes(scalarVariables: Array<InstanceScalarPair>, types: ScalarVariableType[]) {
		return scalarVariables.filter((v) => types.indexOf(v.scalarVariable.type) > -1);
	}
	//FIXME uses non-angular interface 
	restrictToCheckedLogVariables(instance: Instance, scalarVariables: Array<ScalarVariable>) {
		return scalarVariables.filter((variable) => this.isLogVariableChecked(instance, variable));
	}
	//FIXME uses non-angular interface 
	addConstraint(value: any) {
		if (!this.newConstraint) return;

		let algorithm = <VariableStepAlgorithm>this.config.algorithm;
		let formArray = <FormArray>this.form.get("algorithm")?.get("constraints");
		let constraint = new this.newConstraint();
		algorithm.constraints.push(constraint);
		formArray.push(constraint.toFormGroup());
	}
	//FIXME uses non-angular interface 
	removeConstraint(constraint: VariableStepConstraint) {
		let algorithm = <VariableStepAlgorithm>this.config.algorithm;
		let formArray = <FormArray>this.form.get("algorithm")?.get("constraints");
		let index = algorithm.constraints.indexOf(constraint);

		algorithm.constraints.splice(index, 1);
		formArray.removeAt(index);
	}
	//FIXME uses non-angular interface 
	addLiveGraph() {
		let g = new LiveGraph();
		this.config.liveGraphs.push(g);
		let formArray = <FormArray>this.form.get("liveGraphs");
		formArray.push(g.toFormGroup());
	}
	//FIXME uses non-angular interface 
	removeGraph(graph: LiveGraph) {
		let formArray = <FormArray>this.form.get("liveGraphs");
		let index = this.config.liveGraphs.indexOf(graph);
		this.config.liveGraphs.splice(index, 1);
		formArray.removeAt(index);
	}
	//FIXME uses non-angular interface 
	getConstraintName(constraint: any) {
		if (constraint === ZeroCrossingConstraint || constraint instanceof ZeroCrossingConstraint) return "Zero Crossing";
		if (constraint === FmuMaxStepSizeConstraint || constraint instanceof FmuMaxStepSizeConstraint) return "FMU Max Step Size";
		if (constraint === BoundedDifferenceConstraint || constraint instanceof BoundedDifferenceConstraint) return "Bounded Difference";
		if (constraint === SamplingRateConstraint || constraint instanceof SamplingRateConstraint) return "Sampling Rate";
		return undefined;
	}
	//FIXME uses non-angular interface 
	isLogVariableChecked(instance: Instance, output: ScalarVariable) {
		let variables = this.config.logVariables.get(instance);

		if (!variables) return false;

		return variables.indexOf(output) !== -1;
	}
	//FIXME uses non-angular interface 
	isLocal(variable: ScalarVariable): boolean {
		return variable.causality === CausalityType.Local;
	}
	//FIXME uses non-angular interface 
	getScalarVariableTypeName(type: ScalarVariableType) {
		return ScalarVariableType[type];
	}
	//FIXME uses non-angular interface 
	onLogVariableChange(enabled: boolean, instance: Instance, output: ScalarVariable) {
		let variables = this.config.logVariables.get(instance);

		if (!variables) {
			variables = [];
			this.config.logVariables.set(instance, variables);
		}

		if (enabled) variables.push(output);
		else {
			variables.splice(variables.indexOf(output), 1);

			if (variables.length == 0) this.config.logVariables.delete(instance);
		}
	}
	//FIXME uses non-angular interface 
	onLogVariablesKey(event: any) {
		this.logVariablesSearchName = event.target.value;
	}

}
