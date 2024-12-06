"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";

export default function ViewPayModal({
  isOpen,
  onClose,
  editRecord,
  handleEditRecordChange,
  handleEditPayroll,
  preventScroll,
  fulledit,
  setfulledit,
}) {
  if (!isOpen || !editRecord) {
    console.log("return works ");
    return null;
  }

  return (
    <div>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h3 className="text-xl font-semibold mb-4">View Record</h3>
          <div className="mb-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-gray-800">
              <strong>Selected Employee:</strong>
              {editRecord.employee?.id} {editRecord.employee?.Firstname}{" "}
              {editRecord.employee?.Surname} (NIC:{" "}
              {editRecord.employee?.Nic_Passport}, EmpNo:{" "}
              {editRecord.employee?.EmpNo}, EPFNo: {editRecord.employee?.EpfNo})
            </p>
          </div>

          {/* Selected Employee */}

          {/* Payroll Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
            <div className="form-group">
              <label
                htmlFor="employee_id"
                className="block text-gray-700 font-medium mb-2"
              >
                Record ID
              </label>
              <input
                readOnly
                type="number"
                id="record_id"
                name="record_id"
                value={editRecord.id}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="employee_id"
                className="block text-gray-700 font-medium mb-2"
              >
                Employee ID
              </label>
              <input
                readOnly
                type="number"
                id="employee_id"
                name="employee_id"
                value={editRecord.employee.id}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="payroll_date"
                className="block text-gray-700 font-medium mb-2"
              >
                Payroll Date
              </label>
              <input
                readOnly
                type="date"
                id="payroll_date"
                name="payroll_date"
                value={
                  editRecord.payroll_date
                    ? new Date(editRecord.payroll_date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="work_days"
                className="block text-gray-700 font-medium mb-2"
              >
                Work Days
              </label>
              <input
                readOnly
                type="number"
                id="work_days"
                name="work_days"
                value={editRecord.work_days || ""}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="per_day_salary"
                className="block text-gray-700 font-medium mb-2"
              >
                Per Day Salary - Code 2
              </label>
              <input
                readOnly
                type="number"
                id="per_day_salary"
                name="per_day_salary"
                value={editRecord.per_day_salary}
                onWheel={preventScroll}
                className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="sundays"
                className="block text-gray-700 font-medium mb-2"
              >
                Sundays
              </label>
              <input
                readOnly
                type="number"
                id="sundays"
                name="sundays"
                value={editRecord.sundays}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
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
                readOnly
                type="number"
                id="sunday_rate"
                name="sunday_rate"
                value={editRecord.sunday_rate}
                className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                onWheel={preventScroll}
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="stat_days"
                className="block text-gray-700 font-medium mb-2"
              >
                Stat Days
              </label>
              <input
                readOnly
                type="number"
                id="stat_days"
                name="stat_days"
                value={editRecord.stat_days}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="stat_allowance"
                className="block text-gray-700 font-medium mb-2"
              >
                Stat Rate-Code 16
              </label>
              <input
                readOnly
                type="number"
                id="stat_rate"
                name="stat_rate"
                value={editRecord.stat_rate}
                onWheel={preventScroll}
                className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
              />
            </div>
            <div className="form-group"></div>
            <div className="form-group">
              <label
                htmlFor="poya_days"
                className="block text-gray-700 font-medium mb-2"
              >
                Poya Days
              </label>
              <input
                readOnly
                type="number"
                id="poya_days"
                name="poya_days"
                value={editRecord.poya_days}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="poya_rate"
                className="block text-gray-700 font-medium mb-2"
              >
                Poya rate - code 14
              </label>
              <input
                readOnly
                type="number"
                id="poya_rate"
                name="poya_rate"
                value={editRecord.poya_rate}
                onWheel={preventScroll}
                className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="night_shifts"
                className="block text-gray-700 font-medium mb-2"
              >
                Night Shifts
              </label>
              <input
                readOnly
                type="number"
                id="night_shifts"
                name="night_shifts"
                value={editRecord.night_shifts}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
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
                readOnly
                type="number"
                id="night_shift_rate"
                name="night_shift_rate"
                value={editRecord.night_shift_rate}
                className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
                onWheel={preventScroll}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="normal_ot"
                className="block text-gray-700 font-medium mb-2"
              >
                Normal OT
              </label>
              <input
                readOnly
                type="number"
                id="normal_ot"
                name="normal_ot"
                value={editRecord.normal_ot}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="normal_ot_rate"
                className="block text-gray-700 font-medium mb-2"
              >
                Normal OT Rate-Code 6
              </label>
              <input
                readOnly
                type="number"
                id="normal_ot_rate"
                name="normal_ot_rate"
                value={editRecord.normal_ot_rate}
                onWheel={preventScroll}
                className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="double_ot"
                className="block text-gray-700 font-medium mb-2"
              >
                Double OT
              </label>
              <input
                readOnly
                type="number"
                id="double_ot"
                name="double_ot"
                value={editRecord.double_ot}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="double_ot_rate"
                className="block text-gray-700 font-medium mb-2"
              >
                Double OT Rate-Code 8
              </label>
              <input
                readOnly
                type="number"
                id="double_ot_rate"
                name="double_ot_rate"
                value={editRecord.double_ot_rate}
                onWheel={preventScroll}
                className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="triple_ot"
                className="block text-gray-700 font-medium mb-2"
              >
                Triple OT
              </label>
              <input
                readOnly
                type="number"
                id="triple_ot"
                name="triple_ot"
                value={editRecord.triple_ot}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                onWheel={preventScroll}
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="triple_ot_rate"
                className="block text-gray-700 font-medium mb-2"
              >
                Triple OT Rate-Code 10
              </label>
              <input
                readOnly
                type="number"
                id="triple_ot_rate"
                name="triple_ot_rate"
                value={editRecord.triple_ot_rate}
                onWheel={preventScroll}
                className={`w-full px-4 py-2 border rounded-lg  bg-gray-200`}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="advance"
                className="block text-gray-700 font-medium mb-2"
              >
                Advance
              </label>
              <input
                readOnly
                type="number"
                id="advance"
                name="advance"
                value={editRecord.advance || 0}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                onWheel={preventScroll}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="festival_advance"
                className="block text-gray-700 font-medium mb-2"
              >
                Festival Advance
              </label>
              <input
                readOnly
                type="number"
                id="festival_advance"
                name="festival_advance"
                value={editRecord.festival_advance || 0}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                onWheel={preventScroll}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="loan_amount"
                className="block text-gray-700 font-medium mb-2"
              >
                Loan Amount
              </label>
              <input
                readOnly
                type="number"
                id="loan_amount"
                name="loan_amount"
                value={editRecord.loan_amount || 0}
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
                onWheel={preventScroll}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
