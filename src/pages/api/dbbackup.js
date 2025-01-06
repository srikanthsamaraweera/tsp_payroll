import { PrismaClient } from "@prisma/client";
import path from "path";
import os from "os";
import fs from "fs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            // Define the backup directory and file path
            const documentsPath = path.join("D:", "Tsp_Payroll_DBbackup");
            const backupFilePath = path.join(documentsPath, `database-backup-${Date.now()}.sql`);

            // Ensure the backup directory exists
            if (!fs.existsSync(documentsPath)) {
                fs.mkdirSync(documentsPath, { recursive: true });
            }

            // Fetch data from tables
            const employees = await prisma.employee.findMany();
            const users = await prisma.user.findMany();
            const payRates = await prisma.pay_rates.findMany();
            const payRolls = await prisma.pay_roll.findMany();

            // Generate SQL statements for each table
            const sqlStatements = [];

            // Employees table
            sqlStatements.push(`-- Backup for employees table`);
            employees.forEach((employee) => {
                sqlStatements.push(`
                    INSERT INTO employee (id, Surname, Firstname, Initials, EmpNo, EpfNo, Nic_Passport, emplocation)
                    VALUES (${employee.id}, '${employee.Surname}', '${employee.Firstname || ""}', '${employee.Initials}', '${employee.EmpNo}', '${employee.EpfNo}', '${employee.Nic_Passport}', '${employee.emplocation || ""}');
                `);
            });

            // Users table
            sqlStatements.push(`-- Backup for users table`);
            users.forEach((user) => {
                sqlStatements.push(`
                    INSERT INTO user (id, email, account_type, enabled, password)
                    VALUES (${user.id}, '${user.email}', '${user.account_type}', ${user.enabled}, '${user.password}');
                `);
            });

            // Pay Rates table
            sqlStatements.push(`-- Backup for pay_rates table`);
            payRates.forEach((rate) => {
                sqlStatements.push(`
                    INSERT INTO pay_rates (id, description, pay_rate, pay_code)
                    VALUES (${rate.id}, '${rate.description}', ${rate.pay_rate}, ${rate.pay_code});
                `);
            });

            // Pay Rolls table
            sqlStatements.push(`-- Backup for pay_roll table`);
            payRolls.forEach((roll) => {
                sqlStatements.push(`
                    INSERT INTO pay_roll (
                        id, emp_id, work_days, per_day_salary, bra_2005, bra_2016, sundays, sunday_rate, 
                        sunday_allowance, stat_days, stat_rate, stat_allowance, poya_days, poya_rate, 
                        poya_allowance, night_shifts, night_shift_rate, normal_ot, normal_ot_rate, 
                        normal_ot_allowance, double_ot, double_ot_rate, double_ot_allowance, triple_ot, 
                        triple_ot_rate, triple_ot_allowance, advance, festival_advance, loan_amount, payroll_date
                    )
                    VALUES (
                        ${roll.id}, ${roll.emp_id}, ${roll.work_days}, ${roll.per_day_salary}, ${roll.bra_2005}, ${roll.bra_2016},
                        ${roll.sundays}, ${roll.sunday_rate}, ${roll.sunday_allowance}, ${roll.stat_days}, ${roll.stat_rate || null},
                        ${roll.stat_allowance}, ${roll.poya_days}, ${roll.poya_rate}, ${roll.poya_allowance}, ${roll.night_shifts},
                        ${roll.night_shift_rate}, ${roll.normal_ot}, ${roll.normal_ot_rate}, ${roll.normal_ot_allowance}, ${roll.double_ot},
                        ${roll.double_ot_rate}, ${roll.double_ot_allowance}, ${roll.triple_ot}, ${roll.triple_ot_rate}, ${roll.triple_ot_allowance},
                        ${roll.advance}, ${roll.festival_advance}, ${roll.loan_amount}, '${roll.payroll_date || null}'
                    );
                `);
            });

            // Combine all SQL statements
            const backupContent = sqlStatements.join("\n");

            // Write to the .sql file
            fs.writeFileSync(backupFilePath, backupContent);

            console.log("Backup completed successfully:", backupFilePath);
            res.status(200).json({ message: "Backup successful!", filePath: backupFilePath });
        } catch (error) {
            console.error("Error during backup:", error);
            res.status(500).json({ error: "Failed to create backup. Please try again." });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
