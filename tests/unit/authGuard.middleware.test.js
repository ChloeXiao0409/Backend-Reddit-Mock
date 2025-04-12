jest.mock('../../src/utils/config', () => ({}));
const authGuardMiddleware = require("../../src/middleware/authGuard.middleware")

describe("auth guard middleware", () => {
    it("should return 401 if authorization header is not defined", () => {

        // 01 setup
        const req = { header: jest.fn() };
        const res = {
            status: jest.fn(),
            json: jest.fn(),
        };
        const next = jest.fn();
        // Cus status().json() is a chain function, so we need to mock it, if not, it will just return undefined
        res.status.mockReturnValue(res);

        // 02 execute
        authGuardMiddleware(req, res, next);

        // 03 compare - assertion
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    })
})