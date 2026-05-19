"use client"

import { useState, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
// import "mapbox-gl/dist/mapbox-gl.css"
import {
  Search,
  Menu,
  Crosshair,
  Plus,
  Minus,
  X,
  Clock,
  DollarSign,
  TrendingUp,
  ChevronDown,
  User,
  MessageSquare,
  RefreshCw,
} from "lucide-react"
// import styles from "./map.module.css"

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

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

  const formatPrice = (price: number) => {
    return price >= 1000 ? `${price / 1000}K` : price.toString()
  }

  return (
    <div className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>Logo</h1>

          <nav className={styles.nav}>
            <button className={styles.navBtn}>Category</button>
            <button className={`${styles.navBtn} ${styles.navBtnActive}`} onClick={() => toggleModal("taskerList")}>
              All tasker
            </button>
            <button className={styles.navBtn} onClick={() => toggleModal("price")}>
              Any price
            </button>
            <button className={styles.navBtn} onClick={() => toggleModal("filter")}>
              Filters
            </button>
            <button className={styles.navBtn} onClick={() => toggleModal("sort")}>
              Sort
            </button>
          </nav>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.ratingBadge}>
            <span className={styles.ratingStar}>★</span>
            <span>5.0(+K Taskers)</span>
          </div>

          <div className={styles.searchWrapper}>
            <input type="text" placeholder="Search..." className={styles.searchInput} />
            <Search className={styles.searchIcon} />
          </div>

          <button className={styles.menuBtn}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Map Container */}
      <div className={styles.mapContainer}>
        <div ref={mapContainer} className={styles.map} />

        {/* Map Controls */}
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

        {/* Tasker List Sidebar */}
        <div className={`${styles.taskerList} ${!showTaskerList ? styles.taskerListHidden : ""}`}>
          <div className={styles.taskerListHeader}>
            <h2 className={styles.taskerListTitle}>All Taskers about category</h2>
            <div className={styles.newTaskerBadge}>2 New Tasker Added</div>
          </div>

          <div className={styles.taskerCards}>
            {taskers.map((tasker) => (
              <div
                key={tasker.id}
                className={styles.taskerCard}
                onClick={() => openTaskerProfile(tasker.id)}
              >
                <div className={styles.taskerCardImage}>
                  <User className="w-8 h-8 text-gray-300" />
                </div>
                <div className={styles.taskerCardContent}>
                  <div className={styles.taskerCardHeader}>
                    <h4 className={styles.taskerCardName}>{tasker.name}</h4>
                    <div className={styles.taskerCardTags}>
                      {tasker.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.taskerCardMeta}>
                    <span className={styles.ratingText}>★</span>
                    <span>{tasker.rating} Rating</span>
                    <MessageSquare className="w-3 h-3 ml-2" />
                    <span>{tasker.reviews} Reviews</span>
                  </div>
                  <div className={styles.taskerCardFooter}>
                    <p className={styles.priceText}>
                      Start from : <span className={styles.priceValue}>{tasker.price} MMK</span>
                    </p>
                    <button className={`${styles.orderBtn} ${tasker.online ? styles.orderBtnOnline : styles.orderBtnOffline}`}>
                      {tasker.online ? "Order Now" : "Closed"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.taskerListFooter}>
            <button className={styles.cancelBtn} onClick={() => toggleModal("taskerList")}>
              Cancel
            </button>
            <div className={styles.refreshText}>
              <RefreshCw className="w-4 h-4" />
              Please wait
            </div>
          </div>
        </div>

        {/* Price Modal */}
        <div className={`${styles.modal} ${showPriceModal ? "" : styles.modalHidden}`}>
          <h3 className={styles.priceTitle}>Price in MMK</h3>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={priceRange}
            onChange={handlePriceChange}
            className={styles.priceSlider}
          />
          <div className={styles.priceRange}>
            <span>10K</span>
            <span>1000K</span>
          </div>
          <p className={styles.priceValueDisplay}>
            MMK {formatPrice(priceRange)} -0K
          </p>
          <div className={styles.modalActions}>
            <button className={styles.modalCancelBtn} onClick={() => toggleModal("price")}>
              Cancel
            </button>
            <button className={styles.modalApplyBtn} onClick={() => toggleModal("price")}>
              Apply
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        <div className={`${styles.modal} ${showFilterModal ? "" : styles.modalHidden}`}>
          <h3 className={styles.filterTitle}>Adjust the tasker</h3>

          <div className={styles.filterItem}>
            <div className={styles.filterItemInfo}>
              <p className={styles.filterItemTitle}>Available tasks only</p>
              <p className={styles.filterItemSubtitle}>Hide tasks that are already assigned</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.filterItem}>
            <div className={styles.filterItemInfo}>
              <p className={styles.filterItemTitle}>Tasks with no offers only</p>
              <p className={styles.filterItemSubtitle}>Hide tasks that have offers</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={noOffersOnly}
                onChange={(e) => setNoOffersOnly(e.target.checked)}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <button className={styles.filterApplyBtn} onClick={() => toggleModal("filter")}>
            Apply
          </button>
        </div>

        {/* Sort Modal */}
        <div className={`${styles.modal} ${showSortModal ? "" : styles.modalHidden}`}>
          <h3 className={styles.sortTitle}>Sort by</h3>
          <div className={styles.sortOptions}>
            <button
              className={`${styles.sortOption} ${sortOption === "recent" ? styles.sortOptionActive : ""}`}
              onClick={() => setSortOption("recent")}
            >
              <Clock className="w-5 h-5" />
              Most recently posted
            </button>
            <button
              className={`${styles.sortOption} ${sortOption === "price_asc" ? styles.sortOptionActive : ""}`}
              onClick={() => setSortOption("price_asc")}
            >
              <DollarSign className="w-5 h-5" />
              Lowest price
            </button>
            <button
              className={`${styles.sortOption} ${sortOption === "price_desc" ? styles.sortOptionActive : ""}`}
              onClick={() => setSortOption("price_desc")}
            >
              <TrendingUp className="w-5 h-5" />
              Highest price
            </button>
          </div>
          <div className={styles.sortFooter}>
            <button className={styles.sortApplyBtn} onClick={() => toggleModal("sort")}>
              Apply
            </button>
          </div>
        </div>

        {/* Profile Modal */}
        <div className={`${styles.profileOverlay} ${!showProfileModal ? styles.profileOverlayHidden : ""}`}>
          <div className={styles.profileModal}>
            <button className={styles.profileCloseBtn} onClick={closeProfileModal}>
              <X className="w-5 h-5" />
            </button>

            {selectedTasker && (
              <div className={styles.profileContent}>
                <div className={styles.profileHeader}>
                  <div>
                    <h2 className={styles.profileTitle}>Tutor/teacher/guide</h2>
                    <p className={styles.profileSubtitle}>
                      {selectedTasker.name} with 3 years experience
                    </p>
                  </div>
                  <div className={styles.profileRating}>
                    <div className={styles.profileRatingStars}>
                      {"★★★★☆".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                    <p className={styles.profileRatingText}>
                      {selectedTasker.rating}/5 - {selectedTasker.reviews}+tasker
                    </p>
                  </div>
                </div>

                <div className={styles.profileCard}>
                  <div className={styles.profileAvatar}>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTasker.id}`}
                      alt={selectedTasker.name}
                      className={styles.profileAvatarImg}
                    />
                    {selectedTasker.online && <div className={styles.profileOnline} />}
                  </div>
                  <div className={styles.profileDescription}>
                    <p className={styles.profileQuote}>
                      &quot;{selectedTasker.description}&quot;
                    </p>
                    <button className={styles.profileMoreBtn}>
                      More <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className={styles.profileGrid}>
                  <div>
                    <p className={styles.profileAddress}>{selectedTasker.address}</p>
                    <p className={styles.profilePhone}>{selectedTasker.phone}</p>
                    <p className={styles.profileEmail}>{selectedTasker.email}</p>
                  </div>
                  <div className={styles.profileHours}>
                    <div>
                      <p className={styles.hoursLabel}>Mon-Fri</p>
                      <p>{selectedTasker.hours.weekday}</p>
                    </div>
                    <div>
                      <p className={styles.hoursLabel}>Sat-Sun</p>
                      {selectedTasker.hours.closed ? (
                        <p className={styles.hoursClosed}>closed</p>
                      ) : (
                        <p>{selectedTasker.hours.weekend}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.profileActions}>
                  <button className={styles.confirmBtn} onClick={closeProfileModal}>
                    Confirm
                  </button>
                  <button className={styles.cancelBtn} onClick={closeProfileModal}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}