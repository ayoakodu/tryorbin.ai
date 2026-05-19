const LOGO_URL = 'https://media.base44.com/images/public/6a075dcc5cdaf3650af66cec/abe2ef8ec_RVNU.jpeg';

export default function RVNULogo({ size = 28, className = '' }) {
  return (
    <img
      src={LOGO_URL}
      alt="RVNU"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}