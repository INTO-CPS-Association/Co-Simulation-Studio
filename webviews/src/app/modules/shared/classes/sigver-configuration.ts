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

import { CoSimulationStudioApi } from 'src/app/api';
import { CoSimulationConfig } from "./co-simulation-config";
import { ISerializable } from './serializable';

export class SigverConfiguration implements ISerializable {
    
    public masterModel: string = "";
    public experimentPath: string = "";
    public priorExperimentPath: string = "";
    public reactivity: Map<string, Reactivity> = new Map();
    public coeConfig: CoSimulationConfig = new CoSimulationConfig();
    public coePath: string = "";

    public static readonly COEPATH_TAG: string = "coePath";
    public static readonly MASTERMODEL_TAG: string = "masterModel";
    public static readonly EXPERIMENTPATH_TAG: string = "experimentPath";
    public static readonly PRIOREXPERIMENTPATH_TAG: string = "priorExperimentPath";
    public static readonly REACTIVITY_TAG: string = "reactivity";

    static async parse(jsonObj: any): Promise<SigverConfiguration> {
        const sigverConfiguration = new SigverConfiguration();
        if (jsonObj == undefined || Object.keys(jsonObj).length == 0) {
            return sigverConfiguration;
        } else {
            try {
                sigverConfiguration.reactivity = new Map(Object.entries(jsonObj[SigverConfiguration.REACTIVITY_TAG]));
                sigverConfiguration.experimentPath = jsonObj[this.EXPERIMENTPATH_TAG];
                sigverConfiguration.priorExperimentPath = jsonObj[this.PRIOREXPERIMENTPATH_TAG];
                sigverConfiguration.masterModel = jsonObj[this.MASTERMODEL_TAG];
                sigverConfiguration.coePath = jsonObj[this.COEPATH_TAG];
                return await CoSimulationConfig.parse(sigverConfiguration.coePath, await CoSimulationStudioApi.getRootFilePath() ?? "", await CoSimulationStudioApi.getFmusPath() ?? "").then(config => {
                    sigverConfiguration.coeConfig = config;
                    return sigverConfiguration;
                });
            }
            catch (ex) {
                throw new Error(`Unable parse the configuration: ${ex}`);
            }
        }
    }

    toObject(): object {
        const objToReturn: any = {}
        const reactivity: { [key: string]: Reactivity } = {};
        this.reactivity.forEach((value: Reactivity, key: string) => (reactivity[key] = value));
        objToReturn[SigverConfiguration.MASTERMODEL_TAG] = this.masterModel;
        objToReturn[SigverConfiguration.EXPERIMENTPATH_TAG] = this.experimentPath;
        objToReturn[SigverConfiguration.PRIOREXPERIMENTPATH_TAG] = this.priorExperimentPath;
        objToReturn[SigverConfiguration.REACTIVITY_TAG] = reactivity;
        objToReturn[SigverConfiguration.COEPATH_TAG] = this.coePath;
        return objToReturn;
    }
}

// Represents a ports reactivity
export enum Reactivity {
    Delayed = 'Delayed',
    Reactive = 'Reactive'
}