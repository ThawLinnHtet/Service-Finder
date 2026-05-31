import styles from "../map.module.css"

interface MapContainerProps {
  mapContainer: { current: HTMLDivElement | null }
}

export default function MapContainer({ mapContainer }: MapContainerProps) {
  return <div ref={mapContainer} className={styles.map} />
}
