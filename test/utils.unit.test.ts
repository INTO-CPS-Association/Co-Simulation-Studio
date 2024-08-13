import { ConfigurationScope, Uri, WorkspaceFolder, workspace } from "vscode";
import {
    SimulationConfiguration,
    getCosimPath,
    isDocumentCosimConfig,
    isSimulationConfiguration,
    resolveAbsolutePath,
    resolveSimulationConfig,
} from "../src/utils";
import {
    createTextDocument,
    createMockWorkspaceConfiguration,
} from "jest-mock-vscode";
import { MockWorkspaceConfigurationData } from "jest-mock-vscode/dist/vscode";
import rfdc from "rfdc";

const clone = rfdc();

const workspaceUri = Uri.file("/data");
const workspaceFolder: WorkspaceFolder = {
    uri: workspaceUri,
    name: "data",
    index: 0,
};

type CosimStudioUserSettings = unknown;

const baseConfig: MockWorkspaceConfigurationData<{
    cosimstudio: CosimStudioUserSettings;
}> = {
    "[*]": {
        globalValue: {
            cosimstudio: {
                cosimPath: "custom_cosim.json",
            },
        },
    },
};

const cosimDocument = createTextDocument(
    Uri.joinPath(workspaceUri, "custom_cosim.json"),
    "dummy file content",
    "json"
);
const otherDocumentAtCorrectPath = createTextDocument(
    Uri.joinPath(workspaceUri, "custom_cosim.json"),
    "dummy file content",
    "typescript"
);

describe("Util Functions", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should resolve default config when not set", () => {
        const spy = jest.spyOn(workspace, "getConfiguration");
        const conf = sampleConfig("cosimstudio");
        conf.update("cosimPath", undefined, true);
        spy.mockReturnValue(conf);

        const cosimPath = getCosimPath(cosimDocument);

        expect(cosimPath).toEqual("cosim.json");
    });

    it("should resolve to set config", () => {
        const spy = jest.spyOn(workspace, "getConfiguration");
        const conf = sampleConfig("cosimstudio");
        spy.mockReturnValue(conf);

        const cosimPath = getCosimPath(cosimDocument);

        expect(cosimPath).toEqual("custom_cosim.json");
    });

    it("should correctly identify a cosim file", () => {
        const getConfigurationSpy = jest.spyOn(workspace, "getConfiguration");
        const conf = sampleConfig("cosimstudio");
        getConfigurationSpy.mockReturnValue(conf);

        const workspacesSpy = jest.spyOn(workspace, "workspaceFolders", "get");
        workspacesSpy.mockReturnValue([workspaceFolder]);

        const isCosimFile = isDocumentCosimConfig(cosimDocument);
        const isOtherCosimFile = isDocumentCosimConfig(
            otherDocumentAtCorrectPath
        );

        expect(isCosimFile).toBe(true);
        expect(isOtherCosimFile).toBe(false);
    });

    it("should return input path when already absolute", () => {
        const absPath = "/path/that/is/already/absolute.json";

        const resPath = resolveAbsolutePath(workspaceFolder, absPath);

        expect(resPath).toBe(absPath);
    });

    it("should return absolute path when input is relative to workspace", () => {
        const relPath = "src/custom_cosim.json";

        const resPath = resolveAbsolutePath(workspaceFolder, relPath);

        expect(resPath).toBe("/data/src/custom_cosim.json");
    });

    it("should resolve FMU configs to absolute paths", () => {
        const simConfig: SimulationConfiguration = {
            fmus: {
                fmu1: "/absolute/path",
                fmu2: "relative/path",
                fmu3: "./relative/path2",
            },
        };

        const resolvedConfig = resolveSimulationConfig(
            simConfig,
            workspaceFolder
        );

        expect(resolvedConfig).toEqual({
            fmus: {
                fmu1: "/absolute/path",
                fmu2: "/data/relative/path",
                fmu3: "/data/relative/path2",
            },
        });
    });

    it("should correctly identify cosimulation configuration object", () => {
        const simConfig: SimulationConfiguration = {
            fmus: {},
        };

        const isCosimConfig = isSimulationConfiguration(simConfig);

        expect(isCosimConfig).toBe(true);
    });

    it("should correctly identify when an object is not a cosimulation configuration", () => {
        const simConfig = {
            notFmus: {},
        };

        const isCosimConfig = isSimulationConfiguration(simConfig);

        expect(isCosimConfig).toBe(false);
    });
});

function sampleConfig(key?: string, scope?: ConfigurationScope | null) {
    const config = createMockWorkspaceConfiguration(
        jest,
        clone(baseConfig),
        key,
        scope
    );
    return config;
}
