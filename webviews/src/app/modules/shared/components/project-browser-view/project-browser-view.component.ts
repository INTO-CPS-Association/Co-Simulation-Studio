import { Component, OnInit } from '@angular/core';
import * as fs from 'fs'
import * as Path from "path";
import { IntoCpsAppMenuHandler } from '../../classes/into-cps-app-menu-handler';
import IntoCpsApp from '../../classes/into-cps-app';
import { isResultValid } from '../../classes/result-config';
import { Project } from '../../classes/project';
import { Utilities } from '../../classes/utilities';
//import { rimraf } from 'rimraf';

//import {w2ui} from 'w2ui';

const rimraf: any = {};

@Component({
    selector: 'app-project-browser-view',
    templateUrl: './project-browser-view.component.html',
    styleUrls: ['./project-browser-view.component.scss']
})
export class ProjectBrowserViewComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}

export class MenuEntry {
    id: string;
    text: string;
    icon: any;
    item: ProjectBrowserItem;
    callback: (item: ProjectBrowserItem) => void;
    private static idCounter: number = 0;
    constructor(item: ProjectBrowserItem, text: string, icon: any,
        callback: any /*PL-TODO (item: ProjectBrowserItem) => void*/ = undefined) {
        this.id = "MenuEntry_" + (MenuEntry.idCounter++).toString();
        this.item = item;
        this.text = text;
        this.icon = icon;
        if (callback != undefined) {
            this.callback = callback;
        } else {
            this.callback = function (item: ProjectBrowserItem) { };
        }
    }
}

export class ProjectBrowserItem {
    controller: BrowserController;
    id: string;
    path: string;
    isDirectory: boolean;
    text: string;
    level: number;
    expanded: boolean = false;
    img: any = null;
    nodes: ProjectBrowserItem[] = [];
    parent!: ProjectBrowserItem;
    group: boolean = false;
    fsWatch?: fs.FSWatcher;
    opensInMainWindow: boolean = false;

    clickHandler(item: ProjectBrowserItem): void { }
    dblClickHandler(item: ProjectBrowserItem): void { }
    menuEntries: MenuEntry[] = [];

    private static idCounter: number = 0;
    constructor(controller: BrowserController, path: string, parent?: ProjectBrowserItem) {
        this.controller = controller;
        this.id = "ProjectBrowserItem_" + (ProjectBrowserItem.idCounter++).toString();
        this.path = path;
        this.isDirectory = fs.existsSync(path) && fs.statSync(path).isDirectory();
        this.text = Path.basename(path);
        if (parent == null) {
            this.level = 0;
        } else {
            this.level = parent.level + 1;
        }
        if (this.level <= 1) {
            this.group = true;
            this.expanded = true;
        }
    }

    removeFileExtensionFromText(): void {
        this.text = this.text.substr(0, this.text.indexOf("."));
    }

    getChildByPath(path: string) {
        return this.nodes.find((n) => { return n.path == path; });
    }

    activate(parent: ProjectBrowserItem) {
        // console.log("activating node " + this.id + ": " + this.path);
        let self: ProjectBrowserItem = this;
        if (this.level == 0) {
            // root node is not inserted to tree
        } else {
            let insertPos = 0;
            for (; insertPos < parent.nodes.length && parent.nodes[insertPos].path.localeCompare(this.path) < 0; ++insertPos);
            let before = insertPos < parent.nodes.length ? parent.nodes[insertPos].id : null;
            if (this.level == 1) {
                this.controller.tree.insert(before ?? "", this);
                self = <ProjectBrowserItem>(this.controller.tree.get(this.id));
                parent.nodes.splice(insertPos, 0, self);
            } else {
                this.controller.tree.insert(parent.id, before ?? "", this);
                self = <ProjectBrowserItem>(this.controller.tree.get(this.id));
            }
        }
        if (this.expanded || (parent && parent.expanded)) {
            self.loadChildren();
        }
    }

    watch() {
        let self = this;
        if (this.isDirectory) {
            if (this.fsWatch != undefined) throw "Directory is already being watched";
            let exists = (p: string) => { try { fs.statSync(p); return true; } catch (e) { return false; } };
            this.fsWatch = fs.watch(this.path, (event: any, which: any) => {
                // console.log("While watching folder " + self.path + ": event: " + event + ", which: " + which);
                if (which) {
                    let p = Path.join(self.path, Path.basename(which));
                    let child = self.getChildByPath(p);
                    if (child)
                        child.deactivate();
                    if (exists(p))
                        self.controller.addFSItem(p, self);
                    self.refresh();
                }
            });
        }
    }

