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
        const search = url.searchParams.get("search");

        try {
            const employees = await prisma.employee.findMany({
                where: {
                    OR: [
                        { Firstname: { contains: search } },
                        { Surname: { contains: search } },
                        { EmpNo: { contains: search } },
                        { EpfNo: { contains: search } },
                        { Nic_Passport: { contains: search } },
                    ],
                },
            });

            res.status(200).json(employees);
        } catch (error) {
            console.error("Error fetching employees:", error);
            res.status(500).json({ error: "Failed to fetch employees." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
}
