# Co-Simulation Studio

Co-Simulation Studio is VSCode extension that serves as a frontend of the INTO-CPS Tool Chain. It is used
to configure and run FMI-based co-simulations. Other features include model
checking, test automation and design space exploration.

The VSCode extension is primarily a UI. Most of the modelling and simulation work is done by
the INTO-CPS tools themselves. These can be downloaded from within the app.  
For additional details besides this document, see the [wiki](https://github.com/INTO-CPS-Association/Co-Simulation-Studio/wiki). 

## Build

To build the VSCode extension, you'll need [Angular](https://angular.io/) 14+, [Node.js](https://nodejs.org/) and npm (comes with Node.js). Npm can be upgraded with `npm install npm@latest -g`.

To build the VSCode extension, run the following commands in the project folder after checking out the repository:
```bash
npm install
npm run compile
```

To run the extension with debugging, from with VSCode press F5 on your keyboard.

To run the extension without debugging, from with VSCode press Ctrl+F5 on your keyboard.

## Packaging

To package the VSCode extension, you'll need the vsce package. To install vsce, run the following command:

```bash
npm install -g @vscode/vsce
```

Once vsce is installed, you can package the VSCode extension as a *.vsix file by running the following command at the root of the project:

```bash
vsce package
```

## Development

For an editor, [Visual Studio Code](https://code.visualstudio.com/) is a good choice. It's
cross-platform and is actually built on top of Electron. That said, you can use
whatever you want.

Further developer info is available in https://github.com/INTO-CPS-Association/Co-Simulation-Studio/wiki

## Latest builds

The main branch is built automatically on git pushes and the output, for
successful builds. Please find the artifacts by clicking in the run [of the Package workflow](https://github.com/INTO-CPS-Association/Co-Simulation-Studio/actions?query=workflow%3APackage).

These builds represent ongoing work. They have not been fully tested and are
not guaranteed to work. Normally, you are advised to use one of the
[releases](https://github.com/INTO-CPS-Association/Co-Simulation-Studio/releases).

## About

INTO-CPS is an EU Horizon 2020 research project that is creating an integrated
tool chain for comprehensive Model-Based Design of Cyber-Physical Systems. For
more, see: http://into-cps.au.dk/