    unwatch() {
        if (this.fsWatch != undefined) {
            this.fsWatch.close();
            this.fsWatch = undefined;
        }
    }

    deactivate() {
        while (this.nodes.length != 0) {
            this.nodes[0].deactivate();
        }
        // console.log("deactivating node " + this.id + ": " + this.path);
        this.unwatch();
        this.controller.tree.remove(this.id);
        if (this.level == 1) {
            let parent = this.controller.rootItem;
            let pos = parent?.nodes.findIndex((n) => { return n.id == this.id; });
            if (pos != null && pos >= 0) {
                parent?.nodes.splice(pos, 1);
            }
        }
    }

    releaseChildren(depth = 0) {
        if (depth > 0) {
            for (let c of this.nodes) {
                c.releaseChildren(depth - 1);
            }
        } else {
            while (this.nodes.length != 0) {
                this.nodes[0].deactivate();
            }
            this.unwatch();
        }
    }

    loadChildren(depth = 0) {
        if (depth > 0) {
            for (let c of this.nodes) {
                c.loadChildren(depth - 1);
            }
        } else if (this.isDirectory) {
            this.controller.addFSFolderContent(this.path, this);
            this.watch();
        }
    }

    expand() {
        // load grand-children
        this.loadChildren(1);
    }

    collapse() {
        // discard grand-children
        for (let c of this.nodes) {
            this.controller.tree.collapse(c.id);
        }
        this.releaseChildren(1);
    }

    refresh() {
        this.controller.tree.refresh(this.id);
    }

}

export class BrowserController {
    private browser!: HTMLDivElement;
    public tree!: W2UI.W2Sidebar;
    rootItem?: ProjectBrowserItem;

    private menuHandler: IntoCpsAppMenuHandler | null = null;

    constructor(menuHandler: IntoCpsAppMenuHandler) {
        this.menuHandler = menuHandler;
    }

    public async initialize() {
        this.browser = <HTMLDivElement>document.querySelector("#browser");

        this.tree = $(this.browser).w2sidebar({
            name: "sidebar",
            menu: []
        });

        this.tree.on("expand", (event: JQueryEventObject) => {
            let item: ProjectBrowserItem = <ProjectBrowserItem>((<any>event).object);
            item.expand();
        });

        this.tree.on("collapse", (event: JQueryEventObject) => {
            let item: ProjectBrowserItem = <ProjectBrowserItem>((<any>event).object);
            item.collapse();
        });

        this.tree.on("contextMenu", (event: any) => {
            let item: ProjectBrowserItem = <ProjectBrowserItem>((<any>event).object);
            let menu: MenuEntry[] = item.menuEntries;
            this.tree.menu = menu;
        });

        this.tree.on("menuClick", (event: any) => {
            let entry: MenuEntry = <MenuEntry>((<any>event).menuItem);
            entry.callback(entry.item);
        });

        this.tree.on("dblClick", (event: JQueryEventObject) => {
            // Remove auto expansion on double click
            event.preventDefault();
            let allowClick = true;
            if (this.menuHandler?.deInitialize != null) {
                allowClick = this.menuHandler.deInitialize();
            }
            if (allowClick) {
                let item: ProjectBrowserItem = <ProjectBrowserItem>((<any>event).object);
                // Only mark the item as selected if it opens in the main window.
                if (item.opensInMainWindow) {
                    this.tree.select(item.id);
                }
                item.dblClickHandler(item);
            }
        });


        this.tree.on("click", (event: JQueryEventObject) => {
            event.preventDefault();
            let item: ProjectBrowserItem = <ProjectBrowserItem>((<any>event).object);
            item.clickHandler(item);
        });

        this.refreshProjectBrowser();

        /*    IntoCpsApp.getInstance().on(IntoCpsAppEvents.PROJECT_CHANGED, () => {
               this.refreshProjectBrowser();
           }); */
    }

