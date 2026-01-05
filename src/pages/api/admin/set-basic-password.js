import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();
const BASIC_PASSWORD = "Password123";
const SALT_ROUNDS = 10;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || session.user?.account_type !== "admin") {
            return res.status(403).json({ error: "Only admins can reset passwords." });
        }

        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        const user = await prisma.user.findUnique({
            where: { email: String(email) },
            select: { id: true },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const hashedPassword = await bcrypt.hash(BASIC_PASSWORD, SALT_ROUNDS);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return res.status(200).json({
            message: "Password reset to default. Inform the user to log in with the basic password and change it.",
        });
    } catch (error) {
        console.error("Admin basic password reset error:", error);
        return res.status(500).json({ error: "Failed to reset password. Please try again." });
    } finally {
        await prisma.$disconnect();
    }
}
