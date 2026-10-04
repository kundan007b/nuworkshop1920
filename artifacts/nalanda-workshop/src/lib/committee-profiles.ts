export type CommitteeProfile = {
  designation: string;
  areas: string[];
  summary: string;
  source: string;
  sourceLabel: string;
};

// Academic titles and research descriptions are sourced independently of workshop roles.
// Do not infer a university appointment solely from committee membership.
export const COMMITTEE_PROFILES: Record<string, CommitteeProfile> = {
  "Dr. D. Gangopadhyay": {
    designation: "Professor, writer & editor",
    areas: ["Foundations of quantum mechanics", "History & philosophy of science", "Indian knowledge systems"],
    summary: "His interdisciplinary work connects foundational questions in physics with Indian and Western philosophy, including identity and the quantum measurement problem.",
    source: "https://www.dgangopadhyay.com/about-debajyoti-gangopadhya.php",
    sourceLabel: "Personal academic profile",
  },
  "Dr. T. Prasad": {
    designation: "Associate Professor in Mathematics",
    areas: ["Operator theory", "Functional analysis"],
    summary: "At Nalanda University, his research focuses on operator theory and functional analysis, including subnormal operators and related classes of operators.",
    source: "https://nalandauniv.edu.in/faculty-info/dr-prasad-t/",
    sourceLabel: "University faculty profile",
  },
  "Dr. Abhijit Poddar": {
    designation: "Associate Professor",
    areas: ["Biotechnology research & policy", "Bacterial genomics & systematics", "Biosafety & biosecurity"],
    summary: "His work connects biotechnology research with science policy and the responsible development of emerging technologies.",
    source: "https://sbvu.ac.in/mgmari/scientificstaff",
    sourceLabel: "Academic staff profile",
  },
  "Dr. Pradip Kundu": {
    designation: "Associate Professor of Mathematics",
    areas: ["Optimization under uncertainty", "Reliability theory", "Stochastic orders", "Data analytics"],
    summary: "At Nalanda University, he studies optimization and decision-making under uncertainty, with contributions to reliability theory and data analytics.",
    source: "https://nalandauniv.edu.in/faculty-info/dr-pradip-kundu/",
    sourceLabel: "University faculty profile",
  },
  "Dr. E. Arulmozhi": {
    designation: "Visiting Faculty",
    areas: ["Artificial intelligence & deep learning", "Internet of Things", "Digital twins", "Environmental monitoring"],
    summary: "His research applies AI and intelligent systems to agricultural automation, environmental monitoring and climate-resilient solutions.",
    source: "https://nalandauniv.edu.in/faculty-info/dr-elanchezhian-arulmozhi-ph-d/",
    sourceLabel: "University faculty profile",
  },
};