    // set and refresh the prowser content
    private refreshProjectBrowser() {
        let app: IntoCpsApp | undefined = IntoCpsApp.getInstance() ?? undefined;
        if (this.rootItem)
            this.rootItem.deactivate();
        if (app?.getActiveProject() != null) {
            this.rootItem = this.addFSItem(app.getActiveProject()?.getRootFilePath() ?? "") ?? undefined;
        }
    }

    public addFSItem(path: string, parent?: ProjectBrowserItem): ProjectBrowserItem | undefined | null {
        let self = this;
        let result: ProjectBrowserItem = new ProjectBrowserItem(this, path, parent);
        let stat: any;

        try {
            stat = fs.statSync(path);
        } catch (e) {
            // unable to access path, this happens with emacs json plugin
            return;
        }
        let pathComponents = Utilities.relativeProjectPath(path).split(Path.sep);

        function menuEntry(text: string, icon: any, callback?: (item: ProjectBrowserItem) => void) {
            return new MenuEntry(result, text, icon, callback);
        }

        let menuEntryDelete = menuEntry("Delete", "glyphicon glyphicon-remove",
            function (item: ProjectBrowserItem) {
                console.info("Delete path: " + item.path);
                self.menuHandler?.deletePath?.(item.path);
            });
        let menuRename = menuEntry("Rename", "glyphicon glyphicon-pencil", function (item: ProjectBrowserItem) {
            console.info("Renaming path: " + item.path);
            self.menuHandler?.rename?.(item.path);
        });
        let menuImplode = menuEntry("Implode", "glyphicon glyphicon-pencil", function (item: ProjectBrowserItem) {
            console.info("Implode: " + item.path);
            self.menuHandler?.implodeConfig?.(item.path);
        })

        let menuReveal = menuEntry("Show In Folder", "glyphicon glyphicon-pencil", function (item: ProjectBrowserItem) {
            console.info("Reveal path: " + item.path);
            //PL-TODO const { shell } = require('electron');
            //PL-TODO shell.showItemInFolder(item.path);
        });

        // Default menu entries
        result.menuEntries = [menuEntryDelete];

        if (Path.basename(path).startsWith(".")) {
            return null;
        }
        if (stat.isFile()) {
            let projectPath: any = {}; //PL-TODO RTTester.getRelativePathInProject(result.path);
            if (pathComponents[0] == Project.PATH_TEST_DATA_GENERATION) {
                result.menuEntries = [];
                result.dblClickHandler = function () {
                    //PL-TODO RTTester.openFileInGUI(path);
                };
                result.img = "into-cps-icon-rtt-file";
                if (path.endsWith(".txt")) {
                    result.img = "into-cps-icon-rtt-txt";
                }
                else if ([".conf", ".confinc", ".rtp"].some((e) => path.endsWith(e))) {
                    result.img = "into-cps-icon-rtt-conf";
                }
                else if (path.endsWith(".log")) {
                    result.img = "into-cps-icon-rtt-log";
                }
                else if (path.endsWith(".html")) {
                    result.img = "into-cps-icon-rtt-html";
                    result.dblClickHandler = () => self.menuHandler?.openHTMLInMainView?.(result.path, projectPath);
                }
            }
            else if (pathComponents[0] == Project.PATH_MODEL_CHECKING) {
                if (pathComponents.length == 3 && pathComponents[2] == "abstractions.json") {
                    result.img = "glyphicon glyphicon-cog";
                    result.text = "Abstractions";
                    result.menuEntries = [];
                    result.dblClickHandler = () => self.menuHandler?.openCTAbstractions?.(path);
                } else if (pathComponents.length == 4 && pathComponents[3] == "model-checking-report.html") {
                    result.img = "into-cps-icon-rtt-html";
                    result.dblClickHandler = () => self.menuHandler?.openMCResult?.(result.path);
                } else {
                    return null;
                }
            }
            else if (path.endsWith(".sigverConfig.json") && parent != null) {


                parent.img = "into-cps-icon-projbrowser-config";
                parent.opensInMainWindow = true;
                parent.dblClickHandler = () => self.menuHandler?.openSigverView?.(path);
                parent.menuEntries = [menuEntryDelete, menuRename, menuReveal];
                parent.refresh();
                return null;
            }
            else if (path.endsWith(".dse.json") && parent != null) {
                // merge DSE and folder
                parent.img = "into-cps-icon-projbrowser-dse";
                (<any>parent).dseConfig = path;
                parent.opensInMainWindow = true;
                parent.dblClickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openDseView?.((<any>item).dseConfig);
                };
                parent.menuEntries = [menuEntryDelete];
                parent.refresh();
                return null;
            }
            else if (path.endsWith("results.html")) {
                result.img = "into-cps-icon-projbrowser-dse-result";
                result.removeFileExtensionFromText();
                result.dblClickHandler = function (item: ProjectBrowserItem) {
                    // self.menuHandler.openWithSystemEditor(item.path);
                    console.log(item.path);
                    self.menuHandler?.openHTMLInMainView?.(item.path, "DSE Results View");
                    return null;
                };
            }
            else if (path.endsWith("coe.json") && !this.isResultFolder(Path.dirname(path)) && parent != null) {
                // merge MultiModelConfig and folder
                parent.img = "into-cps-icon-projbrowser-config";
                (<any>parent).coeConfig = path;
                parent.opensInMainWindow = true;
                parent.dblClickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openCoeView?.((<any>item).coeConfig);
                };
                parent.menuEntries = [menuEntryDelete, menuRename, menuReveal, menuImplode];
                parent.refresh();
                return null;
            }

