import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session?.user?.email) {
            return res.status(401).json({ error: "Not authenticated." });
        }

        const { currentPassword, newPassword } = req.body || {};
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current and new passwords are required." });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ error: "New password must be different from current password." });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, password: true },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).json({ error: "Current password is incorrect." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ error: "Failed to change password. Please try again." });
    } finally {
        await prisma.$disconnect();
    }
}
