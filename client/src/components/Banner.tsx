import { useEffect, useState } from 'react';
import { useBanner, BannerType } from '../hooks/useBanner';

const TYPE_STYLES: Record<BannerType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: 'bg-green-900/95', border: 'border-green-500', text: 'text-green-300', icon: '✓' },
  error:   { bg: 'bg-red-900/95',   border: 'border-red-500',   text: 'text-red-300',   icon: '✗' },
  warning: { bg: 'bg-amber-900/95', border: 'border-amber-500', text: 'text-amber-300', icon: '⚠' },
  info:    { bg: 'bg-blue-900/95',  border: 'border-blue-500',  text: 'text-blue-300',  icon: '●' },
};

export default function Banner() {
  const { banner, dismissBanner } = useBanner();
  const [visible, setVisible] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  useEffect(() => {
    if (banner && banner.id !== currentId) {
      setCurrentId(banner.id);
      setVisible(false);
      // Small delay then slide in
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    }
    if (!banner) {
      setVisible(false);
    }
  }, [banner, currentId]);

  if (!banner) return null;

  const styles = TYPE_STYLES[banner.type];

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-transform duration-300 ease-out
        ${visible ? 'translate-y-0' : '-translate-y-full'}
      `}
      style={{ fontFamily: 'Press Start 2P, monospace' }}
    >
      <div className={`
        mx-auto max-w-sm mt-2 mx-2
        ${styles.bg} ${styles.border} border-2
        px-3 py-3 flex items-start gap-2
        shadow-lg shadow-black/50
      `}>
        <span className={`text-[10px] font-bold ${styles.text} flex-shrink-0 mt-0.5`}>
          {styles.icon}
        </span>
        <p className={`text-[9px] leading-relaxed ${styles.text} flex-1`}>
          {banner.message}
        </p>
        {/* User-dismissible close button */}
        <button
          onClick={dismissBanner}
          className={`flex-shrink-0 ${styles.text} opacity-70 hover:opacity-100 transition-opacity text-[12px] font-bold leading-none ml-1 mt-0.5`}
          aria-label="Dismiss"
          data-testid="banner-dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
