import passport from "passport";
import bcrypt from "bcrypt";
import User from "../dao/mongodb/model/user.model.js";
import jwt from 'jsonwebtoken';
import UserDto from "../dao/dto/user.dto.js";

class SessionController {
    async testSession(req, res) {
        res.json({ message: 'Authentication successful' });
    }

    async login(req, res) {
        try {
            const token = req.token ?? req.cookies["token"] ?? null;
            res.render("login", { message: "login successful" });
        } catch (error) {
            res.sendError(error);
        }
    }

    async currentUser(req, res) {
        if (req.user) {
            res.json({
                message: "User is authenticated",
                user: new UserDto(req.user),
            });
        } else {
            res.status(401).json({
                message: "Unauthorized access",
            });
        }
    }
}

export default SessionController;