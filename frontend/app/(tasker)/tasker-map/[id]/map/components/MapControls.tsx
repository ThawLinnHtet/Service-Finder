"use client"

import styles from "../map.module.css"

interface MapControlsProps {
  onRecenter: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export default function MapControls({ onRecenter, onZoomIn, onZoomOut }: MapControlsProps) {
  return (
    <div className={styles.mapControls}>
      <button className={styles.recenterBtn} onClick={onRecenter} title="Recenter Camera">
        <i className="fa-solid fa-location-crosshairs" />
      </button>

      <div className={styles.zoomWidget}>
        <button className={styles.zoomBtn} onClick={onZoomIn} title="Zoom In">
          <i className="fa-solid fa-plus" />
        </button>
        <div className={styles.zoomDivider} />
        <button className={styles.zoomBtn} onClick={onZoomOut} title="Zoom Out">
          <i className="fa-solid fa-minus" />
        </button>
      </div>
    </div>
  )
}
