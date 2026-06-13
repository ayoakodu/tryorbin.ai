const ICON_SVG_URL = 'https://media.base44.com/images/public/6a075dcc5cdaf3650af66cec/d29f57226_Untitleddesign.svg';

export default function RVNULogo({ size = 28, className = '' }) {
  return (
    <img
      src={ICON_SVG_URL}
      alt="Orbin"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}