
import { FiX, FiMapPin } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../api";

const FormModal = ({ onClose, store, onSaved }) => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    manager: "",
    phone: "",
    address: "",
    landmark: "",
    serviceRadius: "",
    status: "ACTIVE",
  });

  // FETCH STORE MANAGERS
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await api.get("/store/managers", {
          withCredentials: true,
        });

        setManagers(res.data.managers || []);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchManagers();
  }, []);

  // FILL FORM WHEN UPDATING
  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || "",
        code: store.code || "",
        manager: store.manager?._id || store.manager || "",
        phone: store.phone || "",
        address: store.address || "",
        landmark: store.landmark || "",
        serviceRadius: store.serviceRadius || "",
        status: store.status || "ACTIVE",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        manager: "",
        phone: "",
        address: "",
        landmark: "",
        serviceRadius: "",
        status: "ACTIVE",
      });
    }
  }, [store]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const storeData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        manager: formData.manager,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        landmark: formData.landmark.trim(),
        serviceRadius: Number(formData.serviceRadius),
        status: formData.status,
      };

      let res;

      if (store) {
        res = await api.put(
          `/store/updateStore/${store._id}`,
          storeData,
          { withCredentials: true }
        );
      } else {
        res = await api.post(
          "/store/createStore",
          storeData,
          { withCredentials: true }
        );
      }

      alert(
        res.data.message ||
        (store ? "Store updated successfully" : "Store created successfully")
      );

      if (onSaved) {
        await onSaved();
      }

      onClose();
    } catch (error) {
      console.error(error.response?.data || error);

      alert(
        error.response?.data?.message ||
        (store ? "Store update failed" : "Store creation failed")
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] outline-none transition placeholder:text-[#829AB1] focus:border-[#087F95] focus:ring-2 focus:ring-[#22B8CF]/20 disabled:cursor-not-allowed disabled:opacity-60";

  const labelStyle =
    "mb-2 block text-sm font-semibold text-[#102A43]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#D9E8EF] bg-[#F8FCFD] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
              <FiMapPin size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#102A43]">
                {store ? "Update Store" : "Add Store"}
              </h2>

              <p className="mt-1 text-sm text-[#627D98]">
                Enter store information below.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-[#627D98] transition hover:bg-[#D7F2F6] hover:text-[#102A43] disabled:opacity-50"
            aria-label="Close modal"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">

            {/* STORE INFORMATION */}
            <div>
              <h3 className="text-lg font-bold text-[#102A43]">
                Store Information
              </h3>

              <p className="mt-1 text-sm text-[#627D98]">
                Enter the store details below.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* STORE NAME */}
              <div>
                <label className={labelStyle}>Store Name *</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Jaipur Central Store"
                  className={inputStyle}
                />
              </div>

              {/* STORE CODE */}
              <div>
                <label className={labelStyle}>Store Code *</label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="e.g. JPR001"
                  className={inputStyle}
                />
              </div>

              {/* STORE MANAGER */}
              <div>
                <label className={labelStyle}>Store Manager *</label>

                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                >
                  <option value="">Select manager</option>

                  {managers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.firstName}
                    </option>
                  ))}
                </select>
              </div>

              {/* PHONE */}
              <div>
                <label className={labelStyle}>Phone Number *</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                  className={inputStyle}
                />
              </div>

              {/* SERVICE RADIUS */}
              <div>
                <label className={labelStyle}>Service Radius (km) *</label>

                <input
                  type="number"
                  name="serviceRadius"
                  value={formData.serviceRadius}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="10"
                  className={inputStyle}
                />
              </div>

              {/* STATUS */}
              <div>
                <label className={labelStyle}>Status *</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            {/* STORE ADDRESS */}
            <div>
              <label className={labelStyle}>Store Address *</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="House No, Street, Area, City, State, PIN Code"
                rows={3}
                className={`${inputStyle} resize-y`}
              />
            </div>

            {/* LANDMARK */}
            <div>
              <label className={labelStyle}>Landmark (Optional)</label>

              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Near Metro Station, Mall, Hospital etc."
                className={inputStyle}
              />
            </div>

            {/* LOCATION INFORMATION */}
            <div className="rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#D7F2F6] p-2 text-[#087F95]">
                  <FiMapPin size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#102A43]">
                    Automatic Location Detection
                  </h3>

                  <p className="mt-1 text-xs text-[#627D98]">
                    Latitude and longitude will be generated automatically from the store address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#D9E8EF] bg-[#F8FCFD] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-[#D9E8EF] bg-white px-5 py-2.5 text-sm font-semibold text-[#102A43] transition hover:bg-[#F0FAFC] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? store ? "Updating..." : "Creating..."
                : store ? "Update Store" : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
