import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getNFTsController = async (req: Request, res: Response) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            collectionId, 
            ownerAddress, 
            sortBy = "recentlyAdded" 
        } = req.query; // Default values: page 1, 10 items per page, sort by recently added

        // Convert query parameters to numbers
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        // Validate pagination parameters
        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
            res.status(400).json({ message: "Invalid pagination parameters." });
            return 
        }

        // Build the query filter
        const where: Record<string, any> = {};
        if (collectionId) {
            where.collectionId = collectionId; // Filter by collectionId if provided
        }
        if (ownerAddress) {
            where.ownerAddress = ownerAddress; // Filter by ownerAddress if provided
        }

        // Determine sorting order
        let orderBy: Record<string, string> = { createdAt: "desc" }; // Default sorting: recently added
        if (sortBy === "priceLowToHigh") {
            orderBy = { price: "asc" }; // Sort by price low to high
        } else if (sortBy === "priceHighToLow") {
            orderBy = { price: "desc" }; // Sort by price high to low
        } else if (sortBy === "recentlyAdded") {
            orderBy = { createdAt: "desc" }; // Sort by recently added
        }

        // Fetch NFTs with pagination and sorting
        const nfts = await prisma.nFT.findMany({
            where,
            skip: (pageNumber - 1) * limitNumber, // Calculate how many items to skip
            take: limitNumber, // Limit the number of items fetched
            orderBy,
        });

        // Optional: Get the total count of NFTs for pagination metadata
        const totalNFTs = await prisma.nFT.count({ where });

        // Respond with data and pagination metadata
        res.status(200).json({
            data: nfts,
            pagination: {
                total: totalNFTs,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalNFTs / limitNumber),
            },
        });
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getNFTController = async (req: Request, res: Response) => {
    const { address } = req.params;

    try {
        // Validate the address parameter
        if (!address) {
            res.status(400).json({ message: "Address parameter is required" });
            return 
        }

        // Fetch the NFT by address
        const nft = await prisma.nFT.findUnique({
            where: {
                id: address,
            },
        });

        // Check if the NFT exists
        if (!nft) {
            res.status(404).json({ message: "NFT not found" });
            return 
        }

        // Respond with the NFT data
        res.status(200).json(nft);
    } catch (error) {
        console.error("Error fetching NFT:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const createNFTController = (req: Request, res: Response) => {

}
