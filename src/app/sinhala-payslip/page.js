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

import './style.css'
import EpfToCSV2 from "@/functions/excelgen/epfcsvgen";
import EtfToCSV2 from "@/functions/excelgen/etfcsvgen";
import Reactmarkdown from 'react-markdown';



export default function PayrollManagement() {
    const componentRef = useRef();

    const [nowdate, setnowdate] = useState(new Date())
    useEffect(() => {
        setnowdate(new Date()); // Generate the date on the client side
    }, []);


    const router = useRouter()

    const getSafeDate = () => {
        const date = new Date(nowdate);
        return Number.isNaN(date.getTime()) ? new Date() : date;
    };

    const getPast30DaysDate = () => {
        const date = getSafeDate();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    };

    // Utility function to get tomorrow's date in YYYY-MM-DD format
    const getTomorrowDate = () => {
        const date = getSafeDate();
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
        emplocation: "",
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

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [chatloading, setChatLoading] = useState(false);


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


    const [rownos, setrownos] = useState(0)

    if (!session || !["admin", "manager"].includes(session.user.account_type)) {
        return <p className="text-red-500 font-bold">Only admins or managers can enter payroll data.</p>;
    }

    const analyzeData = async () => {
        if (!question.trim()) return;

        setChatLoading(true);
        setAnswer("");

        console.log("payrollData front:", JSON.stringify(payrollData, null, 2));

        try {
            const encodedPayrollData = encodeURIComponent(JSON.stringify(payrollData));
            const response = await fetch(`/api/openapi/analyze?payslipdata=${encodedPayrollData}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();
            setAnswer(data.answer || "No response available.");
        } catch (error) {
            console.error("Error:", error);
            setAnswer("Error occurred while analyzing data.");
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 print:bg-transparent">
            <h2 className="text-3xl font-bold text-center mb-6 print:hidden">Payslip</h2>







            {/* Add Payroll Button */}
            <div className="print:hidden" >
                <div className="flex  mb-6 gap-5 justify-center">
                    <button
                        onClick={() => {
                            setshowsearchdrawer(!showsearchdrawer);
                        }}
                        className="px-6 py-1 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
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
                        className="px-6 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faRefresh} className="mr-2" />

                    </button>

                    <button
                        onClick={() => {
                            router.push('/payroll-management')
                        }}
                        className="px-6 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faMoneyBill1Wave} className="mr-2" />
                        Payroll Management
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Print
                    </button>
                    {/* <button
                        onClick={() => payrollSummaryTable(payrollData)}
                        className="px-6 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"

                    >
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Payroll table
                    </button> */}



                    <button
                        onClick={() => {
                            PayrollToCSV(payrollData)
                        }}
                        className="px-6 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
                        Export CSV
                    </button>

                    <button
                        onClick={() => {
                            EpfToCSV2(payrollData)
                        }}
                        className="px-6 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
                        EPF CSV
                    </button>
                    <button
                        onClick={() => {
                            EtfToCSV2(payrollData)
                        }}
                        className="px-6 py-1 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
                        ETF CSV
                    </button>

                </div>

                <div className="flex justify-end mb-6">

                </div>
            </div>
            <div className="print:hidden">
                <h3 className="text-center">No of records: {payrollData.length}</h3>
            </div>

            {/* search drawer */}
            {
                showsearchdrawer && (
                    <div className="print:hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">

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
                                        className="w-full px-4 py-1 border rounded-lg"
                                    />
                                    <input
                                        type="date"
                                        name="dateTo"
                                        value={searchParams.dateTo}
                                        onChange={handleSearchChange}
                                        placeholder="To Date"
                                        className="w-full px-4 py-1 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={searchParams.firstName}
                                        onChange={handleSearchChange}
                                        placeholder="First Name"
                                        className="w-full px-4 py-1 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={searchParams.lastName}
                                        onChange={handleSearchChange}
                                        placeholder="Last Name"
                                        className="w-full px-4 py-1 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="empNo"
                                        value={searchParams.empNo}
                                        onChange={handleSearchChange}
                                        placeholder="Employee No"
                                        className="w-full px-4 py-1 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="epfNo"
                                        value={searchParams.epfNo}
                                        onChange={handleSearchChange}
                                        placeholder="EPF No"
                                        className="w-full px-4 py-1 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="nicPassport"
                                        value={searchParams.nicPassport}
                                        onChange={handleSearchChange}
                                        placeholder="NIC / Passport No"
                                        className="w-full px-4 py-1 border rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        name="emplocation"
                                        value={searchParams.emplocation}
                                        onChange={handleSearchChange}
                                        placeholder="Location"
                                        className="w-full px-4 py-1 border rounded-lg"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 px-6 py-1 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
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
            <div id="payrollwrapper" ref={componentRef} className="p-6 mx-auto bg-white  border rounded-lg shadow-md w-full max-w-[210mm]">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (

                    <div className="overflow-auto " >


                        {

                            payrollData.map((record) => {

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
                                return (

                                    <div className="record  bg-white min-h-[148.5mm] border border-b-black border-dotted  pt-[4mm]" key={record.id + "a1"}>
                                        <div className="text-center w-full pb-2 pt-2">
                                            <h1>T.S.P. Manpower Pay Slip</h1>
                                            <h2 className="font-bold text-sm">Date දිනය: {record.payroll_date.split('T')[0]} | NIC ජා.හැ.අංකය: {record.employee?.Nic_Passport || "-"} | EPF# අංකය: {record.employee?.EpfNo || "-"} | Name නම: {record.employee?.Initials} {record.employee?.Firstname} {record.employee?.Surname}<br></br>| Location: {record.employee?.emplocation}</h2>


                                        </div>


                                        <table className="w-full table-auto bg-white text-xs border border-gray-300 font-bold">

                                            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">

                                                <tr className="border border-gray-300">


                                                    {/* Payroll Table Fields */}
                                                    <th className="px-2   text-xs border border-gray-300 w-[42%]">Description විස්තරය</th>
                                                    <th className="px-1   text-xs border border-gray-300 w-[20%]">Days දින/Hrs පැය/Qty ප්‍රමාණය</th>
                                                    <th className="px-2   text-xs border border-gray-300 w-[18%]">Rate අනුපාතය</th>
                                                    <th className="px-2   text-xs border border-gray-300 w-[20%] text-right">Value අගය</th>


                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key={record.id} className={`text-center focus:bg-slate-100 cursor-pointer  border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Normal Days සමාන්‍ය දින</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.work_days || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">{record.per_day_salary || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{totalbasic.toFixed(2)}</td>


                                                </tr>
                                                <tr key={"2" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer  border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Sunday/7th day LL හිලව් නිවාඩු මුදල</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.sundays || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">{record.per_day_salary || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{sundayLLpay.toFixed(2) || 0}</td>


                                                </tr>
                                                <tr key={"3" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer  border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Sunday /7th day මුදල</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.sundays || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">{record.sunday_rate * record.per_day_salary || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{sundaypayepf.toFixed(2) || 0}</td>


                                                </tr>
                                                <tr key={"4" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer  border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Poya Pay පොහොය දින ගෙවීම</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.poya_days || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">{record.poya_rate * record.per_day_salary || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{poyapay.toFixed(2) || 0}</td>


                                                </tr>
                                                <tr key={"5" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer  border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Night Pay රාත්‍රි වැඩ මුර සඳහා ගෙවීම</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.night_shifts || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">{record.per_day_salary * record.night_shift_rate || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{nightpay.toFixed(2) || 0}</td>


                                                </tr>
                                                <tr key={"5.5" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer  border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Stat Pay වැඩ කල රජයේ නිවාඩු(S/H)දින සඳහා ගෙවීම</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.stat_days || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">{record.stat_rate * record.per_day_salary || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{statpay.toFixed(2) || 0}</td>


                                                </tr>

                                                <tr key={"6" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer bg-slate-200  border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">(Earning before OT)ඒකාබද්ධ මූලික වැටුප</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300"></td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300"></td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{earningForEPF.toFixed(2)}</td>


                                                </tr>



                                                <tr key={"8" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer   border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Normal OT සමාන්‍ය අතිකාල</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.normal_ot || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">{record.normal_ot_rate * record.per_day_salary / 8 || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{normalOTAmount.toFixed(2)}</td>


                                                </tr>
                                                <tr key={"9" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer   border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Double OT ද්විත්ව අතිකාල</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.double_ot || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">{record.double_ot_rate * record.per_day_salary / 8 || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{doubleOTAmount.toFixed(2)}</td>


                                                </tr>

                                                <tr key={"10" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer   border border-gray-300`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Triple OT ත්‍රිත්ව අතිකාල</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.triple_ot || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">{(record.triple_ot_rate * record.per_day_salary / 8).toFixed(2) || 0}</td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{tripleOTAmount.toFixed(2)}</td>


                                                </tr>


                                                <tr key={"11" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer   border border-gray-300 bg-slate-200`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Total OT සම්පූර්ණ අතිකාල පැය සඳහා ඉපයීම</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300"></td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300"></td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{(tripleOTAmount + doubleOTAmount + normalOTAmount).toFixed(2)}</td>


                                                </tr>
                                                <tr key={"12" - record.id} className={`text-center focus:bg-slate-100 cursor-pointer   border border-gray-300 bg-slate-200`}
                                                    onClick={() => setselectedrow(record.id)}>
                                                    {/* Employee Table Fields */}
                                                    <td className="px-2 py-[0.5mm] border border-gray-300">Gross Salary මුළු එකතුව</td>
                                                    <td className="px-1 py-[0.5mm] whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300"></td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300"></td>
                                                    <td className="px-2 py-[0.5mm] border border-gray-300 text-right">{(earningForEPF + tripleOTAmount + doubleOTAmount + normalOTAmount).toFixed(2)}</td>


                                                </tr>





                                            </tbody>
                                        </table>
                                        <table className="border border-gray-100 w-full text-xs font-bold mt-2">
                                            <thead className="bg-gray-100">
                                                <tr >
                                                    <th className="text-right border border-gray-300 px-2 ">Advance<br />අත්තිකාරම් මුදල</th>
                                                    <th className="text-right border border-gray-300  px-2 ">Festival Advance<br />උත්සව අත්තිකාරම් මුදල</th>
                                                    <th className="text-right border border-gray-300 px-2 ">Loan<br />ණය මුදල</th>
                                                    <th className="text-right border border-gray-300 px-2 ">EPF සේ.අ.අ. 8%</th>
                                                    <th className="text-right border border-gray-300 px-2 ">Total Deductions<br /> සම්පූර්ණ අඩුකිරීම්</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="text-right ">
                                                    <td className="text-right border border-gray-300 px-2 ">-{record.advance}</td>
                                                    <td className="text-right border border-gray-300 px-2 ">-{record.festival_advance}</td>
                                                    <td className="text-right border border-gray-300 px-2 ">-{record.loan_amount}</td>
                                                    <td className="text-right border border-gray-300 px-2 ">-{epfeightpercent.toFixed(2)}</td>
                                                    <td className="text-right border border-gray-300 px-2 ">-{(epfeightpercent + record.loan_amount + record.festival_advance + record.advance).toFixed(2)}</td>
                                                </tr>
                                            </tbody>


                                        </table>

                                        <table className="border border-gray-100 w-full text-xs font-bold">
                                            <thead className="bg-gray-100">
                                                <tr >
                                                    <th className="text-right border border-gray-300 px-2 ">Gross Salary<br />සම්පූර්ණ වැටුප/මුළු එකතුව</th>
                                                    <th className="text-right border border-gray-300  px-2 ">Total Deductions<br />අඩුකිරීම්</th>
                                                    <th className="text-right border border-gray-300 px-2  ">Net Salary<br />ශුද්ධ වැටුප</th>
                                                    <th className="text-right border border-gray-300 px-2 ">ETF/සේ.අ.අ.<br />3%</th>
                                                    <th className="text-right border border-gray-300 px-2 ">EPF/සේ.අ.අ.<br />8%</th>
                                                    <th className="text-right border border-gray-300  px-2 ">EPF/සේ.අ.අ.<br />12%</th>
                                                    <th className="text-right border border-gray-300 px-2  ">EPF/සේ.අ.අ.<br />20%</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="text-right ">
                                                    <td className="text-right border border-gray-300 px-2 ">{(earningForEPF + tripleOTAmount + doubleOTAmount + normalOTAmount).toFixed(2)}</td>
                                                    <td className="text-right border border-gray-300 px-2 ">-{(epfeightpercent + record.loan_amount + record.festival_advance + record.advance).toFixed(2)}</td>
                                                    <td className="text-right border border-gray-300 px-2  underline decoration-double">{((earningForEPF + tripleOTAmount + doubleOTAmount + normalOTAmount) - (epfeightpercent + record.loan_amount + record.festival_advance + record.advance)).toFixed(2)}</td>
                                                    <td className="text-right border border-gray-300 px-2 ">{etfthreepercent.toFixed(2)}</td>
                                                    <td className="text-right border border-gray-300 px-2 ">{epfeightpercent.toFixed(2)}</td>
                                                    <td className="text-right border border-gray-300 px-2 ">{epftwelvepercent.toFixed(2)}</td>
                                                    <td className="text-right border border-gray-300 px-2  ">{(epfeightpercent + epftwelvepercent).toFixed(2)}</td>

                                                </tr>
                                            </tbody>


                                        </table>

                                    </div>
                                );


                            })}

                    </div>







                )}
            </div>


            {/* Pagination */}
            <div className="flex justify-center mt-6 print:hidden">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-1">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            {/* analysis code */}
            <div style={{ padding: "2rem" }} className="print:hidden justify-center flex flex-col items-center">
                <h1>Database Analysis</h1>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about the database..."
                    rows="4"
                    cols="50"
                    className="w-full p-2 border"
                ></textarea>
                <br />
                <button onClick={analyzeData} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    {chatloading ? "Analyzing..." : "Analyze"}
                </button>
                {answer && (
                    <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }} className="bg-black text-white">
                        <h3>AI Response:</h3>
                        <Reactmarkdown>{answer}</Reactmarkdown>

                    </div>
                )}
            </div>
        </div >
    );
}
