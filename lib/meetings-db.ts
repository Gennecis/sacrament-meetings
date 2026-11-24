import type { SacramentMeeting } from "./types";

// In-memory data for now. A real database replaces this in a later week.
const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: "2026-05-03",
    meetingType: "testimony",
    presiding: "Bishop Daniel Reyes",
    conducting: "Brother Samuel Adeyemi",
    announcements: [
      "Ward temple night is Thursday at 7:00 PM.",
      "Youth service project on Saturday at 9:00 AM.",
    ],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Sister Grace Thompson",
    wardBusiness: [
      { description: "Release of Sister Maria Lopez as Primary pianist." },
      { description: "Sustaining of Brother Kofi Mensah as Sunday School teacher." },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [],
    closingHymn: { number: 85, title: "How Firm a Foundation" },
    closingPrayer: "Brother James Carter",
  },
  {
    id: 2,
    date: "2026-05-10",
    meetingType: "regular",
    presiding: "Bishop Daniel Reyes",
    conducting: "Brother Ethan Brooks",
    announcements: ["Mother's Day treats will be handed out after the meeting."],
    openingHymn: { number: 292, title: "O My Father" },
    openingPrayer: "Sister Ama Owusu",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: "I Stand All Amazed" },
    speakers: [
      { name: "Sister Hannah Wright", topic: "The influence of righteous mothers", type: "speaker" },
      { name: "Primary children", topic: "I Often Go Walking", type: "musical-number" },
      { name: "Brother Ade Okafor", topic: "Honoring our parents", type: "speaker" },
    ],
    closingHymn: { number: 298, title: "Home Can Be a Heaven on Earth" },
    closingPrayer: "Brother Luis Fernandez",
  },
  {
    id: 3,
    date: "2026-10-04",
    meetingType: "general",
    presiding: "Broadcast from Salt Lake City",
    conducting: "Broadcast from Salt Lake City",
    announcements: ["General Conference sessions are at 10:00 AM and 2:00 PM. No ward meetings today."],
    openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    openingPrayer: "As assigned in the broadcast",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: null,
    speakers: [],
    closingHymn: { number: 21, title: "Come, Listen to a Prophet's Voice" },
    closingPrayer: "As assigned in the broadcast",
  },
  {
    id: 4,
    date: "2026-11-01",
    meetingType: "testimony",
    presiding: "Bishop Daniel Reyes",
    conducting: "Brother Samuel Adeyemi",
    announcements: ["Tithing declaration appointments begin next week. See the executive secretary."],
    openingHymn: { number: 136, title: "I Know That My Redeemer Lives" },
    openingPrayer: "Sister Chidinma Eze",
    wardBusiness: [{ description: "Sustaining of Sister Rachel Kim as Relief Society secretary." }],
    stakeBusiness: false,
    sacramentHymn: { number: 181, title: "Jesus of Nazareth, Savior and King" },
    speakers: [],
    closingHymn: { number: 98, title: "I Need Thee Every Hour" },
    closingPrayer: "Brother Peter Nwosu",
  },
  {
    id: 5,
    date: "2026-11-15",
    meetingType: "stake",
    presiding: "President Michael Turner",
    conducting: "President Joseph Ellis",
    announcements: ["Stake conference is held at the stake center. Ward buildings are closed today."],
    openingHymn: { number: 6, title: "Redeemer of Israel" },
    openingPrayer: "Sister Linda Park",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: null,
    speakers: [
      { name: "Sister Olivia Grant", topic: "Ministering like the Savior", type: "speaker" },
      { name: "Stake choir", topic: "Come, Thou Fount of Every Blessing", type: "musical-number" },
      { name: "President Michael Turner", topic: "Covenant belonging", type: "speaker" },
    ],
    closingHymn: { number: 27, title: "Praise to the Man" },
    closingPrayer: "Brother David Okoro",
  },
  {
    id: 6,
    date: "2026-11-22",
    meetingType: "regular",
    presiding: "Bishop Daniel Reyes",
    conducting: "Brother Ethan Brooks",
    announcements: [
      "Ward Christmas dinner is December 12 at 6:00 PM in the cultural hall.",
      "Please sign up to help with the Thanksgiving food drive.",
    ],
    openingHymn: { number: 94, title: "Come, Ye Thankful People" },
    openingPrayer: "Sister Ngozi Obi",
    wardBusiness: [
      { description: "Release of Brother Tom Allen as elders quorum secretary." },
      { description: "Sustaining of Brother Musa Bello as elders quorum secretary." },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 194, title: "There Is a Green Hill Far Away" },
    speakers: [
      { name: "Sister Emily Ross", topic: "Gratitude in all things", type: "speaker" },
      { name: "Brother and Sister Chen", topic: "Count Your Blessings (duet)", type: "musical-number" },
      { name: "Brother Isaac Mensah", topic: "Remembering the Lord's hand in our lives", type: "speaker" },
    ],
    closingHymn: { number: 241, title: "Count Your Blessings" },
    closingPrayer: "Brother Chinedu Okeke",
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  const sorted = [...meetings].sort((a, b) => b.date.localeCompare(a.date));
  if (!date) return sorted;
  return sorted.filter((meeting) => meeting.date === date);
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.id === id);
}
