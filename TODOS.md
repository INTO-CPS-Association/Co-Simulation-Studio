# Prioritized todo-list

- [x] Tutorial 01 - show first cosim.json file
- [x] Fix paths - the VS Code paths given for a workspace are not valid URI, so both node filesystem and Maestro break when using VS Code paths. Try using node fs API to get current directory (how does this work in single-root workspace and multi-root workspace?)
- [x] console.error in test looks like an error in test.
- [x] Focus output channel on simulation run. Print status of simulation execution in output channel. Probably remove the notification on simulation failure.
- [x] Weird inconsistent spacing/tabs
- [x] The cosim file is not linted when it is opened or when the extension starts. Meaning when the extension first loads it won't catch errors until the file has been edited. Also, if an FMU is ever deleted, it won't show up as an error in the configuration file.
- [x] Remove dangling period in Axios error message.
- [ ] Filter autocompletion items for connections to only show input/output/parameters depending on context.
- [ ] Setup Actions to build extension package
- [ ] Additional testing - increase coverage in unit tests
- [ ] Demo video showing basic functionality of extension.
- [ ] Documentation - MkDocs, for reference: <https://github.com/INTO-CPS-Association/DTaaS/blob/feature/distributed-demo/docs/PUBLISH.md>

## v0.2.0 development

1. (later) cosim_studio.json --> to  be used for one cosimulation workspace. It can refer to multiple cosimulation configs - maestro host and port is moved to here.
2. (later) extension configuration, i.e. where is Maestro running
3. The project could benefit from a DI framework - consider this for a future release.
4. Look at activation events and extension configuration with a fixed name.
5. Display the resulting data from running a simulation in a table (look at old branches in repo for inspiration).
6. Add JSON schemas over the configs.
7. Improve linting and autocompletion of parameters.
8. Set up filesystem watchers to detect when FMUs are changed/moved/deleted etc.
