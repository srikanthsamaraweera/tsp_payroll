import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PaysliptoPDF(payrollData) {
    const doc = new jsPDF({
        format: "a4", // Set page size to A4
        unit: "mm", // Use millimeters for consistency
    });
    const margin = 15;
    const topMargin = 15;

    // Group records by Year+Month and Employee ID
    const groupedData = payrollData.reduce((acc, record) => {
        const monthYear = record.payroll_date.split("T")[0].slice(0, 7); // Extract Year-Month
        const employeeId = record.employee?.EmpNo || "Unknown";

        if (!acc[monthYear]) acc[monthYear] = {};
        if (!acc[monthYear][employeeId]) acc[monthYear][employeeId] = [];

        acc[monthYear][employeeId].push(record);

        return acc;
    }, {});

    // Generate PDF content
    Object.keys(groupedData).forEach((monthYear) => {
        Object.keys(groupedData[monthYear]).forEach((employeeId) => {
            const records = groupedData[monthYear][employeeId];
            const employee = records[0]?.employee;

            records.forEach((record) => {
                let currentY = margin + topMargin;

                // Employee Header
                const header = `${employee?.Initials || "N/A"} ${employee?.Firstname || "N/A"} ${employee?.Surname || "N/A"}`;
                const detailsText = `NIC: ${employee?.Nic_Passport || "N/A"} | EPF No: ${employee?.EpfNo || "N/A"} | Employee No: ${employeeId} | Month: ${monthYear}`;

                // Add Employee Header
                doc.setFontSize(14);
                doc.text(header, margin, currentY);
                currentY += 10;

                doc.setFontSize(12);
                doc.text(detailsText, margin, currentY);
                currentY += 5;

                const per_day_salary = record.per_day_salary;
                const workdays = record.work_days;
                const basicsalary = per_day_salary * workdays;
                const sundays = record.sundays;
                const sundayrate = record.sunday_rate;
                const sundayllpay = sundays * per_day_salary;
                const sundaypay = sundays * sundayrate * per_day_salary;
                const statdays = record.stat_days;
                const statrate = record.stat_rate;
                const statpay = statrate * statdays * per_day_salary;
                const poyadays = record.poya_days;
                const poyarate = record.poya_rate;
                const poyapay = poyadays * poyarate * per_day_salary;
                const nightdays = record.night_shifts;
                const nightrate = record.night_shift_rate;
                const nightpay = per_day_salary / nightrate * nightdays;
                const earnignforepf = basicsalary + sundaypay + statpay + poyapay + nightpay + sundayllpay;
                const epf8percent = earnignforepf * 8 / 100

                const normalot = record.normal_ot;
                const normalotrate = record.normal_ot_rate;
                const normalotperhr = normalotrate / 8 * per_day_salary;
                const normalotpay = normalot * normalotperhr;

                const doubleot = record.double_ot;
                const doubleotrate = record.double_ot_rate;
                const doubleotperhr = doubleotrate / 8 * per_day_salary
                const doubleotpay = doubleot * doubleotperhr;

                const tripleot = record.triple_ot;
                const tripleotrate = record.triple_ot_rate;
                const tripleotperhr = tripleotrate / 8 * per_day_salary;
                const tripleotpay = tripleot * tripleotperhr;

                const tototpay = normalotpay + doubleotpay + tripleotpay;

                const grosspay = tototpay + earnignforepf;

                const advance = record.advance;
                const festiv = record.festival_advance;
                const loan = record.loan_amount;

                const totdeduct = advance + festiv + loan + epf8percent;
                const netsalary = grosspay - totdeduct;

                const epf12percent = earnignforepf * 12 / 100;
                const epf3percent = earnignforepf * 3 / 100;
                const epf20percent = epf12percent + epf8percent;

                // Add salary breakdown
                const salaryBreakdown = [
                    ["Basic Salary:", workdays.toFixed(2), per_day_salary.toFixed(2), basicsalary.toFixed(2)],

                    ["Sunday LL pay:", sundays.toFixed(2), per_day_salary.toFixed(2), sundayllpay.toFixed(2)],
                    ["Sunday Salary:", sundayllpay.toFixed(2), sundayrate.toFixed(2), sundaypay.toFixed(2)],
                    ["Stat Pay:", statdays.toFixed(2), statrate.toFixed(2), statpay.toFixed(2)],
                    ["Poya Pay:", poyadays.toFixed(2), poyarate.toFixed(2), poyapay.toFixed(2)],
                    ["Night Pay:", nightdays.toFixed(2), nightrate.toFixed(2), nightpay.toFixed(2)],
                    ["Earning For EPF:", "", "", earnignforepf.toFixed(2)],
                    ["EPF 8%:", "", "", epf8percent.toFixed(2)],
                    // ["", "", "", ""],
                    ["Normal OT Pay: ", normalot.toFixed(2), normalotperhr.toFixed(2), normalotpay.toFixed(2)],
                    ["Double OT Pay: ", doubleot.toFixed(2), doubleotperhr.toFixed(2), doubleotpay.toFixed(2)],
                    ["Triple OT Pay: ", tripleot.toFixed(2), tripleotperhr.toFixed(2), tripleotpay.toFixed(2)],
                    ["Total OT Pay: ", "", "", tototpay.toFixed(2)],
                    ["Gross Pay: ", "", "", grosspay.toFixed(2)],
                    ["Advance: ", "", "", advance.toFixed(2)],
                    ["Festival Advance: ", "", "", festiv.toFixed(2)],
                    ["Loan Amount: ", "", "", loan.toFixed(2)],
                    ["EPF 8%:", "", "", epf8percent.toFixed(2)],
                    ["Total Deduct:", "", "", totdeduct.toFixed(2)],
                    ["Net Salary:", "", "", netsalary.toFixed(2)],
                    ["EPF 12%:", "", "", epf12percent.toFixed(2)],
                    ["EPF 3%:", "", "", epf3percent.toFixed(2)],
                    ["EPF 20%:", "", "", epf20percent.toFixed(2)],


                ];

                doc.autoTable({
                    startY: currentY,
                    head: [["Description", "Days, Qty", "Rate", "Value"]],
                    body: salaryBreakdown.map((row) => row.map((cell) => cell.toString())),
                    theme: "grid",
                    margin: { left: margin },
                    styles: { fontSize: 10 },
                    headStyles: { fontSize: 12 }, // Default header alignment
                    columnStyles: {
                        0: { cellWidth: 100, halign: "left" }, // Description column
                        1: { cellWidth: 25, halign: "right" }, // Days/Qty column
                        2: { cellWidth: 25, halign: "right" }, // Rate column
                        3: { cellWidth: 25, halign: "right" }, // Value column
                    },
                    didParseCell: function (data) {
                        if (data.section === 'head') {
                            if (data.column.index === 1 || data.column.index === 2 || data.column.index === 3) { // Index 3 corresponds to the "Value" column
                                data.cell.styles.halign = 'right'; // Aligns "Value" header cell to right
                            }
                        }

                        if (data.section === 'body' && (data.row.index === 6 || data.row.index === 11 || data.row.index === 17)) { // Index 5 because rows are zero-indexed
                            data.cell.styles.fillColor = [220, 220, 220]; // Light grey color
                        }
                    },


                });

                // Add a new page for each payslip
                doc.addPage();
            });
        });
    });

    // Save the PDF
    doc.save("Payroll_Report_Grouped.pdf");
}
