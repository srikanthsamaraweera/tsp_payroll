// pages/api/employee.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { surname, firstname, initials, empNo, epfNo, nicPassport, emplocation } = req.body;

            // Insert the employee record
            const employee = await prisma.employee.create({
                data: {
                    Surname: surname,
                    Firstname: firstname,
                    Initials: initials,
                    EmpNo: empNo,
                    EpfNo: epfNo,
                    Nic_Passport: nicPassport,
                    emplocation: emplocation,
                },
            });

            // Return success response
            res.status(201).json({ message: "Employee added successfully!", employee });
        } catch (error) {
            //   console.error("Error adding employee:", error);

            // Handle unique constraint violation
            if (error.code === "P2002") {
                res.status(400).json({
                    error: "Duplicate value error: One or more unique fields already exist.",
                });
            } else {
                res.status(500).json({ error: "An unexpected error occurred. Please try again." });
            }
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
