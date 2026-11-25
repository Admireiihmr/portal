"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type DragEvent, type FormEvent, type ReactNode } from "react";
import { BRANCHES, DEADLINE_TEXT, MAX_FILE_MB, SUBMISSIONS_OPEN } from "@/lib/config";
import { normalise, validateFields, validateFile, type FieldErrors } from "@/lib/validation";
import Icon from "./Icon";
import Reveal from "./Reveal";

type Status = "idle" | "sending" | "done";

const fmt = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

function Confetti() {
  const colors = ["#483a8f", "#7f5fc0", "#ffd200", "#d4261c", "#12a1a1"];
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 36 }).map((_, i) => (
        <motion.i
          key={i}
          style={{ left: `${(i * 97) % 100}%`, background: colors[i % colors.length] }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: 420, opacity: 0, rotate: 540 + i * 20 }}
          transition={{ duration: 1.6 + (i % 5) * 0.25, delay: (i % 7) * 0.06, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/** Label row with an icon in the left gutter. Defined outside the form so inputs keep focus while typing. */
function Field({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="fld xf">
      <span className="xf-ic" aria-hidden>
        <Icon name={icon} size={20} />
      </span>
      <div className="xf-body">{children}</div>
    </div>
  );
}

const GLOW = { fill: "none", stroke: "#d4c4ff", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Laptop with an uploading document, a glowing caduceus and a stack of books. */
function SubmitArt() {
  return (
    <svg viewBox="0 0 360 230" aria-hidden="true">
      <defs>
        <linearGradient id="saV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a7dff" />
          <stop offset="1" stopColor="#5b3bd6" />
        </linearGradient>
        <filter id="saGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* laptop */}
      <rect x="30" y="58" width="170" height="118" rx="10" fill="none" stroke="#c9b4ff" strokeWidth="4" filter="url(#saGlow)" />
      <rect x="40" y="68" width="150" height="98" rx="6" fill="#2b1d70" opacity=".7" />
      <path d="M10 180h210l-14 16H24z" fill="#8f73f2" stroke="#d4c4ff" strokeWidth="2" />
      <g className="sa-doc">
        <rect x="70" y="26" width="92" height="124" rx="8" fill="#f4f0ff" />
        <rect x="84" y="98" width="64" height="6" rx="3" fill="#c9bbff" />
        <rect x="84" y="112" width="52" height="6" rx="3" fill="#c9bbff" />
        <rect x="84" y="126" width="58" height="6" rx="3" fill="#c9bbff" />
        <rect x="94" y="44" width="44" height="40" rx="8" fill="url(#saV)" />
        <path d="M116 76V56M108 63l8-8 8 8" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* books */}
      <rect x="238" y="176" width="100" height="18" rx="4" fill="#6a4ce0" stroke="#c9b4ff" strokeWidth="2" />
      <rect x="246" y="156" width="88" height="20" rx="4" fill="#8466f0" stroke="#c9b4ff" strokeWidth="2" />
      <rect x="240" y="138" width="92" height="18" rx="4" fill="#5b3bd6" stroke="#c9b4ff" strokeWidth="2" />
      {/* caduceus */}
      <g className="sa-bulb" filter="url(#saGlow)">
        <path d="M288 30v106" stroke="#efe9ff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="288" cy="26" r="6" fill="#efe9ff" />
        <path d="M288 40c-20-6-40-4-54 8 16 0 30 2 40 8M288 40c20-6 40-4 54 8-16 0-30 2-40 8" fill="none" stroke="#d4c4ff" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M276 60c24 8 24 20 0 28s-24 20 0 28M300 60c-24 8-24 20 0 28s24 20 0 28" fill="none" stroke="#b79cff" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Heart with a plus and an ECG lead-in, beside the title. */
function HeartPulse() {
  return (
    <svg className="sx-heart" viewBox="0 0 200 90" aria-hidden="true">
      <g {...GLOW} className="glow-stroke">
        <path d="M0 56h50l8-14 10 30 12-50 12 44 8-10h20" />
        <path d="M156 74c-24-16-36-28-36-42 0-11 8-18 17-18 8 0 14 5 19 11 5-6 11-11 19-11 9 0 17 7 17 18 0 14-12 26-36 42z" />
        <path d="M150 40h12v-10h10v10h12v10h-12v10h-10V50h-12z" fill="#fff" stroke="none" />
      </g>
    </svg>
  );
}

/** Three hexagon tiles on the left edge: ECG, plus, capsule. */
function SxHex() {
  const hex = "M50 4l40 23v46L50 96 10 73V27z";
  return (
    <svg className="sx-hex" viewBox="0 0 200 260" aria-hidden="true">
      {[
        { x: 0, y: 0, icon: <path d="M24 52h14l6-12 8 22 8-30 8 26 4-6h12" /> },
        { x: 82, y: 50, icon: <path d="M44 32h12v12h12v12H56v12H44V56H32V44h12z" fill="#fff" stroke="none" /> },
        { x: 26, y: 120, icon: <g transform="rotate(-40 50 50)"><rect x="38" y="28" width="24" height="44" rx="12" /><path d="M38 50h24" /></g> },
      ].map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y})`}>
          <g className="hx-tile" style={{ animationDelay: `${-i * 0.5}s` }}>
            <path d={hex} fill="rgba(143,108,255,.25)" stroke="#c9b4ff" strokeWidth="2.5" className="glow-stroke" />
            <g fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">{t.icon}</g>
          </g>
        </g>
      ))}
    </svg>
  );
}

/** Hospital outline (bottom left) and DNA helix (right). */
function SxScenery() {
  return (
    <>
      <svg className="sx-hosp" viewBox="0 0 300 200" aria-hidden="true">
        <g fill="none" stroke="#b79cff" strokeWidth="2" opacity=".7">
          <path d="M20 200V70h120v130M140 110h110v90M60 70V40h40v30" />
          <path d="M72 50h16M80 42v16" strokeWidth="4" />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={36 + c * 34} y={90 + r * 32} width="18" height="16" />))}
          {[0, 1].map((r) => [0, 1, 2].map((c) => <rect key={`b${r}${c}`} x={156 + c * 30} y={128 + r * 30} width="16" height="14" />))}
        </g>
      </svg>
      <svg className="sx-dna" viewBox="0 0 140 320" aria-hidden="true">
        <g fill="none" stroke="#c9b4ff" strokeWidth="2.5" className="glow-stroke" opacity=".8">
          <path d="M20 0c0 40 100 60 100 100S20 160 20 200s100 60 100 100" />
          <path d="M120 0c0 40-100 60-100 100s100 60 100 100-100 60-100 100" />
          {Array.from({ length: 14 }, (_, i) => {
            const y = 12 + i * 22;
            const t = Math.sin((y / 200) * Math.PI);
            const w = Math.abs(t) * 46;
            return <path key={i} d={`M${70 - w} ${y}h${w * 2}`} strokeWidth="1.5" opacity=".7" />;
          })}
        </g>
      </svg>
    </>
  );
}

export default function SubmitForm() {
  const [v, setV] = useState({ name: "", regNo: "", email: "", branch: "", title: "", collaborators: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMsg, setServerMsg] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [ref, setRef] = useState("");
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k as keyof FieldErrors]) setErrors((s) => ({ ...s, [k]: undefined }));
  };
  const pick = (f: File | null | undefined) => {
    if (!f) return;
    setFile(f);
    setErrors((s) => ({ ...s, file: validateFile(f) }));
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    pick(e.dataTransfer.files?.[0]);
  };

  function submit(e: FormEvent) {
    e.preventDefault();
    setServerMsg("");
    const fields = normalise({ ...v, consent });
    const errs = validateFields(fields);
    const fe = validateFile(file);
    if (fe) errs.file = fe;
    setErrors(errs);
    if (Object.keys(errs).length || !file) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    const fd = new FormData();
    fd.set("name", fields.name);
    fd.set("regNo", fields.regNo);
    fd.set("email", fields.email);
    fd.set("branch", fields.branch);
    fd.set("title", fields.title);
    fd.set("collaborators", fields.collaborators);
    fd.set("consent", "on");
    fd.set("website", v.website);
    fd.set("file", file);

    setStatus("sending");
    setProgress(0);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/submit");
    xhr.upload.onprogress = (ev) => ev.lengthComputable && setProgress(Math.round((ev.loaded / ev.total) * 100));
    xhr.onerror = () => {
      setStatus("idle");
      setServerMsg("Network problem. Please check your connection and try again.");
    };
    xhr.onload = () => {
      let body: { ok?: boolean; ref?: string; message?: string; errors?: FieldErrors } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* ignore */
      }
      if (xhr.status === 200 && body.ok) {
        setRef(body.ref ?? "");
        setStatus("done");
        document.getElementById("submit")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setStatus("idle");
        if (body.errors) setErrors(body.errors);
        setServerMsg(body.message ?? "Something went wrong. Please try again.");
      }
    };
    xhr.send(fd);
  }

  function reset() {
    setV({ name: "", regNo: "", email: "", branch: "", title: "", collaborators: "", website: "" });
    setConsent(false);
    setFile(null);
    setErrors({});
    setStatus("idle");
    setProgress(0);
  }

  const Err = ({ k }: { k: keyof FieldErrors }) =>
    errors[k] ? (
      <small className="err" id={`e-${k}`} role="alert">
        {errors[k]}
      </small>
    ) : null;
  const aria = (k: keyof FieldErrors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `e-${k}` : undefined });

  return (
    <section id="submit" className="sx">
      <svg className="sx-waves" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M-100 ${200 + i * 9} C 260 ${90 + i * 10}, 640 ${280 - i * 6}, 980 ${170 + i * 7} S 1380 ${70 + i * 9}, 1600 ${160 + i * 5}`} fill="none" stroke="#c4adff" strokeWidth={i === 2 ? 2 : 1} opacity={0.18 + (i === 2 ? 0.4 : (i % 3) * 0.08)} />
        ))}
      </svg>
      <div className="doc-photo sx-doc-photo" aria-hidden>
        <Image src="/images/doctor-coat.jpg" alt="" fill sizes="(max-width: 1200px) 0px, 360px" style={{ objectFit: "cover", objectPosition: "50% 70%" }} />
      </div>
      <SxHex />
      <SxScenery />
      <div className="wrap sx-grid">
        <Reveal from="left" className="sx-side">
          <p className="sx-label">02 — Submit <i /></p>
          <motion.h2 className="sx-title" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
            <span className="hl">
              <motion.span variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } } }}>Submit Your</motion.span>
            </span>
            <span className="hl">
              <motion.span className="grad" variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { delay: 0.1, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } } }}>
                Abstract
              </motion.span>
            </span>
            <HeartPulse />
          </motion.h2>
          <p className="sx-lead">Turn your idea into impact. Fill in the form and upload your abstract to participate in Foundation Day.</p>
          <ul className="sx-list">
            <li>
              <span className="sx-li-ic"><Icon name="user" size={18} /></span>Individual entry, one presenter
            </li>
            <li>
              <span className="sx-li-ic"><Icon name="layers" size={18} /></span>Any theme, any format for the abstract
            </li>
            <li>
              <span className="sx-li-ic"><Icon name="cloudUpload" size={18} /></span>Up to {MAX_FILE_MB} MB per file
            </li>
            <li>
              <span className="sx-li-ic"><Icon name="calendar" size={18} /></span>Deadline: <b className="sx-pill">{DEADLINE_TEXT}</b>
            </li>
          </ul>
          <div className="sx-art" aria-hidden>
            <SubmitArt />
          </div>
          <div className="sx-note">
            <Icon name="info" size={26} />
            <span>Shortlisted students are told by e-mail, so please check the address you enter.</span>
          </div>
        </Reveal>

        <Reveal from="right">
          <div className="form-card sx-card">
            <svg className="sx-card-hex" viewBox="0 0 160 120" aria-hidden="true">
              <g fill="none" stroke="#c9b4ff" strokeWidth="1.5">
                <path d="M40 10l17 10v20L40 50 23 40V20z" /><path d="M76 30l17 10v20L76 70 59 60V40z" /><path d="M112 10l17 10v20l-17 10-17-10V20z" fill="rgba(167,139,255,.25)" /><path d="M76 70l17 10v20l-17 10-17-10V80z" />
              </g>
              <path d="M106 30h12M112 24v12" stroke="#8f6cff" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div key="done" className="done" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Confetti />
                  <motion.svg viewBox="0 0 52 52" width="84" height="84" aria-hidden>
                    <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#15803d" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                    <motion.path d="M14 27l8 8 16-17" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
                  </motion.svg>
                  <h3>Abstract received!</h3>
                  <p>Thank you. Your abstract and details are saved in your own folder.</p>
                  <div className="refbox">
                    <span>Your reference</span>
                    <b>{ref}</b>
                  </div>
                  <p className="dim">Keep this reference. We will e-mail you if you are shortlisted.</p>
                  <button className="btn btn-primary" onClick={reset}>
                    Submit another idea
                  </button>
                </motion.div>
              ) : !SUBMISSIONS_OPEN ? (
                <motion.div key="closed" className="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3>Submissions open soon</h3>
                  <p>The portal is not open yet. Check back on the launch day.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h3 className="sx-h">
                    <Icon name="file" size={24} /> Your Details <i />
                  </h3>
                  <div className="row">
                    <Field icon="user">
                      <label htmlFor="name">Full name *</label>
                      <input id="name" autoComplete="name" placeholder="Enter your full name" value={v.name} onChange={set("name")} {...aria("name")} />
                      <Err k="name" />
                    </Field>
                    <Field icon="idcard">
                      <label htmlFor="regNo">Registration no. *</label>
                      <input id="regNo" autoCapitalize="characters" placeholder="Enter your registration number" value={v.regNo} onChange={set("regNo")} {...aria("regNo")} />
                      <Err k="regNo" />
                    </Field>
                  </div>
                  <div className="row">
                    <Field icon="mail">
                      <label htmlFor="email">E-mail *</label>
                      <input id="email" type="email" autoComplete="email" placeholder="Enter your e-mail address" value={v.email} onChange={set("email")} {...aria("email")} />
                      <Err k="email" />
                    </Field>
                    <Field icon="cap">
                      <label htmlFor="branch">Branch *</label>
                      <select id="branch" value={v.branch} onChange={set("branch")} {...aria("branch")}>
                        <option value="">Select your branch</option>
                        {BRANCHES.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                      <Err k="branch" />
                    </Field>
                  </div>
                  <Field icon="bulb">
                    <label htmlFor="title">Title of your idea *</label>
                    <input id="title" placeholder="Enter a concise title for your idea" value={v.title} onChange={set("title")} {...aria("title")} />
                    <Err k="title" />
                  </Field>

                  <Field icon="users">
                    <label htmlFor="collab">Contributors (optional)</label>
                    <input id="collab" placeholder="Enter contributor names, if any" value={v.collaborators} onChange={set("collaborators")} />
                  </Field>

                  <Field icon="clip">
                    <span className="lbl">Abstract *</span>
                    <div
                      className={`drop ${drag ? "drag" : ""} ${errors.file ? "bad" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDrag(true);
                      }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={onDrop}
                      onClick={() => input.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), input.current?.click())}
                      aria-invalid={!!errors.file}
                      aria-describedby={errors.file ? "e-file" : undefined}
                    >
                      <input ref={input} type="file" hidden onChange={(e) => pick(e.target.files?.[0])} />
                      {file ? (
                        <div className="chip-file">
                          <span className="fi" aria-hidden><Icon name="clip" size={18} /></span>
                          <span className="fn">{file.name}</span>
                          <span className="fsz">{fmt(file.size)}</span>
                          <button type="button" aria-label="Remove file" onClick={(e) => (e.stopPropagation(), setFile(null), setErrors((s) => ({ ...s, file: undefined })))}>
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <motion.span className="up" aria-hidden animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Icon name="cloudUpload" size={34} />
                          </motion.span>
                          <b>Drop your file here, or click to browse</b>
                          <small>Any format · up to {MAX_FILE_MB} MB</small>
                        </>
                      )}
                    </div>
                    <Err k="file" />
                  </Field>

                  {/* honeypot: real people never see this */}
                  <div className="hp" aria-hidden="true">
                    <label>
                      Website
                      <input tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} />
                    </label>
                  </div>

                  {serverMsg && (
                    <p className="server-err" role="alert">
                      {serverMsg}
                    </p>
                  )}

                  <div className="sx-bottom">
                    <div>
                      <label className="consent">
                        <input type="checkbox" checked={consent} onChange={(e) => (setConsent(e.target.checked), setErrors((s) => ({ ...s, consent: undefined })))} {...aria("consent")} />
                        <span>I confirm this is my own idea and that I will be the only presenter. *</span>
                      </label>
                      <Err k="consent" />
                    </div>
                    <motion.button className="btn btn-primary btn-lg sx-submit" disabled={status === "sending"} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Icon name="send" size={18} />
                      {status === "sending" ? `Uploading… ${progress}%` : "Submit Abstract"}
                      {status !== "sending" && <Icon name="arrow" size={18} />}
                    </motion.button>
                  </div>
                  {status === "sending" && (
                    <div className="upbar" aria-hidden>
                      <motion.i animate={{ width: `${progress}%` }} />
                    </div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
