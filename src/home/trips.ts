/*
 * Individual trip pages (reusable template at /trips/$slug).
 * Add a trip by adding a Departure in data.ts and a TripDetail here — verified details only.
 */
import {
  CONTACT,
  INCLUDED,
  NOT_INCLUDED,
  PRICES,
  SPORTS,
  STAY,
  TRIP,
  type Day,
} from "@/site/content";

import { DEPARTURES, type Departure } from "./data";
import christmasBrochure from "@/assets/goa-24-27-december-2026.pdf.asset.json";
import newYearBrochure from "@/assets/goa-new-year-trip-itinerary.pdf.asset.json";

export type PriceOption = {
  title: string;
  amount: number;
  sub: string;
  earlyBird?: { before: string; regularAmount: number };
};

export type TripDetail = {
  slug: string;
  summary: string;
  pickup: string;
  priceOptions: PriceOption[];
  reserveAmount: string;
  /** Rupees per person charged online at booking (Razorpay). */
  reservePerPerson: number;
  reserveLine?: string;
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
  brochureUrl?: string;
};

export const ITINERARY_POLICY = {
  noShowChargePercent: 100,
  organizerCancellationRefundPercent: 100,
  arrivalMinutesBeforeDeparture: 15,
  defaultHotelOccupancy: 3,
  hotelStars: 3,
  doubleBeds: 1,
  extraBedsOrMattresses: 1,
} as const;

const HOTEL_TERMS =
  `Clean, comfortable ${ITINERARY_POLICY.hotelStars}-star hotel/resort/cottage on ${ITINERARY_POLICY.defaultHotelOccupancy}-person (triple) sharing by default, grouped by gender (men with men, women with women). Rooms have ${ITINERARY_POLICY.doubleBeds} double bed and ${ITINERARY_POLICY.extraBedsOrMattresses} sofa-cum-bed/mattress.`;

/* Shared Terms, Cancellation & Refunds for every itinerary; amount, meals and stay follow each trip. */
function standardTerms(amount: string, meals: string, stay = HOTEL_TERMS, stayTitle = "Hotel accommodation"): [string, string[]][] {
  return [
    ["Booking & payment", [`${amount}/person confirms your seat. Balance amount as per the booking confirmation is payable at the time of boarding.`]],
    ["Cancellation policy", [
      `By traveller: the ${amount} booking amount is non-refundable but transferable to another person before departure (replacement traveller must share required details in advance). No-show or failure to transfer before departure is treated as a ${ITINERARY_POLICY.noShowChargePercent}% cancellation charge.`,
      `By Cheetah Travelz: if we cancel due to operational reasons, low bookings or minimum group size not being met, you may choose a full (${ITINERARY_POLICY.organizerCancellationRefundPercent}%) refund of ${amount} or a transfer to the next available batch.`,
    ]],
    [stayTitle, [stay]],
    ["Seats, pickups & itinerary changes", [`Seats are allotted first-come, first-served. Pickup timings may vary due to traffic/weather/operations — report ${ITINERARY_POLICY.arrivalMinutesBeforeDeparture} minutes before departure. The itinerary may change or be skipped due to weather, road closures, government restrictions or unforeseen circumstances. Boating, horse riding and other personal activities are not included.`]],
    ["Meals", [`${meals} Timings may vary with hotel/travel schedule.`]],
    ["Traveller responsibilities & code of conduct", ["Carry a valid Aadhaar/government photo ID. No drinking, smoking or prohibited substances in the vehicle. Travellers are responsible for their own belongings. Zero tolerance for abusive/inappropriate behaviour, harassment, property damage, hate speech/discrimination or conduct disrupting the trip — Cheetah Travelz may remove any traveller without refund for unsafe or disruptive behaviour."]],
    ["Liability & jurisdiction", ["Not responsible for delays, route changes, breakdowns, weather or events beyond reasonable control; no refunds or compensation for such disruptions. Travellers participate at their own risk and must follow coordinator safety instructions. Disputes are subject to the exclusive jurisdiction of courts in Mumbai."]],
  ];
}

