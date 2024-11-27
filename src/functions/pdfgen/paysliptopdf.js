import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

export default function PaysliptoPDF(payrollData) {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const topMargin = 15; // Top margin for each page
    let currentY = margin + topMargin; // Start Y position with top margin
    const tableHeightEstimate = 100; // Approximate height of one table
    const tableSpacing = 20; // Space between two tables on the same page

    payrollData.forEach((record, index) => {
        // Header for each payroll record
        const header = `${record.employee?.Initials || "N/A"} ${record.employee?.Firstname || "N/A"} ${record.employee?.Surname || ""
            }`;
        // const details = [
        //     ["NIC", record.employee?.Nic_Passport || "N/A"],
        //     ["Employee No", record.employee?.EmpNo || "N/A"],
        //     ["EPF No", record.employee?.EpfNo || "N/A"],
        //     ["Payroll Date", record.payroll_date?.split("T")[0] || "N/A"],
        // ];

        const detailsText = `NIC: ${record.employee?.Nic_Passport || "N/A"} EPF No: ${record.employee?.EpfNo || "N/A"
            } Employee No: ${record.employee?.EmpNo || "N/A"}`;

        const salaryBreakdown = [
            [`Per Day Salary (Basic Per Day + BRA_2005 + BRA_2016)= ${record.per_day_salary} + ${record.bra_2005} + ${record.bra_2016}`, (record.per_day_salary + record.bra_2005 + record.bra_2016).toFixed(2)],


            ["Work Days", record.work_days.toFixed(2)],
            [
                "Basic Salary",
                ((record.per_day_salary + record.bra_2005 + record.bra_2016) *
                    record.work_days).toFixed(2),
            ],
            [`Normal OT Rate: Day Rate / 8 X 1.5 + Allowance = ${record.per_day_salary + record.bra_2005 + record.bra_2016} / 8 X 1.5 + ${record.normal_ot_allowance}`, (((record.per_day_salary + record.bra_2005 + record.bra_2016) / 8 * record.normal_ot_rate) + record.normal_ot_allowance).toFixed(2)],
            [`Normal OT Hours`, record.normal_ot.toFixed(2)],
            [`Normal OT Amount`, (record.normal_ot * (((record.per_day_salary + record.bra_2005 + record.bra_2016) / 8 * record.normal_ot_rate) + record.normal_ot_allowance)).toFixed(2)],



        ];

        // Estimate the height required for this record
        const estimatedHeight =
            10 + // Header height
            detailsText.length * 10 + // Employee details
            salaryBreakdown.length * 10 + // Salary breakdown table
            10; // Spacing

        // Add a new page if the content does not fit
        // if (currentY + estimatedHeight > pageHeight) {
        //     doc.addPage();
        //     currentY = margin + topMargin; // Reset Y position with top margin
        // }

        // Estimate if the current Y position plus the table height exceeds page height
        if (currentY + tableHeightEstimate > pageHeight) {
            doc.addPage(); // Add a new page
            currentY = margin + topMargin; // Reset Y position
        }

        // Add header
        doc.setFontSize(14);
        doc.text(header, margin, currentY);
        currentY += 10;

        // Add details
        doc.setFontSize(12);
        doc.text(detailsText, margin, currentY);

        // Add bottom margin before the table
        currentY += 5;

        // Add salary breakdown as a table
        doc.autoTable({
            startY: currentY,
            head: [["Description", "Value"]],
            body: salaryBreakdown.map(([label, value]) => [label, value.toString()]),
            theme: "grid",
            margin: { left: margin },
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: (doc.internal.pageSize.width - margin * 2) * 0.7 },
                1: {
                    cellWidth: (doc.internal.pageSize.width - margin * 2) * 0.3,
                    halign: 'right',
                },
            },
            headStyles: {
                halign: 'center', // Default header alignment
            },
            columnStyles: {
                1: {
                    halign: 'right', // Specifically align the header of column 1 to the right
                },
            },
            didParseCell: (data) => {
                if (data.row.raw[0] === "Basic Salary") {
                    data.cell.styles.fillColor = [211, 211, 211]; // Light grey background (RGB)
                }
                if (data.row.raw[0] === "Normal OT Amount") {
                    data.cell.styles.fillColor = [211, 211, 211]; // Light grey background (RGB)
                }
            },
        });

        // currentY = doc.autoTable.previous.finalY + 10; // Update Y position
        currentY = doc.autoTable.previous.finalY + tableSpacing; // Add space between tables

        if (index % 2 === 1) {
            doc.addPage(); // New page for every second table
            currentY = margin + topMargin; // Reset Y position
        }

    });

    doc.save("Payroll_Report.pdf");
};