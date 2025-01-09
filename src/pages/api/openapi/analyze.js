const { PrismaClient } = require("@prisma/client");
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests are allowed" });
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    const payslipdata = JSON.parse(decodeURIComponent(url.searchParams.get("payslipdata")));
    try {
        // Fetch database data excluding the `user` table
        const employees = await prisma.employee.findMany();
        const payRates = await prisma.pay_rates.findMany();
        const payRoll = await prisma.pay_roll.findMany();

        // console.log("payslipdata:", JSON.stringify(payslipdata, null, 2));


        const dataSummary = `
          Employees: ${JSON.stringify(employees, null, 2)}
          Pay Rates: ${JSON.stringify(payRates, null, 2)}
          Payroll: ${JSON.stringify(payRoll, null, 2)}
        `;

        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ message: "Question is required." });
        }

        const prompt = `
          Here is the payslip data:
          ${payslipdata.map((record, index) => {
            const totalbasic = (record.work_days * record.per_day_salary)
            const sundaypayepf = (record.sundays * record.sunday_rate * record.per_day_salary)
            const sundayLLpay = (record.sundays * record.per_day_salary)
            const statpay = (record.stat_days * record.stat_rate * record.per_day_salary)
            const poyapay = (record.poya_days * record.poya_rate * record.per_day_salary)
            const nightpay = (record.night_shifts * record.night_shift_rate * record.per_day_salary)
            const earningForEPF =
                totalbasic
                +
                sundaypayepf
                +
                sundayLLpay
                +
                statpay
                +
                poyapay
                +
                nightpay

            const normalOTAmount = record.normal_ot_rate * record.per_day_salary / 8 * record.normal_ot;
            const doubleOTAmount = record.double_ot_rate / 8 * record.per_day_salary * record.double_ot;
            const tripleOTAmount = record.triple_ot_rate / 8 * record.per_day_salary * record.triple_ot;
            const epfeightpercent = earningForEPF * 8 / 100;
            const epftwelvepercent = earningForEPF * 12 / 100;
            const etfthreepercent = earningForEPF * 3 / 100;
            //employee data
            const nic = record.employee?.Nic_Passport
            const empno = record.employee?.EmpNo
            const name = record.employee?.Firstname
            const surname = record.employee?.Surname


            return `
      Record ${index + 1}:
      - NIC: ${nic}
        - Emp No: ${empno}
        - Name: ${name}
        - Surname: ${surname}
        
      - Total Basic: ${totalbasic.toFixed(2)}
      - Sunday Pay (EPF): ${sundaypayepf.toFixed(2)}
      - Sunday LL Pay: ${sundayLLpay.toFixed(2)}
      - Stat Pay: ${statpay.toFixed(2)}
      - Poya Pay: ${poyapay.toFixed(2)}
      - Night Pay: ${nightpay.toFixed(2)}
      - Earning for EPF / Earning before ot: ${earningForEPF.toFixed(2)}
      - Normal OT Amount: ${normalOTAmount.toFixed(2)}
      - Double OT Amount: ${doubleOTAmount.toFixed(2)}
      - Triple OT Amount: ${tripleOTAmount.toFixed(2)}
      -total ot amount: ${(normalOTAmount + doubleOTAmount + tripleOTAmount).toFixed(2)}
      -gross salary: ${(earningForEPF + tripleOTAmount + doubleOTAmount + normalOTAmount).toFixed(2)}
      -advanced loan: ${record.advance}
      -festival advance: ${record.festival_advance}
      -loan amount(other): ${record.loan_amount}
      -total deductions: ${(epfeightpercent + record.loan_amount + record.festival_advance + record.advance).toFixed(2)}
      -net salary: ${(earningForEPF + tripleOTAmount + doubleOTAmount + normalOTAmount - (epfeightpercent + record.loan_amount + record.festival_advance + record.advance)).toFixed(2)}
      - EPF (8%): ${epfeightpercent.toFixed(2)}
      - EPF (12%): ${epftwelvepercent.toFixed(2)}
      - ETF (3%): ${etfthreepercent.toFixed(2)}
    `;

        }).join("\n")}

          Question: ${question}
          
          Provide a detailed analysis or answer.
        `;

        console.log("ai prompt: ", prompt)

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            temperature: 0.7,
        });

        const answer = response.choices[0].message.content.trim();
        res.status(200).json({ answer });
    } catch (error) {
        console.error("Error analyzing data:", error);
        res.status(500).json({ message: "Failed to analyze data.", error: error.message });
    }
}
