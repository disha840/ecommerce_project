"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "@/axios/api";
import { setSelectedStore } from "@/redux/Slices/StoreSlice";
import {
    FiMapPin,
    FiChevronDown,
    FiX,
    FiLoader,
    FiSearch,
    FiNavigation,
} from "react-icons/fi";

/*
 * Palette
 * Ink      #14213D  (dark surfaces, text, icons)
 * Marigold #FCA311  (primary action, accents)
 * Cream    #FFF8E8  (selected state)
 * Slate    Tailwind slate-* for neutrals
 * Chilli   red-600  (errors)
 */

const formatPhotonSuggestion = (feature) => {
    const properties = feature?.properties || {};
    const coordinates = feature?.geometry?.coordinates;

    if (
        !Array.isArray(coordinates) ||
        coordinates.length < 2 ||
        !Number.isFinite(Number(coordinates[0])) ||
        !Number.isFinite(Number(coordinates[1]))
    ) {
        return null;
    }

    const latitude = Number(coordinates[1]);
    const longitude = Number(coordinates[0]);

    const primary =
        properties.name ||
        properties.street ||
        properties.locality ||
        properties.district ||
        properties.city ||
        properties.county ||
        properties.state;

    if (!primary) return null;

    const details = [
        properties.housenumber && properties.street
            ? `${properties.housenumber} ${properties.street}`
            : properties.street,
        properties.district,
        properties.city,
        properties.state,
        properties.country,
    ].filter(Boolean);

    const uniqueDetails = [...new Set(details)].filter(
        (item) => item !== primary
    );

    const labelParts = [
        primary,
        properties.city,
        properties.state,
    ].filter(Boolean);

    const label = [...new Set(labelParts)].join(", ");

    return {
        id: `${properties.osm_type || "location"}-${properties.osm_id || `${latitude}-${longitude}`}`,
        label,
        detail: uniqueDetails.join(", "),
        latitude,
        longitude,
    };
};

