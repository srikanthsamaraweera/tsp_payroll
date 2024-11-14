"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(
                    `/api/viewemployees?page=${currentPage}&itemsPerPage=${itemsPerPage}`
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
    }, [currentPage, itemsPerPage]);

    const handleEdit = (id) => {
        console.log("Edit employee:", id);
    };

    const handleDelete = (id) => {
        console.log("Delete employee:", id);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Employee List</h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

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

                        {/* Edit and Delete Icons */}
                        <div className="absolute top-4 right-4 flex space-x-3">
                            <button onClick={() => handleEdit(employee.id)} aria-label="Edit">
                                <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-700" />
                            </button>
                            <button onClick={() => handleDelete(employee.id)} aria-label="Delete">
                                <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-700" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
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
        </div>
    );
}
