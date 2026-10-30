
"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [variants, setVariants] = useState([]);

  const fetchVariants = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/productvariant/getvariants/${slug}`
      );

      const data = await response.json();

      console.log("Variants:", data.variants);

      if (response.ok) {
        setVariants(data.variants || []);
      } else {
        setVariants([]);
      }
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchVariants();
    }
  }, [slug]);

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">

        {/* Heading */}

        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-emerald-600">
            Shop Your Favorites
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Choose Your Variant
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 md:text-base">
            Explore available options and select the one that suits you best.
          </p>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-emerald-500"></div>
        </div>

        {/* Variants */}

        {variants.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-20 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
              🛒
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              No Variants Available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Currently, no variants are available for this product.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Available Options
              </h2>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {variants.length} Variants
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">

              {variants.map((variant) => (
                <div
                  key={variant._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl" onClick={() => router.push(`/variants/${variant.slug}`)}
                >
                  {/* Image */}

                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-slate-100 sm:h-52">

                    {variant.images?.[0]?.url ? (
                      <img
                        src={variant.images[0].url}
                        alt={variant.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-6xl">🛒</span>
                    )}

                    {variant.discountPercentage > 0 && (
                      <span className="absolute left-3 top-3 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                        {variant.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Details */}

                  <div className="p-3 sm:p-4">

                    <h2 className="truncate text-base font-bold text-slate-800 sm:text-lg">
                      {variant.name}
                    </h2>

                    {variant.barcode && (
                      <p className="mt-2 truncate text-xs text-slate-400">
                        Barcode:{" "}
                        <span className="font-medium text-slate-600">
                          {variant.barcode}
                        </span>
                      </p>
                    )}

                    {/* Price */}

                    <div className="mt-4 flex min-h-9 items-center justify-between gap-2 border-t border-slate-100 pt-3">

                      {variant.sellingPrice != null ? (
                        <span className="text-lg font-extrabold text-emerald-700">
                          ₹{variant.sellingPrice}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Price unavailable
                        </span>
                      )}

                      

                    </div>

                    {/* Add Button */}

                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95">
                      <span className="text-lg">+</span>
                      Add to Cart
                    </button>

                  </div>
                </div>
              ))}

            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default page;
