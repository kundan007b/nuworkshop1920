export const img = (p: string) => `${import.meta.env.BASE_URL}images/${p}`;

export const CONTACT = "stps-workshop@nalandauniv.edu.in";
export const VENUE = "Nalanda University, Rajgir, Bihar, India";
export const DATES = "19 and 20 December 2026";
export const DEADLINE = "30 November 2026";
export const ABSTRACT_MAX_WORDS = 299;

export const CATEGORIES = [
  { value: "internal_student", label: "Internal Student (Nalanda Univ.)" },
  { value: "internal_faculty", label: "Internal Faculty (Nalanda Univ.)" },
  { value: "external_student", label: "External Student / Researcher" },
  { value: "external_faculty", label: "External Faculty / Professional" },
] as const;

export const categoryLabel = (v: string) =>
  CATEGORIES.find((c) => c.value === v)?.label ?? v;

export const SPEAKERS = [
  { name: "Prof. Jürgen Renn", role: "Director", org: "Max Planck Institute of Geoanthropology, Germany", photo: "renn.jpg" },
  { name: "Prof. Roberto Giuntini", role: "Professor", org: "University of Cagliari, Italy", photo: "roberto.webp" },
  { name: "Dr. Aurvinda", role: "Academician", org: "IIT Tirupati, India", photo: "aurvinda.jpg" },
  { name: "Prof. Archan S. Majumdar", role: "Professor", org: "S. N. Bose Centre, Kolkata", photo: "archan-majumdar.jpg" },
  { name: "Prof. Srikant Radhakrishnan", role: "Professor", org: "PPISR, Bangalore, India", photo: "srikant.jpg" },
];

export const CONVENERS = ["Dr. D. Gangopadhyay", "Dr. T. Prasad"];
export const MEMBERS = ["Dr. Abhijit Poddar", "Dr. Pradip Kundu", "Dr. E. Arulmozhi"];
export const STUDENTS = ["Amit Gunjan", "Kundan Bhaskar", "Rahul Ranjan"];

export const COMMITTEE_PHOTOS: Record<string, string> = {
  "Dr. D. Gangopadhyay": "gangopadhyay.jpg",
  "Dr. T. Prasad": "prasad.jpg",
  "Dr. Abhijit Poddar": "poddar.jpg",
  "Dr. Pradip Kundu": "kundu.jpg",
  "Dr. E. Arulmozhi": "arulmozhi.jpg",
  "Amit Gunjan": "amit.jpg",
  "Kundan Bhaskar": "kundan-upload.jpg",
  "Rahul Ranjan": "rahul.jpg",
};

export type TrackId = "ceremony" | "keynote" | "lectures" | "panel" | "presentations";
export const TRACKS: Record<TrackId, { label: string; color: string }> = {
  ceremony: { label: "Ceremony", color: "#D8CBA0" },
  keynote: { label: "Keynote", color: "#E86A72" },
  lectures: { label: "Expert lectures", color: "#7FA3C7" },
  panel: { label: "Panel", color: "#A31E28" },
  presentations: { label: "Oral and poster", color: "#8FB59A" },
};

export interface Session {
  id: string;
  day: 1 | 2;
  time: string;
  title: string;
  sub?: string;
  track: TrackId;
  detail: string;
}

export const DAYS = [
  { day: 1 as const, date: "19 December", short: "Dec 19", theme: "Mathematics, Logic & Computation" },
  { day: 2 as const, date: "20 December", short: "Dec 20", theme: "Governance, Policy, Investment & India's Scientific Future" },
];

export const SESSIONS: Session[] = [
  { id: "d1-welcome", day: 1, time: "10:00", title: "Welcome & Opening Remarks", track: "ceremony",
    detail: "The workshop opens with a welcome to participants from mathematics, data sciences, STPS and beyond, and sets out the two days ahead." },
  { id: "d1-keynote", day: 1, time: "10:30", title: "Keynote Address", sub: "Office of the Principal Scientific Adviser", track: "keynote",
    detail: "A keynote from the Office of the Principal Scientific Adviser, framing the workshop against India's Mega Science Vision 2035." },
  { id: "d1-lectures", day: 1, time: "11:15", title: "Expert Lectures 1 & 2", track: "lectures",
    detail: "Two expert lectures on the day's theme of mathematics, logic and computation, introducing students of mixed backgrounds to the foundations behind their coursework." },
  { id: "d1-panel", day: 1, time: "16:30", title: "Interdisciplinary Panel Discussion", sub: "Logic, Computation and the Future of Scientific Discovery", track: "panel",
    detail: "An open discussion across disciplines on how logic and computation, and increasingly AI, are changing the way science is done." },
  { id: "d1-posters", day: 1, time: "17:30", title: "Oral & Poster Presentation Session", sub: "Call for Presentations", track: "presentations",
    detail: "Internal and external participants are encouraged to submit an abstract. Oral presentations run 15 minutes (10 minute talk, 5 minute Q&A); posters are standard A0, portrait. Opt in through the registration form." },
  { id: "d2-lect56", day: 2, time: "10:00", title: "Expert Lectures 5 & 6", track: "lectures",
    detail: "Expert lectures opening the second day, which turns from foundations toward governance, policy and investment in science." },
  { id: "d2-lect789", day: 2, time: "12:15", title: "Expert Lectures 7, 8 & 9", track: "lectures",
    detail: "A longer block of three lectures on policy issues in the Big Money sciences and India's scientific future." },
  { id: "d2-panel", day: 2, time: "15:15", title: "Panel Discussion", sub: "Governing and Financing India's Frontier Science", track: "panel",
    detail: "A panel on how frontier science is governed and financed, and what that means for India's trajectory." },
  { id: "d2-vale", day: 2, time: "16:30", title: "Valedictory Session", sub: "Certificate Distribution", track: "ceremony",
    detail: "The workshop closes with a valedictory session and the distribution of certificates." },
];

export const initials = (n: string) =>
  n.replace(/^(Prof|Dr)\.?\s+/i, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
