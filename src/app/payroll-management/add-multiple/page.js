"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";

export default function PayRollForm() {
    const { data: session } = useSession();
    const router = useRouter()

    const [perdayrate, setperdayrate] = useState(0);
    const [sundayrate, setsundayrate] = useState(0);
    const [statrate, setstatrate] = useState(0)
    const [poyarate, setpoyarate] = useState(0)
    const [nightrate, setnightrate] = useState(0)
    const [normalotrate, setnormalotrate] = useState(0)
    const [doubleotrate, setdoubleotrate] = useState(0)
    const [tripleotrate, settripleotrate] = useState(0)
    const [loadingrates, setloadingrates] = useState("")
    const [saving, setsaving] = useState(null)



    const today = new Date();
    const defaultDate = new Date(today.getFullYear(), today.getMonth(), 10).toISOString().split("T")[0]; // 10th of the current month




    // UseEffect to fetch the initial dayrate
    useEffect(() => {
        const fetchInitialDayRate = async () => {
            setloadingrates("Loading rates...")
            const perdayrate = await fetchPayRates(2); // Replace 2 with the desired paycode
            const sundayrate = await fetchPayRates(13); // Replace 2 with the desired paycode
            const statrate = await fetchPayRates(16); // Replace 2 with the desired paycode
            const poyarate = await fetchPayRates(14); // Replace 2 with the desired paycode
            const nightrate = await fetchPayRates(15); // Replace 2 with the desired paycode
            const normalotrate = await fetchPayRates(6); // Replace 2 with the desired paycode
            const doubleotrate = await fetchPayRates(8); // Replace 2 with the desired paycode
            const tripleotrate = await fetchPayRates(10);


            // console.log("Per day rate: ", perdayrate)
            setperdayrate(perdayrate);
            setsundayrate(sundayrate);
            setstatrate(statrate);
            setpoyarate(poyarate);
            setnightrate(nightrate)
            setnormalotrate(normalotrate)
            setdoubleotrate(doubleotrate)
            settripleotrate(tripleotrate)

            setloadingrates("")

        };

        fetchInitialDayRate();
    }, []);

    useEffect(() => {
        setRows((prevRows) =>
            prevRows.map((row) => ({
                ...row,
                per_day_salary: perdayrate,
                sunday_rate: sundayrate,
                statrate: statrate,
                poyarate: poyarate,
                nightrate: nightrate,
                normalotrate: normalotrate,
                doubleotrate: doubleotrate,
                tripleotrate: tripleotrate,
            }))
        );
    }, [perdayrate, sundayrate, statrate, poyarate, nightrate, normalotrate, doubleotrate, tripleotrate]);

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



    const [rows, setRows] = useState([
        {
            id: 1,
            employee: "",
            emp_id: "",
            payroll_date: defaultDate,
            work_days: 0,
            per_day_salary: perdayrate || 0,
            suggestions: [],
            sundays: 0,
            sunday_rate: sundayrate || 0,
            statdays: 0,
            statrate: statrate,
            poyadays: 0,
            poyarate: poyarate,
            nightdays: 0,
            nightrate: nightrate,
            normalot: 0,
            normalotrate: normalotrate,
            doubleot: 0,
            doubleotrate: doubleotrate,
            tripleot: 0,
            tripleotrate: tripleotrate,
            advance: 0,
            festivaladvance: 0,
            loan: 0,
        },
    ]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Add a new row with default values
    const handleAddRow = () => {
        setSuccess("")
        setError("")
        setRows((prevRows) => [
            ...prevRows,
            {
                id: prevRows.length + 1,
                employee: "",
                emp_id: "",
                payroll_date: defaultDate,
                work_days: 0,
                per_day_salary: perdayrate,
                suggestions: [],
                sundays: 0,
                sunday_rate: sundayrate,
                statdays: 0,
                statrate: statrate,
                poyadays: 0,
                poyarate: poyarate,
                nightdays: 0,
                nightrate: nightrate,
                normalot: 0,
                normalotrate: normalotrate,
                doubleot: 0,
                doubleotrate: doubleotrate,
                tripleot: 0,
                tripleotrate: tripleotrate,
                advance: 0,
                festivaladvance: 0,
                loan: 0,
            },
        ]);
    };

    // Remove a row by ID
    const handleRemoveRow = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    // Update the value of a specific field for a row
    const handleInputChange = (id, field, value) => {
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
        );
    };



    const [searchingemployee, setsearchemployee] = useState(null)
    // Fetch employee suggestions based on search input
    const handleSearchChange = async (id, value) => {
        setsearchemployee("Searching...")
        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.id === id) {
                    return { ...row, employee: value };
                }
                return row;
            })
        );

        try {
            if (value.trim() !== "") {
                const response = await fetch(`/api/payroll/employee-search?q=${value}`);
                const data = await response.json();
                setRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === id ? { ...row, suggestions: data } : row
                    )
                );
            } else {
                setRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === id ? { ...row, suggestions: [] } : row
                    )
                );
            }
        } catch (err) {
            console.error("Error fetching employee suggestions:", err);
        }
        setsearchemployee(null)
    };

    // Save the payroll records
    const handleSave = async () => {
        setSuccess("");
        setError("");
        setsaving("Saving...")

        try {
            const response = await fetch("/api/payroll/addmany", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ payrollData: rows.map(({ suggestions, ...rest }) => rest) }), // Exclude suggestions from the save
            });

            if (response.ok) {
                setSuccess("Payroll records added successfully!");
                setRows([
                    //{ id: 1, employee: "", emp_id: "", payroll_date: defaultDate, work_days: 0, per_day_salary: perdayrate, statdays: 0, statrate: statrate, suggestions: [] },
                ]);
            } else {
                const data = await response.json();
                setError(data.error || "Failed to save payroll records. Please try again.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An unexpected error occurred. Please try again.");
        }
        setsaving(null)
    };


    if (!session || !["admin", "manager"].includes(session.user.account_type)) {
        return <p className="text-red-500 font-bold">Only admins or managers can enter payroll data.</p>;
    }
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <div className="grid grid-cols-3">
                <div><button
                    onClick={() => {
                        router.push('/payroll-management')
                    }}
                    className="mt-6 px-2 py-1 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faBackspace} className="mr-2" />
                    Back
                </button>
                </div>
                <div><h2 className="text-2xl font-bold text-center mt-6 mb-6">Add Payroll Records</h2>
                    {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}</div>
                <div></div>

            </div>


            <div className="w-full bg-white p-1 rounded-lg shadow-md">
                {loadingrates === "" ? rows.map((row) => (
                    <div key={row.id} className="flex gap-2 mb-4  flex-wrap border-b border-black pb-2">
                        {/* Employee Search */}
                        <div className="relative">
                            <label htmlFor={`employee-search-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Search Employee
                            </label>
                            <input
                                id={`employee-search-${row.id}`}
                                autoComplete="off"
                                type="text"
                                placeholder="Search Employee"
                                value={row.employee}
                                onChange={(e) => handleSearchChange(row.id, e.target.value)}
                                className="text-xs  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {searchingemployee !== null ? <p>Searching...</p> : ""}
                            {row.suggestions.length > 0 && (
                                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto w-full">
                                    {row.suggestions.map((emp) => (
                                        <li
                                            key={emp.id}
                                            onClick={() => {
                                                handleInputChange(row.id, "employee", `${emp.Surname} ${emp.Firstname}`);
                                                handleInputChange(row.id, "emp_id", emp.id);
                                                setRows((prevRows) =>
                                                    prevRows.map((r) =>
                                                        r.id === row.id ? { ...r, suggestions: [] } : r
                                                    )
                                                );
                                            }}
                                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                        >
                                            {`${emp.Surname} ${emp.Firstname} (${emp.EmpNo})`}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Employee ID */}
                        <div>
                            <label htmlFor={`employee-id-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                ID
                            </label>
                            <input
                                required
                                id={`employee-id-${row.id}`}
                                type="text"
                                value={row.emp_id}
                                readOnly
                                className="text-xs w-10 px-1 py-1 border border-gray-300 bg-gray-100 rounded-md focus:outline-none"
                            />
                        </div>

                        {/* Pay Date */}
                        <div>
                            <label htmlFor={`payroll-date-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Pay Date
                            </label>
                            <input
                                id={`payroll-date-${row.id}`}
                                type="date"
                                value={row.payroll_date}
                                onChange={(e) => handleInputChange(row.id, "payroll_date", e.target.value)}
                                className="text-xs w-[95px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Work Days */}
                        <div className="flex flex-col">
                            <label htmlFor={`work-days-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Work Days
                            </label>
                            <input
                                id={`work-days-${row.id}`}
                                type="number"
                                placeholder="Work Days"
                                value={row.work_days || 0}
                                onChange={(e) => handleInputChange(row.id, "work_days", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                id={`per-day-salary-${row.id}`}
                                readOnly
                                type="number"
                                placeholder="Per Day Salary"
                                value={row.per_day_salary || 0}
                                onChange={(e) => handleInputChange(row.id, "per_day_salary", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="bg-gray-300 text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* SunDays */}
                        <div className="flex flex-col">
                            <label htmlFor={`sun-days-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Sundays
                            </label>
                            <input
                                id={`sun-days-${row.id}`}
                                type="number"
                                placeholder="SunDays"
                                value={row.sundays || 0}
                                onChange={(e) => handleInputChange(row.id, "sundays", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                id={`sun-day-salary-${row.id}`}
                                readOnly
                                type="number"
                                placeholder="sun Day Salary"
                                value={row.sunday_rate || 0}
                                onChange={(e) => handleInputChange(row.id, "sun_day_salary", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="bg-gray-300 text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Stat Days */}
                        <div className="flex flex-col">
                            <label htmlFor={`stat-days-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Stat Days
                            </label>
                            <input
                                id={`stat-days-${row.id}`}
                                type="number"
                                placeholder="Stat Days"
                                value={row.statdays || 0}
                                onChange={(e) => handleInputChange(row.id, "statdays", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                id={`sun-day-salary-${row.id}`}
                                readOnly
                                type="number"
                                placeholder="Stat Rate"
                                value={row.statrate || 0}
                                onChange={(e) => handleInputChange(row.id, "statrate", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="bg-gray-300 text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Poya Days */}
                        <div className="flex flex-col">
                            <label htmlFor={`poya-days-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Poya Days
                            </label>
                            <input
                                id={`poya-days-${row.id}`}
                                type="number"
                                placeholder="Poya Days"
                                value={row.poyadays || 0}
                                onChange={(e) => handleInputChange(row.id, "poyadays", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                id={`poya-day-salary-${row.id}`}
                                readOnly
                                type="number"
                                placeholder="Poya Rate"
                                value={row.poyarate || 0}
                                onChange={(e) => handleInputChange(row.id, "poyarate", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="bg-gray-300 text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Night Shifts */}
                        <div className="flex flex-col">
                            <label htmlFor={`night-days-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Night Days
                            </label>
                            <input
                                id={`night-days-${row.id}`}
                                type="number"
                                placeholder="Night Days"
                                value={row.nightdays || 0}
                                onChange={(e) => handleInputChange(row.id, "nightdays", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                id={`poya-day-salary-${row.id}`}
                                readOnly
                                type="number"
                                placeholder="Night Rate"
                                value={row.nightrate || 0}
                                onChange={(e) => handleInputChange(row.id, "nightrate", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="bg-gray-300 text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Normal OT */}
                        <div className="flex flex-col">
                            <label htmlFor={`night-days-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Normal OT
                            </label>
                            <input
                                id={`normal-ot-${row.id}`}
                                type="number"
                                placeholder="Normal OT"
                                value={row.normalot || 0}
                                onChange={(e) => handleInputChange(row.id, "normalot", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                id={`normal-ot-rate-${row.id}`}
                                readOnly
                                type="number"
                                placeholder="Normal OT Rate"
                                value={row.normalotrate || 0}
                                onChange={(e) => handleInputChange(row.id, "normalotrate", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="bg-gray-300 text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Double OT */}
                        <div className="flex flex-col">
                            <label htmlFor={`double-ot-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Double OT
                            </label>
                            <input
                                id={`double-ot-${row.id}`}
                                type="number"
                                placeholder="Double OT"
                                value={row.doubleot || 0}
                                onChange={(e) => handleInputChange(row.id, "doubleot", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                id={`double-ot-rate-${row.id}`}
                                readOnly
                                type="number"
                                placeholder="Double OT Rate"
                                value={row.doubleotrate || 0}
                                onChange={(e) => handleInputChange(row.id, "doubleotrate", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="bg-gray-300 text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Triple OT */}
                        <div className="flex flex-col">
                            <label htmlFor={`triple-ot-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Triple OT
                            </label>
                            <input
                                id={`triple-ot-${row.id}`}
                                type="number"
                                placeholder="Triple OT"
                                value={row.tripleot || 0}
                                onChange={(e) => handleInputChange(row.id, "tripleot", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                id={`triple-ot-rate-${row.id}`}
                                readOnly
                                type="number"
                                placeholder="Triple OT Rate"
                                value={row.tripleotrate || 0}
                                onChange={(e) => handleInputChange(row.id, "tripleotrate", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="bg-gray-300 text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Advance */}
                        <div className="flex flex-col">
                            <label htmlFor={`advance-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Advance
                            </label>
                            <input
                                id={`advance-${row.id}`}
                                type="number"
                                placeholder="advance"
                                value={row.advance || 0}
                                onChange={(e) => handleInputChange(row.id, "advance", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>
                        {/* Festival Advance */}
                        <div className="flex flex-col">
                            <label htmlFor={`festivaladvance-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Festival Advance
                            </label>
                            <input
                                id={`festivaladvance-${row.id}`}
                                type="number"
                                placeholder="festival advance"
                                value={row.festivaladvance || 0}
                                onChange={(e) => handleInputChange(row.id, "festivaladvance", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[70px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* Loan */}
                        <div className="flex flex-col">
                            <label htmlFor={`loan-${row.id}`} className=" text-xs block text-gray-700 font-medium mb-1">
                                Loan
                            </label>
                            <input
                                id={`loan-${row.id}`}
                                type="number"
                                placeholder="Loan"
                                value={row.loan || 0}
                                onChange={(e) => handleInputChange(row.id, "loan", e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                className="text-xs w-[60px]  px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* Remove Row */}
                        <div className="flex justify-center items-end">
                            <button
                                type="button"
                                onClick={() => handleRemoveRow(row.id)}
                                className="text-xs bg-red-500 text-white rounded-md hover:bg-red-600 p-1"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                )
                ) : <p>Loading...</p>}

                {/* Add Row */}

                {loadingrates === "" ?
                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="text-xs mb-4 px-1 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        + Add Row
                    </button> : ""}

                {/* Save Rows */}
                {
                    rows.length === 0 || loadingrates !== "" || saving !== null ?
                        saving !== null ? <p>Saving...</p> : ""
                        :
                        <button

                            type="button"
                            onClick={handleSave}
                            className="text-xs w-full bg-green-500 text-white py-1 rounded-md hover:bg-green-600"
                        >
                            Save
                        </button>
                }
                {/* <button

                    type="button"
                    onClick={handleSave}
                    className="text-xs w-full bg-green-500 text-white py-1 rounded-md hover:bg-green-600"
                >
                    Save
                </button> */}
            </div>
        </div>
    );
}
