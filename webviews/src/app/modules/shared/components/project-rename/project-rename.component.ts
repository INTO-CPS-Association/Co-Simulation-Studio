import { Component, OnInit } from '@angular/core';
import { CoSimulationStudioApi } from 'src/app/api';

@Component({
  selector: 'app-project-rename',
  templateUrl: './project-rename.component.html',
  styleUrls: ['./project-rename.component.scss']
})
export class ProjectRenameComponent {

  gup(name: any, url: any) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
  }

  async rename(): Promise<void> {

    var n: HTMLInputElement = <HTMLInputElement>document.getElementById("newName");

    let oldPath = decodeURIComponent(this.gup("data", undefined) ?? "");
    let newPath = await CoSimulationStudioApi.join(oldPath, '..', n.value)
    console.log("Renaming from " + oldPath + " to " + newPath);

    try {
      await CoSimulationStudioApi.move(oldPath, newPath);
      console.error("Move completed " + oldPath + " -> " + newPath);
      window.top?.close();
    } catch (e) {
      console.error("Move faild " + oldPath + " -> " + newPath);
    }

  }

}