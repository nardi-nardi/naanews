import type { Product } from "@/app/types/products";

export function ProductActions({ product }: { product: Product }) {
  const isPhysical = product.productType === "physical";
  const platforms = product.platforms || {};

  return (
    <div className="glass-panel rounded-xl p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-200">
        {isPhysical ? "Beli Produk Ini di:" : "Download Produk di:"}
      </h3>

      <div className="space-y-2">
        {isPhysical ? (
          <>
            {platforms.shopee && (
              <PlatformLink
                href={platforms.shopee}
                label="Beli di Shopee"
                color="bg-orange-600"
                icon="🛍️"
              />
            )}
            {platforms.tiktokshop && (
              <PlatformLink
                href={platforms.tiktokshop}
                label="Beli di TikTok Shop"
                color="bg-slate-900"
                icon="🎵"
              />
            )}
            {platforms.tokopedia && (
              <PlatformLink
                href={platforms.tokopedia}
                label="Beli di Tokopedia"
                color="bg-emerald-600"
                icon="🟢"
              />
            )}
          </>
        ) : (
          platforms.lynk && (
            <PlatformLink
              href={platforms.lynk}
              label="Download di Lynk"
              color="bg-cyan-600"
              icon="💎"
            />
          )
        )}
      </div>

      <p className="mt-3 text-center text-xs text-slate-500 italic">
        {isPhysical
          ? "Website ini tidak menyediakan sistem pembayaran secara langsung."
          : "Produk digital akan tersedia setelah pembayaran via platform eksternal."}
      </p>
    </div>
  );
}

function PlatformLink({
  href,
  label,
  color,
  icon,
}: {
  href: string;
  label: string;
  color: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 rounded-lg ${color} px-4 py-3 font-semibold text-white transition filter hover:brightness-110`}
    >
      {icon} {label}
    </a>
  );
}
