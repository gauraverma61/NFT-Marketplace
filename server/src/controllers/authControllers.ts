import { Request, Response } from "express";
import { ethers } from "ethers";
import prisma from "../utils/prisma"; // Prisma client

export const login = async (req: Request, res: Response) => {
    try {
        const { message, signature } = req.body;

        if (!message || !signature) {
            res.status(422).json({ message: "Expected 'message' and 'signature' in the request body." });
            return
        }

        // Verify the signature
        const result = verifyMessage(message, signature);
        if (!result.success || !result?.data) {
            res.status(400).json({ message: "Invalid credentials." });
            return
        }

        const walletAddress = result.data.address.toLowerCase();

        // Check or create user
        let user = await prisma.user.findUnique({ where: { address: walletAddress } });
        if (!user) {
            user = await prisma.user.create({
                data: { address: walletAddress, username: `user_${walletAddress.slice(2, 8)}`, email: `${walletAddress.slice(2, 8)}@example.com` },
            });
        }

        // Generate the JWT token
        const token = generateToken({ id: user.id, address: walletAddress });

        // Set the token as an HTTP-only cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use Secure in production
            sameSite: "strict", // Helps protect against CSRF
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week expiration
        });

        // Send user data in the response
        res.status(200).json({ user });
        return
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error." });
        return
    }
};

// Mock verification logic
const verifyMessage = (message: string, signature: string) => {
    try {
        const signerAddress = ethers.verifyMessage(message, signature);
        return { success: true, data: { address: signerAddress } };
    } catch (error) {
        return { success: false };
    }
};

// Mock token generation logic
const generateToken = (payload: object) => {
    // Example: Use JWT or another library to generate a token
    const jwt = require("jsonwebtoken");
    const secret = process.env.JWT_SECRET || "your-secret-key";
    return jwt.sign(payload, secret, { expiresIn: "7d" }); // Token valid for 7 days
};

export const logout = async (req: Request, res: Response) => {
    try {
        // Clear the authentication cookie
        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use Secure in production
            sameSite: "strict", // Helps protect against CSRF
        });

        // Send a success response
        res.status(200).json({ message: "Successfully logged out." });
        return
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error." });
        return
    }
};