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
import { CoSimulationConfig } from "./co-simulation-config"
import { checksum } from "./project";

export async function storeResultCrc(outputPath: string, coeConfig: CoSimulationConfig): Promise<void> {

    let coeCrc = checksum(await CoSimulationStudioApi.readFile(coeConfig.sourcePath), "md5", "hex");
    let mmCrc = coeConfig.multiModelCrc;
    let resultCrc = checksum(await CoSimulationStudioApi.readFile(outputPath), "md5", "hex");

    let res = { mm_config_crc: mmCrc, coe_config_crc: coeCrc, output_crc: resultCrc }

    let data = JSON.stringify(res);
    let file = await CoSimulationStudioApi.join(await CoSimulationStudioApi.dirname(outputPath), "result.json");
    console.info(data);

    await CoSimulationStudioApi.writeFile(file, data);

}

export async function isResultValid(outputPath: string): Promise<boolean> {

    let dir = await CoSimulationStudioApi.dirname(outputPath);
    let resultPath = await CoSimulationStudioApi.join(dir, "result.json");

    if (!await CoSimulationStudioApi.exists(resultPath)) {
        return true;//no check
    }

    let data = await CoSimulationStudioApi.readFile(resultPath);

    let obj = JSON.parse(data);
    //let res = { mm_config_crc: mmCrc, coe_config: coeCrc, result: resultCrc }
    let ok = true;

    let mmCrc = obj["mm_config_crc"];
    if (mmCrc != null) {
        let mmPath = await CoSimulationStudioApi.join(dir, "..", "..", "mm.json")
        //console.debug("MM path: " + mmPath);
        let crc = checksum(await CoSimulationStudioApi.readFile(mmPath), "md5", "hex");
        //console.debug("crc: " + mmCrc + " == " + crc);
        ok = ok && (crc == mmCrc);
    }
    
    let coeCrc = obj["coe_config_crc"];
    if (coeCrc != null) {

        let coePath = await CoSimulationStudioApi.join(dir, "..", "coe.json");
        if (!await CoSimulationStudioApi.exists(coePath)) {
            //Backwards compatibility
            let file = (await CoSimulationStudioApi.readdir(await CoSimulationStudioApi.join(dir, ".."))).find(file => file.endsWith("coe.json"));
            coePath = await CoSimulationStudioApi.join(dir, "..", file ?? "");
            console.debug("Found old style coe at: " + coePath);
        }
        //console.debug("COE path: " + coePath);
        let crc = checksum(await CoSimulationStudioApi.readFile(coePath), "md5", "hex");
        //console.debug("crc: " + coeCrc + " == " + crc);
        ok = ok && (crc == coeCrc);

    }

    let outputCrc = obj["output_crc"];
    if (outputCrc != null) {
        //console.debug("Output path: " + outputPath);
        let crc = checksum(await CoSimulationStudioApi.readFile(outputPath), "md5", "hex");
        //console.debug("crc: " + outputCrc + " == " + crc);
        ok = ok && (crc == outputCrc);

    }

    return ok;

}
