/*
 * Homepage content — VERIFIED DATA ONLY.
 * Dates, prices and reviews below come from the client's Goa trip PDF and Google reviews.
 * Never add invented prices, seat counts, statistics or reviews here.
 */
import { CONTACT } from "@/site/content";

export { CONTACT };

export const img = (name: string) => `/assets/img/${name}`;

export const WHATSAPP = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(
  "Hi Cheetah Travelz! I'd like to know more about your trips.",
)}`;

/* Page URLs (Step 4). Header links, service cards and final CTAs open these pages. */
export const ROUTES = {
  home: "/",
  trips: "/group-trips",
  holidays: "/customized-holidays",
  transport: "/cars-and-buses",
  about: "/about",
  contact: "/contact",
  blog: "/blog",
  reviews: "/reviews",
  account: "/account",
  terms: "/terms",
  refund: "/cancellation-refund-policy",
} as const;

/* Section anchors on the homepage — the hero buttons scroll to these. */
export const ANCHOR = {
  trips: "#group-trips",
  holidays: "#holidays",
  transport: "#transport",
  about: "#about",
  contact: "#contact",
} as const;

export const SERVICES = [
  {
    n: "01",
    key: "trips",
    title: "Solo Group Trips",
    text: "Come solo. Meet like-minded travellers. Leave with new friends.",
    cta: "Explore Group Trips",
    href: ROUTES.trips,
    image: "g-waterfall.jpg",
    alt: "Cheetah Travelz group in life jackets at a waterfall on a group trip",
    event: "cta_group_trips_click",
  },
  {
    n: "02",
    key: "holidays",
    title: "Customized Holidays",
    text: "Your plans. Your people. Your holiday.",
    cta: "Plan Your Holiday",
    href: ROUTES.holidays,
    image: "g-boat.jpg",
    alt: "Friends relaxing on a boat during a private holiday",
    event: "cta_holiday_click",
  },
  {
    n: "03",
    key: "transport",
    title: "Cars & Buses",
    text: "Chauffeur-driven travel, made easy.",
    cta: "Get a Vehicle Quote",
    href: ROUTES.transport,
    image: "g-bus.jpg",
    alt: "Travellers on board a Cheetah Travelz AC bus with mood lighting",
    event: "cta_transport_click",
  },
] as const;

/* Upcoming departures. Only verified trips; past departures drop off automatically (see upcomingTrips). */
export type Departure = {
  slug: string;
  chip: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  dateLabel: string;
  duration: string;
  priceFrom: number | null;
  priceNote: string;
  departure: string;
  ageGroup?: string; // only when supplied by the client
  seats?: number; // only when verified
  image: string;
  alt: string;
  href: string;
};

export const DEPARTURES: Departure[] = [
  {
    slug: "goa-girls-dec-2026",
    chip: "Goa · Girls only",
    name: "Goa Girls Trip",
    startDate: "2026-12-10",
    endDate: "2026-12-14",
    dateLabel: "10–13 Dec 2026",
    duration: "4 Nights / 3 Days",
    priceFrom: 8900,
    priceNote: "Goa to Goa · ₹10,900 from Mumbai",
    departure: "Mumbai departure",
    ageGroup: "Girls only",
    image: "palolem.jpg",
    alt: "Palolem beach in South Goa lined with palm trees",
    href: "/trips/goa-girls-dec-2026",
  },
  {
    slug: "goa-christmas-dec-2026",
    chip: "Goa · Christmas",
    name: "Goa Christmas Group Trip",
    startDate: "2026-12-24",
    endDate: "2026-12-28",
    dateLabel: "24–27 Dec 2026",
    duration: "4 Nights / 3 Days",
    priceFrom: 8900,
    priceNote: "Goa to Goa · Mumbai bus options available",
    departure: "Mumbai departure",
    image: "yacht.jpg",
    alt: "Private yacht party on the waters of Goa",
    href: "/trips/goa-christmas-dec-2026",
  },
  {
    slug: "goa-new-year-2027",
    chip: "Goa · New Year",
    name: "Goa New Year Trip",
    startDate: "2026-12-30",
    endDate: "2027-01-04",
    dateLabel: "30 Dec 2026 – 4 Jan 2027",
    duration: "4 Nights / 5 Days",
    priceFrom: 14900,
    priceNote: "₹14,900 per person · 5-day package",
    departure: "Mumbai departure",
    image: "pubcrawl.jpg",
    alt: "Goa nightlife and pub crawl",
    href: "/trips/goa-new-year-2027",
  },
  {
    slug: "igatpuri-camping",
    chip: "Igatpuri",
    name: "Igatpuri Camping Trip",
    startDate: "2027-01-16",
    endDate: "2027-01-17",
    dateLabel: "16–17 Jan 2027",
    duration: "1 Night / 2 Days",
    priceFrom: 4300,
    priceNote: "per person · GAIA Resort & Camping",
    departure: "Mumbai departure",
    image: "igt-campfire.jpg",
    alt: "Friends around a campfire beside tents at sunset in Igatpuri",
    href: "/trips/igatpuri-camping",
  },
];

export function upcomingTrips(today = new Date().toISOString().slice(0, 10), limit = 4) {
  return DEPARTURES.filter((d) => d.startDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}

export const AUDIENCES = ["Couples", "Honeymoon", "Families", "Friends", "Private groups"];

/*
 * Destination inspiration tiles + the enquiry form's "Destination" suggestions.
 * `image` is set only where the client supplied a real photo; tiles without one
 * render as text, so a place never shows a photo it doesn't have.
 */
export type Destination = { name: string; image?: string; alt: string };

export const DESTINATIONS: Destination[] = [
  { name: "Goa", image: "beach-pan.jpg", alt: "Goa beach lined with palm trees" },
  {
    name: "Kashmir",
    image: "kashmir.jpg",
    alt: "Houseboats on a Kashmir lake below snow-capped mountains",
  },
  { name: "Kerala", image: "kerala.jpg", alt: "Houseboat on the palm-lined Kerala backwaters" },
  {
    name: "Rajasthan",
    image: "rajasthan.jpg",
    alt: "Decorated horses passing Hawa Mahal in Jaipur",
  },
  {
    name: "Ladakh",
    image: "ladakh.jpg",
    alt: "Monastery on a rocky hill above a Ladakh valley with prayer flags",
  },
  {
    name: "Kutch",
    image: "kutch.jpg",
    alt: "Camel cart crossing the white salt desert of Kutch at sunset",
  },
  {
    name: "Ooty",
    image: "ooty.jpg",
    alt: "Misty tea gardens on the Nilgiri hills in Ooty",
  },
  {
    name: "Punjab",
    image: "punjab.jpg",
    alt: "The Golden Temple in Amritsar glowing at dusk",
  },
  {
    name: "Delhi",
    image: "delhi.jpg",
    alt: "India Gate in Delhi at golden hour",
  },
];

export const VEHICLES = [
  "Sedan & SUV",
  "Innova Crysta",
  "Tempo Traveller",
  "AC Pushback Bus",
  "AC Sleeper Bus",
] as const;

export const JOURNEYS = [
  "Airport Transfers",
  "Outstation Travel",
  "Local Sightseeing",
  "Family Travel",
  "Group Transportation",
  "Corporate & Event Transportation",
];

export const BENEFITS = [
  {
    title: "Thoughtfully Planned Journeys",
    text: "Every experience is planned with attention to the details that matter.",
    icon: "pin",
  },
  {
    title: "Personalised Assistance",
    text: "Get support according to your travel requirements.",
    icon: "chat",
  },
  {
    title: "Reliable Transportation",
    text: "Comfortable travel arrangements for different journey types.",
    icon: "car",
  },
  {
    title: "Selected Stays",
    text: "Accommodation options chosen according to the trip and package.",
    icon: "bed",
  },
  {
    title: "Dedicated Support",
    text: "Assistance throughout your travel planning and journey.",
    icon: "support",
  },
] as const;

/* Genuine Cheetah Travelz trip photos (client albums). Labels describe only what is known. */
export const MEMORIES = [
  {
    image: "g-room.jpg",
    label: "Group trip night",
    alt: "Large Cheetah Travelz group photo in a hotel room",
  },
  { image: "g-daman.jpg", label: "Daman trip", alt: "Friends posing together on the Daman trip" },
  { image: "g-beachnight.jpg", label: "Beach night", alt: "Friends standing in the sea at night" },
  {
    image: "g-rocks.jpg",
    label: "Waterfall adventure",
    alt: "Group in life jackets on the rocks by a waterfall",
  },
  {
    image: "g-red.jpg",
    label: "Night out together",
    alt: "Group of travellers on the beach at night",
  },
  {
    image: "m-horses.jpg",
    label: "Mahabaleshwar table land",
    alt: "Two wild horses on Mahabaleshwar table land",
  },
];

/* Authentic Google reviews (5★ as shown on the client's Google profile). */
export const REVIEWS = [
  {
    name: "Rubi",
    text: "Had such an amazing time! Met some really wonderful people, and huge kudos to the organizers for putting this together so beautifully. It honestly felt like we'd known each other for generations!",
  },
  {
    name: "Akshat Shah",
    text: "That trip was awesome! It was super comfy and totally stress-free. The leaders were so chill and made sure everyone was good with everything. What I loved most was that there was no pressure to go to specific places or spots. It was all relaxed and completely up to us what we wanted to do next depending on our mood and what we liked.",
  },
  {
    name: "Zee",
    text: "The trip was amazing and I had a great time. I will recommend everyone who is planning for a solo trip. Very flexible and friendly operators and the arrangements done were great.",
  },
  {
    name: "Shehbaz Ansari",
    text: "It's a amazing trip with lovely peoples. Special thanks to Abid for the wonderful co-ordination and very supportive nature.",
  },
];

export const BUDGETS = [
  "Under ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "Above ₹1,00,000",
  "Not sure yet",
];
