import MockAdapter from "axios-mock-adapter";
import {
    createSession,
    getSimulationResults,
    initializeSession,
    maestroClient,
    runSimulationWithConfig,
    simulateSession,
} from "maestro";

const axiosMock = new MockAdapter(maestroClient);

describe("Maestro API Client", () => {
    afterEach(axiosMock.restore);

    it("should create a session successfully", async () => {
        const sessionId = "test-session-id";
        axiosMock.onGet("/createSession").replyOnce(200, { sessionId });

        const result = await createSession();
        expect(result).toEqual(sessionId);
    });

    it("should initialize a session successfully", async () => {
        const sessionId = "test-session-id";
        axiosMock
            .onPost(`/initialize/${sessionId}`)
            .replyOnce(200, { status: "initialized" });

        const result = await initializeSession(sessionId, undefined);
        expect(result).toBe(true);
    });

    it("should fail to initialize a session", async () => {
        const sessionId = "test-session-id";
        axiosMock
            .onPost(`/initialize/${sessionId}`)
            .replyOnce(200, { status: "not-initialized" });

        const result = await initializeSession(sessionId, undefined);
        expect(result).toBe(false);
    });

    it("should initialize a simulation successfully", async () => {
        const sessionId = "test-session-id";
        axiosMock
            .onPost(`/simulate/${sessionId}`)
            .replyOnce(200, { status: "Finished" });

        const result = await simulateSession(sessionId, undefined);
        expect(result).toBe(true);
    });

    it("should fail to initialize a simulation", async () => {
        const sessionId = "test-session-id";
        axiosMock
            .onPost(`/simulate/${sessionId}`)
            .replyOnce(200, { status: "not-Finished" });

        const result = await simulateSession(sessionId, undefined);
        expect(result).toBe(false);
    });

    it("should return simulation data", async () => {
        const sessionId = "test-session-id";
        const data = Symbol("data");
        axiosMock.onGet(`/result/${sessionId}/plain`).reply(200, data);

        const result = await getSimulationResults(sessionId);
        expect(result).toBe(data);
    });

    it("should return simulation results if all steps succeed", async () => {
        const sessionId = "test-session-id";
        const data = Symbol("data");

        axiosMock.onGet("/createSession").replyOnce(200, { sessionId });
        axiosMock
            .onPost(`/initialize/${sessionId}`)
            .replyOnce(200, { status: "initialized" });
        axiosMock
            .onPost(`/simulate/${sessionId}`)
            .replyOnce(200, { status: "Finished" });
        axiosMock.onGet(`/result/${sessionId}/plain`).reply(200, data);

        const result = await runSimulationWithConfig(undefined, undefined);

        expect(result).toBe(data);
    });
});
