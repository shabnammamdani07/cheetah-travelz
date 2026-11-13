/* All trip copy lives here — edit prices, dates and itinerary in one place. */

export const CONTACT = {
  phone: "+91 72085 78110",
  phoneRaw: "917208578110",
  upi: "7208578110@ptyes",
  instagram: "https://www.instagram.com/cheetahtravelz/",
  google: "https://g.co/kgs/xeWmL6X",
};

export const WHATSAPP_BOOK = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent("Hi Cheetah Travelz! I want to book the Goa trip (21-24 Nov)")}`;

export const TRIP = {
  dates: "21st – 24th NOV",
  length: "4 Nights / 3 Days",
  reserve: "₹2,900",
};

/* Hero word rotator + "Where to next?" cards. `hero` is the full-screen backdrop, `card` the tile photo. */
export const DESTINATIONS: {
  word: string;
  name: string;
  tag: string;
  blurb: string;
  hero: string;
  card: string;
  next?: string;
}[] = [
  {
    word: "DAMAN",
    name: "Daman",
    tag: "Beach weekend",
    blurb: "Forts, sea breeze and a crew that turns strangers into friends.",
    hero: "daman.jpg",
    card: "g-daman.jpg",
  },
  {
    word: "MAHABALESHWAR",
    name: "Mahabaleshwar",
    tag: "Hills & valleys",
    blurb: "Misty viewpoints, wild horses on the table land and Diwali under the stars.",
    hero: "m-lake2.jpg",
    card: "m-horses.jpg",
  },
  {
    word: "LONAVALA",
    name: "Lonavala",
    tag: "Monsoon escape",
    blurb: "Cliff-top views, waterfalls and the easiest getaway from Mumbai.",
    hero: "lonavala.jpg",
    card: "lonavala.jpg",
  },
  {
    word: "GOA",
    name: "Goa",
    tag: "Beaches & parties",
    blurb: "Yacht party, water sports, sunset kayaking and nights that end at 4 AM.",
    hero: "beach-pan.jpg",
    card: "yacht.jpg",
    next: "21–24 Nov",
  },
  {
    word: "ANYWHERE",
    name: "Anywhere in India",
    tag: "Private trips · cars & buses",
    blurb: "Your group, your dates, your destination. Chauffeur-driven cars & buses, all India.",
    hero: "m-valley.jpg",
    card: "m-bus.jpg",
  },
];

export const INCLUSIONS: { title: string; sub: string; icon: string }[] = [
  {
    title: "AC Bus",
    sub: "Mumbai ⇄ Goa",
    icon: '<rect x="6" y="14" width="52" height="30" rx="6"/><path d="M6 30h52M18 14v16M32 14v16M46 14v16"/><circle cx="18" cy="48" r="5"/><circle cx="46" cy="48" r="5"/>',
  },
  {
    title: "Meals",
    sub: "2 breakfasts · 2 lunches",
    icon: '<circle cx="32" cy="32" r="14"/><path d="M10 12v16a4 4 0 0 0 4 4v20M14 12v12M18 12v16a4 4 0 0 1-4 4M52 12c-5 0-6 10-6 16h6v24"/>',
  },
  {
    title: "3★ Hotel",
    sub: "Triple sharing stay",
    icon: '<path d="M14 56V20h36v36M8 56h48M22 28h6M36 28h6M22 38h6M36 38h6M28 56V46h8v10"/><path d="M20 12l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5zM44 12l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z"/>',
  },
  {
    title: "Sightseeing",
    sub: "North & South Goa",
    icon: '<circle cx="18" cy="40" r="9"/><circle cx="40" cy="40" r="9"/><path d="M27 40h4M14 31l4-12h6M44 31l-4-12h-6"/><path d="M50 50c0-14 2-24 6-30M56 20c-4 0-8 2-10 5M56 20c2 3 2 6 1 9"/>',
  },
  {
    title: "Kayaking",
    sub: "Sunset at Palolem",
    icon: '<ellipse cx="32" cy="32" rx="26" ry="8"/><path d="M32 6v52M26 10h12M26 54h12"/><circle cx="32" cy="32" r="4"/>',
  },
  {
    title: "Trip Captain",
    sub: "Female captain on board",
    icon: '<circle cx="32" cy="20" r="10"/><path d="M22 20c0-10 4-14 10-14s10 4 10 14c0 4 2 8 4 10M18 58c0-12 6-20 14-20s14 8 14 20"/>',
  },
  {
    title: "Yacht Party",
    sub: "Private · at sunset",
    icon: '<path d="M6 42h52l-8 12H14z"/><path d="M14 42l6-12h24l8 12M24 30l4-8h10M30 22v-8"/><path d="M6 58c6 0 6-3 12-3s6 3 12 3 6-3 12-3 6 3 12 3"/>',
  },
  {
    title: "Water Sports",
    sub: "Banana · Bumper · Jet ski · Parasail",
    icon: '<path d="M6 40c10-10 22-12 38-10l12 4-4 8H12z"/><path d="M30 30l6-10h8M20 36h20"/><path d="M4 50c6 0 6-3 12-3s6 3 12 3 6-3 12-3 6 3 12 3 6-3 8-3"/>',
  },
  {
    title: "Games",
    sub: "Group activities",
    icon: '<rect x="6" y="14" width="26" height="36" rx="4" transform="rotate(-12 19 32)"/><rect x="30" y="20" width="26" height="26" rx="5" transform="rotate(10 43 33)"/><circle cx="38" cy="30" r="2"/><circle cx="48" cy="38" r="2"/><circle cx="43" cy="34" r="2"/>',
  },
];

type Stop = { time: string; title: string; note?: string; selfPaid?: boolean; hot?: boolean };
export type Day = {
  num: string;
  date: string;
  images: { src: string; alt: string }[];
  stops: Stop[];
  end?: boolean;
};

export const ITINERARY: Day[] = [
  {
    num: "DAY 0",
    date: "21st November · Saturday",
    images: [{ src: "aguada.jpg", alt: "Fort Aguada at sunset" }],
    stops: [
      {
        time: "10:00 PM",
        title: "Depart from Mumbai",
        note: "Get comfy and excited for an amazing Goa getaway!",
      },
    ],
  },
  {
    num: "DAY 1",
    date: "22nd November · Sunday",
    images: [
      { src: "oldgoa.jpg", alt: "Old Goa churches and Fontainhas" },
      { src: "yacht.jpg", alt: "Private yacht party at sunset" },
      { src: "pubcrawl.jpg", alt: "Pub crawl at night in North Goa" },
    ],
    stops: [
      {
        time: "10:00 AM",
        title: "Arrival in North Goa",
        note: "Warm welcome, hotel check-in & freshen up",
      },
      { time: "12:30 PM", title: "Lunch at hotel" },
      {
        time: "01:00 PM",
        title: "Old Goa & Panjim",
        note: "Basilica of Bom Jesus · Se Cathedral · Fontainhas · Café hopping",
        selfPaid: true,
      },
      {
        time: "05:30 PM",
        title: "Private Yacht Party",
        note: "Open waters, sunset views, music & party vibes",
        hot: true,
      },
      { time: "08:00 PM", title: "Back to hotel", note: "Rest up — the night has just begun" },
      {
        time: "10:00 PM",
        title: "Let the pub crawl begin!",
        note: "Vagator's buzzing pubs & clubs till dawn",
        selfPaid: true,
        hot: true,
      },
      { time: "04:00 AM", title: "Back to hotel" },
    ],
  },
  {
    num: "DAY 2",
    date: "23rd November · Monday",
    images: [
      { src: "palolem.jpg", alt: "Palolem beach coastline" },
      { src: "kayak.jpg", alt: "Kayaking at sunset" },
      { src: "club.jpg", alt: "Baga beach club night" },
    ],
    stops: [
      { time: "09:00 AM", title: "Breakfast", note: "Fuel up for a day full of fun" },
      {
        time: "10:00 AM",
        title: "South Goa sightseeing",
        note: "Cabo de Rama — rocky cliffs over the Arabian Sea · Palolem — golden sands & palms",
      },
      {
        time: "Sunset",
        title: "Kayaking & sunset",
        note: "Paddle Palolem's serene waters as the sun goes down",
        hot: true,
      },
      { time: "08:30 PM", title: "Back to hotel" },
      { time: "10:00 PM", title: "Candolim beach", note: "Sheesha, snacks & music-filled vibes" },
      {
        time: "11:30 PM",
        title: "Baga beach & Tito's Lane",
        note: "Beach clubs, beats, no tomorrow",
        selfPaid: true,
        hot: true,
      },
      { time: "03:00 AM", title: "Back to hotel" },
    ],
  },
  {
    num: "DAY 3",
    date: "24th November · Tuesday",
    images: [
      { src: "banana.jpg", alt: "Banana ride" },
      { src: "jetski.jpg", alt: "Jet ski" },
      { src: "parasail.jpg", alt: "Parasailing over Goa" },
    ],
    stops: [
      { time: "08:00 AM", title: "Breakfast" },
      { time: "09:00 AM", title: "Check-out", note: "Pack up — the trip's not over yet!" },
      {
        time: "10:00 AM",
        title: "Water sports",
        note: "Banana Ride · Bumper Ride · Jet Ski · Para Sailing",
        hot: true,
      },
      { time: "04:00 PM", title: "Lunch & freshen up" },
      { time: "05:30 PM", title: "Depart for Mumbai" },
    ],
  },
  {
    num: "DAY 4",
    date: "25th November · Wednesday",
    images: [],
    end: true,
    stops: [
      {
        time: "05:30 AM",
        title: "Arrival in Mumbai",
        note: "…with a camera roll full of memories.",
      },
    ],
  },
];

export const SPORTS = [
  {
    title: "Banana Ride",
    text: "A thrilling, splash-filled ride across the waves.",
    img: "banana.jpg",
  },
  { title: "Bumper Ride", text: "Bounce across the water. Scream optional.", img: "bumper.jpg" },
  { title: "Jet Ski", text: "High-speed action over sparkling waters.", img: "jetski.jpg" },
  {
    title: "Para Sailing",
    text: "Soar above the sea for panoramic views of Goa's coastline.",
    img: "parasail.jpg",
  },
];

export const STAY = [
  { src: "hotel-pool.jpg", alt: "Hotel pool and resort building", big: true },
  { src: "hotel1.jpg", alt: "Hotel room with double bed" },
  { src: "hotel2.jpg", alt: "Hotel room with ambient lighting" },
  { src: "hotel5.jpg", alt: "Hotel room interior" },
  { src: "hotel3.jpg", alt: "Modern bathroom" },
];

export const GALLERY: { speed: number; imgs: [string, string][] }[] = [
  {
    speed: -120,
    imgs: [
      ["g-room.jpg", "Group photo in hotel room"],
      ["m-horses.jpg", "Wild horses at Mahabaleshwar table land"],
      ["g-boat.jpg", "Friends on a boat"],
      ["m-diwali.jpg", "Diwali celebration on the Mahabaleshwar trip"],
    ],
  },
  {
    speed: 80,
    imgs: [
      ["g-bus.jpg", "Party lights on the bus"],
      ["g-waterfall.jpg", "Group at a waterfall in life jackets"],
      ["m-lake2.jpg", "Mahabaleshwar lake view"],
      ["g-pool.jpg", "Hotel pool"],
    ],
  },
  {
    speed: -60,
    imgs: [
      ["g-red.jpg", "Group on the beach at night"],
      ["m-valley.jpg", "Mahabaleshwar valley"],
      ["g-beachnight.jpg", "Friends on the beach at night"],
      ["g-rocks.jpg", "Group on rocks by a waterfall"],
    ],
  },
  {
    speed: 140,
    imgs: [
      ["ilovegoa.jpg", "I love Goa sign at night"],
      ["m-horse2.jpg", "Horses at Mahabaleshwar"],
      ["m-bus.jpg", "Cheetah Travelz bus"],
      ["candolim.jpg", "Candolim beach shack at night"],
    ],
  },
];

export const REVIEWS: { text: string; who: string; tone?: "orange" | "navy"; chat?: boolean }[] = [
  {
    text: "Had such an amazing time! Met some really wonderful people, and huge kudos to the organizers for putting this together so beautifully. It honestly felt like we'd known each other for generations!",
    who: "Rubi · Google review",
  },
  {
    text: "Super comfy and totally stress-free. The leaders were so chill… no pressure to go to specific places. It was all relaxed and completely up to us what we wanted to do next.",
    who: "Akshat Shah · Google review",
    tone: "orange",
  },
  {
    text: "The trip was amazing and I had a great time. I will recommend everyone who is planning for a solo trip. Very flexible and friendly operators and the arrangements done were great.",
    who: "Zee · Google review",
  },
  {
    text: "Honestly, didn't expect to have THIS much fun 😂 Mafia, Cat from Hell, Maggi at midnight, foosball fights… Definitely one of those trips I'll randomly remember and smile about ❤️",
    who: "Traveller · WhatsApp group",
    tone: "navy",
    chat: true,
  },
  {
    text: "An amazing trip with lovely people. Special thanks to Abid for the wonderful co-ordination and very supportive nature.",
    who: "Shehbaz Ansari · Google review",
  },
  {
    text: "Never imagined my first ever trip would turn out this amazing! Really had a great time and I'm glad to meet such lovely people.",
    who: "First-time traveller · WhatsApp group",
    tone: "orange",
    chat: true,
  },
];

export const PRICES = [
  {
    title: "Goa to Goa",
    amount: 8900,
    sub: "Meet us in Goa — everything from arrival to departure.",
  },
  { title: "Mumbai – Goa – Mumbai", amount: 10900, sub: "by AC Pushback bus", hot: true },
  { title: "Mumbai – Goa – Mumbai", amount: 14900, sub: "by AC Sleeper bus" },
];

export const INCLUDED: [string, string][] = [
  ["AC bus travelling", "Mumbai – Goa & Goa – Mumbai"],
  ["3-star hotel", "triple-sharing accommodation"],
  ["2 breakfasts & 2 lunches", ""],
  ["North & South Goa", "sightseeing"],
  ["Games & activities", ""],
  ["Female trip captain", "accompanying the group"],
  ["Kayaking, yacht party & water sports", ""],
];

export const NOT_INCLUDED: [string, string][] = [
  ["Dinner", "& any meals not listed as included"],
  ["Personal expenses", ""],
  ["Paid activities", 'not mentioned in "what\'s included"'],
  ["Other expenses", "not specifically mentioned"],
  ["Attraction entry fees", "not listed as included"],
];

export const TERMS: [string, string[]][] = [
  [
    "Booking & payment",
    [
      "₹2,900/person confirms your seat. Balance amount as per the booking confirmation is payable at the time of boarding.",
    ],
  ],
  [
    "Cancellation policy",
    [
      "By traveller: the ₹2,900 booking amount is non-refundable but transferable to another person before departure (replacement traveller must share required details in advance). No-show or failure to transfer before departure is treated as a 100% cancellation charge.",
      "By Cheetah Travelz: if we cancel due to operational reasons, low bookings or minimum group size not being met, you may choose a full refund of ₹2,900 or a transfer to the next available batch.",
    ],
  ],
  [
    "Hotel accommodation",
    [
      "Clean, comfortable 3-star hotel/resort/cottage on triple sharing by default, grouped by gender (men with men, women with women). Rooms have 1 double bed and 1 sofa-cum-bed/mattress.",
    ],
  ],
  [
    "Seats, pickups & itinerary changes",
    [
      "Seats are allotted first-come, first-served. Pickup timings may vary due to traffic/weather/operations — report 15 minutes before departure. The itinerary may change or be skipped due to weather, road closures, government restrictions or unforeseen circumstances. Boating, horse riding and other personal activities are not included.",
    ],
  ],
  ["Meals", ["Includes 2 breakfasts and 2 lunches. Timings may vary with hotel/travel schedule."]],
  [
    "Traveller responsibilities & code of conduct",
    [
      "Carry a valid Aadhaar/government photo ID. No drinking, smoking or prohibited substances in the vehicle. Travellers are responsible for their own belongings. Zero tolerance for abusive/inappropriate behaviour, harassment, property damage, hate speech/discrimination or conduct disrupting the trip — Cheetah Travelz may remove any traveller without refund for unsafe or disruptive behaviour.",
    ],
  ],
  [
    "Liability & jurisdiction",
    [
      "Not responsible for delays, route changes, breakdowns, weather or events beyond reasonable control; no refunds or compensation for such disruptions. Travellers participate at their own risk and must follow coordinator safety instructions. Disputes are subject to the exclusive jurisdiction of courts in Mumbai.",
    ],
  ],
];

export const img = (name: string) => `/assets/img/${name}`;
