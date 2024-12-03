import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function PayrollFilter({ setshowsearchdrawer, handleSearchSubmit, handleSearchChange, searchParams }) {
    return (
        <>
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
        </>
    )
}