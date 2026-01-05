import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !['admin', 'manager'].includes(session.user.account_type)) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }

    if (req.method === 'DELETE') {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Payroll ID is required' });
        }

        try {
            // Delete payroll record
            await prisma.pay_roll.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).json({ message: 'Payroll record deleted successfully' });
        } catch (error) {
            console.error('Error deleting payroll record:', error);
            return res.status(500).json({ error: 'Failed to delete payroll record' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
