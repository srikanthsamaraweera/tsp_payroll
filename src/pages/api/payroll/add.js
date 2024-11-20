import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    const body = await req.json();

    try {
        const newPayroll = await prisma.pay_roll.create({
            data: {
                emp_id: body.emp_id,
                work_days: body.work_days,
                per_day_salary: body.per_day_salary,
                payroll_date: new Date(body.payroll_date),
                advance: body.advance,
                festival_advance: body.festival_advance,
                loan_amount: body.loan_amount,
            },
        });

        return new Response(
            JSON.stringify({ message: "Payroll record added successfully!", newPayroll }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding payroll record:", error);
        return new Response(
            JSON.stringify({ error: "Failed to add payroll record." }),
            { status: 500 }
        );
    }
}
