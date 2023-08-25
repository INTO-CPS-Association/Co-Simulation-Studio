
import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IDseAlgorithm, DseConfiguration, ExhaustiveSearch, GeneticSearch, DseParameter, DseParameterConstraint, ExternalScript, InternalFunction, DseObjectiveConstraint, ParetoRanking, ParetoDimension, DseScenario } from 'src/app/modules/shared/classes/dse-configuration';
import { WarningMessage } from 'src/app/modules/shared/classes/messages';
import { Instance, ScalarVariable, isCausalityCompatible, CausalityType, ScalarValuePair, ScalarVariableType } from 'src/app/modules/shared/classes/fmu';
import { Project } from 'src/app/modules/shared/classes/project';
import { MaestroApiService } from 'src/app/modules/shared/services/maestro-api.service';
import { NavigationService } from 'src/app/modules/shared/services/navigation.service';
import IntoCpsApp from 'src/app/modules/shared/classes/into-cps-app';
import * as Path from "path";
import * as fs from 'fs'
import { Serializer } from 'src/app/modules/shared/classes/parser';
import { SettingKeys } from 'src/app/modules/shared/classes/setting-keys';
import {DseConfigurationReact} from "./dse-configuration"


/*TASKS
replace function calls with unified API
for now stub with dummy data
Get UI functional
use console.log or simple data to enable UI
*/
/*
------------------------------------------------------
FUNCTIONS THAT NEED TO BE EXTRACTED INTO API //PL-TODO
------------------------------------------------------
*/
export function readdirSync(path: string) : string[] {
    return ["a.txt", "b.txt"];
};
export function isDirectory(path: string) : boolean {

    return true;
}


/*
------------------------------------------------------
ACTUAL COMPONENT
------------------------------------------------------
*/
@Component({
    selector: 'app-dse-configuration',
    templateUrl: './dse-configuration.component.html',
    styleUrls: ['./dse-configuration.component.scss']
})
export class DseConfigurationComponent {
    component = DseConfigurationReact;
    props = this;

    _path!: string;
    _coeIsOnlineSub: Subscription;
    @Input()
    set path(path: string) {
        this._path = path;

        if (path) {
            let app: IntoCpsApp | undefined = IntoCpsApp.getInstance() ?? undefined; //intoCPSapp???
            let p: string = app?.getActiveProject()?.getRootFilePath() ?? "";
            this.cosimConfig = this.loadCosimConfigs(Path.join(p, Project.PATH_MULTI_MODELS));

        }
    }
    get path(): string {
        return this._path;
    }

    @Output()
    change = new EventEmitter<string>();

    @Output()
    coechange = new EventEmitter<string>();

    form!: FormGroup;
    algorithms: IDseAlgorithm[] = [];
    algorithmFormGroups = new Map<IDseAlgorithm, FormGroup>();
    editing: boolean = false;
    editingMM: boolean = false;
    isInValidDSEConfig: boolean = false;
    warnings: WarningMessage[] = [];
    parseError: string | null = null;

    mmSelected: boolean = true;
    mmPath: string = '';

    config = new DseConfiguration();
    cosimConfig: string[] = [];
    mmOutputs: string[] = [];
    objNames: string[] = [];
    coeconfig: string = '';

    online: boolean = false;
    dseWarnings: WarningMessage[] = [];
    coeWarnings: WarningMessage[] = [];

    onlineInterval!: number;

    selectedParameterInstance!: Instance;

    newParameter!: ScalarVariable;

    algorithmConstructors = [
        ExhaustiveSearch,
        GeneticSearch
    ];

    //Collection of arrays to use for drop-boxes. Some may be expanded as the backend is developed
    geneticPopulationDistribution = ["random"];//To add in when backend works["random", "uniform"];
    geneticParentSelectionStrategy = ["random"];//["random", "algorithmObjectiveSpace","algorithmDesignSpace"];
    internalFunctionTypes = ["max", "min", "mean"];
    externalScriptParamTp = ["model output", "constant", "simulation value"];
    simulationValue = ["step-size", "time"];
    paretoDirections = ["-", "+"];


    constructor(public maestroApiService: MaestroApiService, private zone: NgZone, public navigationService: NavigationService) {
        this.navigationService.registerComponent(this);
        this._coeIsOnlineSub = this.maestroApiService.startMonitoringOnlineStatus(isOnline => this.online = isOnline);
    }

