const LOGO_URL = 'https://media.base44.com/images/public/6a075dcc5cdaf3650af66cec/6e7cc42e3_OrbinAIIcon.png';

export default function OrbinAILogo({ size = 28, className = '' }) {
  return (
    <img
      src={LOGO_URL}
      alt="Orbin"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}