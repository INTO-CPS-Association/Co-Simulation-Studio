import React, { useEffect } from "react";
import IntoCpsApp from "src/app/modules/shared/classes/into-cps-app"; //FIXME reference to class crucial to components

const remote: any = {};
const ipcRenderer: any = {};

const CoeServerStatusComponent: React.FC = () => {
  useEffect(() => {
    const intoCpsAppIns = IntoCpsApp.getInstance();
    let globalChild: any;
    let killWindow = false;
    let preventUnload = true;
    let activeDiv: HTMLElement | null;
    let errorPrefix = ".";
    //FIXME The following was commented out of angular code
    //    if (window.location.search === "?data=autolaunch")
    //      launchCoe();

    function hideBehaviour(ev: BeforeUnloadEvent) {
      ev.preventDefault();
      remote.getCurrentWindow().hide();
    }

    remote.getCurrentWindow().on("minimize", (ev: Event) => {
      hideBehaviour(ev as BeforeUnloadEvent);
    });

    window.onbeforeunload = (ev: BeforeUnloadEvent) => {
      if (preventUnload) {
        const isQuitting = intoCpsAppIns?.isquitting;
        if (isQuitting || killWindow) {
          if (globalChild) {
            ev.returnValue = false;
            killCoeCloseWindow();
          }
        } else {
          hideBehaviour(ev);
        }
      }
    };

    ipcRenderer.on("kill", () => {
      killWindow = true;
      window.close();
    });

    function killCoeCloseWindow() {
      if (globalChild) {
        const kill = require("tree-kill");
        kill(globalChild.pid, "SIGKILL", (err: any) => {
          if (err) {
            remote.dialog.showErrorBox(
              "Failed to close COE",
              `It was not possible to close the COE. Pid: ${globalChild.pid}`
            );
          } else {
            globalChild = null;
          }
          preventUnload = false;
          window.close();
        });
      }
    }

    //FIXME function never used
    function coeClose() {
      window.close();
    }

    //FIXME function never used
    function clearOutput() {
      let div = document.getElementById("coe-console-output");
      while (div != null && div.hasChildNodes()) {
        if (div.firstChild != null) div.removeChild(div.firstChild);
      }
    }

    function processOutput(data: string) {
      const div = document.getElementById(
        "coe-console-output"
      ) as HTMLDivElement;
      const dd = (data + "").split("\n");

      dd.forEach((line) => {
        if (line.trim().length !== 0) {
          const m = document.createElement("span");
          m.innerHTML = `${line}<br/>`;
          if (line.includes("ERROR") || line.indexOf(errorPrefix) === 0) {
            m.style.color = "rgb(255, 0, 0)";
          }
          if (line.includes("WARN")) {
            m.style.color = "rgb(255, 165, 0)";
          }
          if (line.includes("DEBUG")) {
            m.style.color = "rgb(0, 0, 255)";
          }
          if (line.includes("TRACE") || line.indexOf("(resumed)") === 0) {
            m.style.color = "rgb(128,128,128)";
          }

          div.appendChild(m);
        }
      });

      if (div.childElementCount > 600) {
        while (div.childElementCount > 5000 && div.hasChildNodes()) {
          if (div.firstChild !== null) {
            div.removeChild(div.firstChild);
          }
        }
      }
      window.scrollTo(0, document.body.scrollHeight);
    }

    function launchCoe() {
      const coe = IntoCpsApp.getInstance()?.getCoeProcess();
      errorPrefix = coe?.getErrorLogLinePrefix() ?? "";

      //let root = document.getElementById("coe-console")
      activeDiv = document.getElementById("coe-console-output");
      while (activeDiv?.hasChildNodes()) {
        if (activeDiv.firstChild !== null) {
          activeDiv.removeChild(activeDiv.firstChild);
        }
      }

      //FIXME the following was commented out in angular
      //let div = document.createElement("div");
      //div.id = "coe-console-output";
      //let panel = createPanel("Console", div);
      //root.appendChild(panel);
      const mLaunch = document.createElement("span");
      mLaunch.innerHTML = `Terminal args: java -jar ${coe?.getCoePath()}<br/>`;
      //div.appendChild(mLaunch);
      //activeDiv = div;

      activeDiv!?.appendChild(mLaunch);

      coe?.subscribe(processOutput);

      if (!coe?.isLogRedirectActive()) {
        const sp = document.getElementById("stream-status") as HTMLSpanElement;
        if (sp) {
          sp.className = "glyphicon glyphicon-remove";
        }
      } else {
        const sp = document.getElementById("stream-status") as HTMLSpanElement;
        if (sp) {
          sp.className = "glyphicon glyphicon-link";
        }
      }

      if (!coe?.isRunning()) {
        coe?.start();
        const sp = document.getElementById("stream-status") as HTMLSpanElement;
        if (sp) {
          sp.className = "glyphicon glyphicon-link";
        }
      }
    }

    //FIXME function never used
    function stopCoe() {
      var coe = IntoCpsApp.getInstance()?.getCoeProcess();
      if (coe?.isRunning()) {
        coe.stop();
      }
    }

    //FIXME function never used
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

    launchCoe();

    return () => {
      // Clean up any necessary resources here
    };
  }, []);
};

export default CoeServerStatusComponent;
