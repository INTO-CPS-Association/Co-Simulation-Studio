/*
     * Method to run a DSE with the current DSE configuration. Assumes that the DSE can be run. 
     * The method does not need to send the DSEConfiguration object, simply the correct paths. It relies upon the
     * config being saved to json format correctly.
     */
async function runDse() {
	const dir = await CoSimulationStudioApi.dirname(this._path);

	fs.watch(dir, (eventType, filename) => {
		if (filename) {
			if (eventType == 'rename') {
				this.resultdir = Path.join(dir, filename);
			}
		} else {
			console.log('filename not provided');
		}
	});

	this.simulation = true;
	this.simfailed = false;
	this.simsuccess = false;
	let stdoutChunks: any[] = [];
	let stderrChunks: any[] = [];
	const spawn = require('child_process').spawn;
	const installDir = IntoCpsApp.getInstance()?.getSettings().getValue(SettingKeys.INSTALL_DIR);

	const absoluteProjectPath = await CoSimulationStudioApi.getRootFilePath() ?? "";
	const experimentConfigName = this._path.slice(absoluteProjectPath.length + 1, this._path.length);
	const multiModelConfigName = this.coeconfig.slice(absoluteProjectPath.length + 1, this.coeconfig.length);


	//Using algorithm selector script allows any algortithm to be used in a DSE config.
	const scriptFile = await CoSimulationStudioApi.join(installDir, "dse", "Algorithm_selector.py");
	const dseScriptOptions = [scriptFile, absoluteProjectPath, experimentConfigName, multiModelConfigName, `-t ${this.threadCount}`];

	if (!this.generateHTMLOutput)
		dseScriptOptions.push("-noHTML");
	if (!this.generateCSVOutput)
		dseScriptOptions.push("-noCSV");

	const child = spawn("python", dseScriptOptions, {
		/* detached: true, */
		shell: false,
		// cwd: childCwd
	});
	child.unref();

	child.on('error', (err: any) => {
		// When the python was not found in your system
		console.error('Failed to start subprocess.' + err.message);
		dialog.showMessageBox(
			{
				type: "error",
				buttons: ["OK"],
				message:
					"Python spawn failed \n" +
					"Check if Python is install and available in the path \n" +
					err.message
			}
		);
		this.simfailed = true;
		this.simulation = false;
	});

	child.on('close', (code: any) => {
		console.log(`child process close all stdio with code ${code}`);
	});

	child.on('end', (code: any) => {
		console.log(`child process exited with code ${code}`);
	});

	child.stdout.on('data', function (data: any) {
		stdoutChunks = stdoutChunks.concat(data);
	});
	child.stdout.on('end', () => {
		const stdoutContent = Buffer.concat(stdoutChunks).toString();
		console.log('stdout chars:', stdoutContent.length);
		// see the output uncomment this line
		// console.log(stdoutContent);
	});
	child.stderr.on('data', function (data: any) {
		stderrChunks = stderrChunks.concat(data);
	});
	child.stderr.on('end', async () => {
		const stderrContent = Buffer.concat(stderrChunks).toString();
		console.log('stderr chars:', stderrContent.length);

		console.log(stderrContent);
		if (stderrContent.length > 0) {
			this.parseError = stderrContent;
			console.warn(this.parseError);
			this.simfailed = true;
			this.simulation = false;
			dialog.showMessageBox(
				{
					type: "error",
					buttons: ["OK"],
					message:
						"Running DSE failed. \n" +
						this.parseError.toString().substr(0, 25) +
						"See full error description in devtools. \n"
				}
			);
		} else {
			this.simsuccess = true;
			this.simulation = false;
			console.log("end DSE sim");
			this.resultpath = await CoSimulationStudioApi.normalize(`${this.resultdir}/results.html`);
		}
	});
}

/*
     * Method to run a DSE with the current DSE configuration. Assumes that the DSE can be run. 
     * The method does not need to send the DSEConfiguration object, simply the correct paths. It relies upon the
     * config being saved to json format correctly.
     */
function runDse2() {
	console.log('running from config');
	const spawn = require('child_process').spawn;
	const installDir = IntoCpsApp.getInstance()?.getSettings().getValue(SettingKeys.INSTALL_DIR) ?? "";

	const absoluteProjectPath = IntoCpsApp.getInstance()?.getActiveProject()?.getRootFilePath() ?? "";
	const experimentConfigName = this._path.slice(absoluteProjectPath.length + 1, this._path.length);
	const multiModelConfigName = this.coeconfig.slice(absoluteProjectPath.length + 1, this.coeconfig.length);
	// check if python is installed.
	/* dependencyCheckPythonVersion(); */


	//Using algorithm selector script allows any algortithm to be used in a DSE config.
	const scriptFile = Path.join(installDir, "dse", "Algorithm_selector.py");
	const child = spawn("python", [scriptFile, absoluteProjectPath, experimentConfigName, multiModelConfigName], {
		detached: true,
		shell: false,
		// cwd: childCwd
	});
	child.unref();

	child.stdout.on('data', function (data: any) {
		console.log('dse/stdout: ' + data);
	});
	child.stderr.on('data', function (data: any) {
		console.log('dse/stderr: ' + data);
	});
}