import { Component, OnInit } from '@angular/core';
import * as Path from 'path';


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

  rename() {

    var n: HTMLInputElement = <HTMLInputElement>document.getElementById("newName");


    let oldPath = decodeURIComponent(this.gup("data", undefined) ?? "");
    let newPath = Path.join(oldPath, '..', n.value)
    console.log("Renaming from " + oldPath + " to " + newPath);

    var fs: any = {} // PL-TODO require('fs-extra');

    fs.move(oldPath, newPath, function (err: any) {
      if (err) {
        console.error("Move faild " + oldPath + " -> " + newPath);
        return console.error(err);
      }
      console.error("Move completed " + oldPath + " -> " + newPath);
      window.top?.close();
    })
  }

}