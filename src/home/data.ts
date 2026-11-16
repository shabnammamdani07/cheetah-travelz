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

/* Section anchors on the homepage. Step 4 swaps service links to their own pages. */
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
    href: ANCHOR.trips,
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
    href: ANCHOR.holidays,
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
    href: ANCHOR.transport,
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
  priceFrom: number;
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
    slug: "goa-nov-2026",
    chip: "Goa",
    name: "Goa Group Trip",
    startDate: "2026-11-21",
    endDate: "2026-11-25",
    dateLabel: "21–24 Nov 2026",
    duration: "4 Nights / 3 Days",
    priceFrom: 8900,
    priceNote: "Goa to Goa · ₹10,900 from Mumbai",
    departure: "Mumbai departure",
    image: "beach-pan.jpg",
    alt: "Goa beach with palm trees and fishing boats",
    href: "/goa-trip",
  },
];

export function upcomingTrips(today = new Date().toISOString().slice(0, 10)) {
  return DEPARTURES.filter((d) => d.startDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4);
}

export const AUDIENCES = ["Couples", "Honeymoon", "Families", "Friends", "Private groups"];

export const DESTINATIONS = [
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
