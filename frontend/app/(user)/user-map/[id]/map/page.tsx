"use client"

import { useState, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
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
  LogOut,
  MapPin,
  Calendar,
  ArrowUpDown,
  Send,
  ThumbsUp,
  ThumbsDown,
  Lock,
} from "lucide-react"
import styles from "./map.module.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

const PriceModal = ({ open, onClose, priceRange, onPriceChange, formatPrice }: {
  open: boolean
  onClose: () => void
  priceRange: number
  onPriceChange: (value: number) => void
  formatPrice: (price: number) => string
}) => {
  if (!open) return null
  return (
    <div className={styles.priceOverlay} onClick={onClose}>
      <div className={styles.priceModal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.priceModalTitle}>Price in MMK</h3>
        <div className="py-4">
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={priceRange}
            onChange={(e) => onPriceChange(parseInt(e.target.value))}
            className={styles.priceSlider}
          />
          <div className={styles.priceRange}>
            <span>10K</span>
            <span>1000K</span>
          </div>
          <p className={styles.priceValue}>
            MMK {formatPrice(priceRange)} -0K
          </p>
        </div>
        <div className={styles.priceButtons}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.modalApplyBtn} onClick={onClose}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

const FilterModal = ({ open, onClose, availableOnly, onAvailableChange, noOffersOnly, onNoOffersChange }: {
  open: boolean
  onClose: () => void
  availableOnly: boolean
  onAvailableChange: (value: boolean) => void
  noOffersOnly: boolean
  onNoOffersChange: (value: boolean) => void
}) => {
  if (!open) return null
  return (
    <div className={styles.filterOverlay} onClick={onClose}>
      <div className={styles.filterModal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.filterTitle}>Adjust the tasker</h3>
        <div className="py-4 space-y-6">
          <div className={styles.filterOption}>
            <div>
              <p className={styles.filterOptionText}>Available tasks only</p>
              <p className={styles.filterOptionSubtext}>Hide tasks that are already assigned</p>
            </div>
            <div
              className={`${styles.filterToggle} ${availableOnly ? styles.filterToggleActive : ""}`}
              onClick={() => onAvailableChange(!availableOnly)}
            />
          </div>
          <div className={styles.filterOption}>
            <div>
              <p className={styles.filterOptionText}>Tasks with no offers only</p>
              <p className={styles.filterOptionSubtext}>Hide tasks that have offers</p>
            </div>
            <div
              className={`${styles.filterToggle} ${noOffersOnly ? styles.filterToggleActive : ""}`}
              onClick={() => onNoOffersChange(!noOffersOnly)}
            />
          </div>
        </div>
        <button className={styles.filterApplyBtn} onClick={onClose}>
          Apply
        </button>
      </div>
    </div>
  )
}

const SortModal = ({ open, onClose, sortOption, onSortChange }: {
  open: boolean
  onClose: () => void
  sortOption: string
  onSortChange: (option: string) => void
}) => {
  if (!open) return null
  const options = [
    { id: "recent", label: "Most recently posted", icon: <Clock className="w-5 h-5" /> },
    { id: "price_asc", label: "Lowest price", icon: <DollarSign className="w-5 h-5" /> },
    { id: "price_desc", label: "Highest price", icon: <TrendingUp className="w-5 h-5" /> },
  ]
  return (
    <div className={styles.sortOverlay} onClick={onClose}>
      <div className={styles.sortModal} onClick={(e) => e.stopPropagation()}>
        <h4 className={styles.sortHeader}>Sort by</h4>
        <div className="py-2 space-y-1">
          {options.map((option) => (
            <button
              key={option.id}
              className={`${styles.sortOption} ${sortOption === option.id ? styles.sortOptionActive : ""}`}
              onClick={() => onSortChange(option.id)}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
        <div className={styles.sortFooter}>
          <button className={styles.sortApplyBtn} onClick={onClose}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

const categories = [
  { id: 'all', label: 'All', checked: true },
  { id: 'tutor', label: 'Tutor', checked: false },
  { id: 'guide', label: 'Guide', checked: false },
  { id: 'moving', label: 'Moving', checked: false },
  { id: 'packing', label: 'Packing', checked: false },
  { id: 'unpacking', label: 'Unpacking', checked: false },
  { id: 'cleaning', label: 'Cleaning', checked: false },
  { id: 'repair', label: 'Repair & Building', checked: false },
  { id: 'laundry', label: 'Laundry', checked: false },
  { id: 'ironing', label: 'Ironing', checked: false },
  { id: 'itsupport', label: 'IT Support', checked: false },
  { id: 'delivery', label: 'Delivery', checked: false },
  { id: 'cooking', label: 'Cooking', checked: false },
  { id: 'beauty', label: 'Beauty & Hair', checked: false },
  { id: 'gardening', label: 'Gardening', checked: false },
]

const CategoryModal = ({ open, onClose, search, onSearchChange, selected, onSelect }: {
  open: boolean
  onClose: () => void
  search: string
  onSearchChange: (value: string) => void
  selected: string[]
  onSelect: (categories: string[]) => void
}) => {
  if (!open) return null

  const filteredCategories = categories.filter(cat =>
    cat.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleCategoryClick = (id: string) => {
    if (id === 'all') {
      onSelect(['all'])
    } else {
      const newSelected = selected.filter(s => s !== 'all')
      if (newSelected.includes(id)) {
        const filtered = newSelected.filter(s => s !== id)
        onSelect(filtered.length === 0 ? ['all'] : filtered)
      } else {
        onSelect([...newSelected, id])
      }
    }
  }

  const handleClearAll = () => {
    onSelect(['all'])
    onSearchChange('')
  }

  return (
    <div className={styles.categoryOverlay} onClick={onClose}>
      <div className={styles.categoryModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.categoryHeader}>
          <h3>ALL CATEGORIES</h3>
        </div>

        <div className={styles.categorySearchWrapper}>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.categorySearch}
          />
          <button className={styles.categoryClearBtn} onClick={handleClearAll}>
            Clear All
          </button>
        </div>

        <div className={styles.categoryGrid}>
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className={`${styles.categoryItem} ${selected.includes(cat.id) ? styles.categoryItemSelected : ""}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <span className={styles.categoryLabel}>{cat.label}</span>
              <div className={`${styles.categoryCheckbox} ${selected.includes(cat.id) ? styles.categoryCheckboxChecked : ""}`}>
                {selected.includes(cat.id) && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.categoryFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.categoryApplyBtn} onClick={onClose}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

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
  const menuRef = useRef<HTMLDivElement>(null)

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
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"])
  const [showMenuDropdown, setShowMenuDropdown] = useState(false)
  const [showTaskFlowModal, setShowTaskFlowModal] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenuDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
            <button className={styles.navBtn} onClick={() => toggleModal("category")}>
              Category
            </button>
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

          <button className={styles.menuBtn} onClick={() => setShowMenuDropdown(!showMenuDropdown)}>
            <Menu className="w-5 h-5" />
          </button>
          {showMenuDropdown && (
            <div className={styles.dropdownMenu} ref={menuRef}>
              <div className={styles.dropdownItem} onClick={() => setShowMenuDropdown(false)}>Profile</div>
              <div className={styles.dropdownItem} onClick={() => setShowMenuDropdown(false)}>Browse tasks</div>
              <div className={styles.dropdownItem} onClick={() => setShowMenuDropdown(false)}>Settings</div>
              <div className={styles.dropdownItem} onClick={() => setShowMenuDropdown(false)}>Help</div>
              <div className={styles.dropdownDivider} />
              <div className={styles.dropdownItem}>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </div>
          )}
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

        {/* Task Flow Modal */}
        {showTaskFlowModal && (
          <div className={styles.taskFlowOverlay} onClick={() => setShowTaskFlowModal(false)}>
            <div className={styles.taskFlowModal} onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className={styles.taskFlowHeader}>
                <div>
                  <div className={styles.taskFlowBreadcrumb}>
                    <span className={styles.breadcrumbItem}>Open</span>
                    <span className={`${styles.breadcrumbItem} ${styles.breadcrumbActive}`}>Assigned</span>
                    <span className={styles.breadcrumbItem}>Completed</span>
                  </div>
                  <h2 className={styles.taskFlowTitle}>Create a Happy Feeling with me. I can make everything you want.</h2>
                </div>
                <button className={styles.taskFlowCloseBtn} onClick={() => setShowTaskFlowModal(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className={styles.taskFlowBody}>
                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIconBox}><User className="w-5 h-5" /></div>
                    <div>
                      <span className={styles.statLabel}>Post By</span>
                      <h4 className={styles.statValue}>Aung Kaung Myat</h4>
                      <span className={styles.statSubtext}>about 19 hours ago</span>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIconBox}><MapPin className="w-5 h-5" /></div>
                    <div>
                      <span className={styles.statLabel}>Location</span>
                      <h4 className={styles.statValue}>Pyay, Yangon</h4>
                      <span className={styles.statSubtext}>Service Area</span>
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statIconBox}><Calendar className="w-5 h-5" /></div>
                    <div>
                      <span className={styles.statLabel}>To be done on</span>
                      <h4 className={styles.statValue}>Today</h4>
                      <span className={styles.statSubtext}>Afternoon(2pm-6pm)</span>
                    </div>
                  </div>
                </div>

                {/* Budget Banner */}
                <div className={styles.budgetBanner}>
                  <span className={styles.budgetLabel}>Task Budget</span>
                  <h3 className={styles.budgetAmount}>20000 MMK</h3>
                  <div className={styles.budgetBadge}>Assigned</div>
                  <p className={styles.budgetEscrow}><Lock className="w-3 h-3 inline-block mr-1" /> Payment held securely in Escrow</p>
                </div>

                {/* Details */}
                <div className={styles.detailsBlock}>
                  <div className={styles.detailsHeader}>
                    <span className={styles.detailsLabel}>Details</span>
                    <button className={styles.detailsToggle}>
                      Less <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <div className={styles.detailsContent}>
                    <p>Builds their story based on mutual agreements and physical training goals. Ensuring all parts of the teaching syllabus is completely completed on time.</p>
                    <p>We require someone with patience, extreme dedication and great communication skills. Materials are all provided.</p>
                  </div>
                </div>

                {/* Comments */}
                <div className={styles.commentsSection}>
                  <div className={styles.commentsHeader}>
                    <h3 className={styles.commentsTitle}>Comments</h3>
                    <button className={styles.commentsSortBtn}>
                      <ArrowUpDown className="w-3.5 h-3.5" /> Sort by
                    </button>
                  </div>
                  <div className={styles.commentInputRow}>
                    <div className={styles.commentInputAvatar}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className={styles.commentInputWrap}>
                      <input type="text" placeholder="Add a comment..." className={styles.commentInput} />
                      <button className={styles.commentSendBtn}>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className={styles.commentFeed}>
                    <div className={styles.commentItem}>
                      <div className={styles.commentAvatar}>AK</div>
                      <div className={styles.commentBody}>
                        <div className={styles.commentMeta}>
                          <span className={styles.commentUsername}>@aungkaungmyat</span>
                          <span className={styles.commentTime}>1 hour ago</span>
                        </div>
                        <p className={styles.commentText}>This guy is good and very very kind. High professional attitude and prompt response.</p>
                        <div className={styles.commentActions}>
                          <button className={styles.commentActionBtn}>
                            <ThumbsUp className="w-3 h-3" /> 15
                          </button>
                          <button className={styles.commentActionBtn}>
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                          <button className={styles.commentReplyBtn}>Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.taskFlowFooter}>
                <button className={styles.taskFlowCancelBtn} onClick={() => setShowTaskFlowModal(false)}>Cancel</button>
                <button className={styles.taskFlowConfirmBtn} onClick={() => setShowTaskFlowModal(false)}>Confirm</button>
              </div>
            </div>
          </div>
        )}
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
        <PriceModal
          open={showPriceModal}
          onClose={() => toggleModal("price")}
          priceRange={priceRange}
          onPriceChange={(val) => setPriceRange(val)}
          formatPrice={formatPrice}
        />

        {/* Filter Modal */}
        <FilterModal
          open={showFilterModal}
          onClose={() => toggleModal("filter")}
          availableOnly={availableOnly}
          onAvailableChange={setAvailableOnly}
          noOffersOnly={noOffersOnly}
          onNoOffersChange={setNoOffersOnly}
        />

        {/* Sort Modal */}
        <SortModal
          open={showSortModal}
          onClose={() => toggleModal("sort")}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />

        {/* Category Modal */}
        <CategoryModal
          open={showCategoryModal}
          onClose={() => toggleModal("category")}
          search={categorySearch}
          onSearchChange={setCategorySearch}
          selected={selectedCategories}
          onSelect={setSelectedCategories}
        />

        {/* Profile Modal - Custom (unchanged) */}
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
                  <button className={styles.confirmBtn} onClick={() => { closeProfileModal(); setShowTaskFlowModal(true); }}>
                    Confirm
                  </button>
                  <button className={styles.cancelBtnLg} onClick={closeProfileModal}>
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