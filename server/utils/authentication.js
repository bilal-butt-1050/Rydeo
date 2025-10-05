import jwt from "jsonwebtoken";

export function setUser(user) {
    const payload = {
        _id: user._id,
    }

    return jwt.sign(payload, process.env.JWT_SECRET)
}

export function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    }
    catch (error) {
        return null
    }
}