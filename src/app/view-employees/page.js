"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";

export default function EmployeeList() {
    // Retrieve session data
    const { data: session } = useSession();
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const itemsPerPage = 6;

    // Debugging log to ensure session data is valid
    console.log("Session data on frontend:", session);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(
                    `/api/viewemployees?page=${currentPage}&itemsPerPage=${itemsPerPage}&search=${encodeURIComponent(
                        searchTerm
                    )}`
                );
                if (!response.ok) throw new Error("Failed to fetch employees");

                const data = await response.json();
                setEmployees(data.employees);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error("Error fetching employees:", err);
                setError("Could not load employee data. Please try again later.");
            }
        };

        fetchEmployees();
    }, [currentPage, itemsPerPage, searchTerm]);

    const handleEdit = (employee) => {
        if (session?.user?.account_type === "admin") {
            setEditEmployee(employee);
            setEditModalOpen(true);
        } else {
            alert("Only admins can edit records.");
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch("/api/editemployee", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editEmployee),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update employee");
            }

            setSuccessMessage("Employee updated successfully!");
            setEditModalOpen(false);
            setEmployees((prevEmployees) =>
                prevEmployees.map((emp) =>
                    emp.id === editEmployee.id ? { ...editEmployee } : emp
                )
            );

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearchTerm(search);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Employee List</h2>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex justify-center mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employees..."
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                    Search
                </button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                    <div key={employee.id} className="bg-white rounded-lg shadow-md p-6 relative">
                        <h3 className="text-xl font-semibold mb-2">
                            {employee.Firstname} {employee.Surname}
                        </h3>
                        <p><strong>Initials:</strong> {employee.Initials}</p>
                        <p><strong>Employee Number:</strong> {employee.EmpNo}</p>
                        <p><strong>EPF Number:</strong> {employee.EpfNo}</p>
                        <p><strong>NIC/Passport:</strong> {employee.Nic_Passport}</p>

                        <div className="absolute top-4 right-4 flex space-x-3">
                            <button onClick={() => handleEdit(employee)} aria-label="Edit">
                                <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-700" />
                            </button>
                            <button onClick={() => handleDelete(employee.id)} aria-label="Delete">
                                <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-700" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-lg font-medium">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {editModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-lg max-w-lg w-full relative">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-semibold mb-6 text-center">Edit Employee</h3>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        {session?.user?.account_type === "admin" ? (
                            <>
                                <input
                                    type="text"
                                    value={editEmployee.Surname}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, Surname: e.target.value })}
                                    placeholder="Surname"
                                    className="w-full mb-3 p-3 border rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editEmployee.Firstname}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, Firstname: e.target.value })}
                                    placeholder="Firstname"
                                    className="w-full mb-3 p-3 border rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editEmployee.Initials}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, Initials: e.target.value })}
                                    placeholder="Initials"
                                    className="w-full mb-3 p-3 border rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editEmployee.EmpNo}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, EmpNo: e.target.value })}
                                    placeholder="Employee Number"
                                    className="w-full mb-3 p-3 border rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editEmployee.EpfNo}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, EpfNo: e.target.value })}
                                    placeholder="EPF Number"
                                    className="w-full mb-3 p-3 border rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editEmployee.Nic_Passport}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, Nic_Passport: e.target.value })}
                                    placeholder="NIC/Passport"
                                    className="w-full mb-3 p-3 border rounded-md"
                                />
                                <button
                                    onClick={handleSave}
                                    className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <p className="text-red-500 text-center">Only admins can edit records.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
