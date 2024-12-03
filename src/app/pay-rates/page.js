"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faPlus, faSyncAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { generateRandomNumber } from "@/functions/randomno";

export default function PayRates() {
    const { data: session, status } = useSession();
    const [payRates, setPayRates] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [modal, setModal] = useState({ type: "", data: null, isOpen: false });
    const [randomNumber, setRandomNumber] = useState(null);
    const [inputNumber, setInputNumber] = useState("");
    const [loading, setLoading] = useState("");
    const itemsPerPage = 10;
    const router = useRouter();



    // Authentication Check
    // useEffect(() => {
    //     if (status === "loading") {
    //         return <p>Loading...</p>;
    //     }
    //     if (!session || session.user.account_type !== "admin") {
    //         return <p className="text-red-500 font-bold">Only admins have access to this feature.</p>;

    //     }
    // }, [session, status, router]);

    // Fetch Pay Rates
    const fetchPayRates = async () => {
        setLoading('Loading Data...')
        try {
            const response = await fetch(
                `/api/pay_rates?page=${currentPage}&itemsPerPage=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}`
            );
            if (!response.ok) throw new Error("Failed to fetch pay rates.");

            const data = await response.json();
            setPayRates(data.data);
            setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
        } catch (err) {
            console.error("Error fetching pay rates:", err);
            setError("Could not load pay rates. Please try again later.");
        }
        setLoading('')
    };

    useEffect(() => {
        fetchPayRates();
    }, [currentPage, searchTerm]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }
    if (!session || session.user.account_type !== "admin") {
        return <p className="text-red-500 font-bold">Only admins have access to this feature.</p>;

    }

    // Add/Edit/Delete Handlers
    const handleAddEdit = async (data) => {
        const isEdit = modal.type === "edit";
        const endpoint = isEdit ? `/api/pay_rates/${data.id}` : "/api/pay_rates";
        const method = isEdit ? "PUT" : "POST";

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error(await response.text());

            setSuccessMessage(isEdit ? "Pay rate updated successfully!" : "Pay rate added successfully!");
            setModal({ type: "", data: null, isOpen: false });
            fetchPayRates(); // Refresh the table after successful action
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        }
    };

    const handleDelete = async () => {
        setLoading('Trying to Delete...')
        if (parseInt(inputNumber) !== randomNumber) {
            setError("Confirmation number does not match.");
            setLoading('')
            return;
        }

        try {
            const response = await fetch(`/api/pay_rates/${modal.data.id}`, { method: "DELETE" });
            if (!response.ok) {

                throw new Error("Failed to delete pay rate.")
            };


            setSuccessMessage("Pay rate deleted successfully!");
            setModal({ type: "", data: null, isOpen: false });
            fetchPayRates(); // Refresh the table after successful deletion
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        }
        setLoading('')
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Pay Rates</h2>

            {/* Search Bar, Refresh Button, and Add Button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSearchTerm(search);
                        }}
                        className="flex"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search pay rates..."
                            className="px-4 py-2 border border-gray-300 rounded-l-md"
                        />
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-md">
                            Search
                        </button>
                    </form>
                    <button
                        onClick={fetchPayRates}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        <FontAwesomeIcon icon={faSyncAlt} /> Refresh
                    </button>
                </div>
                <button
                    onClick={() => {
                        setError('')
                        setModal({ type: "add", data: null, isOpen: true })
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    <FontAwesomeIcon icon={faPlus} /> Add Pay Rate
                </button>
            </div>

            {/* Pay Rates Table */}
            <div className="overflow-auto bg-white rounded-md shadow-md">
                {loading ? <div className="mb-4 p-4 bg-blue-100 rounded-lg"> <h1 className="text-yellow-500 text-center animate-bounce text-2xl z-10">{loading}</h1></div> : ""}
                <table className="w-full text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-4">Description</th>
                            <th className="p-4">Pay Rate</th>
                            <th className="p-4">Pay Code</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {payRates.map((rate) => (
                            <tr key={rate.id} className="border-t">
                                <td className="p-4">{rate.description}</td>
                                <td className="p-4">LKR {rate.pay_rate.toFixed(2)}</td>
                                <td className="p-4">{rate.pay_code}</td>
                                <td className="p-4 flex space-x-4">
                                    <button onClick={() => {
                                        setError('')
                                        setModal({ type: "edit", data: rate, isOpen: true })
                                    }
                                    }>
                                        <FontAwesomeIcon icon={faEdit} className="text-blue-500" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setError('')
                                            const random = generateRandomNumber();
                                            setModal({ type: "delete", data: rate, isOpen: true });
                                            setRandomNumber(random);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} className="text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading ? <div className="mb-4 p-4 bg-blue-100 rounded-lg"> <h1 className="text-yellow-500 text-center animate-bounce text-2xl z-10">{loading}</h1></div> : ""}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-300 rounded-l-md"
                >
                    Previous
                </button>
                <span className="px-4 py-2 bg-gray-200">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-gray-300 rounded-r-md"
                >
                    Next
                </button>
            </div>

            {/* Modals */}
            {modal.isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative">
                        <button
                            onClick={() => setModal({ type: "", data: null, isOpen: false })}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        {/* Add/Edit Modal */}
                        {(modal.type === "add" || modal.type === "edit") && (
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setLoading('Talking to server...')
                                    await handleAddEdit({
                                        id: modal.data?.id,
                                        description: e.target.description.value,
                                        pay_rate: parseFloat(e.target.pay_rate.value),
                                        pay_code: parseInt(e.target.pay_code.value),
                                    });
                                    setLoading('')
                                }}
                            >
                                <h3 className="text-xl font-semibold mb-4">
                                    {modal.type === "add" ? "Add Pay Rate" : "Edit Pay Rate"}
                                </h3>
                                {loading ? <h1 className="text-yellow-500 text-center animate-pulse text-xl">{loading}</h1> : ""}
                                {error && <p className="text-red-500 text-center">{error}</p>}
                                <input
                                    name="description"
                                    defaultValue={modal.data?.description || ""}
                                    placeholder="Description"
                                    required
                                    className="w-full mb-4 p-2 border rounded-md"
                                />
                                <input
                                    name="pay_rate"
                                    type="number"
                                    step="0.01"
                                    defaultValue={modal.data?.pay_rate || ""}
                                    placeholder="Pay Rate"
                                    required
                                    className="w-full mb-4 p-2 border rounded-md"
                                />
                                <input
                                    name="pay_code"
                                    type="number"
                                    step="1"
                                    defaultValue={modal.data?.pay_code || ""}
                                    placeholder="Pay Code"
                                    required
                                    className="w-full mb-4 p-2 border rounded-md"
                                />
                                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                                    Save
                                </button>
                            </form>
                        )}
                        {/* Delete Modal */}
                        {modal.type === "delete" && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-center">Confirm Deletion</h3>
                                <p className="text-center text-gray-600 mb-4">
                                    You are about to delete: <strong>{modal.data.description}</strong>
                                </p>
                                {loading ? <p className="text-yellow-500 text-center animate-pulse text-xl">{loading}</p> : ""}
                                {error && <p className="text-red-500 text-center">{error}</p>}
                                <p className="mb-4 text-center">
                                    Enter the number <strong>{randomNumber}</strong> to confirm deletion.
                                </p>
                                <input
                                    type="number"
                                    value={inputNumber}
                                    onChange={(e) => setInputNumber(e.target.value)}
                                    placeholder="Enter number"
                                    className="w-full mb-4 p-2 border rounded-md"
                                />
                                <button onClick={handleDelete} className="w-full bg-red-500 text-white py-2 rounded-md">
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
