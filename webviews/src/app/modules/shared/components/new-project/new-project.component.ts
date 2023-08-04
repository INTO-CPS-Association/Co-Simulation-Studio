import { Component, OnInit } from '@angular/core';
import IntoCpsApp from '../../classes/into-cps-app';

const dialog: any = {};

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent {


  launchProjectExplorer() {
    /* let dialogResult: string[] = remote.dialog.showOpenDialog({ properties: ["openDirectory", "createDirectory"] });
    if (dialogResult != undefined) {
  
        var p: HTMLInputElement = <HTMLInputElement>document.getElementById("projectRootPathText");
        p.value = dialogResult[0];
        //       this.app.createProject("my project",this.projectRootPath.value);
    } */
    // for electron v8
    dialog.showOpenDialog({ properties: ["openDirectory", "createDirectory"] }).then((res: any) => {
      console.log(res);
      if (res.filePaths != undefined) {
        var p: HTMLInputElement = <HTMLInputElement>document.getElementById("projectRootPathText");
        p.value = res.filePaths[0];
      }
    }).catch((error: any) => {
      console.error(error);
      return;
    });


  }



  createProject() {
    //PL-TODO var ipc = require('electron').ipcRenderer;
    console.log("Project created");

    var p: HTMLInputElement = <HTMLInputElement>document.getElementById("projectRootPathText");
    var n: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
    //FIXME IntoCpsApp is non-angular class 
    IntoCpsApp.getInstance()?.createProject(n.value, p.value);
    window.top?.close();

  }


}