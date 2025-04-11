// Auth - authentication + authorization
// 1. Authentication - Who are you? -> hash password
// 2. Authorization - What are you allowed to do? -> JWT (JSON Web Token)
//      -> access token 15 mins + refresh token 30 days

const ConflictsException = require("../exceptions/conflict.exception");
const UnauthorizedException = require("../exceptions/unauthorized.exception");
const UserModel = require("../models/user.model");
const { generateToken} = require("../utils/jwt");
const Joi = require("joi");

// 3 Methods check validation error
    /**
     * 1. try-catch -> async await
     * try {
     *   xxxx
     * } catch (error) {
     *  xxx
     *  next(error); // pass the error to the error middleware
     * }
     */

    /**
     * 2. .catch -> promise.then.catch
     * UserModel.findOne().then().catch(e => next(e));
     */

    /**
     * 3. callback func -> error always be the first argument
     * UserModel.findOne((err, user) => {
     * if(err) {
     *  next(err);
     *  return;
     *  }
     *    xxxxx
     * })
     */

    /** 
     * const catchAllErrors = (middleware) => {
     *  return async (req, res, next) => {
     *      try {
     *          await middleware(req, res, next);
     *      } catch (error) {
     *          next(error);
     *     }
     *   }
     * }
     * 
     * app.get('/'. catchAllErrors(register));
     * 
     * express-async-errors -> npm package for async error handling
     */
    
    /** 
     * Joi -> npm package for input validation V.S. Mongoose validation
     * Logic: liberary will check the validation from request.
     * -> Need a validation schema
     * -> for complex validation
    */

// ---------------------------------------------------
// 1. REGISTER
const register = async (req, res, next) => {

    try {
        // Set up the validation schema
        // To make these validation more maintainable, set up a folder for validation and store the schema there

        // Need to fetch username and password from req.body
        const { username, password } = req.body;
        // After set up the validation schema, change to below
    //    const { username, password } = await registerValidationSchema.validateAsync(req.body, 
    //     {
    //     // These are the options, only it need to check those two fields
    //     stripUnknown: true,
    //     allowUnknown: true,
    //    })

        // Check if input validate
        // Happy path

        // Conflicts
        // Check if username already exists
        if ( await UserModel.findOne({username})) {
            next(new ConflictsException("Username already exists", { username })); // will call the conflict error middleware
            return;
            // res.status(409).json({
            //     success: false,
            //     error: "Username already exists",
            // })
        }

        const user = new UserModel({ username, password });
        await user.hashPassword();
        // Save is async, so add await before it
        await user.save(); 

        // Generate token
        const token = generateToken({id: user.id, username: user.username});

        res.status(201).json({success: true, data: { token }}); // Format for success

    } catch (e) {
        next(e); // Pass the error to the next middleware
    }
}

// ---------------------------------------------------
// 2. LOGIN
const login = async (req, res, next) => {

    try {
        const { username, password } = req.body;

        // Find if there is a username
        const user = await UserModel.findOne({ username }).exec();
        if(!user) {
            // res.status(401).json({success: false, error: "Invalid credentials"}); // Fromat for error
            // Above change to below!
            next(new UnauthorizedException("Invalid credentials")); // will call the unauthorized error middleware
            return;
        }

        const validPassword = await user.validatePassword(password);
        // Check if password is correct
        if(!validPassword) {
            // res.status(401).json({success: false, error: "Invalid credentials"}); // Fromat for error
            next(new UnauthorizedException("Invalid credentials")); // will call the unauthorized error middleware
            return;
        }

        // Generate token
        const token = generateToken(
            {
                id: user.id, 
                username: user.username, 
                role: "admin",
            });

        res.json({success: true, data: { token }});

    } catch (e) {
        next(e); // Pass the error to the next middleware
    }
};

module.exports = {
    register,
    login,
};