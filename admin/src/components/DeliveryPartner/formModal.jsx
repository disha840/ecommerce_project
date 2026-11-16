
import { FiX, FiTruck, FiUser } from "react-icons/fi";

const formModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D9E8EF] bg-[#F0FAFC] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#D7F2F6] p-2 text-[#087F95]">
              <FiTruck size={20} />
            </div>
            <h2 className="text-lg font-semibold text-[#102A43]">
              Add Delivery Partner
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#627D98] hover:bg-[#D7F2F6]"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 p-6">

          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Select User
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 text-[#627D98]" />
              <select className="w-full rounded-lg border border-[#D9E8EF] bg-white py-3 pl-10 pr-3 text-sm text-[#102A43] outline-none focus:border-[#22B8CF]">
                <option value="">Select user</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Vehicle Type
            </label>
            <select className="w-full rounded-lg border border-[#D9E8EF] bg-white px-3 py-3 text-sm text-[#102A43] outline-none focus:border-[#22B8CF]">
              <option value="">Select vehicle type</option>
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="cycle">Cycle</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Vehicle Number
            </label>
            <input
              type="text"
              placeholder="Enter vehicle number"
              className="w-full rounded-lg border border-[#D9E8EF] px-3 py-3 text-sm text-[#102A43] outline-none placeholder:text-[#9FB3C8] focus:border-[#22B8CF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Driving License Number
            </label>
            <input
              type="text"
              placeholder="Enter driving license number"
              className="w-full rounded-lg border border-[#D9E8EF] px-3 py-3 text-sm text-[#102A43] outline-none placeholder:text-[#9FB3C8] focus:border-[#22B8CF]"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#D9E8EF] bg-[#F0FAFC] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#D9E8EF] px-5 py-2.5 text-sm font-medium text-[#627D98] hover:bg-[#D7F2F6]"
          >
            Cancel
          </button>

          <button
            className="rounded-lg bg-[#087F95] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#066879]"
          >
            Add Partner
          </button>
        </div>

      </div>
    </div>
  );
};

export default formModal;
