import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Path from "path";
import * as fs from "fs";

@Component({
    selector: 'app-file-browser',
    templateUrl: './file-browser.component.html',
    styleUrls: ['./file-browser.component.scss']
})
export class FileBrowserComponent implements OnInit {
    
    @Input()
    basePath = "";

    @Input()
    set path(path: string) {
        this._path = path.replace(Path.normalize(`${this.basePath}/`), "");
    }
    get path(): string {
        return this._path;
    }

    @Output()
    pathChange = new EventEmitter<string>();

    _path: string = "";
    dialog: any;
    platform!: string;

    //FIXME some commented code here 
    ngOnInit(): any {
        //this.dialog = remote.dialog;
        //this.platform = remote.getGlobal("intoCpsApp").platform;
    }

    browseFile() {
        this.browse(["openFile"]);
    }

    browseDirectory() {
        this.browse(["openDirectory"]);
    }

    browse(properties: ('openFile' | 'openDirectory' | 'multiSelections' | 'createDirectory')[] = ["openFile", "openDirectory"]) {

        this.dialog.showOpenDialog({ defaultPath: this.basePath, properties: properties }).then((res: any) => {
            if (res) this.onChange(res.filePaths[0]);
        }).catch((error: Error) => {
            console.error(error);
            return;
        });

    }
    //FIXME uses some fs code here 
    onChange(path: string) {
        this.path = path;

        fs.access(Path.normalize(`${this.basePath}/${this.path}`), fs.constants.R_OK, error => {
            this.pathChange.emit(Path.normalize(error ? this.path : `${this.basePath}/${this.path}`));
        });
    }
}
