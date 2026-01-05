import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const session = await getServerSession(req, res, authOptions);

        if (!session || !["admin", "manager"].includes(session.user.account_type)) {
            return res.status(403).json({ error: "Only admins or managers can perform this action." });
        }
        const { payrollData } = req.body;
        console.log("payroll passed: ", payrollData)

        try {
            const result = await prisma.pay_roll.createMany({
                data: payrollData.map(record => ({
                    emp_id: parseInt(record.emp_id, 10), // Convert emp_id to integer
                    work_days: parseFloat(record.work_days), // Convert work_days to float
                    per_day_salary: parseFloat(record.per_day_salary), // Convert per_day_salary to float
                    sundays: parseFloat(record.sundays), // Convert sundays to float (if required in your schema)
                    sunday_rate: parseFloat(record.sunday_rate), // Convert sunday_rate to float
                    payroll_date: record.payroll_date ? new Date(record.payroll_date) : null, // Convert to Date if not null
                    stat_days: parseFloat(record.statdays),
                    stat_rate: parseFloat(record.statrate),
                    poya_days: parseFloat(record.poyadays),
                    poya_rate: parseFloat(record.poyarate),
                    night_shifts: parseFloat(record.nightdays),
                    night_shift_rate: parseFloat(record.nightrate),
                    normal_ot: parseFloat(record.normalot),
                    normal_ot_rate: parseFloat(record.normalotrate),
                    double_ot: parseFloat(record.doubleot),
                    double_ot_rate: parseFloat(record.doubleotrate),
                    triple_ot: parseFloat(record.tripleot),
                    triple_ot_rate: parseFloat(record.tripleotrate),
                    advance: parseFloat(record.advance),
                    festival_advance: parseFloat(record.festivaladvance),
                    loan_amount: parseFloat(record.loan),
                })),
            });
            res.status(201).json({ message: "Payroll records added successfully!", result });
        } catch (error) {
            console.error("Error saving payroll records:", error);
            res.status(500).json({ error: "Failed to save payroll records. Please try again." });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
