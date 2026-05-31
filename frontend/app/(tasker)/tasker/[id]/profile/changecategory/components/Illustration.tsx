import styles from "../changecategory.module.css"

export default function Illustration() {
  return (
    <div className={styles.illustrationCol}>
      <svg viewBox="0 0 500 500" className={styles.illustrationSvg} fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="120" y1="360" x2="380" y2="360" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        <path d="M100 340 C100 320, 130 310, 150 310 C170 310, 180 320, 190 325 C205 310, 230 310, 245 325 C260 310, 290 310, 305 325 C320 315, 345 315, 360 325 C370 325, 380 330, 385 340 C395 350, 395 360, 370 360 L120 360 C105 360, 100 350, 100 340 Z" fill="#E2E8F0" opacity="0.6" />
        <g transform="translate(340, 100)">
          <path d="M 0 40 L -20 50 L -2 30" fill="#E2E8F0" />
          <rect x="-100" y="-50" width="150" height="60" rx="10" fill="#E2E8F0" />
          <line x1="-90" y1="-30" x2="-20" y2="-30" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <line x1="-90" y1="-15" x2="-30" y2="-15" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <line x1="-90" y1="0" x2="-45" y2="0" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <rect x="30" y="-30" width="20" height="20" rx="4" fill="white" stroke="#6366F1" strokeWidth="2" />
          <path d="M 34 -20 L 38 -16 L 46 -24" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g transform="translate(180, 160)">
          <path d="M 0 0 L 15 20 L 5 -10" fill="#E2E8F0" />
          <rect x="-110" y="-40" width="125" height="45" rx="8" fill="#E2E8F0" />
          <line x1="-100" y1="-25" x2="-50" y2="-25" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-100" y1="-13" x2="-60" y2="-13" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="-10" y="-30" width="16" height="16" rx="3" fill="white" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M -7 -22 L -4 -19 L 2 -26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <line x1="170" y1="180" x2="170" y2="340" stroke="#475569" strokeWidth="2" />
        <circle cx="170" cy="180" r="6" fill="#475569" />
        <line x1="335" y1="150" x2="335" y2="210" stroke="#475569" strokeWidth="2" />
        <circle cx="335" cy="210" r="6" fill="#475569" />
        <rect x="180" y="210" width="55" height="55" rx="27.5" fill="#312E81" />
        <rect x="185" y="215" width="45" height="45" rx="22.5" fill="#3B386F" />
        <circle cx="205" cy="190" r="18" fill="#6366F1" />
        <path d="M 205 172 Q 225 155 330 205" stroke="#312E81" strokeWidth="2" fill="none" />
        <line x1="198" y1="190" x2="200" y2="190" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="210" y1="190" x2="212" y2="190" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 202 196 Q 205 200 208 196" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 185 228 L 165 245" stroke="#6366F1" strokeWidth="10" strokeLinecap="round" />
        <circle cx="165" cy="245" r="5" fill="#6366F1" />
        <path d="M 230 220 L 265 198" stroke="#6366F1" strokeWidth="10" strokeLinecap="round" />
        <circle cx="265" cy="198" r="5" fill="#6366F1" />
        <path d="M 197 265 L 197 340" stroke="#6366F1" strokeWidth="9" strokeLinecap="round" />
        <path d="M 213 265 Q 215 285 230 295 T 208 340" stroke="#6366F1" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className={styles.illustrationText}>
        <h3 className={styles.illustrationHeading}>Keep Your Services Updated</h3>
        <p className={styles.illustrationDesc}>This helps customers find your current skills, experience, and pricing details accurately.</p>
      </div>
    </div>
  )
}