    setEditing(edit: boolean): void{
        this.editing = edit;
        console.log("editing: " + this.editing);
    }

    ngOnDestroy() : void {
        clearInterval(this.onlineInterval);
        this.maestroApiService.stopMonitoringOnlineStatus(this._coeIsOnlineSub);
    }

    parseConfig(mmPath: string) : void {
        let project = IntoCpsApp.getInstance()?.getActiveProject();
        if (project == null)
            return;
        DseConfiguration
            .parse(this.path, project.getRootFilePath(), project.getFmusPath(), mmPath)
            .then(config => {
                this.zone.run(() => {
                    this.config = config;
                    //retrieve information to use for validation purposes
                    this.objNames = this.getObjectiveNames();
                    this.mmOutputs = this.loadMMOutputs();

                    // Create an array of the algorithm from the coe config and a new instance of all other algorithms
                    this.algorithms = this.algorithmConstructors
                        .map(constructor =>
                            config.searchAlgorithm instanceof constructor
                                ? config.searchAlgorithm
                                : new constructor()
                        );
                    // Create an array of formGroups for the algorithms
                    this.algorithms.forEach(algorithm => {
                        this.algorithmFormGroups.set(algorithm, algorithm.toFormGroup());
                    });

                    // Create a form group for validation
                    this.form = new FormGroup({
                        //searchAlgorithm: this.algorithmFormGroups.get(this.config.searchAlgorithm), //PL-TODO
                        paramConstraints: new FormArray(this.config.paramConst.map(c => new FormControl(c))),

                        objConstraints: new FormArray(this.config.objConst.map(c => new FormControl(c))),
                        extscr: new FormArray(this.config.extScrObjectives.map(s => new FormControl(s))),
                        scenarios: new FormArray(this.config.scenarios.map(s => new FormControl(s)))
                    });
                });
            }, error => this.zone.run(() => { this.parseError = error })).catch(error => console.error(`Error during parsing of config: ${error}`));

    }

    onNavigate(): boolean {
        if (!this.editing)
            return true;

        if (this.form.valid) {
            if (confirm("Save your work before leaving?"))
                this.onSubmit();

            return true;
        } else {
            return confirm("The changes to the configuration are invalid and can not be saved. Continue anyway?");
        }
    }

    onSubmit() {
        if (!this.editing) return;

        this.warnings = this.config.validate();

        let override = false; //override doesn't do anything but change state - there has to be something dependent on the state of override //FIXME

        if (this.warnings.length > 0) {

            //PL-TODO
            const electron: any = {};
            let dialog: any = {};
            /* let res = dialog.showMessageBox({ title: 'Validation failed', message: 'Do you want to save anyway?', buttons: ["No", "Yes"] });
  
            if (res == 0) {
                return;
            } else {
                override = true;
                this.warnings = [];
            } */
            // for electron v10
            let res = dialog.showMessageBox({ title: 'Validation failed', message: 'Do you want to save anyway?', buttons: ["No", "Yes"] });
            res.catch(() => {
                return
            });
            res.then(function (res: any) {
                if (res.response == 0) {
                    return;
                } else {
                    override = true;
                    //PL-TODO this.warnings = [];
                }
            })
        }

        this.config.save()
            .then(() => this.change.emit(this.path))
            .then(() => this.coechange.emit(this.coeconfig))
            .catch(error => console.error("error when saving dse config: " + error));

        this.editing = false;

    }

    /*
     * Method to state that the multi-model has been chosen for the DSE config
     */
    onMMSubmit() { //FIXME
        if (!this.editingMM) return;
        this.editingMM = false;
        if (this.mmPath !='')
        {
            this.mmSelected = true;
        }
    }


    


    getFiles(path: string): string[] {
        var fileList: string[] = [];
        
        
        var files = readdirSync(path); //stubbed function
        
        for (var i in files) {
            var name = Path.join(path, files[i]);
            if (isDirectory(name)) { //stubbed function
                fileList = fileList.concat(this.getFiles(name));
            } else {
                fileList.push(name);
            }
        }

        return fileList;
    }



    loadCosimConfigs(path: string): string[] {
        var files: string[] = this.getFiles(path);
        return files.filter(f => f.endsWith("coe.json"));
    }

    experimentName(path: string): string {
        let elems = path.split(Path.sep);
        let mm: string = elems[elems.length - 2];
        let ex: string = elems[elems.length - 3];
        return mm + " | " + ex;
    }

    getMultiModelName(): string {
        return this.experimentName(this.mmPath);
    }

