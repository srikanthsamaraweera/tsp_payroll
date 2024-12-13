"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faEye, faSearchPlus, faRefresh, faSearchMinus, faDollar, faFileCsv, faBinoculars, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PayrollToCSV from "@/functions/pdfgen/payrolltable1";
import AddPayrollModal from "@/components/payroll/addpayrecord";
import EditPayrollModal from "@/components/payroll/editpayrecord";
import PayrollFilter from "@/components/payroll/payrollfilter";
import DeleteModal from "@/components/payroll/deletemodal";
import ViewPayModal from "@/components/payroll/viewpayrecord";
import { generateRandomNumber } from "@/functions/randomno";

export default function PayrollManagement() {
    const router = useRouter()
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

    const [sundayallowance, setsundayallowance] = useState("");
    const [sundayrate, setsundayrate] = useState("");
    const [statallowance, setstatallowance] = useState("");
    const [poyaallowance, setpoyaallowance] = useState("");
    const [poyarate, setpoyarate] = useState("");
    const [normalotrate, setnormalotrate] = useState("");
    const [normalotallowance, setnormalotallowance] = useState("");
    const [doubleotrate, setdoubleotrate] = useState("");
    const [doubleotallowance, setdoubleotallowance] = useState("");
    const [tripleotrate, settripleotrate] = useState("");
    const [tripleotallowance, settripleotallowance] = useState("");
    const [nightshiftrate, setnightshiftrate] = useState("");
    const [statrate, setstatrate] = useState("");

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [selectededrow, setselectedrow] = useState('');

    const [fulledit, setfulledit] = useState(false);
    const [viewascol, setviewascol] = useState(false)

    const [searchingemployeemessage, setsearchingemployeemessage] = useState('');
    const { data: session } = useSession();
    const [showsearchdrawer, setshowsearchdrawer] = useState(false)
    const [saving, setsaving] = useState(false)



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


        setPayrollFields((prev) => ({
            ...prev,
            per_day_salary: ratesetval,


            sunday_rate: sundayrate,

            poya_rate: poyarate,

            normal_ot_rate: normalotrateval,

            double_ot_rate: doubleotrateval,

            triple_ot_rate: tripleotrateval,

            night_shift_rate: nightshiftrate,
            stat_rate: statrate,
        }));

        seteditPayrollFields((prev) => ({
            ...prev,
            per_day_salary: ratesetval,

            sunday_rate: sundayrate,

            poya_rate: poyarate,

            normal_ot_rate: normalotrateval,

            double_ot_rate: doubleotrateval,

            triple_ot_rate: tripleotrateval,

            night_shift_rate: nightshiftrate,
            stat_rate: statrate,
        }));
    }

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
        per_day_salary: "",

        sunday_rate: "",

        poya_rate: "",

        normal_ot_rate: "",

        double_ot_rate: "",

        triple_ot_rate: "",

        night_shift_rate: "",
        stat_rate: "",


    });

    const [editpayrollFields, seteditPayrollFields] = useState({
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
        per_day_salary: "",

        sunday_rate: "",

        poya_rate: "",

        normal_ot_rate: "",

        double_ot_rate: "",

        triple_ot_rate: "",

        night_shift_rate: "",
        stat_rate: "",


    });


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

    const handleEditRecordChange = (e) => {
        const { name, value } = e.target;

        // Prevent negative values
        const numericValue = Math.max(0, Number(value));

        setEditRecord((prev) => ({
            ...prev,
            [name]: name === "payroll_date" ? value : numericValue, // Only allow non-negative values
        }));
    };

    const handleSavePayroll = async () => {
        setsaving(true)
        if (!selectedEmployee) {
            alert("Please select an employee.");
            return;
        }
        if (!payrollFields.payroll_date) {
            alert("Please select payroll date.");
            return;
        }
        if (!payrollFields.work_days > 0) {
            alert("Please enter work days.");
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
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to save payroll record");
            }

            alert("Payroll record added successfully!");
            setAddPayrollModalOpen(false);
            setSelectedEmployee(null)
            fetchPayrollData();
        } catch (error) {
            console.error("Error saving payroll record:", error);
            alert("An error occurred while saving payroll.");
        }
        setsaving(false)
    };

    const handleEditPayroll = async () => {
        setsaving(true)
        try {
            const response = await fetch("/api/payroll/editpayroll", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editRecord),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update payroll record");
            }

            alert("Payroll record updated successfully!");
            setEditModalOpen(false); // Close the modal
            fetchPayrollData(); // Refresh the data table
        } catch (error) {
            console.error("Error updating payroll record:", error);
            alert("An error occurred while updating payroll.");
        }
        setsaving(false)
    };


    const handleEdit = (record) => {
        setfulledit(false)
        setEditRecord(record);
        setEditModalOpen(true);
    };

    const handleviewascol = (record) => {

        setfulledit(false)
        setEditRecord(record);
        setviewascol(true);
    };

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, recordId: null, randomNumber: null });
    const [deleteInput, setDeleteInput] = useState("");

    const openDeleteModal = (id) => {
        const randomNum = generateRandomNumber()// Generate random number
        // const randomNum = Math.floor(1000000 + Math.random() * 9000000); // Generate random number
        setDeleteModal({ isOpen: true, recordId: id, randomNumber: randomNum });
        setDeleteInput("");
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, recordId: null, randomNumber: null });
        setDeleteInput("");
    };

    const confirmDelete = async () => {
        if (parseInt(deleteInput) !== deleteModal.randomNumber) {
            alert("Entered number does not match. Please try again.");
            return;
        }

        try {
            const response = await fetch('/api/payroll/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: deleteModal.recordId }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            alert("Payroll record deleted successfully!");
            closeDeleteModal();
            fetchPayrollData(); // Refresh data table
        } catch (error) {
            console.error("Error deleting payroll record:", error);
            alert("Failed to delete payroll record. Please try again.");
        }
    };




    if (!session || session.user.account_type !== "admin") {
        return <p className="text-red-500 font-bold">Only admins can enter payroll data.</p>;

    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Payroll Management</h2>






            {/* Add Payroll Button */}
            <div className="grid-cols-2 grid">
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
                                dateFrom: "",
                                dateTo: "",
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
                            router.push('/payslip')
                        }}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faBinoculars} className="mr-2" />
                        Reports
                    </button>
                    <button
                        onClick={() => {
                            PayrollToCSV(payrollData)
                        }}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => {
                            router.push('/sinhala-payslip')
                        }}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
                        Sinhala PaySlip
                    </button>
                </div>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={async () => {
                            //fetchPayRates(1);
                            setfulledit(false)
                            resetPayrollFields();
                            await payrateset();
                            console.log("per_day_salary", payrollFields.per_day_salary)
                            setAddPayrollModalOpen(true);
                        }}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Payroll
                    </button>
                </div>
            </div>

            {/* search drawer */}
            {showsearchdrawer && (
                <PayrollFilter
                    setshowsearchdrawer={setshowsearchdrawer}
                    handleSearchSubmit={handleSearchSubmit}
                    handleSearchChange={handleSearchChange}
                    searchParams={searchParams}

                />
            )}

            {/* Add Payroll Modal */}
            {addPayrollModalOpen && (
                <AddPayrollModal
                    isOpen={addPayrollModalOpen}
                    onClose={() => {
                        setfulledit(false);
                        setSelectedEmployee(null);
                        setAddPayrollModalOpen(false);
                    }}
                    payrollFields={payrollFields}
                    setPayrollFields={setPayrollFields}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    employeeSearch={employeeSearch}
                    setEmployeeSearch={setEmployeeSearch}
                    employeeResults={employeeResults}
                    setEmployeeResults={setEmployeeResults}
                    fulledit={fulledit}
                    setfulledit={setfulledit}
                    handlePayrollFieldChange={handlePayrollFieldChange}
                    handleDateFieldChange={handleDateFieldChange}
                    preventScroll={preventScroll}
                    searchingemployeemessage={searchingemployeemessage}
                    handleSavePayroll={handleSavePayroll}
                    setsaving={setsaving}
                    saving={saving}
                />

            )}

            {/* {edit modal} */}
            {editModalOpen && editRecord && (
                <EditPayrollModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    editRecord={editRecord}
                    setEditRecord={setEditRecord}
                    handleEditRecordChange={handleEditRecordChange}
                    handleEditPayroll={handleEditPayroll}
                    preventScroll={preventScroll}
                    fulledit={fulledit}
                    setfulledit={setfulledit}
                    setsaving={setsaving}
                    saving={saving}

                />

            )}

            {deleteModal.isOpen && (

                <DeleteModal
                    deleteModal={deleteModal}
                    deleteInput={deleteInput}
                    confirmDelete={confirmDelete}
                    closeDeleteModal={closeDeleteModal}
                    setDeleteInput={setDeleteInput}
                />
            )}


            {viewascol && (
                <ViewPayModal
                    isOpen={viewascol}
                    onClose={() => setviewascol(false)}
                    editRecord={editRecord}
                    setEditRecord={setEditRecord}
                    handleEditRecordChange={handleEditRecordChange}
                    handleEditPayroll={handleEditPayroll}
                    preventScroll={preventScroll}
                    fulledit={fulledit}
                    setfulledit={setfulledit}

                />

            )}


            {/* Data Table */}
            <div id="tablewrapper" className="overflow-auto max-h-[500px] border rounded-lg shadow-md">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <table className="w-full table-auto bg-white text-xs border border-gray-300 ">
                        <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
                            <tr className="border border-gray-300">
                                {/* Employee Table Fields */}
                                <th className="px-2 py-2   text-xs border border-gray-300">ID No</th>
                                <th className="px-2 py-2  text-xs whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">Name</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Initials</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Employee No</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">EPF No</th>


                                {/* Payroll Table Fields */}
                                <th className="px-2 py-2  text-xs border border-gray-300">Payroll id</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Payroll Date</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Work Days</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Per Day Salary</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Total Basic</th>

                                <th className="px-2 py-2  text-xs border border-gray-300">Sundays</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Sunday Rate</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Sunday Pay: EPF/ETF</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Sunday L/L Pay</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Stat Days</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Stat Rate</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Stat Pay</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Poya Days</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Poya Rate</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Poya Pay EPF</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Night Shifts</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Night Rate</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Night Pay</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Earning for EPF</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">EPF 8%</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Normal OT</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Normal OT Rate</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">Normal OT hour pay</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">Normal OT amount</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Double OT</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Double OT Rate</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">Double OT hour pay</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">Double OT amount</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Triple OT</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Triple OT Rate</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">Triple OT hour pay</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Triple OT amount</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Total OT amount</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Gross Salary</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Advance</th>
                                <th className="px-2 py-2  text-xs border border-gray-300">Festival Advance</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">Loan Amount</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">Net Salary (Gross-EPF 8%)</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">EPF 12%</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">EPF 3%</th>
                                <th className="px-2 py-2 text-xs border border-gray-300">20%</th>
                                <th className="px-2 py-2  border border-gray-300"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrollData.map((record) => {
                                const totalbasic = (record.work_days * record.per_day_salary)
                                const sundaypayepf = (record.sundays * record.sunday_rate * record.per_day_salary)
                                const sundayLLpay = (record.sundays * record.per_day_salary)
                                const statpay = (record.stat_days * record.stat_rate * record.per_day_salary)
                                const poyapay = (record.poya_days * record.poya_rate * record.per_day_salary)
                                const nightpay = (record.night_shifts / record.night_shift_rate * record.per_day_salary)
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
                                    <tr key={record.id} onDoubleClick={() => handleviewascol(record)} className={`text-center focus:bg-slate-100 cursor-pointer ${selectededrow === record.id ? 'bg-slate-200' : ""} border border-gray-300`}
                                        onClick={() => setselectedrow(record.id)}>
                                        {/* Employee Table Fields */}
                                        <td className="px-2 py-2 border border-gray-300">{record.employee?.Nic_Passport || "-"}</td>
                                        <td className="px-2 py-2 whitespace-nowrap overflow-hidden text-ellipsis border border-gray-300">{record.employee?.Firstname + " " + record.employee?.Surname || "-"}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.employee?.Initials || "-"}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.employee?.EmpNo || "-"}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.employee?.EpfNo || "-"}</td>


                                        {/* Payroll Table Fields */}
                                        <td className="px-2 py-2 border border-gray-300">{record.id || "-"}</td>
                                        <td className="px-2 py-2 border border-gray-300 whitespace-nowrap"  > {record.payroll_date.split('T')[0]}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.work_days || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.per_day_salary || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{totalbasic}</td>

                                        <td className="px-2 py-2 border border-gray-300">{record.sundays || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.sunday_rate || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{sundaypayepf}</td>
                                        <td className="px-2 py-2 border border-gray-300">{sundayLLpay}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.stat_days || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.stat_rate || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{statpay}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.poya_days || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.poya_rate || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{poyapay}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.night_shifts || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.night_shift_rate || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{nightpay}</td>
                                        <td className="px-2 py-2 border border-gray-300">{earningForEPF}</td>
                                        <td className="px-2 py-2 border border-gray-300">{earningForEPF * 8 / 100}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.normal_ot || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.normal_ot_rate || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.normal_ot_rate * record.per_day_salary / 8}</td>
                                        <td className="px-2 py-2 border border-gray-300">{normalOTAmount}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.double_ot || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.double_ot_rate || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.double_ot_rate / 8 * record.per_day_salary}</td>
                                        <td className="px-2 py-2 border border-gray-300">{doubleOTAmount}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.triple_ot || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.triple_ot_rate || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.triple_ot_rate / 8 * record.per_day_salary}</td>
                                        <td className="px-2 py-2 border border-gray-300">{tripleOTAmount}</td>
                                        <td className="px-2 py-2 border border-gray-300">{tripleOTAmount + doubleOTAmount + normalOTAmount}</td>
                                        <td className="px-2 py-2 border border-gray-300">{tripleOTAmount + doubleOTAmount + normalOTAmount + earningForEPF}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.advance || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.festival_advance || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{record.loan_amount || 0}</td>
                                        <td className="px-2 py-2 border border-gray-300">{tripleOTAmount + doubleOTAmount + normalOTAmount + earningForEPF - epfeightpercent - record.advance - record.festival_advance - record.loan_amount}</td>
                                        <td className="px-2 py-2 border border-gray-300">{epftwelvepercent}</td>
                                        <td className="px-2 py-2 border border-gray-300">{etfthreepercent}</td>
                                        <td className="px-2 py-2 border border-gray-300">{epfeightpercent + epftwelvepercent}</td>
                                        {/* Action Icons */}
                                        <td className="px-2 py-2 border border-gray-300">
                                            <div className="flex">
                                                <button
                                                    onClick={async () => {
                                                        setfulledit(false)
                                                        resetPayrollFields();
                                                        await payrateset();
                                                        handleviewascol(record)
                                                    }}
                                                    className="text-green-500 hover:text-green-700 mr-4"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        setfulledit(false)
                                                        resetPayrollFields();
                                                        await payrateset();
                                                        handleEdit(record)
                                                    }}
                                                    className="text-blue-500 hover:text-blue-700 mr-4"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(record.id)}
                                                    className="text-red-500 hover:text-red-700 mr-4"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>


                                            </div>

                                        </td>
                                    </tr>
                                );


                            })}
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
