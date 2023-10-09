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
import { CoeServerStatusUiController } from '../../../webviews/src/app/modules/shared/classes/coe-server-status-ui-controller';

interface ReadDataObject {
	readSize?: number
}

export class CoeLogPrinter {

	maxFileReadSize!: number;
	remainingMaxFileReadSize!: number;
	callback: (data: string, skip: boolean) => void;
	path!: string;
	pathIsSet: boolean = false;
	interval: number = 1000;
	filePosition: number = 0;
	intervalIsRunning: boolean = false;
	intervalHandle!: any;
	printingRemainingIsActive: boolean = false;

	constructor(maxFileReadSize: number, callback: (data: string) => void) {
		this.setMaxFileReadSize(maxFileReadSize);
		this.callback = callback;
	}

	public setInterval(interval: number) {
		this.interval = interval;
	}

	private setMaxFileReadSize(maxFileReadSize: number) {
		this.maxFileReadSize = maxFileReadSize;
		this.remainingMaxFileReadSize = 5 * maxFileReadSize;
	}

	private async getFileSize(path: string): Promise<number> {
		return await CoSimulationStudioApi.fileSize(path);
	}

	public stopPrintingRemaining() {
		if (this.intervalHandle) {
			clearInterval(this.intervalHandle);
			this.printingRemainingIsActive = false;
		}
	}

	public printRemaining() {
		// 200 is the typical number of characters per line.
		let truncateSizeInBytes = CoeServerStatusUiController.maxLines * 200;

		this.printingRemainingIsActive = true;
		// console.log(`Printing the remaining data from the COE log file with interval ${this.interval} ms.`)
		// Check if there is still remaining data to be printed, and print it.
		this.intervalHandle = setInterval(async () => {
			let alteredFilePosition = false;
			let currentFileSize = await this.getFileSize(this.path);
			if (currentFileSize != this.filePosition) {
				if (currentFileSize - truncateSizeInBytes > this.filePosition) {
					// Advance the file position
					this.filePosition = currentFileSize - truncateSizeInBytes;
					alteredFilePosition = true;

					//console.log(`CoeLogPrinter watching file: ${this.path} advanced file position to: ${this.filePosition}`);
				}
				let readSize = this.readFunction(this.path, currentFileSize, this.remainingMaxFileReadSize, alteredFilePosition, this.callback)
				if (readSize && readSize < this.maxFileReadSize) {
					this.stopPrintingRemaining();
				}
			}
			else {
				clearInterval(this.intervalHandle)
				this.stopPrintingRemaining();
			}
		}/* not part of newer node , this.interval*/);
	}

	public async stopWatching(): Promise<void> {
		if (this.pathIsSet) {
			await CoSimulationStudioApi.unwatchFile(this.path);
		}
	}

	public unsubscribe() {
		//console.log(`CoeLogPrinter watching ${this.path} unsubscribed callback`)
		this.callback = null;
	}

	private async readFunction(path: string, currentSize: number, maxReadSize: number, alteredFilePosition: boolean, callback: (data: string, skip: boolean) => void): number | undefined {
		
		let calcReadSize = (currentSize: number) => {
			let readSize = currentSize - this.filePosition;
			if (readSize > maxReadSize) {
				return maxReadSize;
			} else {
				return readSize;
			}
		}

		let readSize: number = calcReadSize(currentSize)

		// This happens if the log has been truncated. Therefore perform a reinitialization and calculate the read size again.
		if (readSize <= 0) {
			// console.log(`Info: CoeLogPrinter watching ${path} encountered a non-positive read size. Current size: ${currentSize} - Read size: ${readSize} - File position: ${this.filePosition}. 
			// This is probably due to a log file rollover. Reinitializing and trying again.`);

			currentSize = await this.getFileSize(path);
			this.filePosition = 0;
			readSize = calcReadSize(currentSize);
			//console.log(`Info: CoeLogPrinter watching ${path} reinitialized. Current size: ${currentSize} - Read size: ${readSize} - File position: ${this.filePosition}`);
		}

		if (readSize <= 0) {
			return;
		}
		else {
			let buffer = new Buffer(readSize);
			let fd = await .openSync(path, 'r');
			fs.readSync(fd, buffer, 0, readSize, this.filePosition);
			fs.closeSync(fd);

			if (callback) {
				//console.log(`CoeLogPrinter watching ${path} invoking callback: ${this.callback}`);
				callback(buffer.toString(), alteredFilePosition);
			}
			// console.log(`CoeLogPrinter watching ${path} is reading from filePosition: ${this.filePosition} with the size fileReadSize: ${readSize}. Remaning to read: ${currentSize-this.filePosition-readSize}`);
			this.filePosition = this.filePosition + readSize

			return readSize;
		}
	}

	public async startWatching(path: string): Promise<void> {
		
		if (this.pathIsSet) {
			console.error(`Instance of coeLogPrinter is already watching ${this.path} and can therefore not watch ${path}`);
			return;
		}

		this.path = path;
		this.pathIsSet = true;
		this.filePosition = await this.getFileSize(path);

		fs.watchFile(this.path, { interval: this.interval }, (current: fs.Stats, previous: fs.Stats) => {
			if (!this.printingRemainingIsActive)
				this.readFunction(this.path, current.size, this.maxFileReadSize, false, this.callback);

		});
	}
}