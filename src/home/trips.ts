/*
 * Individual trip pages (reusable template at /trips/$slug).
 * Add a trip by adding a Departure in data.ts and a TripDetail here — verified details only.
 */
import {
  CONTACT,
  INCLUDED,
  ITINERARY,
  NOT_INCLUDED,
  PRICES,
  SPORTS,
  STAY,
  TERMS,
  TRIP,
  type Day,
} from "@/site/content";

import { DEPARTURES, type Departure } from "./data";

export type PriceOption = { title: string; amount: number; sub: string };

export type TripDetail = {
  slug: string;
  summary: string;
  pickup: string;
  priceOptions: PriceOption[];
  reserveAmount: string;
  paymentNote: string;
  itinerary: Day[];
  included: [string, string][];
  excluded: [string, string][];
  stayText: string;
  stayImages: { src: string; alt: string }[];
  meals: string;
  transport: string;
  activities: { title: string; text: string; img: string }[];
  terms: [string, string[]][];
};

const TRIP_DETAILS: TripDetail[] = [
  {
    slug: "goa-nov-2026",
    summary:
      "Old Goa & Panjim, a private sunset yacht party, South Goa's Cabo de Rama and Palolem, kayaking at sunset, Baga & Tito's Lane, and a full morning of water sports — with a crew that feels like family by day two.",
    pickup:
      "Departs Mumbai on Saturday 21 Nov at 10:00 PM by AC bus, returning to Mumbai at 5:30 AM on Wednesday 25 Nov. Goa-to-Goa travellers join on arrival in North Goa. Exact pickup points are shared with your booking confirmation.",
    priceOptions: PRICES.map(({ title, amount, sub }) => ({ title, amount, sub })),
    reserveAmount: TRIP.reserve,
    paymentNote: `Reserve your seat with ${TRIP.reserve} per person; the balance is payable at departure. Pay by UPI (${CONTACT.upi}) or ask us for bank-transfer details, then WhatsApp the payment screenshot to ${CONTACT.phone} for your booking confirmation.`,
    itinerary: ITINERARY,
    included: INCLUDED,
    excluded: NOT_INCLUDED,
    stayText:
      "Clean, comfortable 3-star hotel / resort / cottage on triple sharing, grouped by gender. Each room has one double bed and one sofa-cum-bed / mattress.",
    stayImages: STAY.map(({ src, alt }) => ({ src, alt })),
    meals: "2 breakfasts and 2 lunches included. Dinners and other meals are not included.",
    transport:
      "AC bus Mumbai ⇄ Goa (AC Pushback or AC Sleeper, depending on your option) and travel for the North & South Goa sightseeing.",
    activities: [
      {
        title: "Private Yacht Party",
        text: "Sunset on open water with music and party vibes.",
        img: "yacht.jpg",
      },
      {
        title: "Kayaking & Sunset",
        text: "Paddle Palolem's calm waters as the sun goes down.",
        img: "kayak.jpg",
      },
      ...SPORTS,
    ],
    terms: TERMS,
  },
];

export function getTrip(slug: string): { departure: Departure; detail: TripDetail } | null {
  const departure = DEPARTURES.find((d) => d.slug === slug);
  const detail = TRIP_DETAILS.find((d) => d.slug === slug);
  return departure && detail ? { departure, detail } : null;
}

export const isPast = (d: Departure, today = new Date().toISOString().slice(0, 10)) =>
  d.startDate < today;

/* Destinations the client has run before. Shown as enquiry-only until dates, prices and itinerary are confirmed. */
export const PLANNED_TRIPS = [
  {
    name: "Mahabaleshwar",
    image: "m-lake.jpg",
    alt: "Lake and valley view at Mahabaleshwar",
    text: "Misty viewpoints, table-land horses and hill-station weekends.",
  },
  {
    name: "Daman",
    image: "daman.jpg",
    alt: "Rocky beach at Daman under a blue sky",
    text: "A quick beach getaway with the Cheetah crew.",
  },
];
