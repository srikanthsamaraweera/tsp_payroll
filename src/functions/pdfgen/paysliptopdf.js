import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PaysliptoPDF(payrollData) {
    const doc = new jsPDF();
    const margin = 10;
    const topMargin = 15;
    let currentY = margin + topMargin;

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
        // Add Year+Month Header
        doc.setFontSize(16);
        doc.text(`Payroll for ${monthYear}`, margin, currentY);
        currentY += 10;

        Object.keys(groupedData[monthYear]).forEach((employeeId) => {
            const records = groupedData[monthYear][employeeId];
            const employee = records[0]?.employee;

            // Employee Header
            const header = `${employee?.Initials || "N/A"} ${employee?.Firstname || "N/A"} ${employee?.Surname || "N/A"}`;
            const detailsText = `NIC: ${employee?.Nic_Passport || "N/A"} | EPF No: ${employee?.EpfNo || "N/A"} | Employee No: ${employeeId}`;

            // Add Employee Header
            doc.setFontSize(14);
            doc.text(header, margin, currentY);
            currentY += 10;

            doc.setFontSize(12);
            doc.text(detailsText, margin, currentY);
            currentY += 10;

            // Add each record for the employee as a pay slip
            records.forEach((record) => {
                const salaryBreakdown = [
                    [`Per Day Salary: ${record.per_day_salary} + ${record.bra_2005} + ${record.bra_2016}`, (record.per_day_salary + record.bra_2005 + record.bra_2016).toFixed(2)],
                    ["Work Days", record.work_days.toFixed(2)],
                    ["Basic Salary", ((record.per_day_salary + record.bra_2005 + record.bra_2016) * record.work_days).toFixed(2)],
                    [`Normal OT Rate: Day Rate / 8 X 1.5 + Allowance = ${record.per_day_salary + record.bra_2005 + record.bra_2016} / 8 X 1.5 + ${record.normal_ot_allowance}`, (((record.per_day_salary + record.bra_2005 + record.bra_2016) / 8 * record.normal_ot_rate) + record.normal_ot_allowance).toFixed(2)],
                    ["Normal OT Hours", record.normal_ot.toFixed(2)],
                    ["Normal OT Amount", (record.normal_ot * (((record.per_day_salary + record.bra_2005 + record.bra_2016) / 8 * record.normal_ot_rate) + record.normal_ot_allowance)).toFixed(2)],
                ];

                // Estimate if content fits the current page
                const estimatedHeight = salaryBreakdown.length * 10 + 30; // Header + Table
                if (currentY + estimatedHeight > doc.internal.pageSize.height) {
                    doc.addPage();
                    currentY = margin + topMargin;
                }

                // Add salary breakdown as a table
                doc.autoTable({
                    startY: currentY,
                    head: [["Description", "Value"]],
                    body: salaryBreakdown.map(([label, value]) => [label, value.toString()]),
                    theme: "grid",
                    margin: { left: margin },
                    styles: { fontSize: 10 },
                    columnStyles: {
                        0: { cellWidth: 120 }, // Description column
                        1: { cellWidth: 50, halign: "right" }, // Value column
                    },
                });

                currentY = doc.autoTable.previous.finalY + 10; // Add space after each pay slip
            });

            // Add space after each employee's section
            currentY += 10;

            if (currentY + 30 > doc.internal.pageSize.height) {
                doc.addPage();
                currentY = margin + topMargin;
            }
        });

        // Add a page break after each month-year group, if necessary
        if (currentY + 30 > doc.internal.pageSize.height) {
            doc.addPage();
            currentY = margin + topMargin;
        }
    });

    doc.save("Payroll_Report_Grouped.pdf");
}
