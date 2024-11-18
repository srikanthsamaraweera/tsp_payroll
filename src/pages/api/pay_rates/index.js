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

    if (req.method === 'GET') {
        const { page = 1, search = '' } = req.query;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const where = search
            ? {
                description: {
                    contains: search,
                },
            }
            : {};

        const payRates = await prisma.pay_rates.findMany({
            where,
            skip,
            take: pageSize,
        });

        const totalCount = await prisma.pay_rates.count({ where });

        return res.json({ data: payRates, totalCount });
    }

    if (req.method === 'POST') {
        const { description, pay_rate, pay_code } = req.body;

        // Validate required fields
        if (!description || !pay_rate || !pay_code) {
            return res.status(400).json({ error: 'Description, pay rate, and pay code are required.' });
        }

        try {
            const newPayRate = await prisma.pay_rates.create({
                data: { description, pay_rate: parseFloat(pay_rate), pay_code: parseInt(pay_code) },
            });

            return res.status(201).json(newPayRate);
        } catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('pay_code')) {
                return res.status(409).json({ error: 'Pay code must be unique. Duplicate pay code found.' });
            }
            console.error("Error creating pay rate:", error);
            return res.status(500).json({ error: 'An error occurred while creating the pay rate.' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed.' });
}
