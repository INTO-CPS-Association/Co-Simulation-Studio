import { Component, OnInit } from '@angular/core';
import * as Path from 'path';
import * as fs from 'fs'; //FIXME not an angular library
import IntoCpsApp from '../../classes/into-cps-app';

const dialog: any = {};

@Component({
    selector: 'app-project-fetcher',
    templateUrl: './project-fetcher.component.html',
    styleUrls: ['./project-fetcher.component.scss']
})
export class ProjectFetcherComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}

function launchProjectExplorer() { //FIXME  function is declared but its value is never read.

    dialog.showOpenDialog({ properties: ["openDirectory", "createDirectory"] }).then((res: any) => {
        console.log(res);
        if (!res.canceled) {
            var p: HTMLInputElement = <HTMLInputElement>document.getElementById("projectRootPathText");
            p.value = res.filePaths[0];
        }
    }).catch((error: any) => { console.error(error); return; });
}

function openFromGit() { //FIXME  function is declared but its value is never read.

    var p: HTMLInputElement = <HTMLInputElement>document.getElementById("basic-url");
    var dest: HTMLInputElement = <HTMLInputElement>document.getElementById("projectRootPathText");

    const openSpinner = document.getElementById('openSpinner');
    if (openSpinner != null)
        openSpinner.style.display = "block";

    const container = document.getElementById('container');
    if (container != null)
        container.style.display = "none";

    var progress = document.getElementById('progress');
    var progressBar = document.getElementById('progress-bar');

    fetchProjectThroughGit(p.value, dest.value, (output: string) => {
        var percentage = parsePercentage(output);

        if (percentage && progressBar != null) {
            progressBar.style.width = percentage;
            progressBar.innerHTML = percentage;
        }

        if (progress != null)
            progress.innerHTML = output.split("\n").pop() ?? "";

    }).then(code => window.top?.close()); //FIXME keyword is declared but its value is never read.
}

export function parsePercentage(data: string): string | null {
    var newest = data.split("\n").pop();

    if (newest?.indexOf("Receiving objects:") !== -1) {
        // example: Receiving objects:   1% (12/834), 1.89 MiB | 609.00 KiB/s

        // Pull out percentage value
        return newest?.split("%")[0].split(" ").pop() + '%';
    }

    return null;
}

export function fetchProjectThroughGit(url: string, targetFolder: string, updates: (data: string) => void) {
    return new Promise((resolve, reject) => {
        var spawn = require('child_process').spawn; //PL-TODO //FIXED by enforcing any type on line below
        var spawn: any = function(...args: any) {};

        let childCwd = targetFolder;

        var name = url.substring(url.lastIndexOf('/') + 1);

        let index = name.lastIndexOf('.git');
        if (index > 0) {
            name = name.substring(0, index);
        }

        let repoPath = Path.join(childCwd, name);
        let repoProjectFile = Path.join(repoPath, ".project.json");

        var repoExists = false;
        try {
            fs.accessSync(repoProjectFile, fs.constants.R_OK); //FIXME not an angular library
            repoExists = true;

        } catch (e) {

        }

        var mkdirp = require('mkdirp');
        mkdirp.sync(childCwd);

        var child: any = null;

        if (!repoExists) {
            child = spawn('git', ['clone', "--depth", "1", "--progress", url], {
                detached: false,
                cwd: childCwd
            });
        } else {
            child = spawn('git', ['pull', "--depth", "1", "--progress"], {
                detached: false,
                cwd: repoPath
            });
        }

        child.stdout.on('data', (data: any) => {
            if (updates) updates(data.toString());
        });

        child.stderr.on('data', (data: any) => {
            if (updates) updates(data.toString());
        });

        child.on('close', function (code: any) {
            console.log('closing code: ' + code);
            //Here you can get the exit code of the script
        });

        child.on('exit', async function (code: any) {
            console.log('exit code: ' + code);
            //Here you can get the exit code of the script


            let p = await IntoCpsApp.getInstance()?.loadProject(repoProjectFile);
            if (p != null)
                IntoCpsApp.getInstance()?.setActiveProject(p);

            if (code === 0)
                resolve(code);
            else
                reject(code);
        });
        //    var fork = require("child_process").fork,
        //   child = fork(__dirname + "/start-coe.js");
    });
}
