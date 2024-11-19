import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);


        try {
            const payRate = await prisma.pay_rates.findMany();

            res.status(200).json(payRate);
        } catch (error) {
            console.error("Error fetching pay code:", error);
            res.status(500).json({ error: "Failed to fetch pay code." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
}
