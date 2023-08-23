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


import { CoeProcess } from './coe-process';
import IntoCpsApp from './into-cps-app';

export class PreviewHandler {

	setVisible: any;
	//FIXME CoeProcess is a non angular class 
	coe?: CoeProcess;

	constructor(setVisible: any) {
		this.setVisible = setVisible;
		//FIXME IntoCpsApp is Non-anglular class 
		this.coe = IntoCpsApp.getInstance()?.getCoeProcess() ?? undefined;
		window.setInterval(() => { this.setStatusIcons() }, 1000);
	}
	//FIXME The following mothod uses a non-angular interface. however it looks like its something that built into TS
	private setStatusIcons() {
		let iconSpan = document.getElementById("coeIconColor");
		if (iconSpan)
			iconSpan.style.color = this.coe?.isRunning() ? "green" : "red";
	}
	//FIXME The following mothod uses a non-angular interface. however it looks like its something that built into TS
	public setVisibilityPreviewPanel(name: string, visibel: boolean) {
		this.setVisible("preview", name, visibel);

		var panel = (<HTMLDivElement>document.getElementById(name));
		var children = panel.parentElement?.children;
		if (children != null)
			for (var i = 0; i < children.length; i++) {
				var tableChild = <HTMLDivElement>children[i];
				tableChild.style.display = "none";
			}
		panel.style.display = "block";
	}
}

//FIXME The following class uses a non-angular interface. however it looks like its something that built into TS
export class StatusBarHandler {

	static setVisibilityPreviewPanel(element: HTMLElement, previewHandler: PreviewHandler, name: string) {
		if (element.classList.contains("selected")) {
			previewHandler.setVisibilityPreviewPanel(name, false);
			element.classList.remove("selected");

		} else {
			previewHandler.setVisibilityPreviewPanel(name, true);
			element.classList.add("selected");
		}

		var children = element.parentElement?.parentElement?.getElementsByTagName("a");
		if (children != null)
			for (var i = 0; i < children.length; i++) {
				var tableChild = <HTMLElement>children[i];
				if (tableChild != element)
					tableChild.classList.remove("selected");
			}
	}

	public static initializeStatusbar(previewHandler: PreviewHandler) {
		$('#navigation').children().on('click', function (event) {
			if (event.target != this) {
				if (event.target.id == "coe-status-btn-status") {
					StatusBarHandler.setVisibilityPreviewPanel(<HTMLElement>event.target, previewHandler, "coe-status-view");

				} else if (event.target.id == "coe-log-btn-status") {
					StatusBarHandler.setVisibilityPreviewPanel(<HTMLElement>event.target, previewHandler, "coe-log-view");

				} else if (event.target.id == "trace-daemon-btn-status") {
					StatusBarHandler.setVisibilityPreviewPanel(<HTMLElement>event.target, previewHandler, "trace-daemon-btn-status");
				}
			}
		});
	};
}
