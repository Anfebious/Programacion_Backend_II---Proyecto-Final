import jwt from "passport-jwt"
import passport from "passport";
import User from "../dao/mongo/models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }
    ));
    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
    }, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);

            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            return done(null, user);
        } catch (error) {
            return done(error, false, { message: 'Authentication failure' });
        }
    }))
}

export default initializePassport;