jest.mock('../../src/utils/config', () => ({}));
jest.mock('../../src/utils/jwt');

const authGuardMiddleware = require("../../src/middleware/authGuard.middleware")
const { validateToken } = require("../../src/utils/jwt");

describe("auth guard middleware", () => {
    // (1) Test for missing token
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

    // (2) Test for calling next() when token is valid
    it("should pass the authentication check", () => {
        // 01 setup
        const req = { header: jest.fn()};
        const res = {};
        const next = jest.fn();
        const payload = { id: 123 };
        const token = 'token';
        // Mock the header function to return a valid token
        req.header.mockReturnValue(`Bearer ${token}`);
        // Mock a validateToken function to return a payload
        validateToken.mockReturnValue(payload);
        // 02 execute
        authGuardMiddleware(req, res, next);
        // 03 compare
        expect(validateToken).toHaveBeenCalledWith(token);
        expect(req.user).toEqual(payload);
        expect(next).toHaveBeenCalled();
    })
})