const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

function createToken(user) {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET || "spotify-clone-dev-secret",
        { expiresIn: "7d" }
    );
}

async function registerUser(req, res) {
    try {
        console.log("register hit", req.body);
        const { username, email, password, role = "user" } = req.body;

        if (!username || !email || !password) {
            console.log("register validation failed");
            return res.status(400).json({ message: "Username, email and password are required" });
        }

        console.log("register checking existing user");
        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }],
        });

        if (isUserAlreadyExists) {
            console.log("register duplicate user");
            return res.status(409).json({ message: "User already exists" });
        }

        console.log("register hashing password");
        const hash = await bcrypt.hash(password, 10);

        console.log("register creating user");
        const user = await userModel.create({
            username,
            email,
            password: hash,
            role,
        });

        console.log("register creating token");
        const token = createToken(user);

        res.cookie("token", token);

        console.log("register sending response");
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Registration failed:", error);

        if (error?.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginUser(req, res) {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
        return res.status(400).json({ message: "Username or email and password are required" });
    }

    const user = await userModel.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.cookie("token", token);

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
}

async function logoutUser(req, res) {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
}

module.exports = { registerUser, loginUser, logoutUser };