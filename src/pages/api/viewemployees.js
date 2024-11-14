import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Extract page and itemsPerPage from query parameters
            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = parseInt(req.query.itemsPerPage) || 6;

            // Calculate the offset for pagination
            const skip = (page - 1) * itemsPerPage;

            // Fetch total count of employees and the requested page of employees
            const [employees, totalEmployees] = await Promise.all([
                prisma.employee.findMany({
                    skip,
                    take: itemsPerPage,
                }),
                prisma.employee.count(),
            ]);

            // Calculate total pages
            const totalPages = Math.ceil(totalEmployees / itemsPerPage);

            // Return paginated data
            res.status(200).json({
                employees,
                totalPages,
                currentPage: page,
            });
        } catch (error) {
            console.error("Error fetching employees:", error);
            res.status(500).json({ error: "Failed to fetch employees." });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
