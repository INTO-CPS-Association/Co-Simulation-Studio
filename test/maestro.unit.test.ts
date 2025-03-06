import MockAdapter from 'axios-mock-adapter'
import { MaestroClient } from 'maestro'

const host = 'http://localhost'
const port = 8082
const maestroClient = new MaestroClient(host, port)
const axiosMock = new MockAdapter(maestroClient.getHttpClient())

describe('Maestro API Client', () => {
    afterEach(axiosMock.restore)

    it('should create a session successfully', async () => {
        const sessionId = 'test-session-id'
        axiosMock.onGet('/createSession').replyOnce(200, { sessionId })

        const result = await maestroClient.createSession()
        expect(result).toEqual(sessionId)
    })

    it('should initialize a session successfully', async () => {
        const sessionId = 'test-session-id'
        axiosMock
            .onPost(`/initialize/${sessionId}`)
            .replyOnce(200, { status: 'initialized' })

        const result = await maestroClient.initializeSession(
            sessionId,
            undefined
        )
        expect(result).toBe(true)
    })

    it('should fail to initialize a session', async () => {
        const sessionId = 'test-session-id'
        axiosMock
            .onPost(`/initialize/${sessionId}`)
            .replyOnce(200, { status: 'not-initialized' })

        const result = await maestroClient.initializeSession(
            sessionId,
            undefined
        )
        expect(result).toBe(false)
    })

    it('should initialize a simulation successfully', async () => {
        const sessionId = 'test-session-id'
        axiosMock
            .onPost(`/simulate/${sessionId}`)
            .replyOnce(200, { status: 'Simulation completed' })

        const result = await maestroClient.simulateSession(sessionId, undefined)
        expect(result).toBe(true)
    })

    it('should fail to initialize a simulation', async () => {
        const sessionId = 'test-session-id'
        axiosMock
            .onPost(`/simulate/${sessionId}`)
            .replyOnce(200, { status: 'not-Finished' })

        const result = await maestroClient.simulateSession(sessionId, undefined)
        expect(result).toBe(false)
    })

    it('should return simulation data', async () => {
        const sessionId = 'test-session-id'
        const data = Symbol('data')
        axiosMock.onGet(`/result/${sessionId}/plain`).reply(200, data)

        const result = await maestroClient.getSimulationResults(sessionId)
        expect(result).toBe(data)
    })

    it('should return simulation results if all steps succeed', async () => {
        const sessionId = 'test-session-id'
        const data = Symbol('data')

        axiosMock.onGet('/createSession').replyOnce(200, { sessionId })
        axiosMock
            .onPost(`/initialize/${sessionId}`)
            .replyOnce(200, { status: 'initialized' })
        axiosMock
            .onPost(`/simulate/${sessionId}`)
            .replyOnce(200, { status: 'Simulation completed' })
        axiosMock.onGet(`/result/${sessionId}/plain`).reply(200, data)

        const result = await maestroClient.runSimulationWithConfig(
            undefined,
            undefined
        )

        expect(result?.data).toBe(data)
    })
})
