# Developer guide for Cosimulation Studio VS Code extension

This guide aims to boil everything you need to know to develop on the extension down to a few short steps. The guide covers how to set up your development environment, running tests, bundling the extension, debugging the extension in a VS Code instance, and finally how to publish the extension when it's ready for release.

## Setting up the development environment

### Using Dev Containers

The easiest way(*) to get started with development is by using the Dev Container environment that is set up for the project. It comes with batteries included:

1. VS Code extensions required to develop, e.g. eslint and prettier.
2. Node and npm.
3. The newest version of maestro-webapi and a compatible version of the JRE.

If you prefer to use your own Maestro JAR and Java version, such as when working with a cutting-edge development version, there's also a `Basic` Dev Container available that doesn't include Maestro or Java.

(*) *if you already have Docker installed, otherwise it can be slightly involved*.

#### Prerequisites

Before you can use dev containers, you need to install Docker Desktop, and if you're on Windows enable the WSL 2 backend, so you can run Linux containers. These great guides walk you through the entire process:

1. Installing Docker Desktop: [Windows](https://docs.docker.com/desktop/install/windows-install/), [Mac](https://docs.docker.com/desktop/install/windows-install/), [Linux](https://docs.docker.com/desktop/install/windows-install/)
2. Enabling the WSL 2 backend (skip of not on Windows): [guide](https://docs.docker.com/desktop/wsl/)

⚠️ **NOTE:** When running Docker on a Windows host, it's very important to configure Docker Desktop to use Linux containers, otherwise the dev containers will simply not start.

Now install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension from the VS Code Marketplace.

#### Cloning the repo

Run the VS Code command ```Dev Containers: Clone Repository in Named Container Volume...``` and go through the steps of the setup wizard.

#### Running Maestro

Maestro is automatically started when you launch the Extension Host and use the `Run Extension with Maestro` launch task. To avoid this behavior, use the other launch task instead: `Run Extension`.

### Alternative approach (without Dev Containers)

With this approach, you don't have to install Docker.

1. Clone the repo: `git clone https://github.com/INTO-CPS-Association/Co-Simulation-Studio.git`
2. Open your extensions view in VS Code, search for `@recommended` and install the `Workspace Recommendations`.
3. Install node and NPM. Instructions for your OS are found on the web.
4. [Optional] Downloading Maestro
    1. Install at least Java 11 (JRE).
    2. Download the latest release of `maestro-webapi` from [here](https://github.com/INTO-CPS-Association/maestro/releases).
    3. Set the environment variable `MAESTRO_WEBAPI_PATH` to the path pointing to the Maestro JAR. This allows the dev tools to automatically find and start Maestro when you're debugging the extension.

### Finishing steps (applies to both approaches)

Standing at the root of the cloned repository, install the project dependencies:

```bash
npm install
```

## Running tests

Running tests and generating coverage reports is as simple as running a few npm scripts:

### Units tests

```bash
npm run test:unit
```

### Integration tests

```bash
npm run test:integration
```

## Launching the extension for debugging

When you've made modifications to the extension that you'd like to try out, the fastest way to poke around in a custom build of the extension is to launch the VS Code "Extension Host". There are two configurations to choose from: one that starts Maestro alongside the Extension Host, and one that doesn't (default). You can pick from one of these two configurations and start the Extension Host in the `Run and Debug` view.

For future reference, when you've selected your preferred debug configuration, the shortcut <kbd>F5</kbd> can be used to launch the most recently used configuration.

### A note on code updates

Although `esbuild` is running in watch mode and bundles the project on every detected change, the VS Code Extension Host does not support hot reloading. Thus, your changes will not immediately reflect in the Extension Host, which will require a reload. The easiest way to do this is to run `Developer: Reload Window` from the VS Code command palette.

## Bundling the extension

If a pre-bundled version of the extension hasn't been published to the Visual Studio Code Marketplace, or if you require a build with cutting-edge features, you can bundle the extension locally.

First install the CLI to package VS Code extension:

```bash
# The VS Code Extension Manager, used to bundle the extension
npm install -g @vscode/vsce
```

The extension can then be bundled by running:

```bash
vsce package
```

This will output a `.vsix`-file which can be installed by following the guide [here](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix). The filename of the `.vsix`-file will reflect the version defined in the `package.json`, so it's a good idea to set the version to something that clearly reflects that the bundle is pre-release if you haven't finished development yet.

## Publishing the extension

With a `.vsix` in hand, it's time to publish the extension to the Marketplace. At the moment, this is done manually through the [browser-based interface](https://marketplace.visualstudio.com/manage/).
