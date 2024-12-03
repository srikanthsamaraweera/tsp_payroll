"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faEye, faSearchPlus, faRefresh, faSearchMinus, faDollar, faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PayrollToCSV from "@/functions/pdfgen/payrolltable1";
import AddPayrollModal from "@/components/payroll/addpayrecord";
import EditPayrollModal from "@/components/payroll/editpayrecord";
import PayrollFilter from "@/components/payroll/payrollfilter";
import DeleteModal from "@/components/payroll/deletemodal";
import ViewPayModal from "@/components/payroll/viewpayrecord";

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
    const [bra2005, setbra2005] = useState("");
    const [bra2016, setbra2016] = useState("");
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
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [selectededrow, setselectedrow] = useState('');

    const [fulledit, setfulledit] = useState(false);
    const [viewascol, setviewascol] = useState(false)

    const [searchingemployeemessage, setsearchingemployeemessage] = useState('');
    const { data: session, status } = useSession();
    const [showsearchdrawer, setshowsearchdrawer] = useState(false)



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
        const bra2005val = await fetchPayRates(1)
        const bra2016val = await fetchPayRates(4)
        const statallowanceval = await fetchPayRates(3)
        const poyaallowanceval = await fetchPayRates(5)
        const poyarate = await fetchPayRates(14)
        const normalotrateval = await fetchPayRates(6)
        const normalotallowanceval = await fetchPayRates(7)
        const doubleotrateval = await fetchPayRates(8)
        const doubleotallowanceval = await fetchPayRates(9)
        const tripleotrateval = await fetchPayRates(10)
        const tripleotallowanceval = await fetchPayRates(11)
        const sundayallowance = await fetchPayRates(12)
        const sundayrate = await fetchPayRates(13)

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
        setsundayrate(sundayrate)
        setpoyarate(poyarate)

        setPayrollFields((prev) => ({
            ...prev,
            per_day_salary: ratesetval,
            bra_2005: bra2005val,
            bra_2016: bra2016val,
            sunday_allowance: sundayallowance,
            sunday_rate: sundayrate,
            stat_allowance: statallowanceval,
            poya_rate: poyarate,
            poya_allowance: poyaallowanceval,
            normal_ot_rate: normalotrateval,
            normal_ot_allowance: normalotallowanceval,
            double_ot_rate: doubleotrateval,
            double_ot_allowance: doubleotallowanceval,
            triple_ot_rate: tripleotrateval,
            triple_ot_allowance: tripleotallowanceval,
        }));

        seteditPayrollFields((prev) => ({
            ...prev,
            per_day_salary: ratesetval,
            bra_2005: bra2005val,
            bra_2016: bra2016val,
            sunday_allowance: sundayallowance,
            sunday_rate: sundayrate,
            stat_allowance: statallowanceval,
            poya_rate: poyarate,
            poya_allowance: poyaallowanceval,
            normal_ot_rate: normalotrateval,
            normal_ot_allowance: normalotallowanceval,
            double_ot_rate: doubleotrateval,
            double_ot_allowance: doubleotallowanceval,
            triple_ot_rate: tripleotrateval,
            triple_ot_allowance: tripleotallowanceval,
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
        bra_2005: "",
        bra_2016: "",
        sunday_allowance: "",
        sunday_rate: "",
        stat_allowance: "",
        poya_rate: "",
        poya_allowance: "",
        normal_ot_rate: "",
        normal_ot_allowance: "",
        double_ot_rate: "",
        double_ot_allowance: "",
        triple_ot_rate: "",
        triple_ot_allowance: "",


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
        bra_2005: "",
        bra_2016: "",
        sunday_allowance: "",
        sunday_rate: "",
        stat_allowance: "",
        poya_rate: "",
        poya_allowance: "",
        normal_ot_rate: "",
        normal_ot_allowance: "",
        double_ot_rate: "",
        double_ot_allowance: "",
        triple_ot_rate: "",
        triple_ot_allowance: "",


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
    };

    const handleEditPayroll = async () => {
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
        const randomNum = Math.floor(1000000 + Math.random() * 9000000); // Generate random number
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
                        <FontAwesomeIcon icon={faDollar} className="mr-2" />
                        Payslip
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
                // <div>
                //     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                //         <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
                //             {/* Close Button */}
                //             <button
                //                 onClick={() => {

                //                     setviewascol(false)
                //                 }}
                //                 className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                //             >
                //                 <FontAwesomeIcon icon={faTimes} />
                //             </button>
                //             <h3 className="text-xl font-semibold mb-4">View Record</h3>
                //             <div className="mb-4 p-4 bg-blue-100 rounded-lg">
                //                 <p className="text-gray-800">
                //                     <strong>Selected Employee:</strong>{editRecord.employee?.id}{" "} {editRecord.employee?.Firstname}{" "}
                //                     {editRecord.employee?.Surname} (NIC: {editRecord.employee?.Nic_Passport},
                //                     EmpNo: {editRecord.employee?.EmpNo}, EPFNo: {editRecord.employee?.EpfNo})
                //                 </p>
                //             </div>

                //             {/* Selected Employee */}




                //             {/* Payroll Fields */}
                //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
                //                 <div className="form-group">
                //                     <label htmlFor="employee_id" className="block text-gray-700 font-medium mb-2">
                //                         Record ID
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="record_id"
                //                         name="record_id"
                //                         value={editRecord.id}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="employee_id" className="block text-gray-700 font-medium mb-2">
                //                         Employee ID
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="employee_id"
                //                         name="employee_id"
                //                         value={editRecord.employee.id}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="payroll_date" className="block text-gray-700 font-medium mb-2">
                //                         Payroll Date
                //                     </label>
                //                     <input
                //                         type="date"
                //                         id="payroll_date"
                //                         name="payroll_date"
                //                         value={FormatDate(editRecord.payroll_date)}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         readOnly
                //                     />
                //                 </div>

                //                 <div className="form-group">
                //                     <label htmlFor="work_days" className="block text-gray-700 font-medium mb-2">
                //                         Work Days
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="work_days"
                //                         name="work_days"
                //                         value={editRecord.work_days || ""}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="per_day_salary" className="block text-gray-700 font-medium mb-2">
                //                         Per Day Salary - Code 2
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="per_day_salary"
                //                         name="per_day_salary"
                //                         value={dayrate}

                //                         className={`w-full px-4 py-2 border rounded-lg bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="bra_2005" className="block text-gray-700 font-medium mb-2">
                //                         BRA 2005-Code 1
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="bra_2005"
                //                         name="bra_2005"
                //                         value={bra2005}

                //                         className={`w-full px-4 py-2 border rounded-lg bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="bra_2016" className="block text-gray-700 font-medium mb-2">
                //                         BRA 2016-Code 4
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="bra_2016"
                //                         name="bra_2016"
                //                         value={bra2016}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>

                //                 <div className="form-group">
                //                     <label htmlFor="sundays" className="block text-gray-700 font-medium mb-2">
                //                         Sundays
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="sundays"
                //                         name="sundays"
                //                         value={editRecord.sundays}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="sunday_allowance" className="block text-gray-700 font-medium mb-2">
                //                         Sunday Allowance-Code 12
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="sunday_allowance"
                //                         name="sunday_allowance"
                //                         value={sundayallowance}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>

                //                 <div className="form-group">
                //                     <label htmlFor="stat_days" className="block text-gray-700 font-medium mb-2">
                //                         Stat Days
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="stat_days"
                //                         name="stat_days"
                //                         value={editRecord.stat_days}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="stat_allowance" className="block text-gray-700 font-medium mb-2">
                //                         Stat Allowance-Code 3
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="stat_allowance"
                //                         name="stat_allowance"
                //                         value={statallowance}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group"></div>
                //                 <div className="form-group">
                //                     <label htmlFor="poya_days" className="block text-gray-700 font-medium mb-2">
                //                         Poya Days
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="poya_days"
                //                         name="poya_days"
                //                         value={editRecord.poya_days}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="poya_allowance" className="block text-gray-700 font-medium mb-2">
                //                         Poya Allowance-Code 5
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="poya_allowance"
                //                         name="poya_allowance"
                //                         value={poyaallowance}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>

                //                 <div className="form-group">
                //                     <label htmlFor="night_shifts" className="block text-gray-700 font-medium mb-2">
                //                         Night Shifts
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="night_shifts"
                //                         name="night_shifts"
                //                         value={editRecord.night_shifts}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>

                //                 <div className="form-group">
                //                     <label htmlFor="normal_ot" className="block text-gray-700 font-medium mb-2">
                //                         Normal OT
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="normal_ot"
                //                         name="normal_ot"
                //                         value={editRecord.normal_ot}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="normal_ot_rate" className="block text-gray-700 font-medium mb-2">
                //                         Normal OT Rate-Code 6
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="normal_ot_rate"
                //                         name="normal_ot_rate"
                //                         value={normalotrate}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="normal_ot_allowance" className="block text-gray-700 font-medium mb-2">
                //                         Normal OT Allowance-Code 7
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="normal_ot_allowance"
                //                         name="normal_ot_allowance"
                //                         value={normalotallowance}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>

                //                 <div className="form-group">
                //                     <label htmlFor="double_ot" className="block text-gray-700 font-medium mb-2">
                //                         Double OT
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="double_ot"
                //                         name="double_ot"
                //                         value={editRecord.double_ot}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="double_ot_rate" className="block text-gray-700 font-medium mb-2">
                //                         Double OT Rate-Code 8
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="double_ot_rate"
                //                         name="double_ot_rate"
                //                         value={doubleotrate}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="double_ot_allowance" className="block text-gray-700 font-medium mb-2">
                //                         Double OT Allowance-Code 9
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="double_ot_allowance"
                //                         name="double_ot_allowance"
                //                         value={doubleotallowance}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>

                //                 <div className="form-group">
                //                     <label htmlFor="triple_ot" className="block text-gray-700 font-medium mb-2">
                //                         Triple OT
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="triple_ot"
                //                         name="triple_ot"
                //                         value={editRecord.triple_ot}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="triple_ot_rate" className="block text-gray-700 font-medium mb-2">
                //                         Triple OT Rate-Code 10
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="triple_ot_rate"
                //                         name="triple_ot_rate"
                //                         value={tripleotrate}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="triple_ot_allowance" className="block text-gray-700 font-medium mb-2">
                //                         Triple OT Allowance-Code 11
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="triple_ot_allowance"
                //                         name="triple_ot_allowance"
                //                         value={tripleotallowance}

                //                         className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                //                         readOnly
                //                     />
                //                 </div>

                //                 <div className="form-group">
                //                     <label htmlFor="advance" className="block text-gray-700 font-medium mb-2">
                //                         Advance
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="advance"
                //                         name="advance"
                //                         value={editRecord.advance || 0}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="festival_advance" className="block text-gray-700 font-medium mb-2">
                //                         Festival Advance
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="festival_advance"
                //                         name="festival_advance"
                //                         value={editRecord.festival_advance || 0}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //                 <div className="form-group">
                //                     <label htmlFor="loan_amount" className="block text-gray-700 font-medium mb-2">
                //                         Loan Amount
                //                     </label>
                //                     <input
                //                         type="number"
                //                         id="loan_amount"
                //                         name="loan_amount"
                //                         value={editRecord.loan_amount || 0}

                //                         className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                //                         onWheel={preventScroll}
                //                         readOnly
                //                     />
                //                 </div>
                //             </div>



                //         </div>
                //     </div>
                // </div>

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
                    <table className="w-full table-auto bg-white">
                        <thead className="bg-gray-200 text-gray-600 sticky top-0 z-10">
                            <tr>
                                {/* Employee Table Fields */}
                                <th className="px-4 py-2   ">First Name</th>
                                <th className="px-4 py-2  ">Last Name</th>
                                <th className="px-4 py-2  ">Initials</th>
                                <th className="px-4 py-2  ">Employee No</th>
                                <th className="px-4 py-2  ">EPF No</th>
                                <th className="px-4 py-2  ">NIC/Passport</th>

                                {/* Payroll Table Fields */}
                                <th className="px-4 py-2  ">Payroll id</th>
                                <th className="px-4 py-2  ">Payroll Date</th>
                                <th className="px-4 py-2  ">Work Days</th>
                                <th className="px-4 py-2  ">Per Day Salary</th>
                                <th className="px-4 py-2  ">BRA 2005</th>
                                <th className="px-4 py-2  ">BRA 2016</th>
                                <th className="px-4 py-2  ">Sundays</th>
                                <th className="px-4 py-2  ">Sunday Rate</th>
                                <th className="px-4 py-2  ">Sunday Allowance</th>
                                <th className="px-4 py-2  ">Stat Days</th>
                                <th className="px-4 py-2  ">Stat Allowance</th>
                                <th className="px-4 py-2  ">Poya Days</th>
                                <th className="px-4 py-2  ">Poya Rate</th>
                                <th className="px-4 py-2  ">Poya Allowance</th>
                                <th className="px-4 py-2  ">Night Shifts</th>
                                <th className="px-4 py-2  ">Normal OT</th>
                                <th className="px-4 py-2  ">Normal OT Rate</th>
                                <th className="px-4 py-2 ">Normal OT Allowance</th>
                                <th className="px-4 py-2  ">Double OT</th>
                                <th className="px-4 py-2  ">Double OT Rate</th>
                                <th className="px-4 py-2 ">Double OT Allowance</th>
                                <th className="px-4 py-2  ">Triple OT</th>
                                <th className="px-4 py-2  ">Triple OT Rate</th>
                                <th className="px-4 py-2  ">Triple OT Allowance</th>
                                <th className="px-4 py-2  ">Advance</th>
                                <th className="px-4 py-2  ">Festival Advance</th>
                                <th className="px-4 py-2 ">Loan Amount</th>
                                <th className="px-4 py-2  "></th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrollData.map((record) => (
                                <tr key={record.id} onDoubleClick={() => handleviewascol(record)} className={`text-center focus:bg-slate-100 cursor-pointer ${selectededrow === record.id ? 'bg-slate-200' : ""}`}
                                    onClick={() => setselectedrow(record.id)}>
                                    {/* Employee Table Fields */}
                                    <td className="px-4 py-2">{record.employee?.Firstname || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.Surname || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.Initials || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.EmpNo || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.EpfNo || "-"}</td>
                                    <td className="px-4 py-2">{record.employee?.Nic_Passport || "-"}</td>

                                    {/* Payroll Table Fields */}
                                    <td className="px-4 py-2">{record.id || "-"}</td>
                                    <td className="px-4 py-2 whitespace-nowrap"  > {record.payroll_date.split('T')[0]}</td>
                                    <td className="px-4 py-2">{record.work_days || 0}</td>
                                    <td className="px-4 py-2">{record.per_day_salary || 0}</td>
                                    <td className="px-4 py-2">{record.bra_2005 || 0}</td>
                                    <td className="px-4 py-2">{record.bra_2016 || 0}</td>
                                    <td className="px-4 py-2">{record.sundays || 0}</td>
                                    <td className="px-4 py-2">{record.sunday_rate || 0}</td>
                                    <td className="px-4 py-2">{record.sunday_allowance || 0}</td>
                                    <td className="px-4 py-2">{record.stat_days || 0}</td>
                                    <td className="px-4 py-2">{record.stat_allowance || 0}</td>
                                    <td className="px-4 py-2">{record.poya_days || 0}</td>
                                    <td className="px-4 py-2">{record.poya_rate || 0}</td>
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
                                    {/* Action Icons */}
                                    <td className="px-4 py-2">
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
