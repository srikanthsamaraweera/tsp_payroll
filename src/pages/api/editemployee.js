import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export default async function handler(req, res) {


    const { id, Surname, Firstname, Initials, EmpNo, EpfNo, Nic_Passport, emplocation } = req.body;
    // console.log('passed data - ', id, Surname, Firstname, Initials, EmpNo, EpfNo, Nic_Passport)



    if (req.method !== "PUT") {
        res.setHeader("Allow", ["PUT"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        //     // Retrieve the session from the request headers
        // const session = await getSession({ req });

        if (
            !session ||
            !["admin", "manager"].includes(session.user.account_type)
        ) {
            return res.status(403).json({ error: "Only admins or managers can edit records." });
        }

        const { id, Surname, Firstname, Initials, EmpNo, EpfNo, Nic_Passport, emplocation } = req.body;

        console.log('editdata- ', id, Surname, Firstname, Initials, EmpNo, EpfNo, Nic_Passport, emplocation);

        try {
            const updatedEmployee = await prisma.employee.update({
                where: { id },
                data: {
                    Surname,
                    Firstname,
                    Initials,
                    EmpNo,
                    EpfNo,
                    Nic_Passport,
                    emplocation,
                },
            });

            return res.status(200).json({ message: "Employee updated successfully", updatedEmployee });
        } catch (error) {
            if (error.code === "P2002") {
                return res.status(400).json({
                    error: "Duplicate value error: One or more unique fields already exist.",
                });
            }
            throw error;
        }
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ error: "Failed to update employee data." });
    } finally {
        await prisma.$disconnect();
    }
}
