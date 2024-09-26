# Prioritized todo-list

- [ ] Tutorial 01 - show first cosim.json file
- [x] console.error in test looks like an error in test.
- [x] Focus output channel on simulation run. Print status of simulation execution in output channel. Probably remove the notification on simulation failure.
- [x] Weird inconsistent spacing/tabs
- [ ] Additional testing - increase coverage in unit tests
- [ ] Setup Actions to build extension package
- [ ] Demo video showing basic functionality of extension.
- [ ] Documentation - MkDocs, for reference: <https://github.com/INTO-CPS-Association/DTaaS/blob/feature/distributed-demo/docs/PUBLISH.md>

## v0.2.0 development

1. (later) cosim_studio.json --> to  be used for one cosimulation workspace. It can refer to multiple cosimulation configs - maestro host and port is moved to here.
2. (later) extension configuration, i.e. where is Maestro running
3. The project could benefit from a DI framework - consider this for a future release.
4. Look at activation events and extension configuration with a fixed name.
5. Display the resulting data from running a simulation in a table (look at old branches in repo for inspiration).
6. Add JSON schemas over the configs.
