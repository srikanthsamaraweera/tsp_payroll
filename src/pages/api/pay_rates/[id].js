import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.account_type !== 'admin') {
        return res.status(403).json({ error: 'Only admins can perform this action.' });
    }

    const { id } = req.query;

    if (req.method === 'PUT') {
        const { description, pay_rate, pay_code } = req.body;

        if (!description || !pay_rate || !pay_code) {
            return res.status(400).json({ error: 'Description, pay rate, and pay code are required.' });
        }

        try {
            const updatedPayRate = await prisma.pay_rates.update({
                where: { id: parseInt(id) },
                data: { description, pay_rate, pay_code: parseInt(pay_code) },
            });

            return res.json(updatedPayRate);
        } catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('pay_code')) {
                return res.status(409).json({ error: 'Pay code must be unique. Duplicate pay code found.' });
            }

            console.error("Error updating pay rate:", error);
            return res.status(500).json({ error: 'An error occurred while updating the pay rate.' });
        }
    }

    if (req.method === 'DELETE') {
        await prisma.pay_rates.delete({
            where: { id: parseInt(id) },
        });

        return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed.' });
}
