import passportCall from "../../utils/passportCall.js"
import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../../dao/mongo/models/user.model.js";
import jwt from 'jsonwebtoken';
import UserDto from "../../dao/dto/user.dto.js";

const router = express.Router();

router.get('/test', passportCall("jwt"), (req, res) => {
    res.json({ message: 'Authentication successful' });
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // res.json({ user });
        // res.redirect('/login?message=Login successful');
        res.render("login", { message: "login successful" });
    } catch (error) {
        next(error);
    }
});


// Middleware to check authentication and return token
router.get("/current", passportCall("current"), (req, res) => {
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
});

export default router;