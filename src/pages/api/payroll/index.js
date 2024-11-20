import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const page = parseInt(url.searchParams.get("page")) || 1;
            const recordsPerPage = parseInt(url.searchParams.get("recordsPerPage")) || 50;

            const filters = {
                ...(url.searchParams.get("dateFrom") &&
                    url.searchParams.get("dateTo") && {
                    payroll_date: {
                        gte: new Date(url.searchParams.get("dateFrom")),
                        lte: new Date(url.searchParams.get("dateTo")),
                    },
                }),
                ...(url.searchParams.get("firstName") && {
                    employee: {
                        Firstname: {
                            contains: url.searchParams.get("firstName"),

                        },
                    },
                }),
                ...(url.searchParams.get("lastName") && {
                    employee: {
                        Surname: {
                            contains: url.searchParams.get("lastName"),

                        },
                    },
                }),
                ...(url.searchParams.get("empNo") && {
                    employee: {
                        EmpNo: {
                            contains: url.searchParams.get("empNo"),

                        },
                    },
                }),
                ...(url.searchParams.get("epfNo") && {
                    employee: {
                        EpfNo: {
                            contains: url.searchParams.get("epfNo"),

                        },
                    },
                }),
                ...(url.searchParams.get("nicPassport") && {
                    employee: {
                        Nic_Passport: {
                            contains: url.searchParams.get("nicPassport"),

                        },
                    },
                }),
            };

            const skip = (page - 1) * recordsPerPage;

            const [records, totalCount] = await Promise.all([
                prisma.pay_roll.findMany({
                    skip,
                    take: recordsPerPage,
                    where: filters,
                    include: {
                        employee: true, // Includes all employee fields
                    },
                }),
                prisma.pay_roll.count({
                    where: filters,
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
