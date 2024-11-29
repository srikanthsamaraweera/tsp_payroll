import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

export default function payrollSummaryTable(payrollData) {
    const doc = new jsPDF({ orientation: "landscape" });
    const margin = 10;
    const topMargin = 15; // Top margin for the page
    let currentY = margin + topMargin; // Start Y position with top margin

    // Summarize data by employee
    const summaryData = payrollData.reduce((acc, record) => {
        const employeeId = record.employee?.EmpNo || "Unknown";
        if (!acc[employeeId]) {
            acc[employeeId] = {
                fullName: `${record.employee?.Initials || ""} ${record.employee?.Firstname || ""} ${record.employee?.Surname || ""}`,
                perDaySalary: record.per_day_salary + record.bra_2005 + record.bra_2016,
                totalDaysWorked: 0,
                totalOTHours: 0,
                otRate: record.normal_ot_rate,
            };
        }
        acc[employeeId].totalDaysWorked += record.work_days;
        acc[employeeId].totalOTHours += record.normal_ot + record.double_ot + record.triple_ot;
        return acc;
    }, {});

    // Convert summarized data into an array for the table
    const tableData = Object.values(summaryData).map((data) => [
        data.fullName,
        data.perDaySalary.toFixed(2),
        data.totalDaysWorked.toFixed(2),
        data.totalOTHours.toFixed(2),
        data.otRate.toFixed(2),
    ]);

    // Define table headers
    const tableHeaders = [
        "Employee Full Name",
        "Per Day Salary",
        "Total Days Worked",
        "Total OT Hours",
        "OT Rate",
    ];

    // Add title
    doc.setFontSize(16);
    doc.text("Employee Payroll Summary", margin, currentY);
    currentY += 10;

    // Add the summary table
    doc.autoTable({
        startY: currentY,
        head: [tableHeaders],
        body: tableData,
        theme: "grid",
        margin: { left: margin },
        styles: { fontSize: 10, halign: "center" },
        columnStyles: {
            0: { cellWidth: 60 }, // Employee Full Name
            1: { cellWidth: 30, halign: "right" }, // Per Day Salary
            2: { cellWidth: 30, halign: "right" }, // Total Days Worked
            3: { cellWidth: 30, halign: "right" }, // Total OT Hours
            4: { cellWidth: 30, halign: "right" }, // OT Rate
        },
    });

    // Save the PDF
    doc.save("Employee_Payroll_Summary.pdf");
}
