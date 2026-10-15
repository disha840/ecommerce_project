import React from 'react'
import { ShoppingBag } from 'lucide-react'

const Loader = () => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#713F50]/30 backdrop-blur-sm">

      <div className="flex flex-col items-center gap-5 rounded-3xl border border-[#EBD9D9] bg-[#FFF9F6] px-12 py-9 shadow-[0_8px_30px_rgba(113,63,80,0.25)]">

        {/* Spinner */}
        <div className="relative flex h-20 w-20 items-center justify-center">

          {/* Outer ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#F0DDE1] border-t-[#96566A]" />

          {/* Inner ring (reverse direction) */}
          <div
            className="absolute inset-2.5 animate-spin rounded-full border-4 border-transparent border-b-[#B65D70]"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          />

          {/* Center logo */}
          <div className="flex h-9 w-9 animate-pulse items-center justify-center rounded-xl bg-[#F0DDE1] text-[#96566A]">
            <ShoppingBag size={18} strokeWidth={1.8} />
          </div>

        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-[10px] font-medium tracking-[4px] text-[#96566A]">
            MYSTORE
          </p>

          <div className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#713F50]">
            <span>Loading</span>

            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#96566A]" />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#96566A]"
                style={{ animationDelay: '0.15s' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#96566A]"
                style={{ animationDelay: '0.3s' }}
              />
            </span>
          </div>

          <p className="mt-1 text-xs text-[#A17B86]">
            Please wait a moment
          </p>
        </div>

      </div>
    </div>
  )
}

export default Loader
