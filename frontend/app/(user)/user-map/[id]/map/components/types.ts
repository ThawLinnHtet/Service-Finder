export interface Tasker {
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

export const categories = [
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

export const taskers: Tasker[] = [
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

export const formatPrice = (price: number) => {
  return price >= 1000 ? `${price / 1000}K` : price.toString()
}
