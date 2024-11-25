import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const {
            id, // Primary key to identify the record
            payroll_date,
            work_days,
            advance,
            festival_advance,
            loan_amount,
            night_shifts,
            normal_ot,
            double_ot,
            triple_ot,
            sundays,
            stat_days,
            poya_days,
        } = req.body;

        // Validation: Ensure ID is provided
        if (!id) {
            return res.status(400).json({ error: 'ID is required to update the payroll record.' });
        }

        try {
            // Update the record in the database
            const updatedRecord = await prisma.pay_roll.update({
                where: { id: parseInt(id) }, // Convert ID to integer if necessary
                data: {
                    payroll_date,
                    work_days: parseInt(work_days) || null,
                    advance: parseFloat(advance) || null,
                    festival_advance: parseFloat(festival_advance) || null,
                    loan_amount: parseFloat(loan_amount) || null,
                    night_shifts: parseInt(night_shifts) || null,
                    normal_ot: parseInt(normal_ot) || null,
                    double_ot: parseInt(double_ot) || null,
                    triple_ot: parseInt(triple_ot) || null,
                    sundays: parseInt(sundays) || null,
                    stat_days: parseInt(stat_days) || null,
                    poya_days: parseInt(poya_days) || null,
                },
            });

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
