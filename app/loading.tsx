"use client";

export default function Loading() {
  return (
    <div className="bg-canvas flex min-h-screen items-center justify-center px-4 py-12">
      <div className="text-center">
        {/* Animated Logo/Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative h-24 w-24">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan-400 border-r-cyan-400"></div>
            
            {/* Inner pulse */}
            <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 ring-1 ring-cyan-500/40"></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-cyan-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-100 md:text-2xl">
            Memuat Konten
          </h2>
          <p className="text-sm text-slate-400">
            Mohon tunggu sebentar...
          </p>
        </div>

        {/* Animated dots */}
        <div className="mt-4 flex justify-center gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"></div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 mx-auto w-64">
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800/60">
            <div className="h-full animate-loading-bar bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 0%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
