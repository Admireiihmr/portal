"use client";
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

/** Laptop with an uploading document, a glowing bulb and a stack of books. */
function SubmitArt() {
  return (
    <svg viewBox="0 0 360 230" aria-hidden="true">
      <defs>
        <linearGradient id="saV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a7dff" />
          <stop offset="1" stopColor="#5b3bd6" />
        </linearGradient>
        <radialGradient id="saGold" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset=".55" stopColor="#f9c63a" />
          <stop offset="1" stopColor="#d99410" />
        </radialGradient>
        <filter id="saGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* laptop */}
      <rect x="40" y="58" width="170" height="118" rx="10" fill="url(#saV)" />
      <rect x="50" y="68" width="150" height="98" rx="6" fill="#2b1d70" />
      <path d="M20 180h210l-14 18H34z" fill="#8f73f2" />
      <path d="M20 180h210" stroke="#c4b2ff" strokeWidth="3" />
      {/* document rising out of the screen */}
      <g className="sa-doc">
        <rect x="78" y="24" width="96" height="128" rx="8" fill="#f4f0ff" stroke="#c9bbff" strokeWidth="2" />
        <rect x="92" y="98" width="68" height="6" rx="3" fill="#c9bbff" />
        <rect x="92" y="112" width="56" height="6" rx="3" fill="#c9bbff" />
        <rect x="92" y="126" width="62" height="6" rx="3" fill="#c9bbff" />
        <rect x="104" y="44" width="44" height="40" rx="10" fill="url(#saV)" />
        <path d="M126 76V56M118 63l8-8 8 8" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* books */}
      <rect x="236" y="168" width="104" height="20" rx="4" fill="#7a5df0" />
      <rect x="236" y="168" width="104" height="5" rx="2" fill="#f7e6c4" />
      <rect x="244" y="146" width="90" height="22" rx="4" fill="#9a7dff" />
      <rect x="244" y="146" width="90" height="5" rx="2" fill="#f7e6c4" />
      {/* bulb */}
      <g className="sa-bulb">
        <g stroke="#f9c63a" strokeWidth="4" strokeLinecap="round">
          <path d="M290 18v-10M262 28l-7-7M318 28l7-7M250 56h-10M330 56h10" />
        </g>
        <circle cx="290" cy="64" r="34" fill="url(#saGold)" filter="url(#saGlow)" />
        <path d="M278 66l8-10 6 14 8-12" stroke="#fff6d6" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="276" y="98" width="28" height="9" rx="4" fill="#c9bbff" />
        <rect x="279" y="109" width="22" height="9" rx="4" fill="#9a7dff" />
        <rect x="270" y="120" width="40" height="24" rx="6" fill="url(#saV)" />
      </g>
    </svg>
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
      <div className="wrap sx-grid">
        <Reveal from="left" className="sx-side">
          <p className="sx-label">06 — Submit <i /></p>
          <motion.h2 className="sx-title" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
            <span className="hl">
              <motion.span variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } } }}>Submit Your</motion.span>
            </span>
            <span className="hl">
              <motion.span className="grad" variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { delay: 0.1, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } } }}>
                Abstract
              </motion.span>
            </span>
            <svg className="sx-swoosh" viewBox="0 0 240 20" aria-hidden="true">
              <motion.path d="M4 14 C 70 4, 160 4, 236 9" fill="none" stroke="#c9a8ff" strokeWidth="4" strokeLinecap="round" variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 0.6, duration: 0.8 } } }} />
            </svg>
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