    onConfigChange(config: string) {
        this.parseError = null;
        this.coeconfig = config;
        let mmPath = Path.join(this.coeconfig, "..", "..", "mm.json");
        /* let coePath = Path.join(this.coeconfig, "..", "..", "coe.json"); */
        try {
            if (Path.isAbsolute(mmPath)) {
                // console.warn("Could not find mm at: " + mmPath + " initiating search or possible alternatives...")
                readdirSync(Path.join(this.coeconfig, "..", "..")).forEach(file => {            //stubbed function readdirSync
                    if (file.endsWith("mm.json")) {
                        mmPath = Path.join(this.coeconfig, "..", "..", file);
                        console.log("Found mm at: " + mmPath);
                        //  console.debug("Found old style mm at: " + mmPath);
                        return;
                    }
                });
            }
            this.mmPath = mmPath;
            this.parseConfig(mmPath);
        } catch (error) {
            console.error("Path was not a correct path.. " + mmPath + " error: " + error);
        }
    }

    /*
     * Method for updating the DSE algorithm
     */
    onAlgorithmChange(algorithm: IDseAlgorithm) {
        this.parseError = null;
        this.config.searchAlgorithm = algorithm;

        this.form.removeControl('algorithm');
        this.form.addControl('algorithm', this.algorithmFormGroups.get(algorithm));
    }

    getSearchAlgorithm() {
        return this.config.searchAlgorithm.getName()
    }

    setGeneticpopDist(dist: string) {
        //assume is a genetic search 
        (<GeneticSearch>this.config.searchAlgorithm).initialPopulationDistribution = dist;
    }

    setParentSelectionStrategy(strat: string) {
        //assume is a genetic search 
        (<GeneticSearch>this.config.searchAlgorithm).parentSelectionStrategy = strat;
    }

    /* REUSED FROM MM-CONFIG */
    selectParameterInstance(instance: Instance) {
        this.selectedParameterInstance = instance;
        this.newParameter = this.getParameters()[0];
    }

    /*
     * Get the parameters for a selected FMU instance (selected instance set as a state variable)
     */
    getParameters(): ScalarVariable[] {
        if (!this.selectedParameterInstance)
            return [];

        return this.selectedParameterInstance.fmu.scalarVariables
            .filter(variable => isCausalityCompatible(variable.causality, CausalityType.Parameter) && !this.selectedParameterInstance.initialValues.has(variable));
    }

    /*
     * Get the initial values for a selected FMU instance (selected instance set as a state variable)
     */
    getInitialValues(): Array<ScalarValuePair> {
        let initialValues: Array<ScalarValuePair> = [];

        this.selectedParameterInstance.initialValues.forEach((value, variable) => {
            initialValues.push(new ScalarValuePair(variable, value));
        });

        return initialValues;
    }

    getScalarTypeName(type: number) {
        return ['Real', 'Bool', 'Int', 'String', 'Unknown'][type];
    }

    /*
     * Add a new DSE parameter
     */
    addParameter() {
        if (!this.newParameter) return;

        this.selectedParameterInstance.initialValues.set(this.newParameter, []);
        this.newParameter = this.getParameters()[0];
    }

    /*
     * Remove the given DSE search parameter
     */
    removeParameter(instance: Instance, parameter: ScalarVariable) {
        instance.initialValues.delete(parameter);
        this.newParameter = this.getParameters()[0];
    }

    setParameterName(p: DseParameter, name: string) {
        p.param = `${name}`;
    }

    getParameterName(p: DseParameter) {
        return p.param;
    }

