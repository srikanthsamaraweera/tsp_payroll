import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { q } = req.query;

    try {
        const employees = await prisma.employee.findMany({
            where: {
                OR: [
                    { Surname: { contains: q } },
                    { Firstname: { contains: q } },
                    { EmpNo: { contains: q } },
                    { EpfNo: { contains: q } },
                    { Nic_Passport: { contains: q } },
                ],
            },
            select: { id: true, Surname: true, Firstname: true, EmpNo: true },
        });
        console.log(JSON.stringify(employees))
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Failed to fetch employees. Please try again." });
    } finally {
        await prisma.$disconnect();
    }
}
