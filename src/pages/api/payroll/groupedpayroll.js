import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    // Check if the user is an admin or manager
    if (!session || !["admin", "manager"].includes(session.user.account_type)) {
        return res.status(403).json({ error: "Only admins or managers can perform this action." });
    }

    if (req.method === "GET") {
        try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const page = parseInt(url.searchParams.get("page")) || 1;
            const recordsPerPage = parseInt(url.searchParams.get("recordsPerPage")) || 50;

            const dateFrom = url.searchParams.get("dateFrom");
            const dateTo = url.searchParams.get("dateTo");
            const firstName = url.searchParams.get("firstName");
            const lastName = url.searchParams.get("lastName");
            const empNo = url.searchParams.get("empNo");
            const epfNo = url.searchParams.get("epfNo");
            const nicPassport = url.searchParams.get("nicPassport");

            const skip = (page - 1) * recordsPerPage;

            // Construct the raw SQL query with dynamic WHERE conditions
            const filters = [];
            if (dateFrom && dateTo) {
                filters.push(`payroll_date BETWEEN '${dateFrom}' AND '${dateTo}'`);
            }
            if (firstName) {
                filters.push(`employee.Firstname LIKE '%${firstName}%'`);
            }
            if (lastName) {
                filters.push(`employee.Surname LIKE '%${lastName}%'`);
            }
            if (empNo) {
                filters.push(`employee.EmpNo LIKE '%${empNo}%'`);
            }
            if (epfNo) {
                filters.push(`employee.EpfNo LIKE '%${epfNo}%'`);
            }
            if (nicPassport) {
                filters.push(`employee.Nic_Passport LIKE '%${nicPassport}%'`);
            }

            const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

            // Main raw query for fetching records
            const query = `
                SELECT pay_roll.*, employee.*
                FROM tsp_payroll_cloud.pay_roll
                INNER JOIN employee ON employee.id = pay_roll.emp_id
                ${whereClause}
                GROUP BY payroll_date, emp_id
                ORDER BY payroll_date DESC
                LIMIT ${recordsPerPage}
                OFFSET ${skip};
            `;

            // Raw query for total count
            const countQuery = `
                SELECT COUNT(*) AS totalCount
                FROM (
                    SELECT payroll_date, emp_id
                    FROM tsp_payroll_cloud.pay_roll
                    INNER JOIN employee ON employee.id = pay_roll.emp_id
                    ${whereClause}
                    GROUP BY payroll_date, emp_id
                ) AS groupedRecords;
            `;

            const [records, countResult] = await Promise.all([
                prisma.$queryRawUnsafe(query),
                prisma.$queryRawUnsafe(countQuery),
            ]);

            const totalCount = countResult[0]?.totalCount || 0;
            const totalPages = Math.ceil(Number(totalCount) / recordsPerPage);

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
