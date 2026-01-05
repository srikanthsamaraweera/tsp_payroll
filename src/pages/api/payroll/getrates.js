import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    // Check if the user is an admin or manager
    if (!session || !['admin', 'manager'].includes(session.user.account_type)) {
        return res.status(403).json({ error: 'Only admins or managers can perform this action.' });
    }

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
