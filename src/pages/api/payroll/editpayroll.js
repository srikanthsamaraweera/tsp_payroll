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

    if (req.method === 'PUT') {
        const {
            id, // Primary key to identify the record
            payroll_date,
            work_days,
            per_day_salary,
            bra_2005,
            bra_2016,
            sundays,
            sunday_allowance,
            stat_days,
            stat_allowance,
            poya_days,
            poya_allowance,
            night_shifts,
            normal_ot,
            normal_ot_rate,
            normal_ot_allowance,
            double_ot,
            double_ot_rate,
            double_ot_allowance,
            triple_ot,
            triple_ot_rate,
            triple_ot_allowance,
            advance,
            festival_advance,
            loan_amount,
        } = req.body;



        // Validation: Ensure ID is provided
        if (!id) {
            return res.status(400).json({ error: 'ID is required to update the payroll record.' });
        }

        try {
            // Prepare the payload for Prisma
            const updateData = {
                payroll_date: payroll_date ? new Date(payroll_date) : null,
                work_days: parseFloat(work_days) || 0,
                per_day_salary: parseFloat(per_day_salary) || 700,
                bra_2005: parseFloat(bra_2005) || 100,
                bra_2016: parseFloat(bra_2016) || 40,
                sundays: parseFloat(sundays) || 0,
                sunday_allowance: parseFloat(sunday_allowance) || 990,
                stat_days: parseFloat(stat_days) || 0,
                stat_allowance: parseFloat(stat_allowance) || 660,
                poya_days: parseFloat(poya_days) || 0,
                poya_allowance: parseFloat(poya_allowance) || 330,
                night_shifts: parseFloat(night_shifts) || 0,
                normal_ot: parseFloat(normal_ot) || 0,
                normal_ot_rate: parseFloat(normal_ot_rate) || 1.5,
                normal_ot_allowance: parseFloat(normal_ot_allowance) || 123.75,
                double_ot: parseFloat(double_ot) || 0,
                double_ot_rate: parseFloat(double_ot_rate) || 2,
                double_ot_allowance: parseFloat(double_ot_allowance) || 165,
                triple_ot: parseFloat(triple_ot) || 0,
                triple_ot_rate: parseFloat(triple_ot_rate) || 3,
                triple_ot_allowance: parseFloat(triple_ot_allowance) || 247.5,
                advance: parseFloat(advance) || 0,
                festival_advance: parseFloat(festival_advance) || 0,
                loan_amount: parseFloat(loan_amount) || 0,
            };

            console.log("Filtered payload for update:", updateData);

            // Update the record in the database
            const updatedRecord = await prisma.pay_roll.update({
                where: { id: parseInt(id) },
                data: updateData,
            });

            console.log("Updated record:", updatedRecord);

            // Respond with the updated record
            return res.status(200).json(updatedRecord);
        } catch (error) {
            console.error("Error updating payroll record:", error);

            // Handle specific Prisma errors
            if (error.code === 'P2002') {
                return res.status(409).json({
                    error: 'A unique constraint violation occurred.',
                });
            }

            // Generic error response
            return res.status(500).json({ error: 'An error occurred while updating the record.' });
        }
    } else {
        // Method not allowed
        return res.status(405).json({ error: 'Method not allowed. Use PUT for updates.' });
    }
}
