"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faDatabase, faDollar, faUsers, faFileLines } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(null); // State for button loading

    useEffect(() => {
        if (status === "loading") return; // Wait for session to load
        if (!session) {
            // Redirect if user is not logged in
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [session, status, router]);

    const handleButtonClick = (path) => {
        setButtonLoading(path); // Set loading for the clicked button
        router.push(path);
    };

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                Welcome, {session.user.name || session.user.email}!
            </h1>
            <h2 className="text-xl font-semibold text-center text-gray-600 mb-6">
                Account Level: <span className="text-blue-500">{session.user.account_type}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {/* Employee View Button */}
                <div
                    onClick={() => handleButtonClick("/view-employees")}
                    className={`group cursor-pointer bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg p-6 w-full max-w-xs text-center ${buttonLoading === "/view-employees" ? "opacity-50 pointer-events-none" : ""
                        }`}
                >
                    {buttonLoading === "/view-employees" ? (
                        <p className="text-blue-500 text-lg font-semibold">Loading...</p>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={faUsers}
                                className="text-blue-500 group-hover:text-blue-600 transition-colors duration-300 text-4xl mb-4"
                            />
                            <h2 className="text-xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                                View Employees
                            </h2>
                            <p className="text-gray-500 text-sm">Manage and view employee details</p>
                        </>
                    )}
                </div>

                {/* Pay Rate Button */}
                <div
                    onClick={() => handleButtonClick("/pay-rates")}
                    className={`group cursor-pointer bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg p-6 w-full max-w-xs text-center ${buttonLoading === "/pay-rates" ? "opacity-50 pointer-events-none" : ""
                        }`}
                >
                    {buttonLoading === "/pay-rates" ? (
                        <p className="text-blue-500 text-lg font-semibold">Loading...</p>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={faCoins}
                                className="text-blue-500 group-hover:text-blue-600 transition-colors duration-300 text-4xl mb-4"
                            />
                            <h2 className="text-xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                                Pay Rates
                            </h2>
                            <p className="text-gray-500 text-sm">Manage and view Pay Rates</p>
                        </>
                    )}
                </div>

                {/* payroll entry */}
                <div
                    onClick={() => handleButtonClick("/payroll-management")}
                    className={`group cursor-pointer bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg p-6 w-full max-w-xs text-center ${buttonLoading === "/pay-rates" ? "opacity-50 pointer-events-none" : ""
                        }`}
                >
                    {buttonLoading === "/payroll-management" ? (
                        <p className="text-blue-500 text-lg font-semibold">Loading...</p>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={faDollar}
                                className="text-blue-500 group-hover:text-blue-600 transition-colors duration-300 text-4xl mb-4"
                            />
                            <h2 className="text-xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                                Payroll Management
                            </h2>
                            <p className="text-gray-500 text-sm">Manage the payroll data</p>
                        </>
                    )}
                </div>

                {/* Database backup */}
                <div
                    onClick={() => handleButtonClick("/dbbackup")}
                    className={`group cursor-pointer bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg p-6 w-full max-w-xs text-center ${buttonLoading === "/pay-rates" ? "opacity-50 pointer-events-none" : ""
                        }`}
                >
                    {buttonLoading === "/dbbackup" ? (
                        <p className="text-blue-500 text-lg font-semibold">Loading...</p>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={faDatabase}
                                className="text-blue-500 group-hover:text-blue-600 transition-colors duration-300 text-4xl mb-4"
                            />
                            <h2 className="text-xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                                Data Backup
                            </h2>
                            <p className="text-gray-500 text-sm">Backup all data to a SQL file</p>
                        </>
                    )}
                </div>

                {/* Sinhala Payslip */}
                <div
                    onClick={() => handleButtonClick("/sinhala-payslip")}
                    className={`group cursor-pointer bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg p-6 w-full max-w-xs text-center ${buttonLoading === "/sinhala-payslip" ? "opacity-50 pointer-events-none" : ""
                        }`}
                >
                    {buttonLoading === "/sinhala-payslip" ? (
                        <p className="text-blue-500 text-lg font-semibold">Loading...</p>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={faFileLines}
                                className="text-blue-500 group-hover:text-blue-600 transition-colors duration-300 text-4xl mb-4"
                            />
                            <h2 className="text-xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                                View Payslips
                            </h2>
                            <p className="text-gray-500 text-sm">View payslips and get printouts</p>
                        </>
                    )}
                </div>

                {/* Future Links or Features Placeholder */}
                <div className="group cursor-not-allowed bg-gray-200 shadow-md rounded-lg p-6 w-full max-w-xs text-center">
                    <div className="text-gray-400 text-4xl mb-4">🚧</div>
                    <h2 className="text-xl font-semibold text-gray-400">More Features Coming</h2>
                    <p className="text-gray-400 text-sm">Stay tuned for future updates</p>
                </div>
            </div>
        </div>
    );
}
