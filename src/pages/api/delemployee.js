import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        res.setHeader("Allow", ["DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        // Use getServerSession to retrieve the session
        const session = await getServerSession(req, res, authOptions);

        // Check if user has admin privileges
        if (!session || session.user.account_type !== "admin") {
            return res.status(403).json({ error: "Only admins can delete records." });
        }

        const { id } = req.body;

        try {
            const deletedEmployee = await prisma.employee.delete({
                where: { id },
            });

            return res.status(200).json({ message: "Record deleted successfully", deletedEmployee });
        } catch (error) {
            console.error("Error deleting employee:", error);
            return res.status(500).json({ error: error.message || "Failed to delete employee." });
        }
    } finally {
        await prisma.$disconnect();
    }
}
