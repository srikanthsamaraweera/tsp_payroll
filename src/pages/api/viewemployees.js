import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = parseInt(req.query.itemsPerPage) || 6;
            const search = req.query.search || "";

            const skip = (page - 1) * itemsPerPage;

            const whereClause = search
                ? {
                    OR: [
                        { Surname: { contains: search } },
                        { Firstname: { contains: search } },
                        { Initials: { contains: search } },
                        { EmpNo: { contains: search } },
                        { EpfNo: { contains: search } },
                        { Nic_Passport: { contains: search } },
                    ],
                }
                : {};

            console.log("Search parameter:", search);
            console.log("Where clause:", JSON.stringify(whereClause, null, 2)); // Updated for detailed logging

            const [employees, totalEmployees] = await Promise.all([
                prisma.employee.findMany({
                    where: whereClause,
                    skip,
                    take: itemsPerPage,
                }),
                prisma.employee.count({ where: whereClause }),
            ]);

            const totalPages = Math.ceil(totalEmployees / itemsPerPage);

            res.status(200).json({
                employees,
                totalPages,
                currentPage: page,
            });
        } catch (error) {
            //console.error("Error fetching employees:", JSON.stringify(error, null, 2)); // Detailed error logging
            res.status(500).json({ error: "Failed to fetch employees." });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
