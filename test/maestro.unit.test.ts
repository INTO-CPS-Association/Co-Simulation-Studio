import { expect } from "chai";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createSession } from "../src/maestro";

const axiosMock = new MockAdapter(axios);

describe('Maestro API Client Test Suite', () => {
    afterEach(axiosMock.restore)

  it('should create a session successfully', async () => {
    const sessionId = "test-session-id";
    axiosMock.onGet("http://localhost:8082/createSession").reply(200, { sessionId });

    const result = await createSession();
    expect(result).to.equal(sessionId);
  });
});