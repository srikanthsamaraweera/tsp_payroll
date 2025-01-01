export default function EpfToCSV2(payrollData) {
    if (typeof window === "undefined") {
        console.error("This function must be called in a client-side environment.");
        return;
    }

    const csvHeaders = [
        "NIC",
        "Full Name",
        "Initials",
        "EPF No",
        "Employer Contribution Rs",
        "Employee Contribution Rs",
        "Total Earnings Rs",
        "Member Status Description",
        "No of days worked",
        "Occupational Classification  Grade Discription",





    ];

    // Assign calculated values to variables first
    const csvRows = payrollData.map((row) => {
        const nicPassport = row.employee?.Nic_Passport;
        const fullName = row.employee?.Firstname + " " + row.employee?.Surname;
        const initials = row.employee?.Initials;
        const epfNo = row.employee?.EpfNo;
        const perDaySalary = row.per_day_salary;
        const workDays = row.work_days;
        const TotlBasicSalary = row.work_days * row.per_day_salary;
        const sundays = row.sundays;
        const sundaysalary = row.sundays * row.sunday_rate * perDaySalary;
        const sundayllpay = row.sundays * perDaySalary;
        const statdays = row.stat_days;
        const statpay = statdays * row.stat_rate * perDaySalary;
        const poyadays = row.poya_days;
        const poyapay = row.poya_days * row.poya_rate * perDaySalary;
        const nightdays = row.night_shifts;
        const nightpay = perDaySalary * row.night_shift_rate * nightdays;
        const totepfearn = TotlBasicSalary + sundaysalary + statpay + poyapay;
        const epf8percent = totepfearn * 8 / 100;

        const normalot = row.normal_ot;
        const normalotrate = row.normal_ot_rate / 8 * perDaySalary
        const normalotpay = normalot * normalotrate;

        const doubleot = row.double_ot;
        const doubleotrate = row.double_ot_rate / 8 * perDaySalary
        const doubleotpay = doubleot * doubleotrate;

        const tripleot = row.triple_ot;
        const tripleotrate = row.triple_ot_rate / 8 * perDaySalary
        const tripleotpay = tripleot * tripleotrate;

        const totalotpay = normalotpay + doubleotpay + tripleotpay;
        const grosssalary = totalotpay + totepfearn;

        const advance = row.advance;
        const festadvance = row.festival_advance;
        const loanamount = row.loan_amount;
        const totaldeductions = advance + festadvance + loanamount + epf8percent;
        const netsalary = grosssalary - totaldeductions;
        const epf12percent = totepfearn * 12 / 100;
        const etf3percent = totepfearn * 3 / 100;
        const epf20percent = epf8percent + epf12percent;


        return [
            nicPassport,
            fullName,
            initials,
            epfNo,
            epf12percent,
            epf8percent,
            grosssalary,
            " ",
            workDays,
            " ",





        ].join(",");
    });

    // Create CSV content
    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Epf_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
