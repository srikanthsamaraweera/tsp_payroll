import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
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
            normal_ot: Number(body.normal_ot),
            double_ot: Number(body.double_ot),
            triple_ot: Number(body.triple_ot),
            sundays: Number(body.sundays),
            stat_days: Number(body.stat_days),
            poya_days: Number(body.poya_days),
            bra_2005: Number(body.bra_2005),
            bra_2016: Number(body.bra_2016),
            sunday_allowance: Number(body.sunday_allowance),
            stat_allowance: Number(body.stat_allowance),
            poya_allowance: Number(body.poya_allowance),
            normal_ot_rate: Number(body.normal_ot_rate),
            normal_ot_allowance: Number(body.normal_ot_allowance),
            double_ot_rate: Number(body.double_ot_rate),
            double_ot_allowance: Number(body.double_ot_allowance),
            triple_ot_rate: Number(body.triple_ot_rate),
            triple_ot_allowance: Number(body.triple_ot_allowance),
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
