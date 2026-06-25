const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "spotify-clone-dev-secret";

async function authArtist(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "You don't have access" });
        }

        req.user = decoded;
        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.role !== "user") {
            return res.status(403).json({ message: "You don't have access" });
        }

        req.user = decoded;
        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { authArtist, authUser };