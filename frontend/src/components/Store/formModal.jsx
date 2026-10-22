
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
        console.error(
          error.response?.data || error.message
        );
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

    // Validate coordinates
    if (latitude === "" || longitude === "") {
      alert("Please enter both latitude and longitude.");
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      lat < -90 ||
      lat > 90
    ) {
      alert("Latitude must be between -90 and 90.");
      return;
    }

    if (
      !Number.isFinite(lng) ||
      lng < -180 ||
      lng > 180
    ) {
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

        // Match backend schema
        location: {
          latitude: lat,
          longitude: lng,
        },
      };

      const res = await createStoreApi(storeData);

      alert(res.message || "Store created successfully");
      onClose();
    } catch (error) {
      console.error(
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Store creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#EBD9D9] bg-white shadow-2xl">

        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EBD9D9] bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#713F50]">
              Add Store
            </h2>
            <p className="mt-1 text-sm text-[#A17B86]">
              Enter store information below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#A17B86] transition hover:bg-[#F0DDE1] hover:text-[#713F50]"
          >
            <FiX size={21} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* STORE NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#713F50]">
                Store Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Jaipur Central Store"
                className="w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-2.5 text-sm outline-none placeholder:text-[#A17B86] focus:border-[#96566A] focus:bg-white"
              />
            </div>

            {/* STORE CODE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#713F50]">
                Store Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="e.g. JPR001"
                className="w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-2.5 text-sm outline-none placeholder:text-[#A17B86] focus:border-[#96566A] focus:bg-white"
              />
            </div>

            {/* STORE MANAGER */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#713F50]">
                Store Manager *
              </label>
              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-2.5 text-sm text-[#713F50] outline-none focus:border-[#96566A]"
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
              <label className="mb-2 block text-sm font-semibold text-[#713F50]">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-2.5 text-sm outline-none placeholder:text-[#A17B86] focus:border-[#96566A] focus:bg-white"
              />
            </div>

            {/* SERVICE RADIUS */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#713F50]">
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
                className="w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-2.5 text-sm outline-none placeholder:text-[#A17B86] focus:border-[#96566A] focus:bg-white"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#713F50]">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-2.5 text-sm text-[#713F50] outline-none focus:border-[#96566A]"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#713F50]">
              Store Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter complete store address"
              rows={3}
              className="w-full resize-y rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-2.5 text-sm outline-none placeholder:text-[#A17B86] focus:border-[#96566A] focus:bg-white"
            />
          </div>

          {/* GEOLOCATION */}
          <div className="rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-[#F0DDE1] p-2 text-[#96566A]">
                <FiMapPin size={19} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#713F50]">
                  Store Coordinates
                </h3>
                <p className="mt-1 text-xs text-[#A17B86]">
                  Enter both longitude and latitude.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* LONGITUDE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#713F50]">
                  Longitude *
                </label>
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
                  className="w-full rounded-xl border border-[#EBD9D9] bg-white px-4 py-2.5 text-sm outline-none placeholder:text-[#A17B86] focus:border-[#96566A]"
                />
              </div>

              {/* LATITUDE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#713F50]">
                  Latitude *
                </label>
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
                  className="w-full rounded-xl border border-[#EBD9D9] bg-white px-4 py-2.5 text-sm outline-none placeholder:text-[#A17B86] focus:border-[#96566A]"
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-[#A17B86]">
              Coordinates identify the exact store location.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#EBD9D9] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#EBD9D9] px-5 py-2.5 text-sm font-semibold text-[#713F50] transition hover:bg-[#FFF9F6]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#96566A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#814659] disabled:cursor-not-allowed disabled:opacity-60"
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
