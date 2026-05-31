export interface TaskerProfile {
  id: number
  name: string
  avatar: string
  phone: string
  coords: [number, number]
  rating: number
  jobsCompleted: number
}

export interface UserProfile {
  id: number
  name: string
  phone: string
  address: string
  coords: [number, number]
  serviceRequested: string
}

export interface RouteStep {
  instruction: string
  distanceKm: number
  direction: string
  icon: string
}

export interface RouteInfo {
  tasker: TaskerProfile
  user: UserProfile
  path: [number, number][]
  totalDistanceKm: number
  estimatedMinutes: number
  steps: RouteStep[]
  source: "api" | "mock"
}

export const MOCK_TASKER: TaskerProfile = {
  id: 1,
  name: "Min Thu",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MinThu",
  phone: "+95 9774280001",
  coords: [96.1550, 16.8350],
  rating: 4.8,
  jobsCompleted: 156,
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: 1,
    name: "Aung Kyaw Kyaw",
    phone: "+95 9774271230",
    address: "Yankin Children Hospital Area",
    coords: [96.1648, 16.8335],
    serviceRequested: "Cleaning",
  },
  {
    id: 2,
    name: "Nandar Win",
    phone: "+95 9774271231",
    address: "Inya Lake Shoreline",
    coords: [96.1492, 16.8332],
    serviceRequested: "Moving",
  },
  {
    id: 3,
    name: "Su Mon Aung",
    phone: "+95 9774271232",
    address: "Hlaing Township Main Rd",
    coords: [96.1265, 16.8375],
    serviceRequested: "Tutoring",
  },
  {
    id: 4,
    name: "Zaw Min Oo",
    phone: "+95 9774271233",
    address: "Kamayut, Yangon",
    coords: [96.1360, 16.8225],
    serviceRequested: "Plumbing",
  },
  {
    id: 5,
    name: "Phyu Phyu Win",
    phone: "+95 9774271234",
    address: "Insein, Yangon",
    coords: [96.1050, 16.8720],
    serviceRequested: "IT Support",
  },
  {
    id: 6,
    name: "Thura Tun",
    phone: "+95 9774271235",
    address: "Tamwe, Yangon",
    coords: [96.1430, 16.8080],
    serviceRequested: "Laundry",
  },
]

export const SERVICE_ICONS: Record<string, string> = {
  Cleaning: "fa-broom",
  Moving: "fa-truck",
  Tutoring: "fa-book-open",
  Plumbing: "fa-wrench",
  "IT Support": "fa-laptop-code",
  Laundry: "fa-soap",
}

export const YANGON_CENTER: [number, number] = [96.1420, 16.8350]

export const MAP_STYLES = [
  { label: "Streets", url: "mapbox://styles/mapbox/streets-v12", roadmap: true },
  { label: "Dark", url: "mapbox://styles/mapbox/dark-v11", roadmap: false },
  { label: "Navigation", url: "mapbox://styles/mapbox/navigation-night-v1", roadmap: false },
  { label: "Satellite", url: "mapbox://styles/mapbox/satellite-streets-v12", roadmap: false },
]