    /*
     * Set the initial values for a DSE parameter. Will check types of values and also ensure 
     * parameter of choice is recorded in the DSE config.
     */
    setDSEParameter(instance: Instance, variableName: string, newValue: any) {

        // this will not work with the python scripts as it will try to run on an array, this will be commented out for now and removed in an up-coming commit //FIXME
        /* if (!newValue.includes(",")){
            if (instance.fmu.getScalarVariable(variableName).type === ScalarVariableType.Real)
                newValue = parseFloat(newValue);
            else if (instance.fmu.getScalarVariable(variableName).type === ScalarVariableType.Int)
                newValue = parseInt(newValue);
            else if (instance.fmu.getScalarVariable(variableName).type === ScalarVariableType.Bool)
                newValue = !!newValue;
        }
        else{
            newValue = this.parseArray(instance.fmu.getScalarVariable(variableName).type, newValue);
        } */

        newValue = this.parseArray(instance.fmu.getScalarVariable(variableName).type, newValue);

        let varExistsInDSE = false
        let instanceExistsInDSE = false

        //Need to determine if the DSE configuration knows firstly about the FMU instance, and then 
        //if it does AND has existing values for the given parameter, add the new value to the initial values.
        for (let dseParam of this.config.dseSearchParameters) {
            if (dseParam.name === instance.name) {
                instanceExistsInDSE = true
                dseParam.initialValues.forEach((value, variable) => {
                    if (variable.name === variableName) {
                        dseParam.initialValues.set(variable, newValue)
                        varExistsInDSE = true
                    }
                })
            }
        }
        //If the config does not know about this instance, it is added with the given initial values
        if (!instanceExistsInDSE) {
            let newInstance = this.addDSEParameter(instance);
            newInstance.initialValues.set(instance.fmu.getScalarVariable(variableName), newValue);
        }
        //If the config knows about the instance but NOT the parameter values, they are added to the 
        //instance in the DSE config.
        if (!varExistsInDSE) {
            for (let dseParam of this.config.dseSearchParameters) {
                if (dseParam.name === instance.name) {
                    dseParam.initialValues.set(instance.fmu.getScalarVariable(variableName), newValue);
                }
            }
        }
    }

    /*
     * Record a new instance in the list of DSE parameters
     */
    addDSEParameter(instance: Instance): Instance {
        let newInstance = instance
        this.config.dseSearchParameters.push(newInstance);
        return newInstance;
    }

    removeDSEParameter(instance: Instance, variableName: string) {
        for (let dseParam of this.config.dseSearchParameters) {
            if (dseParam.name === instance.name) {
                dseParam.initialValues.delete(instance.fmu.getScalarVariable(variableName));
            }
        }
    }

    parseArray(tp: ScalarVariableType, value: any): any[] {
        let newArray = value.split(",")
        for (let v of newArray) {
            if (tp === ScalarVariableType.Real)
                newArray.splice(newArray.indexOf(v), 1, parseFloat(v));
            else if (tp === ScalarVariableType.Int)
                newArray.splice(newArray.indexOf(v), 1, parseInt(v));
            else if (tp === ScalarVariableType.Bool)
                newArray.splice(newArray.indexOf(v), 1, !!v);
        }
        return newArray
    }

    //Utility method to obtain an instance from the multimodel by its string id encoding
    private getParameter(dse: DseConfiguration, id: string): Instance | null { //FIXME Entire function is never read
        let ids = this.parseId(id);

        let fmuName = ids[0];
        let instanceName = ids[1];
        //let scalarVariableName = ids[2]; //value never called //FIXME
        return dse.getInstanceOrCreate(fmuName, instanceName);
    }

    /*
     * Parse an FMU id
     */
    parseId(id: string): string[] {
        //is must have the form: '{' + fmuName '}' + '.' instance-name + '.' + scalar-variable
        // restriction is that instance-name cannot have '.'

        let indexEndCurlyBracket = id.indexOf('}');
        if (indexEndCurlyBracket <= 0) {
            throw "Invalid id";
        }

        let fmuName = id.substring(0, indexEndCurlyBracket + 1);
        var rest = id.substring(indexEndCurlyBracket + 1);
        var dotIndex = rest.indexOf('.');
        if (dotIndex < 0) {
            throw "Missing dot after fmu name";
        }
        rest = rest.substring(dotIndex + 1);
        //this is instance-name start index 0

        dotIndex = rest.indexOf('.');
        if (dotIndex < 0) {
            throw "Missing dot after instance name";
        }
        let instanceName = rest.substring(0, dotIndex);
        let scalarVariableName = rest.substring(dotIndex + 1);

        return [fmuName, instanceName, scalarVariableName];
    }

    /*
     * Method to produce an array of outputs in the chosen multi-model
     */
    loadMMOutputs(): string[] {
        let outputs: string[] = [];

        this.config.multiModel?.fmuInstances.forEach(instance => {
            instance.outputsTo.forEach((connections, scalarVariable) => {
                outputs.push(Serializer.getIdSv(instance, scalarVariable));
            });
        });

        return outputs;
    }

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    dseParamExists(instance: Instance, variableName: string): boolean {
        let paramFound = false;

        for (let dseParam of this.config.dseSearchParameters) {
            if (dseParam.name === instance.name) {
                dseParam.initialValues.forEach((value, variable) => {
                    if (variable.name === variableName) {
                        paramFound = true;
                    }
                })
            }
        }
        return paramFound;
    }


