
const geocodeAddress = async (address, landmark = "") => {
    const addressParts = address
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    const lastParts = addressParts.slice(-3).join(", ");
    const withoutHouseNumber = addressParts.slice(1).join(", ");

    const queries = [
        address,
        landmark ? `${address}, ${landmark}` : "",
        withoutHouseNumber,
        landmark ? `${landmark}, ${lastParts}` : "",
        lastParts
    ];

    const uniqueQueries = [...new Set(
        queries
            .filter(Boolean)
            .map((query) => `${query}, India`)
    )];

    for (let i = 0; i < uniqueQueries.length; i++) {
        try {
            const url = new URL("https://photon.komoot.io/api/");

            url.searchParams.set("q", uniqueQueries[i]);
            url.searchParams.set("limit", "5");
            url.searchParams.set("lang", "en");
            url.searchParams.set("countrycode", "IN");

            const response = await fetch(url, {
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                console.log("Photon API Error:", response.status);
                continue;
            }

            const data = await response.json();

            if (!data.features || data.features.length === 0) {
                console.log("No result for:", uniqueQueries[i]);
                continue;
            }

            const feature = data.features.find((item) => {
                const coordinates = item.geometry?.coordinates;

                return (
                    coordinates &&
                    Number.isFinite(coordinates[0]) &&
                    Number.isFinite(coordinates[1]) &&
                    coordinates[0] >= -180 &&
                    coordinates[0] <= 180 &&
                    coordinates[1] >= -90 &&
                    coordinates[1] <= 90 &&
                    item.properties?.countrycode?.toUpperCase() === "IN"
                );
            });

            if (feature) {
                const [longitude, latitude] = feature.geometry.coordinates;

                console.log("Address Found:", uniqueQueries[i]);
                console.log("Coordinates:", latitude, longitude);

                return {
                    latitude,
                    longitude,
                    matchedAddress: uniqueQueries[i],
                    matchedLevel: i + 1,
                    properties: feature.properties
                };
            }

        } catch (error) {
            console.log(
                `Geocoding attempt ${i + 1} failed:`,
                error.message
            );
        }
    }

    return null;
};

module.exports = geocodeAddress;
