"use client"

import type { MutableRefObject } from "react"
import type mapboxgl from "mapbox-gl"
import { Crosshair, Plus, Minus } from "lucide-react"
import styles from "../map.module.css"

interface MapControlsProps {
  map: MutableRefObject<mapboxgl.Map | null>
}

export default function MapControls({ map }: MapControlsProps) {
  return (
    <div className={styles.mapControls}>
      <button className={styles.mapControlBtn}>
        <Crosshair className="w-5 h-5 text-gray-700" />
      </button>
      <div className={styles.zoomControls}>
        <button className={styles.zoomBtn} onClick={() => map.current?.zoomIn()}>
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button className={styles.zoomBtn} onClick={() => map.current?.zoomOut()}>
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  )
}