    getDseParamValue(instance: Instance, variableName: string): any {
        let result = "ERROR";
        for (let dseParam of this.config.dseSearchParameters) {
            if (dseParam.name === instance.name) {
                dseParam.initialValues.forEach((value, variable) => {
                    if (variable.name === variableName) {
                        result = value;
                    }
                })
            }
        }
        return result;
    }


    addParameterInitialValue(p: DseParameter, value: any) {
        p.addInitialValue(value);
    }

    getParameterIntialValues(p: DseParameter) {
        return p.initialValues;
    }

    setParameterIntialValues(p: DseParameter, oldVal: any, newVal: any) {
        return p.setInitialValue(oldVal, newVal);
    }

    removeParameterInitialValue(p: DseParameter, value: string) {
        p.removeInitialValue(value);
    }



    addParameterConstraint() {
        let pc = this.config.addParameterConstraint();
        let pcArray = <FormArray>this.form.get('paramConstraints');

        pcArray.push(new FormControl(this.getParameterConstraint(pc)));
    }

    setParameterConstraint(pc: DseParameterConstraint, name: string) {
        pc.constraint = `${name}`;
    }

    getParameterConstraint(pc: DseParameterConstraint) {
        return pc.constraint;
    }

    removeParameterConstraint(pc: DseParameterConstraint) {
        this.config.removeParameterConstraint(pc);
        let pcArray = <FormArray>this.form.get('paramConstraints');
        let index = this.config.paramConst.indexOf(pc);

        pcArray.removeAt(index);
    }



    addExternalScript() {
        let es = this.config.addExternalScript();
        this.objNames = this.getObjectiveNames();
    }

    getExternalScriptName(e: ExternalScript) {
        return e.name;
    }

    setExternalScriptName(p: ExternalScript, name: string) {
        p.name = `${name}`;
        this.objNames = this.getObjectiveNames();
    }

    getExternalScriptFilename(e: ExternalScript) {
        return e.fileName;
    }

    setExternalScriptFileName(p: ExternalScript, name: string) {
        p.fileName = `${name}`;
    }

    getExternalScriptParameters(e: ExternalScript) {
        return e.parameterList;
    }

    addExternalScriptParameter(e: ExternalScript, value: any, tp: string) {
        e.addParameter(value, tp);
    }

    setExternalScriptParameterId(e: ExternalScript, param: any, newId: any) {
        return e.setParameterId(param, newId);
    }

    setExternalScriptParameterValue(e: ExternalScript, param: any, newVal: any) {
        return e.setParameterValue(param, newVal);
    }

    setExternalScriptParameterType(e: ExternalScript, param: any, newTp: string) {
        return e.setParameterType(param, newTp);
    }

    removeExternalScriptParameter(e: ExternalScript, value: string) {
        e.removeParameter(value);
    }

    removeExternalScript(e: ExternalScript) {
        this.config.removeExternalScript(e);
        this.objNames = this.getObjectiveNames();
    }



    addInternalFunction() {
        //let intf = this.config.addInternalFunction(); //value never used //FIXME
        this.objNames = this.getObjectiveNames();
    }

    removeInternalFunction(i: InternalFunction) {
        this.config.removeInternalFunction(i);
        this.objNames = this.getObjectiveNames();
    }

    getInternalFunctionName(i: InternalFunction) {
        return i.name;
    }

    setInternalFunctionName(i: InternalFunction, name: string) {
        i.name = `${name}`;
        this.objNames = this.getObjectiveNames();
    }

    getInternalFunctionColumnName(i: InternalFunction) {
        return i.columnId;
    }

    setInternalFunctionColumnName(i: InternalFunction, name: string) {
        i.columnId = `${name}`;
    }

    getInternalFunctionObjectiveType(i: InternalFunction) {
        return i.funcType;
    }

    setInternalFunctionObjectiveType(i: InternalFunction, name: string) {
        i.funcType = `${name}`;
    }



    addObjectiveConstraint() {
        let oc = this.config.addObjectiveConstraint();
        let ocArray = <FormArray>this.form.get('objConstraints');

        ocArray.push(new FormControl(this.getObjectiveConstraint(oc)));
    }

    setObjectiveConstraint(oc: DseObjectiveConstraint, name: string) {
        oc.constraint = `${name}`;
    }

