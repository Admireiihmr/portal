export const TICKER_A = [
  "Open theme",
  "Individual entry",
  "15 presenters",
  "Poster or video",
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
  { to: 4, suffix: " min", label: "to pitch your idea" },
  { to: 7, suffix: " days", label: "submission window" },
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

export const FAQ = [
  { q: "Who can take part?", a: "Any current IIHMR Bangalore student, first or second year. The event is not open to external participants." },
  { q: "Can I submit as a team?", a: "No. Entries are individual and there is a single presenter. You can list your contributors and they will be acknowledged, but the certificate is issued only in the presenter's name." },
  { q: "What should my abstract contain?", a: "A short description of the problem, your idea, how it works and the impact you expect. A page or two is enough, in any format you like." },
  { q: "Which file formats are accepted?", a: "Almost any: PDF, Word, PowerPoint, images, text, even a video. Only directly executable files (such as .exe) are blocked for safety. The size limit is shown on the form." },
  { q: "How will I know if I am shortlisted?", a: "We will e-mail the address you give in the form, so please double-check it." },
  { q: "Can I submit again if I made a mistake?", a: "Yes. Submit again with the same registration number and your files are kept together in your folder. The organisers will use the latest one." },
];

// Detailed guidelines (section 02). {deadline} and {maxMb} are filled in from config.
export const GUIDELINES: { icon: string; title: string; points: string[] }[] = [
  {
    icon: "cap",
    title: "Eligibility",
    points: [
      "Open to current IIHMR Bangalore students only. The event is not open to external participants.",
      "First- and second-year students compete together on equal terms.",
      "Students from every PGDM programme can take part. There are no branch-wise categories.",
    ],
  },
  {
    icon: "user",
    title: "Entry format",
    points: [
      "This is an individual entry: one student, one idea, one presenter.",
      "Team entries are not accepted. Only the student who submits will present.",
      "You may list your contributors in the form. They are acknowledged, but the certificate carries only the presenter's name.",
    ],
  },
  {
    icon: "bulb",
    title: "Your idea",
    points: [
      "There is no fixed theme. Any idea that can improve health, care, hospitals, pharma or health-tech is welcome.",
      "Cross-cutting ideas, such as AI in pharma or digital tools for hospital operations, are encouraged.",
      "The idea must be your own original work.",
    ],
  },
  {
    icon: "file",
    title: "Writing your abstract",
    points: [
      "Describe the problem you are solving and who it affects.",
      "Explain your idea, how it works and the impact you expect.",
      "Keep it short: a page or two is enough. Give your idea a clear, concise title.",
    ],
  },
  {
    icon: "cloudUpload",
    title: "Submitting online",
    points: [
      "Fill in your full name, registration number, e-mail, branch and idea title, then upload your abstract.",
      "Any common format works: PDF, Word, PowerPoint, images, text or video. Executable files (such as .exe) are blocked. Maximum file size: {maxMb} MB.",
      "Tick the confirmation that the idea is your own and that you will be the only presenter.",
      "Note the reference number shown after you submit. Made a mistake? Submit again with the same registration number; the latest version is used.",
      "Deadline: {deadline}.",
    ],
  },
  {
    icon: "trophy",
    title: "Selection & presentation",
    points: [
      "Every submission is checked for completeness and eligibility, then reviewed by domain experts.",
      "The top 15 ideas are shortlisted. Shortlisted students are told by e-mail, so double-check your address.",
      "Shortlisted students receive a uniform template and present with a poster or an animated video, plus a demo link if you built something.",
      "Each finalist gets 4 minutes on stage to pitch to the expert panel on Foundation Day.",
      "Three winners and three consolation awards are announced, and every presenter receives a certificate.",
    ],
  },
];
