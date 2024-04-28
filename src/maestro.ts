import axios from "axios"
import { logError } from "./utils";

const MAESTRO_BASE_URL = "http://localhost:8082";

const maestroClient = axios.create({
    baseURL: MAESTRO_BASE_URL
});

/**
 * Generates a unique Maestro session id.
 * @returns Session-id upon success, `undefined` if request fails. 
 */
export async function createSession(): Promise<string | undefined> {
    try {
        const response = await maestroClient.get("/createSession");
        return response.data.sessionId;
    } catch (error) {
        const errMsg = `Failed to create session with error '${error}'`;
        logError(errMsg);
        throw new Error(errMsg);
    }
}

/**
 * Initializes a Maestro session with a simulation configuration.
 * @param sessionId Session identifier.
 * @param config The configuration applied to the session.
 * @returns A Promise that resolves to `true` if the session is successfully initialized, otherwise resolves to`false`.
 */
export async function initializeSession(sessionId: string, config: unknown): Promise<boolean> {
    try {
        const response = await maestroClient.post(`/initialize/${sessionId}`, config);
        return response.data.status === "initialized";
    } catch (error) {
        const errMsg = `Failed to initialize session '${sessionId}' with error '${error}'`;
        logError(errMsg);
        throw new Error(errMsg);
    }
}

/**
 * Runs the simulation for a Maestro session with the specified session identifier.
 * This function triggers the execution of the simulation associated with the provided session ID.
 * 
 * @param sessionId The identifier of the Maestro session for which the simulation should be run.
 * @param config The simulation configuration.
 * @returns A Promise that resolves to `true` if the simulation is successfully initiated and completes, 
 *          otherwise resolves to `false` if the simulation fails to start or encounters an error during execution.
 */
export async function simulateSession(sessionId: string, config: unknown): Promise<boolean> {
    try {
        const response = await maestroClient.post(`/simulate/${sessionId}`, config);
        return response.data.status === "Finished";
    } catch (error) {
        logError(`Failed to run simulation for session '${sessionId}' with error '${error}'`);
        return false;
    }
}

/**
 * Retrieves the simulation results for a Maestro session with the specified session identifier.
 * 
 * @param sessionId The identifier of the Maestro session for which the simulation results are to be retrieved.
 * @returns A Promise that resolves to a CSV-formatted string representing the simulation results if retrieval is successful,
 *          otherwise resolves to `undefined` if the retrieval fails or encounters an error.
 */
export async function getSimulationResults(sessionId: string): Promise<string | undefined> {
    try {
        const response = await maestroClient.get(`/result/${sessionId}/plain`);
        return response.data;
    } catch (error) {
        logError(`Failed to retrieve simulation for session '${sessionId}' with error '${error}'`);
        return undefined;
    }
}

/**
 * Runs a simulation using the provided configuration.
 * This function creates a new session, initializes it with the provided configuration,
 * and then runs the simulation.
 * @param simulationConfig The configuration for the simulation.
 * @param config The simulation configuration.
 * @returns A Promise that resolves to a CSV-formatted string representing the simulation results if retrieval is successful,
 *          otherwise resolves to `undefined` if the retrieval fails or encounters an error.
 */
export async function runSimulationWithConfig(simulationConfig: unknown, config: unknown): Promise<string | undefined> {
    try {
        // Create a new session
        const sessionId = await createSession();
        if (!sessionId) {
            logError("Failed to create session for simulation.");
            return undefined;
        }

        // Initialize the session with the provided configuration
        const initializationResult = await initializeSession(sessionId, simulationConfig);
        if (!initializationResult) {
            logError(`Failed to initialize session '${sessionId}' for simulation.`);
            return undefined;
        }

        // Run the simulation
        await simulateSession(sessionId, config);

        // Retrieve the results
        return await getSimulationResults(sessionId);
    } catch (error) {
        const errMsg = `Failed to run simulation with error '${error}'`;
        logError(errMsg);
        throw new Error(errMsg);
    }
}