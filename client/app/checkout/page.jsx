
"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddAddressModal from "@/components/AddAddressModal";
import { getCart } from "@/redux/Slices/cartSlice";
import api from "@/axios/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const store = useSelector((state) => state.store.selectedStore);

  const router = useRouter();
  const dispatch = useDispatch();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const cartDetails = useSelector((state) => state.cart.cart);

  // CALCULATE SUBTOTAL
  const subtotal = (cartItems || []).reduce((total, item) => {
    return total + (item.totalPrice || item.price * item.quantity);
  }, 0);

  const discount = cartDetails?.discount || 0;
  const deliveryFee = cartDetails?.deliveryFee || 0;

  const totalAmount = subtotal - discount + deliveryFee;

  // GET PRODUCT IMAGE
  const getProductImage = (item) => {
    if (item.product?.image?.url) {
      return item.product.image.url;
    }

    if (typeof item.product?.image === "string") {
      return item.product.image;
    }

    if (item.product?.images?.length > 0) {
      return item.product.images[0]?.url || item.product.images[0];
    }

    return null;
  };

  // GET ADDRESSES
  const getAddresses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/address/get");

      const addressList = response.data.addresses || [];

      setAddresses(addressList);

      const defaultAddress = addressList.find(
        (address) => address.isDefault
      );

      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      } else if (addressList.length > 0) {
        setSelectedAddress(addressList[0]._id);
      } else {
        setSelectedAddress("");
      }
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  // SELECT ADDRESS
  const handleSelectAddress = async (addressId) => {
    setSelectedAddress(addressId);

    setAddresses((previousAddresses) =>
      previousAddresses.map((address) => ({
        ...address,
        isDefault: address._id === addressId,
      }))
    );

    try {
      const response = await api.put(
        `/address/set-default/${addressId}`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("Default Address Response:", response.data);

      if (!response.data.success) {
        console.log("Default address update failed");
      }
    } catch (error) {
      console.log(
        "SET DEFAULT ADDRESS ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // DELETE ADDRESS
  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await api.delete(
        `/address/delete/${addressId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        await getAddresses();
        toast.success("Address deleted successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  };

  // LOAD RAZORPAY SCRIPT
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = src;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // PLACE ORDER
  const handlePlaceOrder = async (method) => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);

      // COD ORDER
      if (method === "COD") {
        const response = await api.post(
          "/order/place",
          {
            addressId: selectedAddress,
            paymentMethod: "COD",
            storeId: store?._id,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success("Order placed successfully!");

          await dispatch(getCart());

          router.push("/orders");
        } else {
          toast.error(
            response.data.message || "Failed to place order"
          );
        }

        return;
      }

      // ONLINE PAYMENT
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        toast.error("Razorpay SDK failed to load");
        setPlacingOrder(false);
        return;
      }

      // CREATE ONLINE ORDER
      const orderResponse = await api.post(
        "/order/create-online-order",
        {
          addressId: selectedAddress,
          storeId: store?._id,
        },
        {
          withCredentials: true,
        }
      );

      const orderData = orderResponse.data;

      console.log("Created Online Order:", orderData);

      if (!orderData.success || !orderData.razorpay?.orderId) {
        toast.error("Failed to create online order");
        setPlacingOrder(false);
        return;
      }

      // RAZORPAY CHECKOUT
      const options = {
        key: orderData.razorpay.keyId,
        amount: orderData.razorpay.amount,
        currency: orderData.razorpay.currency,

        name: "QuickKart",
        description: "QuickKart Order Payment",

        order_id: orderData.razorpay.orderId,

        handler: async function (response) {
          try {
            // VERIFY ONLINE PAYMENT
            const verifyResponse = await api.post(
              "/order/verify-online-payment",
              {
                orderId: orderData.order._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
              }
            );

            const verifyData = verifyResponse.data;

            console.log("Payment Verification:", verifyData);

            if (verifyData.success) {
              toast.success("Order placed successfully!");

              await dispatch(getCart());

              router.push("/orders");
            } else {
              toast.error("Payment verification failed");
              setPlacingOrder(false);
            }
          } catch (error) {
            console.log("Verification Error:", error);

            toast.error(
              error.response?.data?.message ||
              "Payment verification failed"
            );

            setPlacingOrder(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPlacingOrder(false);
          },
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();

    } catch (error) {
      console.log("PLACE ORDER ERROR:", error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );

      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">

      {/* ADDRESS MODAL */}
      <AddAddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onAddressAdded={getAddresses}
        address={editingAddress}
      />

      <div className="max-w-7xl mx-auto">

        {/* PAGE TITLE */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-800">
            Checkout
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Complete your order by selecting delivery address and payment
            method.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">

            {/* DELIVERY ADDRESS */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-emerald-700">📍</span>
                  Delivery Address
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select your preferred delivery location
                </p>
              </div>

              {loading ? (
                <p className="text-sm text-gray-500 py-5">
                  Loading addresses...
                </p>
              ) : addresses.length > 0 ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {addresses.map((address) => (

                    <div
                      key={address._id}
                      onClick={() => handleSelectAddress(address._id)}
                      className={`relative flex flex-col border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedAddress === address._id
                          ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                          : "border-gray-200 hover:border-emerald-400 hover:shadow-sm"
                      }`}
                    >

                      {/* ADDRESS HEADER */}
                      <div className="flex justify-between items-center mb-3">

                        <div className="flex items-center gap-2">

                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              selectedAddress === address._id
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            🏠
                          </div>

                          <h3 className="font-semibold text-gray-800">
                            {address.type || "Address"}
                          </h3>

                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAddress === address._id
                              ? "border-emerald-600"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedAddress === address._id && (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          )}
                        </div>

                      </div>

                      {/* DEFAULT ADDRESS */}
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                          <span>✓</span>
                          Default Address
                        </span>
                      )}

                      {/* ADDRESS DETAILS */}
                      <div className="text-sm text-gray-600 mt-3 space-y-1">

                        <p className="font-medium text-gray-800">
                          {address.name}
                        </p>

                        <p>
                          {address.houseNumber || "-"}, {address.street || "-"}
                        </p>

                        {address.landmark && (
                          <p>{address.landmark}</p>
                        )}

                        <p>
                          {address.city || "-"}, {address.state || "-"}
                        </p>

                        <p>{address.country || "-"}</p>

                        <p>Pincode: {address.pincode || "-"}</p>

                        <p>Phone: {address.phone || "-"}</p>

                      </div>

                      {/* EDIT AND DELETE BUTTONS */}
                      <div className="flex items-center gap-3 mt-auto pt-5">

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            setEditingAddress(address);
                            setShowAddressModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 hover:border-emerald-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                          </svg>

                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address._id);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:border-red-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="m19 6-1 14H6L5 6" />
                            <path d="M10 11v5" />
                            <path d="M14 11v5" />
                          </svg>

                          Delete
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    No saved addresses found.
                  </p>
                </div>

              )}

              {/* ADD NEW ADDRESS */}
              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null);
                  setShowAddressModal(true);
                }}
                className="w-full mt-5 min-h-14 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/40 transition"
              >
                <span className="text-xl">+</span>

                <span className="text-sm font-medium">
                  Add New Address
                </span>
              </button>

            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-emerald-700">💳</span>
                  Payment Method
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select your preferred payment option
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* COD */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`cursor-pointer rounded-xl border-2 p-5 transition ${
                    paymentMethod === "COD"
                      ? "border-emerald-600 bg-green-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🚚</span>

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Cash on Delivery
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          Pay when your order arrives
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "COD"
                          ? "border-emerald-600"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "COD" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                      )}
                    </div>

                  </div>

                </div>

                {/* ONLINE PAYMENT */}
                <div
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`cursor-pointer rounded-xl border-2 p-5 transition ${
                    paymentMethod === "ONLINE"
                      ? "border-emerald-600 bg-green-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💳</span>

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Online Payment
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          UPI, Cards and Net Banking
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "ONLINE"
                          ? "border-emerald-600"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "ONLINE" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                      )}
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SECTION - ORDER SUMMARY */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">

              <h2 className="text-lg font-semibold text-gray-800 pb-4 border-b border-gray-200">
                Order Summary
              </h2>

              {/* CART ITEMS */}
              <div className="py-4 space-y-4">

                {cartItems && cartItems.length > 0 ? (

                  cartItems.map((item) => (

                    <div key={item._id} className="flex gap-3">

                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">

                        {getProductImage(item) ? (
                          <img
                            src={getProductImage(item)}
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}

                      </div>

                      <div className="flex-1 min-w-0">

                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                          {item.product?.name ||
                            item.product?.title ||
                            "Product"}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.variant?.name || ""}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>

                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          ₹{item.totalPrice || item.price * item.quantity}
                        </p>

                      </div>

                    </div>

                  ))

                ) : (

                  <div className="text-center py-6">
                    <div className="text-3xl mb-3">🛒</div>

                    <p className="text-sm font-medium text-gray-700">
                      Your cart is empty
                    </p>
                  </div>

                )}

              </div>

              {/* PRICE DETAILS */}
              <div className="border-t border-gray-200 pt-4 space-y-3">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Charges</span>

                  <span className="text-emerald-700">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-emerald-700">- ₹{discount}</span>
                </div>

              </div>

              {/* TOTAL */}
              <div className="border-t border-gray-200 mt-5 pt-5">

                <div className="flex justify-between items-center">

                  <span className="font-semibold text-gray-800">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    ₹{totalAmount}
                  </span>

                </div>

              </div>

              {/* PLACE ORDER */}
              <button
                type="button"
                onClick={() => handlePlaceOrder(paymentMethod)}
                disabled={
                  !cartItems ||
                  cartItems.length === 0 ||
                  !selectedAddress ||
                  placingOrder
                }
                className="w-full mt-6 bg-emerald-700 text-white font-semibold py-3 rounded-lg hover:bg-emerald-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                Your order details will be confirmed at checkout.
              </p>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>🔒</span>
                Secure Checkout
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
