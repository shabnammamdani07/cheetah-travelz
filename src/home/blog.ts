/*
 * Travel Blog / Guides — edit, add or remove posts here (or ask Lovable to).
 * Each post: slug (URL), title, date (YYYY-MM-DD), image (from /public/assets/img), excerpt, sections.
 * Keep facts verified: prices, dates and rules should match the trip details and terms.
 */
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const POSTS: BlogPost[] = [
  {
    slug: "goa-group-trip-what-to-expect",
    title: "Goa Group Trip (21–24 Nov): What to Expect",
    date: "2026-11-16",
    image: "beach-pan.jpg",
    imageAlt: "Goa beach with palm trees and fishing boats",
    excerpt:
      "From the overnight bus out of Mumbai to a sunset yacht party, South Goa beaches and a morning of water sports — here's how the four days flow.",
    sections: [
      {
        heading: "Getting there",
        paragraphs: [
          "We leave Mumbai at 10:00 PM on Saturday 21 November by AC bus and arrive in North Goa around 10:00 AM on Sunday. Travellers on the Goa-to-Goa option meet the group in Goa.",
        ],
      },
      {
        heading: "Day 1 — Old Goa, Panjim and the yacht party",
        paragraphs: [
          "After check-in and lunch at the hotel, we explore Portuguese heritage at the Basilica of Bom Jesus, Se Cathedral and the lanes of Fontainhas, with time for café hopping (self paid).",
          "At 5:30 PM it's the private yacht party at sunset. After a break at the hotel, the evening carries on with a pub crawl around Vagator (self paid).",
        ],
      },
      {
        heading: "Day 2 — South Goa and sunset kayaking",
        paragraphs: [
          "South Goa day: the cliffs of Cabo de Rama, the golden sands of Palolem, and kayaking as the sun goes down. Evening plans include Candolim beach and Baga & Tito's Lane (self paid).",
        ],
      },
      {
        heading: "Day 3 — Water sports, then home",
        paragraphs: [
          "After breakfast and check-out, the morning is all water sports: banana ride, bumper ride, jet ski and parasailing. Lunch, freshen up, and we depart for Mumbai at 5:30 PM, arriving around 5:30 AM on Wednesday.",
        ],
      },
      {
        heading: "What's included",
        paragraphs: [
          "AC bus travel (for Mumbai options), a 3-star hotel on triple sharing, 2 breakfasts and 2 lunches, North & South Goa sightseeing, kayaking, the yacht party, water sports, group games and a female trip captain. Dinners, personal expenses and anything marked self paid are not included.",
        ],
      },
    ],
  },
  {
    slug: "first-solo-group-trip-guide",
    title: "Your First Solo Group Trip: A Quick Guide",
    date: "2026-11-16",
    image: "g-room.jpg",
    imageAlt: "Cheetah Travelz group photo on a trip",
    excerpt:
      "Travelling solo with a group of strangers for the first time? Here's what to know before you pack — rooms, ID, timings and the house rules.",
    sections: [
      {
        heading: "Come solo — you won't stay solo",
        paragraphs: [
          "Most people on our group trips join on their own. Games, shared meals and a relaxed pace mean the group usually feels like friends by day two.",
        ],
      },
      {
        heading: "Rooms and your trip captain",
        paragraphs: [
          "Stays are on triple sharing by default, and rooms are grouped by gender. Our group trips are accompanied by a female trip captain.",
        ],
      },
      {
        heading: "Before you leave home",
        paragraphs: [
          "Carry a valid Aadhaar or other government photo ID. Report 15 minutes before the scheduled departure — pickup timings can shift with traffic or weather, and the team will keep you posted.",
        ],
      },
      {
        heading: "House rules",
        paragraphs: [
          "No drinking, smoking or prohibited substances in the vehicle, and zero tolerance for harassment or disruptive behaviour. Look after your own belongings, and follow your coordinator's safety instructions during activities.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug) ?? null;
