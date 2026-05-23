import Link from "next/link";

export default function SaleBanner() {
  return (
    <section className="w-full py-10 sm:py-14">
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 via-indigo-950 to-violet-900 min-h-[280px] sm:min-h-[320px] flex items-center">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-violet-500/20 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full px-8 sm:px-12 md:px-16 py-10 gap-8">
          <div className="max-w-lg">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-base" aria-hidden="true">👑</span>
              <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase">
                Opulent Savings
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-3">
              Exclusive 50%
              <br />
              Luxury Sale
            </h2>

            {/* Subtitle */}
            <p className="text-base text-zinc-300 mb-8 max-w-sm">
              On selected Summer Essentials items.
            </p>

            {/* CTA */}
            <Link
              href={"/collections/summer-essentials"}
              className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-black rounded-full font-semibold text-sm sm:text-base hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg"
            >
              Shop Collection Now
            </Link>
          </div>

          {/* Right side decorative illustration */}
          <div className="hidden sm:flex items-center justify-center relative">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-violet-400/30 to-indigo-500/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-violet-500/40 to-purple-600/30 flex items-center justify-center">
                <span className="text-6xl md:text-7xl" aria-hidden="true">🛍️</span>
              </div>
            </div>
            {/* Floating sparkles */}
            <div className="absolute -top-2 right-4 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>✨</div>
            <div className="absolute bottom-4 -left-2 text-xl animate-bounce" style={{ animationDelay: "0.5s" }}>✨</div>
          </div>
        </div>
      </div>
    </section>
  );
}
