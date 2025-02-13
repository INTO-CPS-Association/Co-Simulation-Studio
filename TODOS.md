# Prioritized todo-list

- [x] Tutorial 01 - show first cosim.json file
- [x] Fix paths - the VS Code paths given for a workspace are not valid URI, so both node filesystem and Maestro break when using VS Code paths. Try using node fs API to get current directory (how does this work in single-root workspace and multi-root workspace?)
- [x] console.error in test looks like an error in test.
- [x] Focus output channel on simulation run. Print status of simulation execution in output channel. Probably remove the notification on simulation failure.
- [x] Weird inconsistent spacing/tabs
- [x] The cosim file is not linted when it is opened or when the extension starts. Meaning when the extension first loads it won't catch errors until the file has been edited. Also, if an FMU is ever deleted, it won't show up as an error in the configuration file.
- [x] Remove dangling period in Axios error message.
- [x] Filter autocompletion items for connections to only show input/output/parameters depending on context.
- [x] Setup Actions to build extension package
- [x] Additional testing - increase coverage in unit tests
  - [x] Linting error typing
  - [x] Test data into data directory
  - [x] Open preliminary PR
- [x] Demo video showing basic functionality of extension.
- [x] Documentation - MkDocs, for reference: <https://github.com/INTO-CPS-Association/DTaaS/blob/feature/distributed-demo/docs/PUBLISH.md>
- [x] Improve linting and autocompletion of parameters.

## v0.2.0 development - end of January

> Reference: (<https://github.com/INTO-CPS-Association/Co-Simulation-Studio/discussions/197>)

- [ ] Save simulation results in file in workspace in `results`-directory
- [ ] (later) cosim_studio.json --> to be used for one cosimulation workspace. It can refer to multiple cosimulation configs - maestro host and port is moved to here.
  - [ ] `cosimulation` top-level directory
  - [ ] Add schemas for the validation of the config
- [ ] Look at activation events and extension configuration with a fixed name.

## v0.2.1 development

- [ ] The project could benefit from a DI framework - consider this for a future release.
- [ ] Display the resulting data from running a simulation in a table (look at old branches in repo for inspiration).
- [ ] Set up filesystem watchers to detect when FMUs are changed/moved/deleted etc.
