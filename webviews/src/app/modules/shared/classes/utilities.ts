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

export class Utilities {

	public static timeStringToNumberConversion(text: string, setterFunc: (val: number) => void): boolean {
		let value = Number(text);
		if (isNaN(value)) {
			return false;
		} else {
			setterFunc(value);
			return true;
		}
	}

	public static async projectRoot(): Promise<string> {
		return await CoSimulationStudioApi.getRootFilePath();
	}

	public static async getSystemArchitecture() {
		return CoSimulationStudioApi.getSystemArchitecture();
	}

	public static async getSystemPlatform() {
		return CoSimulationStudioApi.getSystemPlatform();
	}

	public static async relativeProjectPath(path: string): Promise<string> {
		if (!await CoSimulationStudioApi.isAbsolute(path)) {
			return await CoSimulationStudioApi.normalize(path);
		}
		var root: string = await Utilities.projectRoot();
		return await CoSimulationStudioApi.relative(root, path);
	}

	public static async absoluteProjectPath(path: string): Promise<string> {
		if (await CoSimulationStudioApi.isAbsolute(path)) {
			return await CoSimulationStudioApi.resolve(path);
		}
		var root: string = await Utilities.projectRoot();
		return await CoSimulationStudioApi.resolve(root, path);
	}

	public static async pathIsInFolder(path: string, folder: string): Promise<boolean> {
		var aPath: string[] = (await Utilities.absoluteProjectPath(path)).split(await CoSimulationStudioApi.sep());
		var aFolder: string[] = (await Utilities.absoluteProjectPath(folder)).split(await CoSimulationStudioApi.sep());
		var res: boolean = true;
		if (aPath.length < aFolder.length) {
			res = false;
		}
		for (var i = 0; i < aFolder.length; ++i) {
			if (aPath[i] != aFolder[i])
				res = false;
		}
		return res;
	}

	public static pathToUri(path: string) {
		return encodeURI(path.replace(/\\/g, "/"))
	}

}