function LocationAddressForm({
    manualAddress,
    setManualAddress,
    suggestions,
    suggestionLoading,
    selectedSuggestion,
    onSelectSuggestion,
    onSubmit,
    locationSubmitting,
    locationError,
    suggestionError,
}) {
    const showSuggestions =
        manualAddress.trim().length >= 3 && !selectedSuggestion;

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <div>
                <div className="relative">
                    <FiSearch
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        placeholder="Search area, street or landmark"
                        autoComplete="off"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-[#14213D] outline-none transition placeholder:text-slate-400 focus:border-[#14213D] focus:bg-white focus:ring-4 focus:ring-[#FCA311]/30"
                    />
                </div>

                {showSuggestions && (
                    <div className="mt-2 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
                        {suggestionLoading ? (
                            <div className="flex items-center justify-center gap-2 px-4 py-5 text-sm text-slate-500">
                                <FiLoader className="animate-spin text-[#14213D]" />
                                Searching locations...
                            </div>
                        ) : suggestions.length > 0 ? (
                            <ul className="divide-y divide-slate-100">
                                {suggestions.map((suggestion) => (
                                    <li key={suggestion.id}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSelectSuggestion(suggestion)
                                            }
                                            className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                                        >
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#14213D]/5 text-[#14213D]">
                                                <FiMapPin size={15} />
                                            </span>

                                            <span className="min-w-0">
                                                <span className="block text-sm font-semibold text-[#14213D]">
                                                    {suggestion.label}
                                                </span>

                                                {suggestion.detail && (
                                                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                                                        {suggestion.detail}
                                                    </span>
                                                )}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : suggestionError ? (
                            <p className="px-4 py-4 text-sm text-red-600">
                                {suggestionError}
                            </p>
                        ) : (
                            <p className="px-4 py-4 text-sm text-slate-500">
                                No locations found. Try another area or landmark.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {selectedSuggestion && (
                <div className="flex items-start gap-3 rounded-2xl border-l-4 border-[#FCA311] bg-[#FFF8E8] p-3.5">
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500">
                            Delivering to
                        </p>

                        <p className="mt-0.5 text-sm font-bold text-[#14213D]">
                            {selectedSuggestion.label}
                        </p>

                        {selectedSuggestion.detail && (
                            <p className="mt-0.5 text-xs leading-5 text-slate-500">
                                {selectedSuggestion.detail}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setManualAddress("")}
                        className="rounded-full p-1.5 text-slate-500 transition hover:bg-[#FCA311]/20 hover:text-[#14213D]"
                        aria-label="Change selected location"
                    >
                        <FiX size={16} />
                    </button>
                </div>
            )}

            {locationError && (
                <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">
                    {locationError}
                </p>
            )}

            <button
                type="submit"
                disabled={locationSubmitting || !selectedSuggestion}
                className="w-full rounded-2xl bg-[#FCA311] px-4 py-3.5 text-sm font-extrabold text-[#14213D] transition hover:brightness-95 active:brightness-90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
                {locationSubmitting
                    ? "Confirming location..."
                    : "Confirm location"}
            </button>
        </form>
    );
}

function PickerBody({ locationLoading, onUseCurrent, formProps }) {
    return (
        <>
            <button
                type="button"
                onClick={onUseCurrent}
                disabled={locationLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#14213D] px-4 py-3 text-sm font-bold text-[#14213D] transition hover:bg-[#14213D] hover:text-white disabled:opacity-60"
            >
                <FiNavigation size={17} />
                {locationLoading
                    ? "Detecting location..."
                    : "Use my current location"}
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                or type an address
                <span className="h-px flex-1 bg-slate-200" />
            </div>

            <LocationAddressForm {...formProps} />
        </>
    );
}

export default function DeliveryLocation() {
    const dispatch = useDispatch();

    const [location, setLocation] = useState("Select Location");
    const [locationReady, setLocationReady] = useState(false);
    const [locationLoading, setLocationLoading] = useState(true);
    const [locationModalOpen, setLocationModalOpen] = useState(false);

    const [manualAddress, setManualAddress] = useState("");
    const [locationSubmitting, setLocationSubmitting] = useState(false);
    const [locationError, setLocationError] = useState("");

    const [suggestions, setSuggestions] = useState([]);
    const [suggestionLoading, setSuggestionLoading] = useState(false);
    const [suggestionError, setSuggestionError] = useState("");
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);

    // Find nearest store and save it in Redux
    const saveLocation = async (value) => {
        try {
            const response = await api.post("/store/nearest", {
                latitude: value.latitude,
                longitude: value.longitude,
            });

            if (!response.data.success || !response.data.store) {
                throw new Error("Nearest store not found");
            }

            // Save nearest store in Redux
            dispatch(setSelectedStore(response.data.store));

            // Save customer location only after finding a store
            sessionStorage.setItem(
                "quickkart_location",
                JSON.stringify(value)
            );

            setLocation(value.label);
            setLocationReady(true);
            setLocationModalOpen(false);
            setLocationError("");
            setLocationLoading(false);
            setManualAddress("");
            setSuggestions([]);
            setSelectedSuggestion(null);
            setSuggestionError("");

            window.dispatchEvent(new Event("location-updated"));

            return true;
        } catch (error) {
            setLocationError(
                error.response?.data?.message ||
                error.message ||
                "Unable to find nearest store"
            );

            setLocationLoading(false);
            setLocationModalOpen(true);

            return false;
        }
    };

    const getAreaName = (address = {}) =>
        address.neighbourhood ||
        address.suburb ||
        address.residential ||
        address.city_district ||
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        address.state ||
        "Selected Location";

    const requestCurrentLocation = () => {
        setLocationError("");

        if (!navigator.geolocation) {
            setLocationLoading(false);
            setLocationModalOpen(true);

            setLocationError(
                "Your browser does not support location. Please enter your address."
            );

            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const { latitude, longitude } = coords;

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );

                    if (!response.ok) {
                        throw new Error("Unable to find your area.");
                    }

                    const data = await response.json();

                    await saveLocation({
                        label: getAreaName(data.address || {}),
                        latitude,
                        longitude,
                        source: "gps",
                    });
                } catch {
                    setLocationLoading(false);
                    setLocationModalOpen(true);

                    setLocationError(
                        "Could not identify your area. Please enter your address manually."
                    );
                }
            },
            (error) => {
                setLocationLoading(false);
                setLocationModalOpen(true);

                if (error.code === 1) {
                    setLocationError(
                        "Location permission was denied. Please enter your address manually."
                    );
                } else if (error.code === 3) {
                    setLocationError(
                        "Location request timed out. Please enter your address manually."
                    );
                } else {
                    setLocationError(
                        "Unable to get your location. Please enter your address manually."
                    );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    const handleSelectSuggestion = (suggestion) => {
        setSelectedSuggestion(suggestion);
        setManualAddress(suggestion.label);
        setSuggestions([]);
        setSuggestionError("");
        setLocationError("");
    };

    const submitManualAddress = async (e) => {
        e.preventDefault();

        if (!selectedSuggestion) {
            setLocationError(
                "Please select a location from the suggestions first."
            );
            return;
        }

        setLocationSubmitting(true);
        setLocationError("");

        try {
            await saveLocation({
                label: selectedSuggestion.label,
                latitude: selectedSuggestion.latitude,
                longitude: selectedSuggestion.longitude,
                source: "manual",
            });
        } finally {
            setLocationSubmitting(false);
        }
    };

    useEffect(() => {
        const query = manualAddress.trim();

        if (
            query.length < 3 ||
            (selectedSuggestion && query === selectedSuggestion.label)
        ) {
            setSuggestions([]);
            setSuggestionLoading(false);
            setSuggestionError("");
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            setSuggestionLoading(true);
            setSuggestionError("");

            try {
                const response = await fetch(
                    `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Location search failed.");
                }

                const data = await response.json();

                const results = (data.features || [])
                    .map(formatPhotonSuggestion)
                    .filter((item) => item !== null);

                setSuggestions(results);

                if (results.length === 0) {
                    setSuggestionError(
                        "No locations found. Try another area or landmark."
                    );
                }
            } catch (error) {
                if (error?.name !== "AbortError") {
                    setSuggestions([]);
                    setSuggestionError(
                        "Unable to load suggestions. Please try again."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setSuggestionLoading(false);
                }
            }
        }, 400);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [manualAddress, selectedSuggestion]);

    useEffect(() => {
        const savedLocation = sessionStorage.getItem("quickkart_location");

        if (savedLocation) {
            try {
                const parsed = JSON.parse(savedLocation);

                if (
                    parsed?.label &&
                    typeof parsed.latitude === "number" &&
                    Number.isFinite(parsed.latitude) &&
                    typeof parsed.longitude === "number" &&
                    Number.isFinite(parsed.longitude)
                ) {
                    // Re-fetch nearest store on page reload
                    saveLocation(parsed);
                    return;
                }

                sessionStorage.removeItem("quickkart_location");
            } catch {
                sessionStorage.removeItem("quickkart_location");
            }
        }

        requestCurrentLocation();

        // Run only once when this component mounts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openLocationModal = () => {
        setLocationError("");
        setSuggestionError("");
        setManualAddress("");
        setSuggestions([]);
        setSelectedSuggestion(null);
        setLocationModalOpen(true);
    };

    const setAddress = (value) => {
        setManualAddress(value);
        setSelectedSuggestion(null);
        setLocationError("");
    };

    const formProps = {
        manualAddress,
        setManualAddress: setAddress,
        suggestions,
        suggestionLoading,
        selectedSuggestion,
        onSelectSuggestion: handleSelectSuggestion,
        onSubmit: submitManualAddress,
        locationSubmitting,
        locationError,
        suggestionError,
    };

    return (
        <>
            {/* Navbar Location */}
            <div className="relative hidden w-56 min-w-0 shrink-0 lg:block">
                <button
                    type="button"
                    onClick={openLocationModal}
                    className="flex w-full items-center gap-2.5 overflow-hidden rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 text-left transition hover:border-[#14213D]"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-[#FCA311]">
                        <FiMapPin size={17} />
                    </span>

                    <span className="min-w-0 flex-1">
                        <span className="block text-[11px] leading-4 text-slate-500">
                            Deliver to
                        </span>

                        <span
                            title={location}
                            className="flex min-w-0 items-center gap-1 text-sm font-bold leading-5 text-[#14213D]"
                        >
                            <span className="min-w-0 flex-1 truncate">
                                {locationLoading
                                    ? "Detecting location..."
                                    : location}
                            </span>

                            <FiChevronDown
                                size={14}
                                className="shrink-0"
                            />
                        </span>
                    </span>
                </button>
            </div>

            {/* Mandatory Location Screen */}
            {!locationReady && (
                <div className="fixed inset-0 z-9999 flex flex-col overflow-y-auto bg-white md:flex-row">
                    {/* Brand panel */}
                    <div className="flex shrink-0 flex-col justify-between bg-[#14213D] px-6 py-6 text-white md:w-[44%] md:px-12 md:py-12">
                        <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
                            <span className="h-3 w-3 rounded-full bg-[#FCA311]" />
                            Quick Kart
                        </div>

                        {/* Radar: the one memorable element */}
                        <div
                            className="relative mx-auto my-10 hidden h-64 w-64 md:block"
                            aria-hidden="true"
                        >
                            <span className="absolute inset-0 rounded-full border border-white/15" />
                            <span className="absolute inset-10 rounded-full border border-white/20" />
                            <span className="absolute inset-20 rounded-full border border-white/25" />

                            <span className="absolute inset-0 flex items-center justify-center">
                                <span className="relative flex h-6 w-6">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FCA311] opacity-60 motion-reduce:animate-none" />
                                    <span className="relative inline-flex h-6 w-6 rounded-full bg-[#FCA311]" />
                                </span>
                            </span>
                        </div>

                        <div className="mt-6 md:mt-0">
                            <h2 className="text-2xl font-extrabold leading-tight md:text-4xl">
                                Groceries at your door in minutes.
                            </h2>

                            <p className="mt-3 hidden max-w-sm text-sm leading-6 text-white/70 md:block">
                                Share your location and we’ll show only the
                                stores and products that can reach you.
                            </p>
                        </div>
                    </div>

                    {/* Action panel */}
                    <div className="flex flex-1 items-center justify-center px-6 py-8 md:px-12">
                        {locationLoading ? (
                            <div className="flex w-full max-w-sm flex-col items-center text-center">
                                <FiLoader
                                    size={30}
                                    className="animate-spin text-[#14213D]"
                                />

                                <h2 className="mt-5 text-xl font-extrabold text-[#14213D]">
                                    Setting up your location
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Please allow location access so we can
                                    find nearby stores and show products
                                    available in your area.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full max-w-md">
                                <h2 className="text-2xl font-extrabold text-[#14213D]">
                                    Choose your location
                                </h2>

                                <p className="mb-6 mt-2 text-sm leading-6 text-slate-500">
                                    Select your delivery location to continue
                                    shopping on Quick Kart.
                                </p>

                                <PickerBody
                                    locationLoading={locationLoading}
                                    onUseCurrent={requestCurrentLocation}
                                    formProps={formProps}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Change Location Modal (bottom sheet on mobile) */}
            {locationReady && locationModalOpen && (
                <div className="fixed inset-0 z-9999 flex items-end justify-center bg-[#14213D]/60 sm:items-center sm:px-4 sm:py-6">
                    <div className="max-h-full w-full overflow-y-auto rounded-t-3xl bg-white p-6 pb-8 shadow-2xl sm:max-w-md sm:rounded-3xl sm:pb-6">
                        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />

                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-extrabold text-[#14213D]">
                                    Choose your location
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    We’ll use this to show delivery
                                    availability near you.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setLocationModalOpen(false)}
                                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#14213D]"
                                aria-label="Close location dialog"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <PickerBody
                            locationLoading={locationLoading}
                            onUseCurrent={requestCurrentLocation}
                            formProps={formProps}
                        />
                    </div>
                </div>
            )}
        </>
    );
}