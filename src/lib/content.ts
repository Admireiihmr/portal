export const TICKER_A = [
  "Open theme",
  "Individual entry",
  "15 presenters",
  "Poster or video",
  "IIHMR students",
  "Submit online",
  "Domain tags",
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
  { to: 4, suffix: " min", label: "to pitch your idea" },
  { to: 7, suffix: " days", label: "submission window" },
];

export const RULES = [
  { icon: "bulb", title: "Any theme, any idea", text: "There is no fixed theme. If it can improve health, care, pharma or health-tech, it belongs here." },
  { icon: "cap", title: "IIHMR students only", text: "Open to our own students. First- and second-year students compete together on equal terms." },
  { icon: "user", title: "Individual entry", text: "One student, one idea, one presenter. You may name people who helped you; they are acknowledged, and the certificate carries the presenter's name." },
  { icon: "tag", title: "Tag, don't box", text: "No branch-wise categories. Simply tag the domains your idea touches, such as AI in healthcare or hospital operations." },
  { icon: "file", title: "Abstract first", text: "Upload your abstract in any common format. Experts review them and shortlist the best." },
  { icon: "video", title: "Poster or video", text: "Shortlisted students receive a uniform template and present with a poster or an animated video, with a demo link if you built something." },
];

export const STEPS = [
  { t: "Have an Idea", d: "Identify a relevant healthcare challenge and a creative solution." },
  { t: "Submit Your Abstract", d: "Fill in your details and upload your abstract." },
  { t: "Initial Screening", d: "Submissions are checked for completeness and eligibility." },
  { t: "Expert Review", d: "Domain experts evaluate each abstract and select the best ideas." },
  { t: "Shortlist of 15", d: "The top 15 ideas are selected to present on Foundation Day." },
  { t: "Prepare Your Pitch", d: "Create a 4-minute presentation with your problem, idea and impact." },
  { t: "Present on Foundation Day", d: "The 15 shortlisted students present their ideas to the expert panel." },
  { t: "Awards & Recognition", d: "Three winners and three consolation awards are announced, with certificates for all presenters." },
];

export const FUNNEL = [
  { icon: "file", short: "Everyone can submit", title: "Open to every IIHMR student", text: "Any student, any idea, any area of health. Submit one abstract online." },
  { icon: "search", short: "Experts screen", title: "Domain experts review every abstract", text: "Each expert reads the abstracts in their area and picks the strongest." },
  { icon: "target", short: "15 shortlisted", title: "Fifteen students make it to the stage", text: "You hear by e-mail and receive the presentation template." },
  { icon: "trophy", short: "6 awards", title: "Three winners and three consolation awards", text: "Chosen on the day, with a certificate for every presenter." },
];

export const FAQ = [
  { q: "Who can take part?", a: "Any current IIHMR Bangalore student, first or second year. The event is not open to external participants." },
  { q: "Can I submit as a team?", a: "No. Entries are individual and there is a single presenter. You can list the names of people who helped you and they will be acknowledged, but the certificate is issued only in the presenter's name." },
  { q: "What should my abstract contain?", a: "A short description of the problem, your idea, how it works and the impact you expect. A page or two is enough, in any format you like." },
  { q: "Which file formats are accepted?", a: "Almost any: PDF, Word, PowerPoint, images, text, even a video. Only directly executable files (such as .exe) are blocked for safety. The size limit is shown on the form." },
  { q: "Do I have to pick a single domain?", a: "No. Tag as many domains as fit your idea. Cross-cutting ideas such as AI in pharma are welcome." },
  { q: "How will I know if I am shortlisted?", a: "We will e-mail the address you give in the form, so please double-check it." },
  { q: "Can I submit again if I made a mistake?", a: "Yes. Submit again with the same registration number and your files are kept together in your folder. The organisers will use the latest one." },
];
