
export default function PayrollToCSV(payrollData) {

    if (typeof window === "undefined") {
        console.error("This function must be called in a client-side environment.");
        return;
    }


    const csvHeaders = [
        "NIC",
        "Full Name",
        "Initials",
        "EPF No",
        "Per day salary",
        "No of work days",
        "BRA 2005",
        "BRA 2016",
        "Basic per day",
        "Basic Salary",
        "No of Sundays",
        "Sunday payment for EPF/ETF",
        "Stat Days",
        "Stat Pay EPF/ETF",
        "Poya Days",
        "Poya pay EPF/ETF"




    ];
    const csvRows = payrollData.map((row) =>
        [row.employee?.Nic_Passport,
        row.employee?.Firstname + " " + row.employee?.Surname,
        row.employee?.Initials,
        row.employee?.EpfNo,
        row.per_day_salary,
        row.work_days,
        row.bra_2005,
        row.bra_2016,
        row.per_day_salary + row.bra_2005 + row.bra_2016,
        row.work_days * (row.per_day_salary + row.bra_2005 + row.bra_2016),
        row.sundays,
        (row.per_day_salary + row.bra_2005 + row.bra_2016) * row.sunday_rate * row.sundays,
        row.stat_days,
        row.stat_days * row.stat_allowance,
        row.poya_days,
        row.poya_days * row.poya_rate,

        ].join(",")
    );

    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payroll_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);



}
