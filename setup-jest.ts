jest.mock('./src/logging.ts', () => {
    return {
        getLogger: jest.fn(() => ({
            // Mock the logger methods like info, warn, error, etc.
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            log: jest.fn(),
        })),
    }
})
