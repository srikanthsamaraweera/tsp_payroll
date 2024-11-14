// pages/api/toggleEnabled.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // or 'bcryptjs'

const prisma = new PrismaClient();
const saltRounds = 10; // Define the number of salt rounds for hashing

export default async function handler(req, res) {
    try {
        // Handle POST request to toggle status if user is an admin
        if (req.method === 'POST') {
            const { emailaddress, passwordval } = req.body;

            const sanitizedEmail = String(emailaddress);
            const existingUser = await prisma.user.findUnique({
                where: { email: sanitizedEmail },
            });
            console.log('exist val - ', existingUser);

            if (existingUser) {
                return res.status(400).json({ error: "Email is already in use." });
            }

            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(passwordval, saltRounds);

            // Save the user with the hashed password
            await prisma.user.create({
                data: {
                    email: emailaddress,
                    password: hashedPassword
                }
            });

            return res.status(201).json({ message: "User registered successfully!" });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    } finally {
        await prisma.$disconnect();
    }
}
