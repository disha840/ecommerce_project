
export default function Hero() {
  return (
    <section className="relative mx-6 mt-6 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-800 via-emerald-700 to-teal-600 px-10 py-16 text-white md:mx-10 md:px-16 md:py-20">
      <div className="relative z-10 max-w-xl">
        <p className="mb-4 font-medium text-emerald-200">
          FRESHNESS AT YOUR DOORSTEP
        </p>

        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          Fresh Groceries,
          <br />
          Happy Living.
        </h1>

        <p className="mt-5 max-w-md leading-7 text-emerald-50">
          Shop fresh fruits, vegetables and daily essentials
          delivered straight to your home.
        </p>

        <button className="mt-8 rounded-lg bg-white px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-100">
          Shop Now →
        </button>
      </div>

      
<div className="absolute right-8 top-1/2 hidden -translate-y-1/2 items-center gap-5 md:flex">
  <div className="flex h-36 w-36 rotate-[-8deg] items-center justify-center rounded-3xl border border-white/20 bg-white/15 text-7xl shadow-xl backdrop-blur-sm">
    🥑
  </div>

  <div className="flex flex-col gap-5">
    <div className="flex h-28 w-28 rotate-6 items-center justify-center rounded-3xl border border-white/20 bg-white/15 text-6xl shadow-xl backdrop-blur-sm">
      🍓
    </div>

    <div className="flex h-28 w-28 rotate-[-5deg] items-center justify-center rounded-3xl border border-white/20 bg-white/15 text-6xl shadow-xl backdrop-blur-sm">
      🥦
    </div>
  </div>
</div>

    </section>
  );
}
