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
        try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const page = parseInt(url.searchParams.get("page")) || 1;
            const recordsPerPage = parseInt(url.searchParams.get("recordsPerPage")) || 50;


            const skip = (page - 1) * recordsPerPage;


            // 1) Pull out every filter param and build a true AND array
            const dateFrom = url.searchParams.get("dateFrom");
            const dateTo = url.searchParams.get("dateTo");
            const firstName = url.searchParams.get("firstName");
            const lastName = url.searchParams.get("lastName");
            const empNo = url.searchParams.get("empNo");
            const epfNo = url.searchParams.get("epfNo");
            const nicPassport = url.searchParams.get("nicPassport");
            const emplocation = url.searchParams.get("emplocation");

            const andFilters = [];
            if (dateFrom) andFilters.push({ payroll_date: { gte: new Date(dateFrom) } });
            if (dateTo) andFilters.push({ payroll_date: { lte: new Date(dateTo) } });
            if (firstName) andFilters.push({ employee: { Firstname: { contains: firstName } } });
            if (lastName) andFilters.push({ employee: { Surname: { contains: lastName } } });
            if (empNo) andFilters.push({ employee: { EmpNo: { contains: empNo } } });
            if (epfNo) andFilters.push({ employee: { EpfNo: { contains: epfNo } } });
            if (nicPassport) andFilters.push({ employee: { Nic_Passport: { contains: nicPassport } } });
            if (emplocation) andFilters.push({ employee: { emplocation: { contains: emplocation } } });

            // If no filters provided, return empty result
            if (andFilters.length === 0) {
                return res.status(200).json({ records: [], totalPages: 0 });
            }

            const [records, totalCount] = await Promise.all([
                prisma.pay_roll.findMany({
                    skip,
                    take: recordsPerPage,
                    where: { AND: andFilters },
                    include: {
                        employee: true, // Includes all employee fields
                    },
                    orderBy: {
                        payroll_date: 'desc', // Sorts by payroll_date in descending order
                    },
                }),
                prisma.pay_roll.count({
                    where: { AND: andFilters },
                }),
            ]);

            const totalPages = Math.ceil(totalCount / recordsPerPage);

            res.status(200).json({ records, totalPages });
        } catch (error) {
            console.error("Error fetching payroll data:", error);
            res.status(500).json({ error: "Failed to fetch payroll data." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
