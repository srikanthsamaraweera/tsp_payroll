import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
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
