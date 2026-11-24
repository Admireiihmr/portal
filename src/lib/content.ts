export const TICKER_A = [
  "Open theme",
  "Individual entry",
  "15 presenters",
  "PPT, poster or video",
  "IIHMR students",
  "Submit online",
  "Any format",
  "Expert review",
];
export const PHOTOS: { src: string; caption: string; wide?: boolean }[] = [
  { src: "fd-16th.jpg", caption: "16th Foundation Day" },
  { src: "campus-entrance.jpg", caption: "IIHMR Bangalore campus", wide: true },
  { src: "fd-2025.jpg", caption: "Foundation Day & Alumni Meet 2025" },
  { src: "admire-symposium-2.jpg", caption: "ADMIRE Digital Health Symposium" },
  { src: "campus-group.jpg", caption: "Students on campus" },
  { src: "fd-2016.jpg", caption: "Foundation Day 2016" },
  { src: "admire-symposium-1.jpg", caption: "ADMIRE Digital Health Symposium" },
  { src: "campus-event.jpg", caption: "Campus event" },
  { src: "library.jpg", caption: "The IIHMR library" },
];

export const TICKER_B =["IIHMR Bangalore", "ADMIRE", "Foundation Day", "Your idea", "Digital health", "Innovation", "Impact"];

export const STATS = [
  { to: 15, suffix: "", label: "students present on stage" },
  { to: 6, suffix: "", label: "awards to be won" },
  { to: 7, suffix: " days", label: "submission window" },
];

export const STEPS = [
  { t: "Have an Idea", d: "Identify a relevant healthcare challenge and a creative solution." },
  { t: "Submit Your Abstract", d: "Fill in your details and upload your abstract." },
  { t: "Initial Screening", d: "Submissions are checked for completeness and eligibility." },
  { t: "Expert Review", d: "Domain experts evaluate each abstract and select the best ideas." },
  { t: "Shortlist of 15", d: "The top 15 ideas are selected to present on Foundation Day." },
  { t: "Prepare Your Pitch", d: "Create a PPT, poster or video covering your problem, idea and impact." },
  { t: "Present on Foundation Day", d: "The 15 shortlisted students present their ideas to the expert panel." },
  { t: "Awards & Recognition", d: "Three winners and three consolation awards are announced, with certificates for all presenters." },
];

export const FAQ = [
  { q: "Who can take part?", a: "Any current IIHMR Bangalore student, first or second year. The event is not open to external participants." },
  { q: "Can I submit as a team?", a: "No. Entries are individual and there is a single presenter. You can list your contributors and they will be acknowledged, but the certificate is issued only in the presenter's name." },
  { q: "What should my abstract contain?", a: "A short description of the problem, your idea, how it works and the impact you expect. A page or two is enough, in any format you like." },
  { q: "Which file formats are accepted?", a: "Almost any: PDF, Word, PowerPoint, images, text, even a video. Only directly executable files (such as .exe) are blocked for safety. The size limit is shown on the form." },
  { q: "How will I know if I am shortlisted?", a: "We will e-mail the address you give in the form, so please double-check it." },
  { q: "Can I submit again if I made a mistake?", a: "Yes. Submit again with the same registration number and your files are kept together in your folder. The organisers will use the latest one." },
];

// Guidelines (section 02): short points shown as neon glass cards. `glow` picks the card colour.
export const GUIDELINES: { icon: string; title: string; note: string; glow: string }[] = [
  { icon: "students", title: "All Students Eligible", note: "IIHMR Bangalore · 1st & 2nd year", glow: "violet" },
  { icon: "person", title: "Individual Entry", note: "One student, one presenter", glow: "amber" },
  { icon: "rocket", title: "Any Idea – Any Domain", note: "No fixed theme", glow: "cyan" },
  { icon: "write", title: "Submit Abstract", note: "Any format, online", glow: "green" },
  { icon: "media", title: "Present Your Idea", note: "PPT · Poster · Video", glow: "pink" },
];