const TRIP_DETAILS: TripDetail[] = [
  {
    slug: "goa-girls-dec-2026",
    summary:
      "A girls-only Goa getaway: Old Goa & Panjim, a private sunset yacht party, South Goa's Cabo de Rama and Palolem with sunset kayaking, beach nights and all four water sports.",
    pickup: "Departs Mumbai on Thursday 10 Dec at 10:00 PM by AC Pushback bus, returning at 5:30 AM on Monday 14 Dec.",
    priceOptions: PRICES.slice(0, 2).map(({ title, amount, sub }) => ({ title, amount, sub })),
    reserveAmount: TRIP.reserve,
    reservePerPerson: 2900,
    paymentNote: `Reserve your seat with ${TRIP.reserve} per person (non-refundable); the balance is payable at departure. Pay by UPI (${CONTACT.upi}) or bank transfer (DCB Bank · Cheetah Travelz · A/c 00121900019585 · IFSC DCBL0000001), then WhatsApp the payment screenshot to ${CONTACT.phone} for your booking confirmation.`,
    itinerary: [
      {
        num: "DAY 0",
        date: "10th December · Thursday",
        images: [{ src: "aguada.jpg", alt: "Fort Aguada at sunset" }],
        stops: [
          { time: "10:00 PM", title: "Depart from Mumbai", note: "By AC Pushback bus — get comfy for an amazing Goa getaway!" },
        ],
      },
      {
        num: "DAY 1",
        date: "11th December · Friday",
        images: [
          { src: "oldgoa.jpg", alt: "Old Goa churches and Fontainhas" },
          { src: "yacht.jpg", alt: "Private yacht party at sunset" },
        ],
        stops: [
          { time: "10:00 AM", title: "Arrival in North Goa", note: "Hotel check-in & freshen up" },
          { time: "12:30 PM", title: "Lunch at hotel" },
          { time: "01:00 PM", title: "Old Goa & Panjim", note: "Basilica of Bom Jesus · Se Cathedral · Fontainhas · Café hopping", selfPaid: true },
          { time: "05:30 PM", title: "Private Yacht Party", note: "Open waters, sunset views, music & party vibes", hot: true },
          { time: "08:00 PM", title: "Back to hotel" },
          { time: "10:00 PM", title: "Night on the beach", note: "Calangute Beach · Baga Beach", hot: true },
          { time: "01:00 AM", title: "Back to hotel" },
        ],
      },
      {
        num: "DAY 2",
        date: "12th December · Saturday",
        images: [
          { src: "palolem.jpg", alt: "Palolem beach coastline" },
          { src: "kayak.jpg", alt: "Kayaking at sunset" },
        ],
        stops: [
          { time: "09:00 AM", title: "Breakfast", note: "Fuel up for a day full of fun" },
          { time: "10:00 AM", title: "South Goa sightseeing", note: "Cabo de Rama — rocky cliffs & sea views · Palolem — golden sands & palms" },
          { time: "Sunset", title: "Kayaking & sunset", note: "Paddle across calm waters at sunset", hot: true },
          { time: "08:30 PM", title: "Back to hotel" },
          { time: "10:00 PM", title: "Explore Goa", note: "Clubbing, or games & party at the hotel" },
          { time: "01:00 AM", title: "Overnight stay at hotel" },
        ],
      },
      {
        num: "DAY 3",
        date: "13th December · Sunday",
        images: [
          { src: "banana.jpg", alt: "Banana ride" },
          { src: "jetski.jpg", alt: "Jet ski" },
          { src: "parasail.jpg", alt: "Parasailing over Goa" },
        ],
        stops: [
          { time: "08:00 AM", title: "Breakfast" },
          { time: "09:00 AM", title: "Hotel check-out", note: "Pack up — a final day full of thrill!" },
          { time: "10:00 AM", title: "Water sports", note: "Banana Ride · Bumper Ride · Jet Ski · Parasailing — all four included", hot: true },
          { time: "04:00 PM", title: "Lunch & freshen up" },
          { time: "05:30 PM", title: "Depart for Mumbai" },
        ],
      },
      {
        num: "DAY 4",
        date: "14th December · Monday",
        images: [],
        end: true,
        stops: [{ time: "05:30 AM", title: "Arrival in Mumbai", note: "Come solo. Leave with friends." }],
      },
    ],
    included: INCLUDED,
    excluded: NOT_INCLUDED,
    stayText:
      "Premium 3-star hotel / resort. Room layout: 1 double bed and 1 sofa-cum-bed / mattress. Hotel details are shared with confirmed travellers before departure.",
    stayImages: STAY.map(({ src, alt }) => ({ src, alt })),
    meals: "2 breakfasts and 2 lunches included. Dinner is not included. Meal timings may vary with the hotel and travel schedule.",
    transport: "AC Pushback bus Mumbai ⇄ Goa (Mumbai option) and travel for the North & South Goa sightseeing.",
    activities: [
      { title: "Private Yacht Party", text: "Sunset on open water with music and party vibes.", img: "yacht.jpg" },
      { title: "Kayaking & Sunset", text: "Paddle Palolem's calm waters as the sun goes down.", img: "kayak.jpg" },
      ...SPORTS,
    ],
    terms: standardTerms("₹2,900", "Includes 2 breakfasts and 2 lunches."),
  },
  {
    slug: "goa-christmas-dec-2026",
    brochureUrl: christmasBrochure.url,
    summary: "North and South Goa, sunset kayaking, pub crawling, Old Goa & Panjim and a private yacht party over Christmas.",
    pickup: "Departs Mumbai on Thursday 24 December at 10:00 PM. Return arrival Monday 28 December at 5:30 AM.",
    priceOptions: [
      { title: "Goa to Goa", amount: 8900, sub: "Per person" },
      {
        title: "Mumbai–Goa–Mumbai · AC Pushback Bus",
        amount: 10900,
        sub: "Early bird: book before 30 Nov 2026 · regular price ₹13,400 per person",
        earlyBird: { before: "2026-11-30", regularAmount: 13400 },
      },
      { title: "Mumbai–Goa–Mumbai · AC Sleeper Bus", amount: 14900, sub: "Per person" },
    ],
    reserveAmount: "₹2,900",
    reservePerPerson: 2900,
    paymentNote: `Reserve your seat with ₹2,900 per person (non-refundable); the balance as per your booking confirmation is payable at boarding / departure. Pay by UPI (${CONTACT.upi}) or bank transfer (DCB Bank · Cheetah Travelz · A/c 00121900019585 · IFSC DCBL0000001), then WhatsApp the payment screenshot to ${CONTACT.phone} for confirmation.`,
    itinerary: [
      {
        num: "DAY 0", date: "24th December · Thursday", images: [],
        stops: [{ time: "10:00 PM", title: "Depart from Mumbai", note: "AC Pushback or AC Sleeper bus — the journey begins." }],
      },
      {
        num: "DAY 1", date: "25th December · Friday", images: [],
        stops: [
          { time: "10:00 AM", title: "Arrival in North Goa", note: "Hotel check-in & freshen up" },
          { time: "12:30 PM", title: "Lunch at hotel" },
          { time: "01:00 PM", title: "North Goa sightseeing", note: "Parra Road · Chapora Fort · Anjuna Beach & flea market · Vagator Beach sunset" },
          { time: "08:00 PM", title: "Back to hotel" },
          { time: "10:00 PM", title: "Let the pub crawl begin!", note: "Baga Beach · Calangute Beach · Tito’s Lane. Club entries are self paid.", hot: true },
          { time: "04:00 AM", title: "Back to hotel" },
        ],
      },
      {
        num: "DAY 2", date: "26th December · Saturday", images: [],
        stops: [
          { time: "09:00 AM", title: "Breakfast", note: "Fuel up for a day full of fun" },
          { time: "10:00 AM", title: "South Goa sightseeing", note: "Cabo de Rama Beach — rocky cliffs & sea views · Palolem Beach — golden sands & swaying palms" },
          { time: "Sunset", title: "Kayaking & sunset", note: "Paddle across calm waters at sunset", hot: true },
          { time: "08:30 PM", title: "Dinner at hotel" },
          { time: "10:00 PM", title: "Candolim Beach", note: "Sheesha, snacks and music-filled beach vibes" },
          { time: "11:30 PM", title: "Vagator & Anjuna nightlife", note: "Beach clubs and parties. Club entries are self paid.", hot: true },
          { time: "03:00 AM", title: "Back to hotel" },
        ],
      },
      {
        num: "DAY 3", date: "27th December · Sunday", images: [],
        stops: [
          { time: "09:00 AM", title: "Breakfast" },
          { time: "10:00 AM", title: "Hotel check-out" },
          { time: "11:00 AM", title: "Old Goa & Panjim", note: "Basilica of Bom Jesus · Se Cathedral · Fontainhas" },
          { time: "03:30 PM", title: "Private Yacht Party", note: "Open waters, beautiful views, music and party vibes", hot: true },
          { time: "06:00 PM", title: "Depart for Mumbai" },
        ],
      },
      {
        num: "DAY 4", date: "28th December · Monday", images: [], end: true,
        stops: [{ time: "05:30 AM", title: "Arrival in Mumbai", note: "Come solo. Leave with friends." }],
      },
    ],
    included: [
      ["AC bus travel", "Mumbai–Goa–Mumbai, where selected"],
      ["Meals", "2 breakfasts, 1 lunch & 1 dinner"],
      ["Sightseeing", "North & South Goa"],
      ["Kayaking", "included"],
      ["Private Yacht Party", "included"],
    ],
    excluded: [
      ["Paid activities", "any not mentioned under What’s Included; club entries are self paid"],
      ["Other meals", "any not specifically mentioned as included"],
    ],
    stayText: "Premium 3-star hotel / resort. Room layout: 1 double bed and 1 sofa-cum-bed / mattress. Hotel details are shared with confirmed travellers before departure. Room photos are indicative.",
    stayImages: [
      { src: "hotel1.jpg", alt: "Indicative hotel room with double bed" },
      { src: "hotel2.jpg", alt: "Indicative hotel room interior" },
      { src: "hotel4.jpg", alt: "Indicative hotel room with seating" },
    ],
    meals: "2 breakfasts, 1 lunch & 1 dinner included. Other meals are not included. Timings may vary with the hotel and travel schedule.",
    transport: "Mumbai–Goa–Mumbai by AC Pushback or AC Sleeper bus, where selected. Goa-to-Goa option also available.",
    activities: [
      { title: "North Goa", text: "Chapora Fort, Anjuna, Parra Road and Vagator sunset.", img: "aguada.jpg" },
      { title: "Pub Crawl", text: "North Goa pubs and beach clubs; entries self paid.", img: "pubcrawl.jpg" },
      { title: "South Goa", text: "Cabo de Rama and Palolem beaches.", img: "palolem.jpg" },
      { title: "Kayaking & Sunset", text: "Paddle across calm waters at sunset.", img: "kayak.jpg" },
      { title: "Old Goa & Panjim", text: "Basilica of Bom Jesus, Se Cathedral and Fontainhas.", img: "oldgoa.jpg" },
      { title: "Private Yacht Party", text: "Music, beautiful views and a party on the open waters.", img: "yacht.jpg" },
    ],
    terms: standardTerms("₹2,900", "Includes 2 breakfasts, 1 lunch and 1 dinner."),
  },
  {
    slug: "goa-new-year-2027",
    brochureUrl: newYearBrochure.url,
    summary: "Celebrate New Year in Goa with North and South Goa sightseeing, kayaking, a private sunset yacht party and beach nightlife.",
    pickup: "Departs Mumbai on 30 December 2026 at 9:00 PM; arrives in North Goa on 31 December at 10:00 AM. Return arrival in Mumbai on 4 January 2027 at 4:00 AM.",
    priceOptions: [
      {
        title: "Goa New Year Package",
        amount: 14900,
        sub: "Per person · 30 Dec 2026 – 4 Jan 2027",
      },
    ],
    reserveAmount: "₹2,900",
    reservePerPerson: 2900,
    reserveLine: "Reserve with ₹2,900 per person · balance payable at departure",
    paymentNote: `Reserve your seat with ₹2,900 per person (non-refundable); the balance as per your booking confirmation is payable at boarding / departure. Pay by UPI (${CONTACT.upi}) or bank transfer (DCB Bank · Cheetah Travelz · A/c 00121900019585 · IFSC DCBL0000001), then WhatsApp the payment screenshot to ${CONTACT.phone} for confirmation.`,
    itinerary: [
      { num: "DAY 0", date: "30 December 2026 · Wednesday", images: [], stops: [
        { time: "09:00 PM", title: "Depart from Mumbai" },
      ] },
      { num: "DAY 1", date: "31 December 2026 · Thursday", images: [], stops: [
        { time: "10:00 AM", title: "Arrival in North Goa", note: "Hotel check-in and freshen up" },
        { time: "12:30 PM", title: "Lunch at hotel" },
        { time: "01:00 PM", title: "North Goa sightseeing", note: "Parra Road · Anjuna Beach & flea market · Chapora Fort · Vagator Beach & sunset" },
        { time: "07:30 PM", title: "Back to hotel" },
        { time: "10:00 PM", title: "New Year pub crawl", note: "Baga Beach · Calangute Beach", hot: true },
        { time: "04:00 AM", title: "Back to hotel" },
      ] },
      { num: "DAY 2", date: "1 January 2027 · Friday", images: [], stops: [
        { time: "10:00 AM", title: "Breakfast" },
        { time: "11:00 AM", title: "South Goa sightseeing", note: "Cabo de Rama Beach · Palolem Beach · Kayaking & sunset" },
        { time: "08:30 PM", title: "Dinner at hotel" },
        { time: "10:00 PM", title: "Pub crawling & nightlife", note: "Candolim Beach · Vagator & Anjuna", hot: true },
        { time: "04:00 AM", title: "Back to hotel" },
      ] },
      { num: "DAY 3", date: "2 January 2027 · Saturday", images: [], stops: [
        { time: "10:00 AM", title: "Breakfast" },
        { time: "11:00 AM", title: "Old Goa & Panjim sightseeing", note: "Basilica of Bom Jesus · Se Cathedral · Fontainhas · Café hopping" },
        { time: "05:00 PM", title: "Private yacht party & sunset", hot: true },
        { time: "09:00 PM", title: "Dinner at hotel" },
        { time: "11:00 PM", title: "Tito’s Lane or hotel party", note: "Pub crawling at Tito’s Lane OR in-house party at hotel" },
        { time: "03:00 AM", title: "Back to hotel" },
      ] },
      { num: "DAY 4", date: "3 January 2027 · Sunday", images: [], stops: [
        { time: "09:00 AM", title: "Breakfast" },
        { time: "10:00 AM", title: "Hotel check-out" },
        { time: "11:00 AM", title: "Sightseeing continues", note: "Fort Aguada · Reis Magos Fort · Morjim Beach · Arambol Beach" },
        { time: "05:00 PM", title: "Depart from Goa" },
      ] },
      { num: "DAY 5", date: "4 January 2027 · Monday", images: [], end: true, stops: [
        { time: "04:00 AM", title: "Arrival in Mumbai" },
      ] },
    ],
    included: [["Meals", "3 breakfasts, 1 lunch & 2 dinners"]],
    excluded: [],
    stayText: "Clean, comfortable 3-star hotel stay on sharing basis, grouped by gender.",
    stayImages: [],
    meals: "3 breakfasts, 1 lunch & 2 dinners included.",
    transport: "Departure from Mumbai on 30 December at 9:00 PM; return to Mumbai on 4 January at 4:00 AM. Contact us for travel options.",
    activities: [
      { title: "New Year Pub Crawl", text: "Baga and Calangute beach nightlife on New Year’s Eve.", img: "pubcrawl.jpg" },
      { title: "South Goa & Kayaking", text: "Cabo de Rama, Palolem and sunset kayaking.", img: "kayak.jpg" },
      { title: "Old Goa & Panjim", text: "Churches, Fontainhas and café hopping.", img: "oldgoa.jpg" },
      { title: "Private Yacht Party", text: "A sunset yacht party on 2 January.", img: "yacht.jpg" },
      { title: "Forts & Beaches", text: "Fort Aguada, Reis Magos Fort, Morjim and Arambol.", img: "aguada.jpg" },
    ],
    terms: standardTerms("₹2,900", "Includes 3 breakfasts, 1 lunch and 2 dinners."),
  },
  {
    slug: "igatpuri-camping",
    summary:
      "Two days of camping at GAIA Resort & Camping, Igatpuri — mud bath, bonfire & BBQ, a movie under the stars, open-sky yoga and Igatpuri sightseeing.",
    pickup: "Exact pickup points are shared with your booking confirmation.",
    priceOptions: [
      {
        title: "Igatpuri Camping Package",
        amount: 4300,
        sub: "Camping stay, 5 meals & all activities",
      },
    ],
    reserveAmount: "₹4,300",
    reservePerPerson: 4300,
    reserveLine: "Package price ₹4,300 per person · meals, camping stay & activities included",
    paymentNote: `Package price ₹4,300 per person. Pay by UPI (${CONTACT.upi}) or bank transfer (DCB Bank · Cheetah Travelz · A/c 00121900019585 · IFSC DCBL0000001), then WhatsApp the payment screenshot to ${CONTACT.phone} for your booking confirmation.`,
    itinerary: [
      {
        num: "DAY 1",
        date: "Adventure & Fun",
        images: [
          { src: "igt-mud.jpg", alt: "Traveller enjoying the mud bath" },
          { src: "igt-bbq.jpg", alt: "BBQ on the bonfire" },
        ],
        stops: [
          { time: "01:00 PM", title: "Camp check-in", note: "GAIA Resort & Camping" },
          { time: "", title: "Delicious lunch", note: "Veg & non-veg options" },
          {
            time: "",
            title: "Adventure & fun",
            note: "Mud bath · Mud art & creative activities · Kite flying",
            hot: true,
          },
          { time: "", title: "Evening high tea & snacks" },
          {
            time: "",
            title: "Bonfire & BBQ",
            note: "Veg: BBQ Aloo · Non-veg: BBQ Chicken",
            hot: true,
          },
          { time: "", title: "Dinner & movie under the stars" },
          { time: "", title: "Overnight stay", note: "Camping tents at GAIA, Igatpuri" },
        ],
      },
      {
        num: "DAY 2",
        date: "Nature & Relaxation",
        images: [{ src: "igt-yoga.jpg", alt: "Open-sky yoga at sunrise" }],
        stops: [
          { time: "", title: "Open-sky yoga session", note: "Start the day fresh in nature" },
          { time: "", title: "Nature walk" },
          {
            time: "",
            title: "Hands-on agricultural activities",
            note: "Get your hands dirty on the farm",
          },
          { time: "", title: "Breakfast & lunch" },
          { time: "02:00 PM", title: "Camp check-out" },
          { time: "", title: "Igatpuri sightseeing", note: "Explore Igatpuri after check-out" },
          { time: "10:00 PM", title: "Back to Mumbai", note: "Thank you for travelling with us!" },
        ],
        end: true,
      },
    ],
    included: [
      ["Camping stay", "comfortable tents at GAIA Resort & Camping"],
      ["5 meals", "Day 1 lunch, snacks & dinner · Day 2 breakfast & lunch"],
      ["Mud bath & mud art", "plus kite flying & creative activities"],
      ["Bonfire & BBQ", "Veg: BBQ Aloo · Non-veg: BBQ Chicken"],
      ["Movie under the stars", "open-air movie night"],
      ["Yoga & nature walk", "plus hands-on agricultural activities"],
      ["Igatpuri sightseeing", "after check-out on Day 2"],
      ["Facilities", "western washrooms & hot water showers"],
    ],
    excluded: [
      ["Personal expenses", "any personal purchases"],
      ["Paid activities", "optional paid activities during sightseeing"],
      ["Attraction entry fees", "not specifically mentioned as included"],
      ["Other expenses", "anything not listed under What's Included"],
    ],
    stayText:
      "Comfortable camping tents on a sharing basis at GAIA Resort & Camping, Igatpuri, grouped by gender. Clean western-style washrooms with hot water showers, in beautiful natural surroundings.",
    stayImages: [
      { src: "igt-tents.jpg", alt: "Lit camping tents at GAIA Resort & Camping" },
      { src: "igt-tents2.jpg", alt: "Tents at the campsite at dusk" },
      { src: "igt-campfire.jpg", alt: "Campfire at the campsite" },
    ],
    meals:
      "5 meals, veg & non-veg: Day 1 lunch, evening snacks & dinner; Day 2 breakfast & lunch.",
    transport: "Mumbai ⇄ Igatpuri travel with the group; return to Mumbai by 10:00 PM on Day 2.",
    activities: [
      { title: "Mud Bath & Mud Art", text: "Get messy, creative and laugh a lot.", img: "igt-mud.jpg" },
      { title: "Bonfire & BBQ", text: "BBQ Aloo or BBQ Chicken by the fire.", img: "igt-bbq.jpg" },
      { title: "Movie Under the Stars", text: "An open-air movie night at camp.", img: "igt-tents.jpg" },
      { title: "Open-Sky Yoga", text: "Start Day 2 fresh in nature.", img: "igt-yoga.jpg" },
    ],
    terms: standardTerms("₹4,300", "Includes 5 meals (veg & non-veg): Day 1 lunch, evening snacks & dinner; Day 2 breakfast & lunch.", "Comfortable camping tents on a sharing basis at GAIA Resort & Camping, Igatpuri, grouped by gender, with clean western-style washrooms and hot water showers.", "Camping accommodation"),
  },
];

export const canBookOnline = (detail: TripDetail) => detail.reservePerPerson > 0 && detail.priceOptions.length > 0;

export function getTrip(slug: string, today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })): { departure: Departure; detail: TripDetail } | null {
  const departure = DEPARTURES.find((d) => d.slug === slug);
  const detail = TRIP_DETAILS.find((d) => d.slug === slug);
  if (!departure || !detail) return null;
  return { departure, detail: { ...detail, priceOptions: detail.priceOptions.map((option) =>
    option.earlyBird && today >= option.earlyBird.before
      ? { ...option, amount: option.earlyBird.regularAmount, sub: "Regular price per person · early bird offer ended" }
      : option,
  ) } };
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
