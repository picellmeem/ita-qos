export default function ColorfulBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Blob 1: cyan/teal — top-left */}
      <div className="absolute -left-32 -top-40 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-cyan-300 to-teal-400 opacity-60 blur-[120px]" />
      {/* Blob 2: deep blue — top-center */}
      <div className="absolute -top-20 left-[28%] h-[520px] w-[640px] rounded-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-55 blur-[140px]" />
      {/* Blob 3: navy — bottom-right */}
      <div className="absolute -bottom-32 -right-20 h-[440px] w-[520px] rounded-full bg-gradient-to-br from-blue-700 to-cyan-500 opacity-50 blur-[140px]" />
      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
