"use client"

import { useState, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
// import "mapbox-gl/dist/mapbox-gl.css"
import styles from "./map.module.css"

import MapHeader from "./components/MapHeader"
import MapContainer from "./components/MapContainer"
import MapControls from "./components/MapControls"
import ProfileModal from "./components/ProfileModal"

interface Tasker {
  id: number
  name: string
  rating: number
  reviews: number
  price: number
  tags: string[]
  coords: [number, number]
  online: boolean
  description: string
  phone: string
  email: string
  address: string
  hours: {
    weekday: string
    weekend: string
    closed: boolean
  }
}

const taskers: Tasker[] = [
  {
    id: 1,
    name: "Aung Kaung Myat",
    rating: 4.5,
    reviews: 1200,
    price: 1000,
    tags: ["Moving", "Packing & Unpacking"],
    coords: [96.1171, 16.8284],
    online: true,
    description: "Hello everyone, my name is Aung Kaung Myat. I have 3 years of experience in moving services...",
    phone: "+95 9774271230",
    email: "aung123@gmail.com",
    address: "No.12, Pyay, 75011 near Thamin, Yangon",
    hours: { weekday: "10h-8h", weekend: "closed", closed: true },
  },
  {
    id: 2,
    name: "Tiffini Grattin",
    rating: 3.5,
    reviews: 200,
    price: 5000,
    tags: ["Tutor", "Guide"],
    coords: [96.1305, 16.8402],
    online: true,
    description: "Hello everyone, My name is Dr Physics teacher...",
    phone: "+95 9774271231",
    email: "tiffini@gmail.com",
    address: "No.15, Hledan, Yangon",
    hours: { weekday: "9h-6h", weekend: "10h-4h", closed: false },
  },
  {
    id: 3,
    name: "Kyaw Zeya",
    rating: 4.9,
    reviews: 850,
    price: 1200,
    tags: ["Cleaning", "Repair"],
    coords: [96.1250, 16.8200],
    online: false,
    description: "Professional cleaning and repair services...",
    phone: "+95 9774271232",
    email: "kyaw@gmail.com",
    address: "No.20, Thingangyun, Yangon",
    hours: { weekday: "8h-7h", weekend: "9h-5h", closed: false },
  },
  {
    id: 4,
    name: "Hla Hla",
    rating: 4.2,
    reviews: 430,
    price: 2000,
    tags: ["Laundry", "Ironing"],
    coords: [96.1400, 16.8350],
    online: true,
    description: "Quality laundry and ironing services...",
    phone: "+95 9774271233",
    email: "hlahla@gmail.com",
    address: "No.8, Tamwe, Yangon",
    hours: { weekday: "7h-9h", weekend: "8h-6h", closed: false },
  },
  {
    id: 5,
    name: "Bo Bo",
    rating: 4.7,
    reviews: 90,
    price: 3000,
    tags: ["IT Support"],
    coords: [96.1100, 16.8500],
    online: true,
    description: "Expert IT support and computer repair...",
    phone: "+95 9774271234",
    email: "bobo@gmail.com",
    address: "No.25, Mayangone, Yangon",
    hours: { weekday: "10h-8h", weekend: "11h-5h", closed: false },
  },
]

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])

  const [selectedTasker, setSelectedTasker] = useState<Tasker | null>(null)
  const [priceRange, setPriceRange] = useState(10000)
  const [showTaskerList, setShowTaskerList] = useState(true)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [noOffersOnly, setNoOffersOnly] = useState(false)
  const [sortOption, setSortOption] = useState("price_asc")

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

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
    setShowTaskerList(modal === "taskerList" ? !showTaskerList : showTaskerList)
    setShowPriceModal(modal === "price" ? !showPriceModal : false)
    setShowFilterModal(modal === "filter" ? !showFilterModal : false)
    setShowSortModal(modal === "sort" ? !showSortModal : false)
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(parseInt(e.target.value))
  }

  return (
    <div className={styles.main}>
      <MapHeader
        activeNav={
          showPriceModal ? "price" :
          showFilterModal ? "filter" :
          showSortModal ? "sort" : ""
        }
        showPriceModal={showPriceModal}
        showFilterModal={showFilterModal}
        showSortModal={showSortModal}
        showTaskerList={showTaskerList}
        priceRange={priceRange}
        availableOnly={availableOnly}
        noOffersOnly={noOffersOnly}
        sortOption={sortOption}
        taskers={taskers}
        onToggleTaskerList={() => toggleModal("taskerList")}
        onTogglePrice={() => toggleModal("price")}
        onToggleFilter={() => toggleModal("filter")}
        onToggleSort={() => toggleModal("sort")}
        onPriceChange={handlePriceChange}
        onToggleAvailable={(checked) => setAvailableOnly(checked)}
        onToggleNoOffers={(checked) => setNoOffersOnly(checked)}
        onSortChange={(option) => setSortOption(option)}
        onPriceApply={() => toggleModal("price")}
        onFilterApply={() => toggleModal("filter")}
        onSortApply={() => toggleModal("sort")}
        onTaskerClick={openTaskerProfile}
      />
      <div className={styles.mapContainer}>
        <MapContainer mapContainer={mapContainer} />
        <MapControls map={map} />
        <ProfileModal
          show={showProfileModal}
          tasker={selectedTasker}
          onClose={closeProfileModal}
          onConfirm={closeProfileModal}
        />
      </div>
    </div>
  )
}
