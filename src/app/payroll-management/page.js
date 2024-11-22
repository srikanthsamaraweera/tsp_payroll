"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchData } from "next-auth/client/_utils";

export default function PayrollManagement() {
    const [searchParams, setSearchParams] = useState({
        dateFrom: "",
        dateTo: "",
        firstName: "",
        lastName: "",
        empNo: "",
        epfNo: "",
        nicPassport: "",
    });
    const [payrollData, setPayrollData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [addPayrollModalOpen, setAddPayrollModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [employeeResults, setEmployeeResults] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [dayrate, setDayrate] = useState("");
    const [bra2005, setbra2005] = useState("");
    const [bra2016, setbra2016] = useState("");
    const [sundayallowance, setsundayallowance] = useState("");
    const [statallowance, setstatallowance] = useState("");
    const [poyaallowance, setpoyaallowance] = useState("");
    const [normalotrate, setnormalotrate] = useState("");
    const [normalotallowance, setnormalotallowance] = useState("");
    const [doubleotrate, setdoubleotrate] = useState("");
    const [doubleotallowance, setdoubleotallowance] = useState("");
    const [tripleotrate, settripleotrate] = useState("");
    const [tripleotallowance, settripleotallowance] = useState("");

    const [payrollFields, setPayrollFields] = useState({
        work_days: "",
        per_day_salary: "",
        payroll_date: "",
        advance: "",
        festival_advance: "",
        loan_amount: "",
        night_shifts: "",
        normal_ot: "",
        double_ot: "",
        triple_ot: "",
        sundays: "",
        stat_days: "",
        poya_days: "",
    });
    const recordsPerPage = 50;

    const resetPayrollFields = () => {
        setPayrollFields({
            work_days: "",
            per_day_salary: "",
            payroll_date: "",
            advance: "",
            festival_advance: "",
            loan_amount: "",
            night_shifts: "",
            normal_ot: "",
            double_ot: "",
            triple_ot: "",
            sundays: "",
            stat_days: "",
            poya_days: "",
        });
    };

    // Fetch payroll data
    const fetchPayrollData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/payroll?page=${currentPage}&recordsPerPage=${recordsPerPage}&${new URLSearchParams(
                    searchParams
                )}`
            );
            const data = await response.json();
            setPayrollData(data.records);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching payroll data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayrollData();
    }, [currentPage, searchParams]);

    // Fetch employees for search
    const fetchEmployees = async () => {
        try {
            const response = await fetch(`/api/payroll/employees?search=${employeeSearch}`);
            const data = await response.json();
            setEmployeeResults(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    //Fetch pay rates
    const fetchPayRates = async (paycode) => {
        try {
            const response = await fetch(`/api/payroll/getrates`);
            const data = await response.json();
            // setPayrates(data);
            console.log('pay rates - ', JSON.stringify(data))
            const targetRate = data.find(rate => rate.pay_code === paycode);
            console.log("Filtered Pay Rate:", targetRate.pay_rate);
            return targetRate?.pay_rate;


        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const payrateset = async () => {
        const ratesetval = await fetchPayRates(2)
        const bra2005val = await fetchPayRates(1)
        const bra2016val = await fetchPayRates(4)
        const statallowanceval = await fetchPayRates(3)
        const poyaallowanceval = await fetchPayRates(5)
        const normalotrateval = await fetchPayRates(6)
        const normalotallowanceval = await fetchPayRates(7)
        const doubleotrateval = await fetchPayRates(8)
        const doubleotallowanceval = await fetchPayRates(9)
        const tripleotrateval = await fetchPayRates(10)
        const tripleotallowanceval = await fetchPayRates(11)
        const sundayallowance = await fetchPayRates(12)

        setDayrate(ratesetval)
        setbra2005(bra2005val)
        setbra2016(bra2016val)
        setstatallowance(statallowanceval)
        setpoyaallowance(poyaallowanceval)
        setnormalotrate(normalotrateval)
        setnormalotallowance(normalotallowanceval)
        setdoubleotrate(doubleotrateval)
        setdoubleotallowance(doubleotallowanceval)
        settripleotrate(tripleotrateval)
        settripleotallowance(tripleotallowanceval)
        setsundayallowance(sundayallowance)
    }

    useEffect(() => {
        if (employeeSearch.length > 2) fetchEmployees();
    }, [employeeSearch]);

    useEffect(() => {
        payrateset(2)
    }, [])

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to the first page when a new search is performed
        fetchPayrollData();
    };

    const preventScroll = (e) => e.target.blur(); // Prevent mouse scroll adjustment

    const handlePayrollFieldChange = (e) => {
        const { name, value } = e.target;
        const numericValue = Math.max(0, Number(value)); // Prevent negative values
        setPayrollFields((prev) => ({ ...prev, [name]: numericValue }));
    };

    const handleDateFieldChange = (e) => {
        const { name, value } = e.target;
        setPayrollFields((prev) => ({
            ...prev,
            [name]: value, // Directly set the date value
        }));
    };

    const handleSavePayroll = async () => {
        if (!selectedEmployee) {
            alert("Please select an employee.");
            return;
        }

        try {
            const response = await fetch("/api/payroll/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emp_id: selectedEmployee.id,
                    ...payrollFields,
                    per_day_salary: dayrate,
                    bra_2005: bra2005,
                    bra_2016: bra2016,
                    sunday_allowance: sundayallowance,
                    stat_allowance: statallowance,
                    poya_allowance: poyaallowance,
                    normal_ot_rate: normalotrate,
                    normal_ot_allowance: normalotallowance,
                    double_ot_rate: doubleotrate,
                    double_ot_allowance: doubleotallowance,
                    triple_ot_rate: tripleotrate,
                    triple_ot_allowance: tripleotallowance,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to save payroll record");
            }

            alert("Payroll record added successfully!");
            setAddPayrollModalOpen(false);
            fetchPayrollData();
        } catch (error) {
            console.error("Error saving payroll record:", error);
            alert("An error occurred while saving payroll.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Payroll Management</h2>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="date"
                        name="dateFrom"
                        value={searchParams.dateFrom}
                        onChange={handleSearchChange}
                        placeholder="From Date"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="date"
                        name="dateTo"
                        value={searchParams.dateTo}
                        onChange={handleSearchChange}
                        placeholder="To Date"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        name="firstName"
                        value={searchParams.firstName}
                        onChange={handleSearchChange}
                        placeholder="First Name"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={searchParams.lastName}
                        onChange={handleSearchChange}
                        placeholder="Last Name"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faSearch} className="mr-2" />
                    Search
                </button>
            </form>

            {/* Add Payroll Button */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => {
                        //fetchPayRates(1);
                        //    payrateset();
                        resetPayrollFields();
                        setAddPayrollModalOpen(true);
                    }}
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Payroll
                </button>
            </div>

            {/* Add Payroll Modal */}
            {addPayrollModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
                        {/* Close Button */}
                        <button
                            onClick={() => setAddPayrollModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h3 className="text-xl font-semibold mb-4">Add Payroll</h3>

                        {/* Selected Employee */}
                        {selectedEmployee ? (
                            <div className="mb-4 p-4 bg-blue-100 rounded-lg">
                                <p className="text-gray-800">
                                    <strong>Selected Employee:</strong>{selectedEmployee.id}{" "} {selectedEmployee.Firstname}{" "}
                                    {selectedEmployee.Surname} (NIC: {selectedEmployee.Nic_Passport},
                                    EmpNo: {selectedEmployee.EmpNo}, EPFNo: {selectedEmployee.EpfNo})
                                </p>
                            </div>
                        ) : (
                            <p className="mb-4 text-gray-500">No employee selected.</p>
                        )}

                        {/* Employee Search */}
                        <div className="mb-6 relative">
                            <input
                                type="text"
                                value={employeeSearch}
                                onChange={(e) => setEmployeeSearch(e.target.value)}
                                placeholder="Search Employee by Name, NIC, etc."
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            {employeeSearch && employeeResults.length > 0 && (
                                <ul className="absolute z-50 bg-white border rounded-lg shadow-md mt-2 max-h-48 overflow-y-auto w-full">
                                    {employeeResults.map((emp) => (
                                        <li
                                            key={emp.id}
                                            onClick={() => {
                                                setSelectedEmployee(emp);
                                                setEmployeeSearch("");
                                                setEmployeeResults([]);
                                            }}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            {emp.Firstname} {emp.Surname} (NIC: {emp.Nic_Passport}, EmpNo: {emp.EmpNo})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Payroll Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
                            <div className="form-group">
                                <label htmlFor="employee_id" className="block text-gray-700 font-medium mb-2">
                                    Employee ID
                                </label>
                                <input
                                    type="number"
                                    id="employee_id"
                                    name="employee_id"
                                    value={selectedEmployee ? selectedEmployee.id : ""}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="payroll_date" className="block text-gray-700 font-medium mb-2">
                                    Payroll Date
                                </label>
                                <input
                                    type="date"
                                    id="payroll_date"
                                    name="payroll_date"
                                    value={payrollFields.payroll_date}
                                    onChange={handleDateFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="work_days" className="block text-gray-700 font-medium mb-2">
                                    Work Days
                                </label>
                                <input
                                    type="number"
                                    id="work_days"
                                    name="work_days"
                                    value={payrollFields.work_days}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="per_day_salary" className="block text-gray-700 font-medium mb-2">
                                    Per Day Salary - Code 2
                                </label>
                                <input
                                    type="number"
                                    id="per_day_salary"
                                    name="per_day_salary"
                                    value={dayrate}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bra_2005" className="block text-gray-700 font-medium mb-2">
                                    BRA 2005-Code 1
                                </label>
                                <input
                                    type="number"
                                    id="bra_2005"
                                    name="bra_2005"
                                    value={bra2005}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"

                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bra_2016" className="block text-gray-700 font-medium mb-2">
                                    BRA 2016-Code 4
                                </label>
                                <input
                                    type="number"
                                    id="bra_2016"
                                    name="bra_2016"
                                    value={bra2016}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sundays" className="block text-gray-700 font-medium mb-2">
                                    Sundays
                                </label>
                                <input
                                    type="number"
                                    id="sundays"
                                    name="sundays"
                                    value={payrollFields.sundays}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sunday_allowance" className="block text-gray-700 font-medium mb-2">
                                    Sunday Allowance-Code 12
                                </label>
                                <input
                                    type="number"
                                    id="sunday_allowance"
                                    name="sunday_allowance"
                                    value={sundayallowance}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stat_days" className="block text-gray-700 font-medium mb-2">
                                    Stat Days
                                </label>
                                <input
                                    type="number"
                                    id="stat_days"
                                    name="stat_days"
                                    value={payrollFields.stat_days}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stat_allowance" className="block text-gray-700 font-medium mb-2">
                                    Stat Allowance-Code 3
                                </label>
                                <input
                                    type="number"
                                    id="stat_allowance"
                                    name="stat_allowance"
                                    value={statallowance}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="poya_days" className="block text-gray-700 font-medium mb-2">
                                    Poya Days
                                </label>
                                <input
                                    type="number"
                                    id="poya_days"
                                    name="poya_days"
                                    value={payrollFields.poya_days}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="poya_allowance" className="block text-gray-700 font-medium mb-2">
                                    Poya Allowance-Code 5
                                </label>
                                <input
                                    type="number"
                                    id="poya_allowance"
                                    name="poya_allowance"
                                    value={poyaallowance}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="night_shifts" className="block text-gray-700 font-medium mb-2">
                                    Night Shifts
                                </label>
                                <input
                                    type="number"
                                    id="night_shifts"
                                    name="night_shifts"
                                    value={payrollFields.night_shifts}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="normal_ot" className="block text-gray-700 font-medium mb-2">
                                    Normal OT
                                </label>
                                <input
                                    type="number"
                                    id="normal_ot"
                                    name="normal_ot"
                                    value={payrollFields.normal_ot}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="normal_ot_rate" className="block text-gray-700 font-medium mb-2">
                                    Normal OT Rate-Code 6
                                </label>
                                <input
                                    type="number"
                                    id="normal_ot_rate"
                                    name="normal_ot_rate"
                                    value={normalotrate}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="normal_ot_allowance" className="block text-gray-700 font-medium mb-2">
                                    Normal OT Allowance-Code 7
                                </label>
                                <input
                                    type="number"
                                    id="normal_ot_allowance"
                                    name="normal_ot_allowance"
                                    value={normalotallowance}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="double_ot" className="block text-gray-700 font-medium mb-2">
                                    Double OT
                                </label>
                                <input
                                    type="number"
                                    id="double_ot"
                                    name="double_ot"
                                    value={payrollFields.double_ot}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="double_ot_rate" className="block text-gray-700 font-medium mb-2">
                                    Double OT Rate-Code 8
                                </label>
                                <input
                                    type="number"
                                    id="double_ot_rate"
                                    name="double_ot_rate"
                                    value={doubleotrate}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="double_ot_allowance" className="block text-gray-700 font-medium mb-2">
                                    Double OT Allowance-Code 9
                                </label>
                                <input
                                    type="number"
                                    id="double_ot_allowance"
                                    name="double_ot_allowance"
                                    value={doubleotallowance}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="triple_ot" className="block text-gray-700 font-medium mb-2">
                                    Triple OT
                                </label>
                                <input
                                    type="number"
                                    id="triple_ot"
                                    name="triple_ot"
                                    value={payrollFields.triple_ot}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="triple_ot_rate" className="block text-gray-700 font-medium mb-2">
                                    Triple OT Rate-Code 10
                                </label>
                                <input
                                    type="number"
                                    id="triple_ot_rate"
                                    name="triple_ot_rate"
                                    value={tripleotrate}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="triple_ot_allowance" className="block text-gray-700 font-medium mb-2">
                                    Triple OT Allowance-Code 11
                                </label>
                                <input
                                    type="number"
                                    id="triple_ot_allowance"
                                    name="triple_ot_allowance"
                                    value={tripleotallowance}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="advance" className="block text-gray-700 font-medium mb-2">
                                    Advance
                                </label>
                                <input
                                    type="number"
                                    id="advance"
                                    name="advance"
                                    value={payrollFields.advance || 0}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}

                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="festival_advance" className="block text-gray-700 font-medium mb-2">
                                    Festival Advance
                                </label>
                                <input
                                    type="number"
                                    id="festival_advance"
                                    name="festival_advance"
                                    value={payrollFields.festival_advance || 0}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="loan_amount" className="block text-gray-700 font-medium mb-2">
                                    Loan Amount
                                </label>
                                <input
                                    type="number"
                                    id="loan_amount"
                                    name="loan_amount"
                                    value={payrollFields.loan_amount || 0}
                                    onChange={handlePayrollFieldChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    onWheel={preventScroll}
                                />
                            </div>
                        </div>


                        {/* Save Button */}
                        <button
                            onClick={handleSavePayroll}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                        >
                            Save Payroll
                        </button>
                    </div>
                </div>
            )}



            {/* Data Table */}
            <div id="tablewrapper" className="overflow-auto max-h-[500px] border rounded-lg shadow-md">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <table className="w-full table-auto bg-white">
                        <thead className="bg-gray-200 text-gray-600">
                            <tr>
                                {/* Employee Table Fields */}
                                <th className="px-4 py-2">First Name</th>
                                <th className="px-4 py-2">Last Name</th>
                                <th className="px-4 py-2">Initials</th>
                                <th className="px-4 py-2">Employee No</th>
                                <th className="px-4 py-2">EPF No</th>
                                <th className="px-4 py-2">NIC/Passport</th>

                                {/* Payroll Table Fields */}
                                <th className="px-4 py-2">Payroll Date</th>
                                <th className="px-4 py-2">Work Days</th>
                                <th className="px-4 py-2">Per Day Salary</th>
                                <th className="px-4 py-2">BRA 2005</th>
                                <th className="px-4 py-2">BRA 2016</th>
                                <th className="px-4 py-2">Sundays</th>
                                <th className="px-4 py-2">Sunday Allowance</th>
                                <th className="px-4 py-2">Stat Days</th>
                                <th className="px-4 py-2">Stat Allowance</th>
                                <th className="px-4 py-2">Poya Days</th>
                                <th className="px-4 py-2">Poya Allowance</th>
                                <th className="px-4 py-2">Night Shifts</th>
                                <th className="px-4 py-2">Normal OT</th>
                                <th className="px-4 py-2">Normal OT Rate</th>
                                <th className="px-4 py-2">Normal OT Allowance</th>
                                <th className="px-4 py-2">Double OT</th>
                                <th className="px-4 py-2">Double OT Rate</th>
                                <th className="px-4 py-2">Double OT Allowance</th>
                                <th className="px-4 py-2">Triple OT</th>
                                <th className="px-4 py-2">Triple OT Rate</th>
                                <th className="px-4 py-2">Triple OT Allowance</th>
                                <th className="px-4 py-2">Advance</th>
                                <th className="px-4 py-2">Festival Advance</th>
                                <th className="px-4 py-2">Loan Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrollData.map((record) => (
                                <tr key={record.id} className="text-center">
                                    {/* Employee Table Fields */}
                                    <td className="px-4 py-2">{record.employee?.Firstname || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.Surname || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.Initials || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.EmpNo || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.EpfNo || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.Nic_Passport || "-"}</td>

                                    {/* Payroll Table Fields */}
                                    <td className="px-4 py-2">{record.payroll_date || "-"}</td>
                                    <td className="px-4 py-2">{record.work_days || 0}</td>
                                    <td className="px-4 py-2">{record.per_day_salary || 0}</td>
                                    <td className="px-4 py-2">{record.bra_2005 || 0}</td>
                                    <td className="px-4 py-2">{record.bra_2016 || 0}</td>
                                    <td className="px-4 py-2">{record.sundays || 0}</td>
                                    <td className="px-4 py-2">{record.sunday_allowance || 0}</td>
                                    <td className="px-4 py-2">{record.stat_days || 0}</td>
                                    <td className="px-4 py-2">{record.stat_allowance || 0}</td>
                                    <td className="px-4 py-2">{record.poya_days || 0}</td>
                                    <td className="px-4 py-2">{record.poya_allowance || 0}</td>
                                    <td className="px-4 py-2">{record.night_shifts || 0}</td>
                                    <td className="px-4 py-2">{record.normal_ot || 0}</td>
                                    <td className="px-4 py-2">{record.normal_ot_rate || 0}</td>
                                    <td className="px-4 py-2">{record.normal_ot_allowance || 0}</td>
                                    <td className="px-4 py-2">{record.double_ot || 0}</td>
                                    <td className="px-4 py-2">{record.double_ot_rate || 0}</td>
                                    <td className="px-4 py-2">{record.double_ot_allowance || 0}</td>
                                    <td className="px-4 py-2">{record.triple_ot || 0}</td>
                                    <td className="px-4 py-2">{record.triple_ot_rate || 0}</td>
                                    <td className="px-4 py-2">{record.triple_ot_allowance || 0}</td>
                                    <td className="px-4 py-2">{record.advance || 0}</td>
                                    <td className="px-4 py-2">{record.festival_advance || 0}</td>
                                    <td className="px-4 py-2">{record.loan_amount || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
