import axios, { AxiosInstance } from 'axios'
import { getLogger } from './logging'
import { inspect } from 'util'

const logger = getLogger()

interface MaestroSessionStatus {
    status: string
    sessionId: string
    lastExecTime: number
    warnings: string[] | null
    errors: string[] | null
}

interface MaestroSimulationResult {
    sessionId?: string
    data?: string
}

/**
 * Helper function to extract useful error information.
 */
function getErrorDetails(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const responseDetails = error.response
            ? `Status: ${error.response.status}, Data: ${inspect(
                  error.response.data
              )}`
            : 'No response received from server.'

        const messageParts = [error.message, responseDetails].filter(
            (c) => c.length > 0
        )
        return messageParts.join('. ')
    } else {
        return `Unknown error: ${inspect(error)}`
    }
}

export class MaestroClient {
    private client: AxiosInstance

    constructor(host: string, port: number) {
        const baseURL = `${host}:${port}`
        this.client = axios.create({ baseURL })
    }

    /**
     * Generates a unique Maestro session id.
     * @returns Session-id upon success, `undefined` if request fails.
     */
    async createSession(): Promise<string | undefined> {
        try {
            const response = await this.client.get('/createSession')
            return response.data.sessionId
        } catch (error) {
            const errMsg = `Failed to create session: '${getErrorDetails(
                error
            )}'`
            logger.error(errMsg)
            throw new Error(errMsg)
        }
    }

    /**
     * Initializes a Maestro session with a simulation configuration.
     * @param sessionId Session identifier.
     * @param config The configuration applied to the session.
     * @returns A Promise that resolves to `true` if the session is successfully initialized, otherwise resolves to`false`.
     */
    async initializeSession(
        sessionId: string,
        config: unknown
    ): Promise<boolean> {
        try {
            const response = await this.client.post(
                `/initialize/${sessionId}`,
                config
            )
            return response.data.status === 'initialized'
        } catch (error) {
            const errMsg = `Failed to initialize session '${sessionId}': '${getErrorDetails(
                error
            )}'`
            logger.error(errMsg)
            throw new Error(errMsg)
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
    async simulateSession(
        sessionId: string,
        config: unknown
    ): Promise<boolean> {
        try {
            const response = await this.client.post(
                `/simulate/${sessionId}`,
                config
            )
            return response.data.status === 'Simulation completed'
        } catch (error) {
            const errMsg = `Failed to run simulation for session '${sessionId}': '${getErrorDetails(
                error
            )}'`
            logger.error(errMsg)

            return false
        }
    }

    /**
     * Retrieves the simulation results for a Maestro session with the specified session identifier.
     *
     * @param sessionId The identifier of the Maestro session for which the simulation results are to be retrieved.
     * @returns A Promise that resolves to a CSV-formatted string representing the simulation results if retrieval is successful,
     *          otherwise resolves to `undefined` if the retrieval fails or encounters an error.
     */
    async getSimulationResults(sessionId: string): Promise<string | undefined> {
        try {
            const response = await this.client.get(`/result/${sessionId}/plain`)
            return response.data
        } catch (error) {
            const errMsg = `Failed to retrieve simulation for session '${sessionId}': '${getErrorDetails(
                error
            )}'`
            logger.error(errMsg)

            return undefined
        }
    }

    /**
     * Retrieves the current status of a Maestro session with the specified session identifier.
     *
     * @param sessionId The identifier of the Maestro session for which the status is to be retrieved.
     * @returns A Promise that resolves to a a Maestro status object if retrieval is successful,
     *          otherwise resolves to `undefined` if the retrieval fails or encounters an error.
     */
    async getSessionStatus(
        sessionId: string
    ): Promise<MaestroSessionStatus | undefined> {
        try {
            const response = await this.client.get(`/status/${sessionId}`)
            return response.data
        } catch (error) {
            const errMsg = `Failed to retrieve session status for session '${sessionId}': '${getErrorDetails(
                error
            )}'`
            logger.error(errMsg)

            return undefined
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
    async runSimulationWithConfig(
        simulationConfig: unknown,
        config: unknown
    ): Promise<MaestroSimulationResult | undefined> {
        try {
            // Create a new session
            const sessionId = await this.createSession()
            if (!sessionId) {
                logger.error('Failed to create session for simulation.')
                return undefined
            }

            // Initialize the session with the provided configuration
            const initializationResult = await this.initializeSession(
                sessionId,
                simulationConfig
            )
            if (!initializationResult) {
                logger.error(
                    `Failed to initialize session '${sessionId}' for simulation.`
                )
                return {
                    sessionId,
                }
            }

            // Run the simulation
            const success = await this.simulateSession(sessionId, config)
            if (!success) {
                return {
                    sessionId,
                }
            }

            // Retrieve the results
            const rawResult = await this.getSimulationResults(sessionId)

            return {
                sessionId,
                data: rawResult,
            }
        } catch (error) {
            const errMsg = `Failed to run simulation: '${error}'`
            throw new Error(errMsg)
        }
    }
}
