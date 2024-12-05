import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    // Check if the user is an admin
    if (!session || session.user.account_type !== 'admin') {
        return res.status(403).json({ error: 'Only admins can perform this action.' });
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        console.log("Request Body:", req.body);
        // Access the request body directly
        const body = req.body;

        const processedData = {
            emp_id: Number(body.emp_id),
            work_days: Number(body.work_days),
            per_day_salary: Number(body.per_day_salary),
            payroll_date: new Date(body.payroll_date),
            advance: Number(body.advance),
            festival_advance: Number(body.festival_advance),
            loan_amount: Number(body.loan_amount),
            night_shifts: Number(body.night_shifts),
            night_shift_rate: Number(body.night_shift_rate),
            normal_ot: Number(body.normal_ot),
            double_ot: Number(body.double_ot),
            triple_ot: Number(body.triple_ot),
            sundays: Number(body.sundays),
            sunday_rate: Number(body.sunday_rate),
            stat_days: Number(body.stat_days),
            poya_days: Number(body.poya_days),
            poya_rate: Number(body.poya_rate),



            stat_rate: Number(body.stat_rate),

            normal_ot_rate: Number(body.normal_ot_rate),

            double_ot_rate: Number(body.double_ot_rate),

            triple_ot_rate: Number(body.triple_ot_rate),

        };
        // Create the new payroll entry
        const newPayroll = await prisma.pay_roll.create({
            data: processedData,
        });

        // Send a successful response
        return res.status(201).json({
            message: "Payroll record added successfully!",
            newPayroll,
        });
    } catch (error) {
        console.error("Error adding payroll record:", error);

        // Send an error response
        return res.status(500).json({
            error: "Failed to add payroll record.",
        });
    }
}
