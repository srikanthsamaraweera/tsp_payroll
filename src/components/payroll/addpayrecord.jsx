"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";

export default function AddPayrollModal({
  isOpen,
  onClose,
  payrollFields,
  setPayrollFields,
  selectedEmployee,
  setSelectedEmployee,
  employeeSearch,
  setEmployeeSearch,
  employeeResults,
  setEmployeeResults,
  fulledit,
  setfulledit,
  handlePayrollFieldChange,
  handleDateFieldChange,
  preventScroll,
  searchingemployeemessage,
  handleSavePayroll,
  saving,
  setsaving,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="text-xl font-semibold mb-4">Add Payroll</h3>

        {/* Selected Employee */}
        {selectedEmployee ? (
          <div className="mb-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-gray-800">
              <strong>Selected Employee:</strong>
              {selectedEmployee.id} {selectedEmployee.Firstname}{" "}
              {selectedEmployee.Surname} (NIC: {selectedEmployee.Nic_Passport},
              EmpNo: {selectedEmployee.EmpNo}, EPFNo: {selectedEmployee.EpfNo})
            </p>
          </div>
        ) : (
          <p className="mb-4 text-gray-500">No employee selected.</p>
        )}

        {/* Employee Search */}
        <div className="mb-6 relative">
          <input
            type="text"
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
            placeholder="Search Employee by Name, NIC, etc."
            className="w-full px-4 py-2 border rounded-lg"
          />
          {searchingemployeemessage && (
            <div className="bg-yellow-100 w-full">
              {searchingemployeemessage}
            </div>
          )}
          {employeeSearch && employeeResults.length > 0 && (
            <ul className="absolute z-50 bg-white border rounded-lg shadow-md mt-2 max-h-48 overflow-y-auto w-full">
              {employeeResults.map((emp) => (
                <li
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setEmployeeSearch("");
                    setEmployeeResults([]);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {emp.Firstname} {emp.Surname} (NIC: {emp.Nic_Passport}, EmpNo:{" "}
                  {emp.EmpNo})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="text-right pr-1 pb-1">
          <button
            className={` p-1 pr-4 pl-4 ${
              fulledit ? "bg-red-200" : "bg-slate-300"
            }`}
            onClick={() => setfulledit(!fulledit)}
          >
            Full Edit <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
        {/* Payroll Fields */}
        <div className="overflow-y-auto max-h-[50vh] ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="form-group">
              <label
                htmlFor="employee_id"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Employee ID
              </label>
              <input
                type="number"
                id="employee_id"
                name="employee_id"
                value={selectedEmployee ? selectedEmployee.id : ""}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                readOnly
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="payroll_date"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Payroll Date
              </label>
              <input
                type="date"
                id="payroll_date"
                name="payroll_date"
                value={payrollFields.payroll_date}
                onChange={handleDateFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <div className="form-group">
              <label
                htmlFor="work_days"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Work Days
              </label>
              <input
                type="number"
                id="work_days"
                name="work_days"
                value={payrollFields.work_days}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="per_day_salary"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Per Day Salary - Code 2
              </label>
              <input
                type="number"
                id="per_day_salary"
                name="per_day_salary"
                value={payrollFields.per_day_salary}
                onChange={handlePayrollFieldChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  fulledit ? "" : "bg-gray-200"
                }`}
                readOnly={!fulledit}
                onWheel={preventScroll}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="sundays"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Sundays
              </label>
              <input
                type="number"
                id="sundays"
                name="sundays"
                value={payrollFields.sundays}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="sundays"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Sunday rate
              </label>
              <input
                type="number"
                id="sunday_rate"
                name="sunday_rate"
                value={payrollFields.sunday_rate}
                onChange={handlePayrollFieldChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  fulledit ? "" : "bg-gray-200"
                }`}
                onWheel={preventScroll}
                required
                readOnly={!fulledit}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="form-group">
              <label
                htmlFor="stat_days"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Stat Days
              </label>
              <input
                type="number"
                id="stat_days"
                name="stat_days"
                value={payrollFields.stat_days}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="sundays"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Stat rate - Code 16
              </label>
              <input
                type="number"
                id="stat_rate"
                name="stat_rate"
                value={payrollFields.stat_rate}
                onChange={handlePayrollFieldChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  fulledit ? "" : "bg-gray-200"
                }`}
                onWheel={preventScroll}
                required
                readOnly={!fulledit}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="poya_days"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Poya Days
              </label>
              <input
                type="number"
                id="poya_days"
                name="poya_days"
                value={payrollFields.poya_days}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="poya_allowance"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Poya Rate - Code 14
              </label>
              <input
                type="number"
                id="poya_rate"
                name="poya_rate"
                value={payrollFields.poya_rate}
                onChange={handlePayrollFieldChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  fulledit ? "" : "bg-gray-200"
                }`}
                readOnly={!fulledit}
                onWheel={preventScroll}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
            <div className="form-group">
              <label
                htmlFor="night_shifts"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Night Shifts
              </label>
              <input
                type="number"
                id="night_shifts"
                name="night_shifts"
                value={payrollFields.night_shifts}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="normal_ot_rate"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Night Shift Rate-Code 15
              </label>
              <input
                type="number"
                id="night_shift_rate"
                name="night_shift_rate"
                value={payrollFields.night_shift_rate}
                onChange={handlePayrollFieldChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  fulledit ? "" : "bg-gray-200"
                }`}
                readOnly={!fulledit}
                onWheel={preventScroll}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="normal_ot"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Normal OT
              </label>
              <input
                type="number"
                id="normal_ot"
                name="normal_ot"
                value={payrollFields.normal_ot}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="normal_ot_rate"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Normal OT Rate-Code 6
              </label>
              <input
                type="number"
                id="normal_ot_rate"
                name="normal_ot_rate"
                value={payrollFields.normal_ot_rate}
                onChange={handlePayrollFieldChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  fulledit ? "" : "bg-gray-200"
                }`}
                readOnly={!fulledit}
                onWheel={preventScroll}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="double_ot"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Double OT
              </label>
              <input
                type="number"
                id="double_ot"
                name="double_ot"
                value={payrollFields.double_ot}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="double_ot_rate"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Double OT Rate-Code 8
              </label>
              <input
                type="number"
                id="double_ot_rate"
                name="double_ot_rate"
                value={payrollFields.double_ot_rate}
                onChange={handlePayrollFieldChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  fulledit ? "" : "bg-gray-200"
                }`}
                readOnly={!fulledit}
                onWheel={preventScroll}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="triple_ot"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Triple OT
              </label>
              <input
                type="number"
                id="triple_ot"
                name="triple_ot"
                value={payrollFields.triple_ot}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="triple_ot_rate"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Triple OT Rate-Code 10
              </label>
              <input
                type="number"
                id="triple_ot_rate"
                name="triple_ot_rate"
                value={payrollFields.triple_ot_rate}
                onChange={handlePayrollFieldChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  fulledit ? "" : "bg-gray-200"
                }`}
                readOnly={!fulledit}
                onWheel={preventScroll}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="advance"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Advance
              </label>
              <input
                type="number"
                id="advance"
                name="advance"
                value={payrollFields.advance || 0}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="festival_advance"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Festival Advance
              </label>
              <input
                type="number"
                id="festival_advance"
                name="festival_advance"
                value={payrollFields.festival_advance || 0}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="loan_amount"
                className="block text-gray-700 font-medium mb-2 text-sm"
              >
                Loan Amount
              </label>
              <input
                type="number"
                id="loan_amount"
                name="loan_amount"
                value={payrollFields.loan_amount || 0}
                onChange={handlePayrollFieldChange}
                className="w-full px-4 py-2 border rounded-lg"
                onWheel={preventScroll}
              />
            </div>
          </div>
          {/* Save Button */}
          {saving ? (
            <p className="bg-orange-100 text-orange-700">Saving...</p>
          ) : (
            <button
              onClick={handleSavePayroll}
              className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            >
              Save Payroll
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
