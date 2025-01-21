// app/employee/page.js
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeForm() {
    const { data: session, status } = useSession();
    const [surname, setSurname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [initials, setInitials] = useState("");
    const [empNo, setEmpNo] = useState("");
    const [epfNo, setEpfNo] = useState("");
    const [nicPassport, setNicPassport] = useState("");
    const [emplocation, setEmplocation] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    // If session is loading, show a loading message
    if (status === "loading") {
        return <p>Loading...</p>;
    }

    // Restrict access to admin users only
    if (session?.user?.account_type !== "admin") {
        return <p className="text-red-500 font-bold">Only admins have access to this feature.</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ surname, firstname, initials, empNo, epfNo, nicPassport, emplocation }),
            });

            if (response.ok) {
                setSuccess("Employee added successfully!");
                setSurname("");
                setFirstname("");
                setInitials("");
                setEmpNo("");
                setEpfNo("");
                setNicPassport("");
                setEmplocation("");

                setTimeout(() => setSuccess(""), 5000);
            } else {
                const data = await response.json();
                setError(data.error || "Failed to add employee. Please try again.");
                // Clear the error message after 5 seconds
                setTimeout(() => setError(""), 5000);
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Add Employee</h2>

                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label htmlFor="surname" className="block text-gray-700 font-medium mb-1">Surname</label>
                    <input
                        type="text"
                        id="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="firstname" className="block text-gray-700 font-medium mb-1">Firstname</label>
                    <input
                        type="text"
                        id="firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="initials" className="block text-gray-700 font-medium mb-1">Initials</label>
                    <input
                        type="text"
                        id="initials"
                        value={initials}
                        onChange={(e) => setInitials(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="empNo" className="block text-gray-700 font-medium mb-1">Employee Number (EmpNo)</label>
                    <input
                        type="text"
                        id="empNo"
                        value={empNo}
                        onChange={(e) => setEmpNo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="epfNo" className="block text-gray-700 font-medium mb-1">EPF Number (EpfNo)</label>
                    <input
                        type="text"
                        id="epfNo"
                        value={epfNo}
                        onChange={(e) => setEpfNo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="nicPassport" className="block text-gray-700 font-medium mb-1">NIC/Passport</label>
                    <input
                        type="text"
                        id="nicPassport"
                        value={nicPassport}
                        onChange={(e) => setNicPassport(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="emplocation" className="block text-gray-700 font-medium mb-1">Location</label>
                    <input
                        type="text"
                        id="emplocation"
                        value={emplocation}
                        onChange={(e) => setEmplocation(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                    />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Add Employee
                </button>
            </form>
        </div>
    );
}
