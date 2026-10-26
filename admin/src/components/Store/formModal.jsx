
import { FiX, FiMapPin } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../api";

const FormModal = ({ onClose }) => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    manager: "",
    phone: "",
    address: "",
    serviceRadius: "",
    latitude: "",
    longitude: "",
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

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // CREATE STORE API
  const createStoreApi = async (storeData) => {
    const response = await api.post(
      "/store/createStore",
      storeData,
      { withCredentials: true }
    );

    return response.data;
  };

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const latitude = formData.latitude.trim();
    const longitude = formData.longitude.trim();

    if (latitude === "" || longitude === "") {
      alert("Please enter both latitude and longitude.");
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      alert("Latitude must be between -90 and 90.");
      return;
    }

    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      alert("Longitude must be between -180 and 180.");
      return;
    }

    try {
      setLoading(true);

      const storeData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        manager: formData.manager,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        serviceRadius: Number(formData.serviceRadius),
        status: formData.status,
        location: {
          latitude: lat,
          longitude: lng,
        },
      };

      const res = await createStoreApi(storeData);

      alert(res.message || "Store created successfully");
      onClose();
    } catch (error) {
      console.error(error.response?.data || error);

      alert(
        error.response?.data?.message ||
          "Store creation failed"
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
                Add Store
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
                <label className={labelStyle}>
                  Service Radius (km) *
                </label>
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

            {/* ADDRESS */}
            <div>
              <label className={labelStyle}>Store Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter complete store address"
                rows={3}
                className={`${inputStyle} resize-y`}
              />
            </div>

            {/* GEOLOCATION */}
            <div className="rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-[#D7F2F6] p-2 text-[#087F95]">
                  <FiMapPin size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#102A43]">
                    Store Coordinates
                  </h3>
                  <p className="mt-1 text-xs text-[#627D98]">
                    Enter both longitude and latitude.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* LONGITUDE */}
                <div>
                  <label className={labelStyle}>Longitude *</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    step="any"
                    min="-180"
                    max="180"
                    placeholder="e.g. 75.7873"
                    className={inputStyle}
                  />
                </div>

                {/* LATITUDE */}
                <div>
                  <label className={labelStyle}>Latitude *</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    step="any"
                    min="-90"
                    max="90"
                    placeholder="e.g. 26.9124"
                    className={inputStyle}
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-[#627D98]">
                Coordinates identify the exact store location.
              </p>
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
              {loading ? "Creating..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
