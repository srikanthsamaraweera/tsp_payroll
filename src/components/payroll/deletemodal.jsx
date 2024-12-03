export default function DeleteModal({
  deleteModal,
  deleteInput,
  confirmDelete,
  closeDeleteModal,
  setDeleteInput,
}) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold text-center mb-4">
          Confirm deletion of payroll record no {deleteModal.recordId}
        </h3>
        <p className="text-center mb-4">
          Enter the number <strong>{deleteModal.randomNumber}</strong> to
          confirm deletion.
        </p>
        <input
          type="number"
          value={deleteInput}
          onChange={(e) => setDeleteInput(e.target.value)}
          placeholder="Enter number"
          className="w-full mb-4 p-2 border rounded-md"
        />
        <div className="flex justify-between">
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