            else if (path.endsWith("index.html") && !this.isResultFolder(Path.dirname(path)) && parent != null) {
                //open the GUI
                parent.img = "into-cps-icon-projbrowser-config";
                (<any>parent).coeConfig = path;
                parent.opensInMainWindow = false;
                let url = "file://" + path;
                parent.dblClickHandler = function (item: ProjectBrowserItem) {
                    //PL-TODO let authWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: false, enableRemoteModule: true } });

                    //PL-TODO authWindow.loadURL(url);
                    //PL-TODO authWindow.show;
                };
                parent.refresh();
                return null
            }
            else if (path.endsWith("mm.json") && !this.isResultFolder(Path.dirname(path)) && parent != null) {
                // merge MultiModelConfig and folder
                parent.img = "into-cps-icon-projbrowser-multimodel";
                (<any>parent).mmConfig = path;
                parent.opensInMainWindow = true;
                parent.dblClickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openMultiModel?.((<any>item).mmConfig);
                };
                let menuEntryCreateCoSim = menuEntry("Create Co-Simulation Configuration", "glyphicon glyphicon-copyright-mark",
                    function (item: ProjectBrowserItem) {
                        console.info("Create new cosim config for: " + item.path);
                        self.menuHandler?.createCoSimConfiguration?.(item.path);
                    });
                parent.menuEntries = [menuEntryDelete, menuEntryCreateCoSim, menuRename, menuReveal];
                parent.refresh();
                return null;
            }
            else if (path.endsWith(".fmu")) {
                result.img = "icon-page";
                result.opensInMainWindow = true;
                result.removeFileExtensionFromText();
                result.dblClickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openFmu?.(item.path);
                };
                result.menuEntries.push(menuReveal);
            }
            else if (path.endsWith(".sysml.json")) {
                result.img = "into-cps-icon-projbrowser-modelio";
                result.removeFileExtensionFromText();
                result.opensInMainWindow = true;
                result.dblClickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openSysMlExport?.(item.path);
                };
                let menuEntryCreateMM = menuEntry("Create Multi-Model", "glyphicon glyphicon-briefcase",
                    function (item: ProjectBrowserItem) {
                        console.info("Create new multimodel for: " + item.path);
                        self.menuHandler?.createMultiModel?.(item.path);
                    });
                result.menuEntries = [menuEntryCreateMM, menuEntryDelete];
            }
            else if (path.endsWith(".sysml-dse.json")) {
                result.img = "into-cps-icon-projbrowser-modelio";
                result.removeFileExtensionFromText();
                result.opensInMainWindow = true;
                result.dblClickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openSysMlDSEExport?.(item.path);
                };
                let menuEntryCreateSysMLDSE = menuEntry("Create DSE Configuration", "glyphicon glyphicon-briefcase",
                    function (item: ProjectBrowserItem) {
                        console.info("Create new dse config for: " + item.path);
                        self.menuHandler?.createSysMLDSEConfig?.(item.path);
                    });
                result.menuEntries = [menuEntryCreateSysMLDSE, menuEntryDelete];
            }
            else if (path.endsWith(".emx")) {
                result.img = "into-cps-icon-projbrowser-20sim";
                result.removeFileExtensionFromText();
                result.dblClickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openWithSystemEditor?.(item.path);
                };
                result.menuEntries.push(menuReveal);
            }
            else if (path.endsWith(".mo")) {
                result.img = "into-cps-icon-projbrowser-openmodelica";
                result.removeFileExtensionFromText();
                result.dblClickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openWithSystemEditor?.(item.path);
                };
                result.menuEntries.push(menuReveal);
            }
            else if (path.endsWith(".csv")) {
                if (isResultValid(path)) {
                    result.img = "into-cps-icon-projbrowser-result";
                }
                else {
                    result.img = "glyphicon glyphicon-remove";
                }
                result.removeFileExtensionFromText();
                result.dblClickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openWithSystemEditor?.(item.path);
                };
                result.menuEntries.push(menuReveal);
            } else {
                return null;
            }
        } else if (stat.isDirectory()) {
            result.img = "icon-folder";
            result.menuEntries = [menuReveal];
            if (pathComponents[0] == Project.PATH_TEST_DATA_GENERATION ||
                pathComponents[0] == Project.PATH_MODEL_CHECKING) {
                result.menuEntries = [];
                if (pathComponents.length == 1) {
                    result.menuEntries.push(menuEntry("Start RT-Tester License Dongle", undefined,
                        function (item: ProjectBrowserItem) {
                            let cmd: any = {
                                title: "Start RT-Tester License Dongle",
                                //PL-TODO command: Path.join(RTTester.rttInstallDir(), "bin", "rtt_licd_dongle"),
                                arguments: ["19999"],
                                background: true
                            };
                            cmd.title = "Start RT-Tester License Dongle";
                            self.menuHandler?.runRTTesterCommand?.(cmd);
                        }));
                    result.menuEntries.push(menuEntry("Stop RT-Tester License Dongle", undefined,
                        function (item: ProjectBrowserItem) {
                            let cmd: any = {
                                title: "Stop RT-Tester License Dongle",
                                //PL-TODO command: Path.join(RTTester.rttInstallDir(), "bin", "rtt_talk_licd"),
                                arguments: ["stop", "19999"],
                            };
                            cmd.title = "Stop RT-Tester License Dongle";
                            self.menuHandler?.runRTTesterCommand?.(cmd);
                        }));
                    if (pathComponents[0] == Project.PATH_TEST_DATA_GENERATION) {
                        let menuEntryCreate = menuEntry("Create Test Data Generation Project", "glyphicon glyphicon-asterisk",
                            function (item: ProjectBrowserItem) {
                                self.menuHandler?.createTDGProject?.(item.path);
                            });
                        result.menuEntries.push(menuEntryCreate);
                    }
                    else if (pathComponents[0] == Project.PATH_MODEL_CHECKING) {
                        let menuEntryCreate = menuEntry("Create Model Checking Project", "glyphicon glyphicon-asterisk",
                            function (item: ProjectBrowserItem) {
                                self.menuHandler?.createMCProject?.(item.path);
                            });
                        result.menuEntries.push(menuEntryCreate);
                    }
                }
                if (pathComponents.length == 2) {
                    if (pathComponents[1] == "utils" ||
                        pathComponents[1] == "oslc" ||
                        pathComponents[1] == "repository") {
                        return null;
                    }
                    result.img = "into-cps-icon-rtt-vsi-tick";
                    let menuEntryDelete = menuEntry("Delete Project \"" + result.text + "\"", "glyphicon glyphicon-remove",
                        (item: ProjectBrowserItem) => rimraf(item.path, { glob: false }).catch(
                            (e: any) => { if (e) throw e; }));
                    result.menuEntries.push(menuEntryDelete);
                }
                if (pathComponents[0] == Project.PATH_MODEL_CHECKING) {
                    if (pathComponents.length == 2) {
                        let menuEntryAdd = menuEntry("Add LTL Query", "glyphicon glyphicon-plus",
                            (item: ProjectBrowserItem) => {
                                self.menuHandler?.showAddLTLQuery?.(result.path);
                            });
                        result.menuEntries.push(menuEntryAdd);
                    } else if (pathComponents.length == 3) {
                        let queryFileExists = () => {
                            try {
                                fs.statSync(Path.join(result.path, "query.json"));
                                return true;
                            } catch (e) { return false; }
                        };
                        if (queryFileExists()) {
                            result.img = "into-cps-icon-rtt-test-procedure";
                            let menuEntryDelete = menuEntry("Delete LTL Query \"" + result.text + "\"", "glyphicon glyphicon-remove",
                                (item: ProjectBrowserItem) => rimraf(item.path, { glob: false }).catch(
                                    (e: any) => { if (e) throw e; }));
                            result.menuEntries.push(menuEntryDelete);
                            result.dblClickHandler = (item: ProjectBrowserItem) => {
                                self.menuHandler?.openLTLQuery?.(result.path);
                            };
                        } else {
                            return null;
                        }
                    }
                }
                else {
                    if (pathComponents.length == 3 && (pathComponents[2] == "TestProcedures" || pathComponents[2] == "RTT_TestProcedures")) {
                        result.img = "into-cps-icon-rtt-tla";
                    }
                    else if (pathComponents.length == 4 && pathComponents[2] == "TestProcedures") {
                        result.img = "into-cps-icon-rtt-mbt-test-procedure";
                        if (pathComponents[3] == "Simulation") {
                            result.menuEntries.push(menuEntry("Generate Simulation FMU", "into-cps-icon-rtt-mbt-generate",
                                function (item: ProjectBrowserItem) {
                                    //PL-TODO let cmd: any = RTTester.genericMBTPythonCommandSpec(path, "rtt-mbt-fmi2gen-sim.py");
                                    //PL-TODO cmd.title = "Generate Simulation FMU";
                                    //PL-TODO self.menuHandler?.runRTTesterCommand(cmd);
                                }));
                        } else {
                            result.menuEntries.push(menuEntry("Copy MBT Test Procedure", "glyphicon glyphicon-plus",
                                (item: ProjectBrowserItem) => {
                                    $("#modalDialog").load("rttester/CopyTestProcedureDialog.html", (event: JQueryEventObject) => {
                                        //PL-TODO CopyTestProcedureDialog.display(item.path);
                                        //PL-TODO (<any>$("#modalDialog")).modal({ keyboard: false, backdrop: false });
                                    });
                                }));
                            result.menuEntries.push(menuEntry("Solve", "into-cps-icon-rtt-mbt-generate",
                                function (item: ProjectBrowserItem) {
                                    //PL-TODO let cmd: any = RTTester.genericMBTPythonCommandSpec(path, "rtt-mbt-gen.py");
                                    //PL-TODO cmd.title = "Solve";
                                    //PL-TODO let reportPath = Path.join(item.path, "log", "test-data-generation-report.html")
                                    //PL-TODO cmd.onSuccess = () => self.menuHandler?.openHTMLInMainView
                                    //PL-TODO (reportPath, RTTester.getRelativePathInProject(path));
                                    //PL-TODO self.menuHandler?.runRTTesterCommand(cmd);
                                }));
                            if (pathComponents[3] != "_P1") {
                                result.menuEntries.push(menuEntry("Delete MBT Test Procedure \"" + result.text + "\"", "glyphicon glyphicon-remove",
                                    (item: ProjectBrowserItem) => rimraf(item.path, { glob: false }).catch(
                                        (e: any) => { if (e) throw e; })));
                            }
                        }
                    }
                    else if (pathComponents.length == 4 && pathComponents[2] == "RTT_TestProcedures") {
                        result.img = "into-cps-icon-rtt-test-procedure";
                        if (pathComponents[3] != "Simulation") {
                            result.menuEntries.push(menuEntry("Generate Test FMU", "into-cps-icon-rtt-mbt-generate",
                                function (item: ProjectBrowserItem) {
                                    //PL-TODO let cmd: any = RTTester.genericMBTPythonCommandSpec(path, "rtt-mbt-fmi2gen.py");
                                    //PL-TODO cmd.title = "Generate Test FMU";
                                    //PL-TODO self.menuHandler?.runRTTesterCommand(cmd);
                                }));
                            result.menuEntries.push(menuEntry("Run Test", "into-cps-icon-rtt-run",
                                function (item: ProjectBrowserItem) {
                                    self.menuHandler?.runTest?.(item.path);
                                }));
                            result.menuEntries.push(menuEntry("Delete Test Procedure \"" + result.text + "\"", "glyphicon glyphicon-remove",
                                (item: ProjectBrowserItem) => rimraf(item.path, { glob: false }).catch(
                                    (e: any) => { if (e) throw e; })));
                        }
                    }
                }
            }
            else if (pathComponents.length == 1 && pathComponents[0] == Project.PATH_MULTI_MODELS) {
                let menuEntryCreate = menuEntry("New Multi-Model", "glyphicon glyphicon-asterisk",
                    function (item: ProjectBrowserItem) {
                        self.menuHandler?.createMultiModelPlain?.();
                    });
                result.menuEntries = [menuEntryCreate];
            }
            else if (this.isOvertureProject(path)) {
                result.img = "into-cps-icon-projbrowser-overture";
                result.expanded = false;
                let menuEntryExportFmuSourceCode = menuEntry("Export Source Code FMU", "glyphicon glyphicon-export",
                    function (item: ProjectBrowserItem) {
                        self.menuHandler?.exportOvertureFmu?.("source", item.path);
                    });
                let menuEntryExportFmuToolWrapper = menuEntry("Export Tool Wrapper FMU", "glyphicon glyphicon-export",
                    function (item: ProjectBrowserItem) {
                        self.menuHandler?.exportOvertureFmu?.("tool", item.path);
                    });
                result.menuEntries = [menuEntryExportFmuSourceCode, menuEntryExportFmuToolWrapper];
                result.menuEntries.push(menuReveal);
            }
            else if (Path.basename(path) == Project.PATH_DSE) {
                let menuEntryCreate = menuEntry("Create Design Space Exploration Config", "glyphicon glyphicon-asterisk",
                    function (item: ProjectBrowserItem) {
                        self.menuHandler?.createDsePlain?.(item.path);
                    });
                result.menuEntries = [menuEntryCreate];
            }
            else if (Path.basename(path) == Project.PATH_SIGVER) {
                let menuEntryCreate = menuEntry("Create new configuration", "glyphicon glyphicon-asterisk",
                    function (item: ProjectBrowserItem) {
                        self.menuHandler?.createSigverPlain?.(item.path);
                    });
                result.menuEntries = [menuEntryCreate];
            }
            else if (Path.basename(path) == Project.PATH_TRACEABILITY) {
                let menuGraph = menuEntry("View Traceability Graph", "glyphicon glyphicon-asterisk",
                    function (item: ProjectBrowserItem) {
                        self.menuHandler?.showTraceView?.();
                    });
                let menuOpenTr = menuEntry("Trace Objects", "glyphicon glyphicon-asterisk",
                    function (item: ProjectBrowserItem) {
                        self.menuHandler?.openTraceability?.();
                    });
                result.menuEntries = [menuGraph, menuOpenTr];
                result.clickHandler = function (item: ProjectBrowserItem) {
                    self.menuHandler?.openTraceability?.();

                };
            } else if (Path.basename(path) == "downloads") {
                // skip the project download folder
                return;
            }
            else if (this.isResultFolder(path)) {
                result.img = 'icon-folder';
                result.menuEntries = [menuEntryDelete];
                result.menuEntries.push(menuReveal);
            }
        }
        if (result != null) {
            if (parent != null)
                result.activate(parent);
        }
        return result;
    }

    public addFSFolderContent(path: string, parent?: ProjectBrowserItem): ProjectBrowserItem[] {
        let result: ProjectBrowserItem[] = [];
        let self = this;
        fs.readdirSync(path).forEach(function (name: string) {
            let filePath: string = Path.join(path, name);
            let ret = self.addFSItem(filePath, parent);
            if (ret != null) {
                result.push(ret);
            }
        });
        return result;
    }

    /*
    Utility function to determin if the container holds an Overture Project. TODO: Should this be annotated in the container instead.
     */
    private isOvertureProject(path: string): boolean {

        let projectFile = Path.normalize(Path.join(path, ".project"));

        try {
            if (fs.accessSync(projectFile, fs.constants.R_OK) !== null) {
                let content = fs.readFileSync(projectFile, "utf-8");
                return content.indexOf("org.overture.ide.vdmrt.core.nature") >= 0;

            }
        } catch (e) {

        }
        return false;
    }

    private isResultFolder(path: string): boolean {
        return Path.basename(path).indexOf("R_") == 0;
    }

}
