"use client"

import { useState, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { taskers, formatPrice } from "./components/types"
import MapHeader from "./components/MapHeader"
import MapContainer from "./components/MapContainer"
import MapControls from "./components/MapControls"
import ProfileModal from "./components/ProfileModal"
import TaskFlowModal from "./components/TaskFlowModal"
import styles from "./map.module.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])

  const [selectedTasker, setSelectedTasker] = useState<(typeof taskers)[number] | null>(null)
  const [priceRange, setPriceRange] = useState(10000)
  const [showTaskerList, setShowTaskerList] = useState(true)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [noOffersOnly, setNoOffersOnly] = useState(false)
  const [sortOption, setSortOption] = useState("price_asc")
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"])
  const [showTaskFlowModal, setShowTaskFlowModal] = useState(false)

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [96.1292, 16.8320],
      zoom: 13,
    })

    map.current.on("load", () => {
      taskers.forEach((tasker) => {
        const el = document.createElement("div")
        el.className = styles.customMarker
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9381FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`

        el.addEventListener("click", () => {
          if (map.current) {
            map.current.flyTo({ center: tasker.coords, zoom: 15 })
          }
          openTaskerProfile(tasker.id)
        })

        const marker = new mapboxgl.Marker(el)
          .setLngLat(tasker.coords)
          .addTo(map.current!)

        markers.current.push(marker)
      })
    })

    return () => {
      markers.current.forEach((marker) => marker.remove())
      markers.current = []
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const toggleModal = (modal: string) => {
    setShowTaskerList(modal === "taskerList" ? !showTaskerList : false)
    setShowPriceModal(modal === "price" ? !showPriceModal : false)
    setShowFilterModal(modal === "filter" ? !showFilterModal : false)
    setShowSortModal(modal === "sort" ? !showSortModal : false)
    setShowCategoryModal(modal === "category" ? !showCategoryModal : false)
  }

  const openTaskerProfile = (id: number) => {
    const tasker = taskers.find((t) => t.id === id)
    if (tasker) {
      setSelectedTasker(tasker)
      setShowProfileModal(true)
    }
  }

  const closeProfileModal = () => {
    setShowProfileModal(false)
    setSelectedTasker(null)
  }

  return (
    <div className={styles.main}>
      <MapHeader
        activeNav={
          showCategoryModal ? "category" :
          showTaskerList ? "taskerList" :
          showPriceModal ? "price" :
          showFilterModal ? "filter" :
          showSortModal ? "sort" : ""
        }
        showPriceModal={showPriceModal}
        showFilterModal={showFilterModal}
        showSortModal={showSortModal}
        showCategoryModal={showCategoryModal}
        showTaskerList={showTaskerList}
        priceRange={priceRange}
        availableOnly={availableOnly}
        noOffersOnly={noOffersOnly}
        sortOption={sortOption}
        categorySearch={categorySearch}
        selectedCategories={selectedCategories}
        taskers={taskers}
        formatPrice={formatPrice}
        onToggleTaskerList={() => toggleModal("taskerList")}
        onTogglePrice={() => toggleModal("price")}
        onToggleFilter={() => toggleModal("filter")}
        onToggleSort={() => toggleModal("sort")}
        onToggleCategory={() => toggleModal("category")}
        onPriceChange={(val) => setPriceRange(val)}
        onAvailableChange={setAvailableOnly}
        onNoOffersChange={setNoOffersOnly}
        onSortChange={setSortOption}
        onCategorySearchChange={setCategorySearch}
        onCategorySelect={setSelectedCategories}
        onTaskerClick={openTaskerProfile}
      />

      <div className={styles.mapContainer}>
        <MapContainer mapContainer={mapContainer} />
        <MapControls map={map} />

        <ProfileModal
          show={showProfileModal}
          tasker={selectedTasker}
          onClose={closeProfileModal}
          onConfirm={() => { closeProfileModal(); setShowTaskFlowModal(true) }}
        />

        <TaskFlowModal
          open={showTaskFlowModal}
          onClose={() => setShowTaskFlowModal(false)}
        />
      </div>
    </div>
  )
}
