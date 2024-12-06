"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faTimes, faTrash, faEdit, faEye, faFilter, faSearchPlus, faRefresh, faSearchMinus, faDollar, faMoneyBill1Wave, faPrint, faFileCsv } from "@fortawesome/free-solid-svg-icons";
import FormatDate from "@/functions/formatdate";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PaysliptoPDF from "@/functions/pdfgen/paysliptopdf";
import PaysliptabletoPDF from "@/functions/pdfgen/paysliptabletopdf";
import PaysliptotablePDF from "@/functions/pdfgen/paysliptabletopdf";
import payrollSummaryTable from "@/functions/pdfgen/payrollsummary";
import paysliptabletopdf from "@/functions/pdfgen/paysliptabletopdf";
import CanvasGen from "@/functions/pdfgen/canvasgen";
import PayrollToCSV from "@/functions/pdfgen/payrolltable1";



export default function PayrollManagement() {
    const componentRef = useRef();

    const [nowdate, setnowdate] = useState(new Date().toLocaleString())
    useEffect(() => {
        setnowdate(new Date().toLocaleString()); // Generate the date on the client side
    }, []);


    const router = useRouter()

    const getPast30DaysDate = () => {
        const date = new Date(nowdate);
        date.setDate(date.getDate() - 30);
        return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    };

    // Utility function to get tomorrow's date in YYYY-MM-DD format
    const getTomorrowDate = () => {
        const date = new Date(nowdate);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    };
    const [searchParams, setSearchParams] = useState({
        dateFrom: getPast30DaysDate(),
        dateTo: getTomorrowDate(),
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
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [selectededrow, setselectedrow] = useState('');

    const [fulledit, setfulledit] = useState(false);
    const [viewascol, setviewascol] = useState(false)

    const [searchingemployeemessage, setsearchingemployeemessage] = useState('');
    const { data: session } = useSession();
    const [showsearchdrawer, setshowsearchdrawer] = useState(false)
    const [sundayrate, setsundayrate] = useState("");
    const [poyarate, setpoyarate] = useState("");
    const [nightshiftrate, setnightshiftrate] = useState("");
    const [statrate, setstatrate] = useState("");


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
    const recordsPerPage = 5000;


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
            setsearchingemployeemessage('Loading employees...')
            const response = await fetch(`/api/payroll/employees?search=${employeeSearch}`);
            const data = await response.json();
            setEmployeeResults(data);
            setsearchingemployeemessage('')
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
            // console.log('pay rates - ', JSON.stringify(data))
            const targetRate = data.find(rate => rate.pay_code === paycode);
            console.log("Filtered Pay Rate:", targetRate.pay_rate);
            return targetRate?.pay_rate;


        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const payrateset = async () => {
        const ratesetval = await fetchPayRates(2)

        const poyarate = await fetchPayRates(14)
        const normalotrateval = await fetchPayRates(6)

        const doubleotrateval = await fetchPayRates(8)

        const tripleotrateval = await fetchPayRates(10)


        const sundayrate = await fetchPayRates(13)
        const night_shift_rate = await fetchPayRates(15)
        const stat_rate = await fetchPayRates(16)

        setDayrate(ratesetval)


        setnormalotrate(normalotrateval)

        setdoubleotrate(doubleotrateval)

        settripleotrate(tripleotrateval)


        setsundayrate(sundayrate)
        setpoyarate(poyarate)
        setnightshiftrate(night_shift_rate)
        setstatrate(stat_rate)
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
        setshowsearchdrawer(false)
    };


    if (!session || session.user.account_type !== "admin") {
        return <p className="text-red-500 font-bold">Only admins can enter payroll data.</p>;

    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Payslip</h2>






            {/* Add Payroll Button */}
            <div >
                <div className="flex  mb-6 justify-start gap-5">
                    <button
                        onClick={() => {
                            setshowsearchdrawer(!showsearchdrawer);
                        }}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
                    >
                        <span
                            className={`mr-2 inline-block transition-transform duration-300 ${showsearchdrawer ? 'rotate-90' : 'rotate-0'
                                }`}
                        >
                            <FontAwesomeIcon icon={showsearchdrawer ? faSearchMinus : faSearchPlus} />
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setSearchParams({
                                dateFrom: getPast30DaysDate(),
                                dateTo: getTomorrowDate(),
                                firstName: "",
                                lastName: "",
                                empNo: "",
                                epfNo: "",
                                nicPassport: "",
                            });

                            fetchPayrollData();
                        }}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faRefresh} className="mr-2" />

                    </button>

                    <button
                        onClick={() => {
                            router.push('/payroll-management')
                        }}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-2" />
                        Payroll Management
                    </button>
                    <button
                        onClick={() => PaysliptoPDF(payrollData)}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Payslip Sheet
                    </button>
                    <button
                        onClick={() => payrollSummaryTable(payrollData)}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"

                    >
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Payroll table
                    </button>

                    <button
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"

                        onClick={

                            () => {
                                console.log("canvas gen press");
                                const element = document.getElementById("payrollwrapper")
                                CanvasGen(element, "payrollcanvas")
                            }
                        }>
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Canvas</button>

                    <button
                        onClick={() => {
                            PayrollToCSV(payrollData)
                        }}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
                        Export CSV
                    </button>

                </div>

                <div className="flex justify-end mb-6">

                </div>
            </div>

            {/* search drawer */}
            {
                showsearchdrawer && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">

                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setshowsearchdrawer(false)
                                }}
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <h3 className="text-xl font-semibold mb-4">Filter Payroll Data</h3>

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
                                    <input
                                        type="text"
                                        name="empNo"
                                        value={searchParams.empNo}
                                        onChange={handleSearchChange}
                                        placeholder="Employee No"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="epfNo"
                                        value={searchParams.epfNo}
                                        onChange={handleSearchChange}
                                        placeholder="EPF No"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="nicPassport"
                                        value={searchParams.nicPassport}
                                        onChange={handleSearchChange}
                                        placeholder="NIC / Passport No"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={faSearch} className="mr-2" />
                                    Filter
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }








            {/* Data Table */}
            <div id="payrollwrapper" ref={componentRef} className="  border rounded-lg shadow-md">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (


                    payrollData.map((record) => (
                        <div
                            key={record.id}
                            className="border rounded-lg shadow-md bg-white p-6 space-y-6"
                        >
                            {/* Full Name */}
                            <div className="grid grid-cols-2">
                                <div>
                                    <h3 className="text-2xl font-bold text-center mb-4">
                                        {`${record.employee?.Initials || ""}, ${record.employee?.Firstname || ""} ${record.employee?.Surname || ""}`}
                                    </h3>
                                </div>
                                {/* Payroll Date */}
                                <div>
                                    <h3 className="text-lg font-semibold">Payroll Date: {record.payroll_date?.split("T")[0] || "-"}</h3>

                                </div>

                            </div>

                            {/* Employee Details in 3 Columns */}
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <p><strong>NIC/Passport:</strong> {record.employee?.Nic_Passport || "-"}</p>
                                <p><strong>Employee No:</strong> {record.employee?.EmpNo || "-"}</p>
                                <p><strong>EPF No:</strong> {record.employee?.EpfNo || "-"}</p>
                            </div>



                            {/* Salary Calculation */}
                            <div>
                                <h3 className="text-lg font-semibold">Press the Print Payslip button for salary details</h3>


                            </div>
                        </div>
                    ))






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
        </div >
    );
}