    getObjectiveConstraint(oc: DseObjectiveConstraint) {
        return oc.constraint;
    }

    removeObjectiveConstraint(oc: DseObjectiveConstraint) {
        this.config.removeObjectiveConstraint(oc);
        let ocArray = <FormArray>this.form.get('objConstraints');
        let index = this.config.objConst.indexOf(oc);

        ocArray.removeAt(index);
    }



    getRankingMethod() {
        return this.config.ranking.getType();
    }

    /*
     * Method to provide an array of all objective names
     */
    getObjectiveNames(): string[] {
        let objNames = [""];
        this.config.extScrObjectives.forEach((o: ExternalScript) => {
            objNames.push(o.name)
        });
        this.config.intFunctObjectives.forEach((o: InternalFunction) => {
            objNames.push(o.name)
        });

        return objNames;
    }

    getRankingDimensions() {
        return (<ParetoRanking>this.config.ranking).getDimensions();
    }

    getDimensionName(d: ParetoDimension) {
        return d.getObjectiveName()
    }

    setDimensionName(d: ParetoDimension, name: string) {
        d.objectiveName = name;
    }

    onDimensionChange(pd: ParetoDimension, d: string) {
        pd.objectiveName = d;
    }

    getDimensionDirection(d: ParetoDimension) {
        return d.getDirection()
    }

    setDimensionDirection(d: ParetoDimension, direct: string) {
        d.direction = direct;
    }

    removeParetoDimension(d: ParetoDimension) {
        (<ParetoRanking>this.config.ranking).removeDimension(d);
    }

    addParetoDimension(objective: string, direction: string) {
        if (this.config.ranking instanceof ParetoRanking) {
            (<ParetoRanking>this.config.ranking).addDimension(objective, direction);
        }
    }


    addScenario() {
        let s = this.config.addScenario();
        let sArray = <FormArray>this.form.get('scenarios');

        if (s != null)
            sArray.push(new FormControl(this.getScenario(s)));
    }

    setScenario(s: DseScenario, name: string) {
        s.name = `${name}`;
    }

    getScenario(s: DseScenario) {
        return s.name;
    }

    removeScenario(s: DseScenario) {
        this.config.removeScenario(s);
        let sArray = <FormArray>this.form.get('scenarios');
        let index = this.config.scenarios.indexOf(s);

        sArray.removeAt(index);
    }


    /*
     * Method to check if can run a DSE. Will check if the COE is online, if there are any warnings
     * and also some DSE-specific elements
     */
    canRun() {
        return this.online
            && this.coeconfig != ""
            && this.dseWarnings.length === 0
            && this.coeWarnings.length === 0
            //&& this.config.dseSearchParameters.length > 1 
            && this.config
            && this.config.extScrObjectives
            && (this.config.extScrObjectives.length + this.config.intFunctObjectives.length) >= 2;
        //&& (<ParetoRanking> this.config.ranking).dimensions.length == 2;
    }

    /*
     * Method to run a DSE with the current DSE configuration. Assumes that the DSE can be run. 
     * The method does not need to send the DSEConfiguration object, simply the correct paths. It relies upon the
     * config being saved to json format correctly.
     */
    runDse() {
        console.log('running from config');
        var spawn = require('child_process').spawn;
        let installDir = IntoCpsApp.getInstance()?.getSettings().getValue(SettingKeys.INSTALL_DIR);

        let absoluteProjectPath = IntoCpsApp.getInstance()?.getActiveProject()?.getRootFilePath();
        let experimentConfigName = this._path.slice(absoluteProjectPath?.length ?? 0 + 1, this._path.length);
        let multiModelConfigName = this.coeconfig.slice(absoluteProjectPath?.length ?? 0 + 1, this.coeconfig.length);
        // check if python is installed.
        /* dependencyCheckPythonVersion(); */


        //Using algorithm selector script allows any algortithm to be used in a DSE config.
        let scriptFile = Path.join(installDir, "dse", "Algorithm_selector.py");
        var child = spawn("python", [scriptFile, absoluteProjectPath, experimentConfigName, multiModelConfigName], {
            detached: true,
            shell: false,
            // cwd: childCwd
        });
        child.unref();

        child.stdout.on('data', function (data: any) {
            console.log('dse/stdout: ' + data);
        });
        child.stderr.on('data', function (data: any) {
            console.log('dse/stderr: ' + data);
        });

    }
    
}
