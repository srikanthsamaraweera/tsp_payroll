import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

export default function paysliptabletopdf(payrollData) {
    const doc = new jsPDF({ orientation: "landscape" });
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const topMargin = 15; // Top margin for each page
    let currentY = margin + topMargin; // Start Y position with top margin
    const tableSpacing = 20; // Space between tables

    // Group records by employee
    const recordsByEmployee = payrollData.reduce((acc, record) => {
        const employeeId = record.employee?.EmpNo || "Unknown";
        if (!acc[employeeId]) {
            acc[employeeId] = {
                employee: record.employee,
                records: [],
            };
        }
        acc[employeeId].records.push(record);
        return acc;
    }, {});

    // Generate PDF for each employee
    Object.values(recordsByEmployee).forEach(({ employee, records }, index) => {
        // Employee header
        const header = `${employee?.Initials || "N/A"} ${employee?.Firstname || "N/A"} ${employee?.Surname || ""}`;
        const detailsText = `NIC: ${employee?.Nic_Passport || "N/A"} | EPF No: ${employee?.EpfNo || "N/A"} | Employee No: ${employee?.EmpNo || "N/A"}`;

        // Define table headers
        const tableHeaders = [
            "Work Days",
            "Per Day Salary",
            "BRA 2005",
            "BRA 2016",
            "OT Hours",
            "Normal OT Rate",
            "Double OT Hours",
            "Double OT Rate",
            "Triple OT Hours",
            "Triple OT Rate",
        ];

        // Define table data (rows for this employee)
        const tableData = records.map((record) => [
            record.work_days.toFixed(2),
            record.per_day_salary.toFixed(2),
            record.bra_2005.toFixed(2),
            record.bra_2016.toFixed(2),
            record.normal_ot.toFixed(2),
            record.normal_ot_rate.toFixed(2),
            record.double_ot.toFixed(2),
            record.double_ot_rate.toFixed(2),
            record.triple_ot.toFixed(2),
            record.triple_ot_rate.toFixed(2),
        ]);

        // Check if the current table fits on the page
        const estimatedTableHeight = records.length * 10 + 30; // Estimated table height based on row count
        if (currentY + estimatedTableHeight > pageHeight) {
            doc.addPage();
            currentY = margin + topMargin; // Reset Y position
        }

        // Add employee header
        doc.setFontSize(14);
        doc.text(header, margin, currentY);
        currentY += 10;

        // Add employee details
        doc.setFontSize(12);
        doc.text(detailsText, margin, currentY);
        currentY += 10;

        // Add table for the employee
        doc.autoTable({
            startY: currentY,
            head: [tableHeaders],
            body: tableData,
            theme: "grid",
            margin: { left: margin },
            styles: { fontSize: 10, halign: "center" },
            columnStyles: {
                0: { cellWidth: 20 }, // Adjust column widths as needed
                1: { cellWidth: 25 },
                2: { cellWidth: 20 },
                3: { cellWidth: 20 },
                4: { cellWidth: 20 },
                5: { cellWidth: 25 },
                6: { cellWidth: 25 },
                7: { cellWidth: 25 },
                8: { cellWidth: 25 },
                9: { cellWidth: 25 },
            },
        });

        // Update current Y position after the table
        currentY = doc.autoTable.previous.finalY + tableSpacing;

        // Add a new page if this is the last table on the current page
        if (index < Object.values(recordsByEmployee).length - 1 && currentY + estimatedTableHeight > pageHeight) {
            doc.addPage();
            currentY = margin + topMargin;
        }
    });

    doc.save("Payroll_Report.pdf");
}
