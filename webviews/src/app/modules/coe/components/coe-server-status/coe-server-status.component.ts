import { Component, OnInit } from '@angular/core';
import IntoCpsApp from 'src/app/modules/shared/classes/into-cps-app';

const remote: any = {};
const ipcRenderer: any = {};

@Component({
  selector: 'app-coe-server-status',
  templateUrl: './coe-server-status.component.html',
  styleUrls: ['./coe-server-status.component.scss']
})
export class CoeServerStatusComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

/*

var globalChild: any;
//FIXME no-agluar interface
var intoCpsAppIns = IntoCpsApp.getInstance();
var killWindow = false;
var preventUnload = true;
//FIXME no-agluar interface
window.onload = function () {
  launchCoe();
  //    if (window.location.search === "?data=autolaunch")
  //      launchCoe();
};

function hideBehaviour(ev: Event) {
  //FIXME function only not-supported on browser deno
  ev.returnValue = false;
  remote.getCurrentWindow().hide();
}

remote.getCurrentWindow().on('minimize', (ev: Event) => {
hideBehaviour(ev);
})

//FIXME no-agluar interface
window.onbeforeunload = (ev: Event) => {
  if (preventUnload) {
    var isqutting = intoCpsAppIns?.isquitting;
    if (isqutting || killWindow) {
      if (globalChild) {
        ev.returnValue = false;
        killCoeCloseWindow();
      }
    }
    else {
      hideBehaviour(ev)
    }
  }
}

ipcRenderer.on("kill", () => {
killWindow = true;
window.close();
});





function killCoeCloseWindow() {
  if (globalChild) {
    var kill = require('tree-kill');
    kill(globalChild.pid, 'SIGKILL', (err: any) => {
      if (err) {
        remote.dialog.showErrorBox("Failed to close COE", "It was not possible to close the COE. Pid: " + globalChild.pid)
      }
      else {
        globalChild = null;
      }
      preventUnload = false;
      window.close();
    });
  }
}

//FIXME Some functions whice are not used here. maybe should be removed 
function coeClose() {
  window.close();
}

function clearOutput() {
  let div = document.getElementById("coe-console-output");
  while (div != null && div.hasChildNodes()) {
    if (div.firstChild != null)
      div.removeChild(div.firstChild);
  }
}
//FIXME no-agluar interface
var activeDiv: HTMLDivElement;
var errorPrefix = ".";

//FIXME no-agluar interface
function processOutput(data: string) {

  let div = <HTMLDivElement>document.getElementById("coe-console-output");
  let dd = (data + "").split("\n");

  dd.forEach(line => {
    if (line.trim().length != 0) {
      let m = document.createElement("span");
      m.innerHTML = line + "<br/>";
      if (line.indexOf("ERROR") > -1 || line.indexOf(errorPrefix) == 0)
        m.style.color = "rgb(255, 0, 0)";
      if (line.indexOf("WARN") > -1)
        m.style.color = "rgb(255, 165, 0)";
      if (line.indexOf("DEBUG") > -1)
        m.style.color = "rgb(0, 0, 255)";
      if (line.indexOf("TRACE") > -1 || line.indexOf("(resumed)") == 0)
        m.style.color = "rgb(128,128,128)";

      div.appendChild(m);
    }
  });


  if (div.childElementCount > 600)
    while (div.childElementCount > 5000 && div.hasChildNodes()) {
      if (div.firstChild != null)
        div.removeChild(div.firstChild);
    }
  window.scrollTo(0, document.body.scrollHeight);
}
//FIXME no-agluar interface. OBS some code has been comented out.
function launchCoe() {

  var coe = IntoCpsApp.getInstance()?.getCoeProcess();
  errorPrefix = coe?.getErrorLogLinePrefix() ?? "";

  //let root = document.getElementById("coe-console")
  activeDiv = <HTMLDivElement>document.getElementById("coe-console-output");
  while (activeDiv?.hasChildNodes()) {
    if (activeDiv.firstChild != null)
      activeDiv.removeChild(activeDiv.firstChild);
  }
  //let div = document.createElement("div");
  //div.id = "coe-console-output";
  //let panel = createPanel("Console", div);
  //root.appendChild(panel);
  let mLaunch = document.createElement("span");
  mLaunch.innerHTML = "Terminal args: java -jar " + coe?.getCoePath() + "<br/>";
  //div.appendChild(mLaunch);
  //activeDiv = div;

  activeDiv?.appendChild(mLaunch);

  coe?.subscribe(processOutput)

  if (!coe?.isLogRedirectActive()) {
    var sp = <HTMLSpanElement>document.getElementById("stream-status");
    if (sp != null)
    sp.className = "glyphicon glyphicon-remove";
  }
  else {
    var sp = <HTMLSpanElement>document.getElementById("stream-status");
    if (sp != null)
    sp.className = "glyphicon glyphicon-link";

  }
  if (!coe?.isRunning()) {
    coe?.start();
    var sp = <HTMLSpanElement>document.getElementById("stream-status");
    if (sp != null)
    sp.className = "glyphicon glyphicon-link";
  }
}
//FIXME no-agluar interface. function is not called 
function stopCoe() {
  var coe = IntoCpsApp.getInstance()?.getCoeProcess();
  if (coe?.isRunning()) {
    coe.stop();
  }
}
//FIXME no-agluar interface. function is not called
function createPanel(title: string, content: HTMLElement): HTMLElement {
  var divPanel = document.createElement("div");
  divPanel.className = "panel panel-default";

  var divTitle = document.createElement("div");
  divTitle.className = "panel-heading";
  divTitle.innerText = title;

  var divBody = document.createElement("div");
  divBody.className = "panel-body";
  divBody.appendChild(content);

  divPanel.appendChild(divTitle);
  divPanel.appendChild(divBody);

  return divPanel;
}
*/