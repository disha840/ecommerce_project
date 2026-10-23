
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between gap-6 border-b border-gray-200 bg-white px-8 py-4">
      <Link href="/" className="text-2xl font-bold text-green-600">
        QuickKart
      </Link>

      <div>
        <p className="text-sm font-semibold">Delivering to</p>
        <p className="text-sm text-gray-500">Select your location</p>
      </div>

      <input
        type="text"
        placeholder="Search for groceries..."
        className="w-full max-w-md rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-green-500"
      />

      <Link href="/login">Login</Link>

      <Link href="/cart" className="font-semibold text-green-700">
        Cart
      </Link>
    </nav>
  );
}
