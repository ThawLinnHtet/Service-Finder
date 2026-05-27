"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { MOCK_TASKER, MOCK_USERS, YANGON_CENTER, SERVICE_ICONS, type RouteInfo } from "./components/types"
import { fetchDirections, haversineDistance } from "./components/utils"
import MapHeader from "./components/MapHeader"
import SideDrawer from "./components/SideDrawer"
import ActiveTaskCard from "./components/ActiveTaskCard"
import SearchPanel from "./components/SearchPanel"
import MapControls from "./components/MapControls"
import CallDialog from "./components/CallDialog"
import TokenModal from "./components/TokenModal"
import Toast from "./components/Toast"
import styles from "./map.module.css"
const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
// const DEFAULT_TOKEN = "pk.YOUR_MAPBOX_TOKEN_HERE"

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const taskerMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const userMarkersRef = useRef<mapboxgl.Marker[]>([])
  const [activeUserId, setActiveUserId] = useState<number | null>(1)
  const [route, setRoute] = useState<RouteInfo | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentStyle, setCurrentStyle] = useState("mapbox://styles/mapbox/streets-v12")
  const [showDrawer, setShowDrawer] = useState(false)
  const [showCallDialog, setShowCallDialog] = useState(false)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [routeVisible, setRouteVisible] = useState(true)
  const [cardCollapsed, setCardCollapsed] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const [toastVisible, setToastVisible] = useState(false)

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }, [])

  // Calculate route between tasker and a user
  const calculateRoute = useCallback(async (userId: number) => {
    const user = MOCK_USERS.find((u) => u.id === userId)
    if (!user || !map.current) return

    setActiveUserId(userId)
    setRouteLoading(true)
    showToast(`Calculating route to ${user.name}...`)

    const result = await fetchDirections(MOCK_TASKER.coords, user.coords, user)
    setRoute(result)
    setRouteLoading(false)

    const m = map.current
    const path = result.path

    // Fly to route
    const bounds = path.reduce(
      (acc, coord) => acc.extend(coord as [number, number]),
      new mapboxgl.LngLatBounds(path[0], path[0])
    )
    m.fitBounds(bounds, { padding: { top: 80, bottom: 80, left: 320, right: 320 }, duration: 1500 })

    setRouteVisible(true)
    showToast(`Route — ${result.totalDistanceKm.toFixed(1)} km, ${result.estimatedMinutes} mins ETA`)
  }, [showToast])

  // Initialize map
  useEffect(() => {
    const stored = localStorage.getItem("custom_mapbox_token")
    mapboxgl.accessToken = stored || DEFAULT_TOKEN

    if (map.current || !mapContainer.current) return

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: currentStyle,
      center: YANGON_CENTER,
      zoom: 13.5,
      pitch: 30,
      bearing: -5,
      antialias: true,
    })

    m.on("load", () => {
      setMapLoaded(true)

      // Tasker marker (purple pulsing)
      const taskerEl = document.createElement("div")
      taskerEl.className = styles.taskerMapMarker
      taskerEl.innerHTML = `<div class="${styles.taskerMarkerInner}">
        <i class="fa-solid fa-user-gear"></i>
      </div>`
      taskerMarkerRef.current = new mapboxgl.Marker(taskerEl)
        .setLngLat(MOCK_TASKER.coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${MOCK_TASKER.name}</b><br/>★ ${MOCK_TASKER.rating} · Tasker`))
        .addTo(m)

      // User markers
      MOCK_USERS.forEach((u) => {
        const el = document.createElement("div")
        el.className = styles.userMapMarker
        const icon = SERVICE_ICONS[u.serviceRequested] || "fa-circle"
        el.innerHTML = `<div class="${styles.userMarkerInner}">
          <i class="fa-solid ${icon}"></i>
        </div>`

        const dist = haversineDistance(MOCK_TASKER.coords, u.coords)
        const popupHtml = `
          <div style="font-family: sans-serif; min-width: 160px;">
            <b>${u.name}</b><br/>
            <span style="color:#6b7280;font-size:12px;">${u.serviceRequested}</span><br/>
            <span style="color:#a78bfa;font-size:12px;">${dist.toFixed(1)} km away</span><br/>
            <span style="color:#9ca3af;font-size:11px;">${u.address}</span>
          </div>
        `
        const marker = new mapboxgl.Marker(el)
          .setLngLat(u.coords)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml))
          .addTo(m)

        el.addEventListener("click", () => calculateRoute(u.id))
        userMarkersRef.current.push(marker)
      })

      // Auto-load first user route
      calculateRoute(1)
    })

    m.on("error", () => setMapLoaded(true))
    map.current = m

    return () => {
      taskerMarkerRef.current?.remove()
      userMarkersRef.current.forEach((mk) => mk.remove())
      m.remove()
      map.current = null
    }
  }, [])

  // Update route source data when route changes (no setStyle)
  useEffect(() => {
    const m = map.current
    if (!m || !route) return
    const sourceId = "route-source"
    if (m.getSource(sourceId)) {
      ;(m.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: route.path },
      })
    } else {
      m.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: route.path },
        },
      })
      m.addLayer({
        id: "route-gps", type: "line", source: sourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#2563eb", "line-width": 6, "line-opacity": 1 },
      })
    }
  }, [route])

  // Only re-apply style + markers when style URL actually changes
  const prevStyle = useRef(currentStyle)
  useEffect(() => {
    const m = map.current
    if (!m || !mapLoaded) return
    if (prevStyle.current === currentStyle) return
    prevStyle.current = currentStyle

    m.setStyle(currentStyle)
    m.once("style.load", () => {
      // Re-add route
      if (route) {
        const srcId = "route-source"
        m.addSource(srcId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: route.path },
          },
        })
        m.addLayer({
          id: "route-gps", type: "line", source: srcId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#2563eb", "line-width": 6, "line-opacity": 1 },
        })
      }
      // Re-add tasker marker
      const taskerEl = document.createElement("div")
      taskerEl.className = styles.taskerMapMarker
      taskerEl.innerHTML = `<div class="${styles.taskerMarkerInner}"><i class="fa-solid fa-user-gear"></i></div>`
      taskerMarkerRef.current = new mapboxgl.Marker(taskerEl)
        .setLngLat(MOCK_TASKER.coords)
        .addTo(m)

      // Re-add user markers
      userMarkersRef.current.forEach((mk) => mk.remove())
      userMarkersRef.current = []
      MOCK_USERS.forEach((u) => {
        const el = document.createElement("div")
        el.className = styles.userMapMarker
        const icon = SERVICE_ICONS[u.serviceRequested] || "fa-circle"
        el.innerHTML = `<div class="${styles.userMarkerInner}"><i class="fa-solid ${icon}"></i></div>`
        const marker = new mapboxgl.Marker(el).setLngLat(u.coords).addTo(m)
        el.addEventListener("click", () => calculateRoute(u.id))
        userMarkersRef.current.push(marker)
      })
    })
  }, [currentStyle, mapLoaded, route, calculateRoute])

  const toggleRouteLine = useCallback(() => {
    const m = map.current
    if (!m) return
    if (routeVisible) {
      m.setPaintProperty("route-gps", "line-opacity", 0)
      setRouteVisible(false)
      showToast("Path hidden.")
    } else {
      m.setPaintProperty("route-gps", "line-opacity", 1)
      setRouteVisible(true)
      showToast("Path visible.")
    }
  }, [routeVisible, showToast])

  const changeMapStyle = useCallback((url: string) => {
    setCurrentStyle(url)
    showToast("Map style updated.")
  }, [showToast])

  const handleSearch = useCallback((query: string) => {
    const m = map.current
    if (!m) return
    const q = query.toLowerCase()

    const found = MOCK_USERS.find(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.address.toLowerCase().includes(q) ||
        u.serviceRequested.toLowerCase().includes(q)
    )
    if (found) {
      calculateRoute(found.id)
      m.flyTo({ center: found.coords, zoom: 15, duration: 1500 })
      showToast(`Found ${found.name} — ${found.serviceRequested}`)
    } else {
      showToast(`No matching user found for "${query}"`)
    }
  }, [calculateRoute, showToast])

  const handleSaveToken = useCallback((token: string) => {
    if (token.trim()) {
      localStorage.setItem("custom_mapbox_token", token.trim())
    } else {
      localStorage.removeItem("custom_mapbox_token")
    }
    showToast("Token saved. Reloading...")
    setShowTokenModal(false)
    setTimeout(() => window.location.reload(), 1000)
  }, [showToast])

  return (
    <div className={styles.main}>
      <MapHeader
        onToggleDrawer={() => setShowDrawer((v) => !v)}
        onToggleToken={() => setShowTokenModal(true)}
      />

      <SideDrawer
        open={showDrawer}
        activeUserId={activeUserId}
        onSelectUser={(id) => { calculateRoute(id); setShowDrawer(false) }}
        onChangeStyle={changeMapStyle}
        onClose={() => setShowDrawer(false)}
      />

      <main className={styles.mapContainer}>
        <div ref={mapContainer} className={styles.map} />

        <div className={`${styles.mapLoader} ${mapLoaded ? styles.mapLoaderHidden : ""}`}>
          <div className={styles.spinner}>
            <div className={styles.spinnerRing} />
            <i className={`fa-solid fa-map-location ${styles.spinnerIcon}`} />
          </div>
          <p className={styles.loaderText}>Loading Yangon dispatch grid...</p>
        </div>

        {routeLoading && (
          <div className={styles.routeLoadingOverlay}>
            <i className="fa-solid fa-spinner fa-spin" /> Calculating route...
          </div>
        )}

        <ActiveTaskCard
          route={route}
          collapsed={cardCollapsed}
          onToggleCollapse={() => setCardCollapsed((v) => !v)}
          onDirectionToggle={toggleRouteLine}
          onCall={() => setShowCallDialog(true)}
        />

        <SearchPanel
          onSearch={handleSearch}
          onUserSelect={(id) => calculateRoute(id)}
        />

        <MapControls
          onRecenter={() => {
            if (route) {
              const bounds = route.path.reduce(
                (acc, coord) => acc.extend(coord as [number, number]),
                new mapboxgl.LngLatBounds(route.path[0], route.path[0])
              )
              map.current?.fitBounds(bounds, { padding: 100, duration: 1500 })
            }
          }}
          onZoomIn={() => map.current?.zoomTo((map.current.getZoom() || 13) + 1)}
          onZoomOut={() => map.current?.zoomTo((map.current.getZoom() || 13) - 1)}
        />

        <CallDialog
          open={showCallDialog}
          userName={route?.user.name || "User"}
          onClose={() => setShowCallDialog(false)}
          onAccept={() => { showToast("Call connected!"); setShowCallDialog(false) }}
        />

        <TokenModal
          open={showTokenModal}
          onClose={() => setShowTokenModal(false)}
          onSave={handleSaveToken}
        />

        <Toast message={toastMsg} visible={toastVisible} />
      </main>
    </div>
  )
}
