type CloudInfrastructure3DProps = {
  className?: string
}

function CloudInfrastructure3D({ className = '' }: CloudInfrastructure3DProps) {
  return (
    <svg
      viewBox="0 0 600 400"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blueGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="blueGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="blueGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Isometric blocks - server racks / data units */}
      {/* Row 1 */}
      <g transform="translate(50, 200) rotate(-30 0 0)">
        <rect x="0" y="0" width="80" height="60" fill="url(#blueGrad1)" rx="8" />
        <rect x="5" y="5" width="70" height="50" fill="url(#blueGrad2)" rx="6" opacity="0.7" />
      </g>
      
      <g transform="translate(180, 180) rotate(-30 0 0)">
        <rect x="0" y="0" width="100" height="80" fill="url(#blueGrad2)" rx="8" />
        <rect x="5" y="5" width="90" height="70" fill="url(#blueGrad1)" rx="6" opacity="0.7" />
      </g>
      
      <g transform="translate(320, 160) rotate(-30 0 0)">
        <rect x="0" y="0" width="90" height="70" fill="url(#blueGrad1)" rx="8" />
        <rect x="5" y="5" width="80" height="60" fill="url(#blueGrad3)" rx="6" opacity="0.7" />
      </g>
      
      {/* Row 2 - Connected blocks */}
      <g transform="translate(120, 280) rotate(-30 0 0)">
        <rect x="0" y="0" width="90" height="70" fill="url(#blueGrad2)" rx="8" />
        <rect x="5" y="5" width="80" height="60" fill="url(#blueGrad1)" rx="6" opacity="0.7" />
      </g>
      
      <g transform="translate(260, 260) rotate(-30 0 0)">
        <rect x="0" y="0" width="110" height="90" fill="url(#blueGrad1)" rx="8" />
        <rect x="5" y="5" width="100" height="80" fill="url(#blueGrad2)" rx="6" opacity="0.7" />
      </g>
      
      <g transform="translate(420, 240) rotate(-30 0 0)">
        <rect x="0" y="0" width="85" height="65" fill="url(#blueGrad3)" rx="8" />
        <rect x="5" y="5" width="75" height="55" fill="url(#blueGrad1)" rx="6" opacity="0.7" />
      </g>
      
      {/* Connection lines */}
      <line x1="130" y1="250" x2="230" y2="230" stroke="#3b82f6" strokeWidth="3" opacity="0.4" />
      <line x1="270" y1="230" x2="360" y2="210" stroke="#3b82f6" strokeWidth="3" opacity="0.4" />
      <line x1="200" y1="330" x2="310" y2="310" stroke="#3b82f6" strokeWidth="3" opacity="0.4" />
      
      {/* Small connecting nodes */}
      <circle cx="180" cy="240" r="4" fill="#60a5fa" opacity="0.8" />
      <circle cx="315" cy="220" r="4" fill="#60a5fa" opacity="0.8" />
      <circle cx="255" cy="320" r="4" fill="#60a5fa" opacity="0.8" />
    </svg>
  )
}

export default CloudInfrastructure3D

