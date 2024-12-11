import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { ethers } from "ethers";


export const getUsersController = async (req: Request, res: Response) => {
    try {
        console.log("users controller");
        
        const { page = 1, pageSize = 10, } = req.query;
        const users = await prisma.user.findMany({
            skip: (Number(page) - 1) * Number(pageSize), // Pagination skip
            take: Number(pageSize), // Pagination limit
        });
        // Fetch total count for pagination (optional)
        const totalUsers = await prisma.user.count();
        // Send the response with paginated data and metadata (total count)
        res.json({
            users,
            pagination: {
                totalPages: Math.ceil(totalUsers / Number(pageSize)),
                currentPage: Number(page),
                pageSize: Number(pageSize),
            },
        });
    } catch (e) {
        console.error("Error fetching users:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserController = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("single user controller");
    try {
        if (ethers.isAddress(id)) {
            res.status(400).json({ message: "Invalid user address." });
            return
        }
        const user = await prisma.user.findUnique({ where: { address: id } });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}