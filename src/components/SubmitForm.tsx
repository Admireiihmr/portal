"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { BRANCHES, DEADLINE_TEXT, DOMAINS, MAX_FILE_MB, SUBMISSIONS_OPEN } from "@/lib/config";
import { normalise, validateFields, validateFile, type FieldErrors } from "@/lib/validation";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

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

export default function SubmitForm() {
  const [v, setV] = useState({ name: "", regNo: "", email: "", branch: "", title: "", collaborators: "", website: "" });
  const [domains, setDomains] = useState<string[]>([]);
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
  const toggle = (d: string) => setDomains((s) => (s.includes(d) ? s.filter((x) => x !== d) : s.length < 6 ? [...s, d] : s));
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
    const fields = normalise({ ...v, domains, consent });
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
    fd.set("domains", fields.domains.join("|"));
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
    setDomains([]);
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
    <section id="submit" className="sec submit">
      <div className="wrap grid2">
        <Reveal from="left" className="submit-side">
          <p className="label light">06 — Submit</p>
          <SplitHeading text={"Submit your\nabstract"} />
          <p>Fill in the form and upload your abstract. We create a folder for you and keep everything together, so there is nothing else to send.</p>
          <ul className="checks">
            <li>Individual entry, one presenter</li>
            <li>Any theme, any format for the abstract</li>
            <li>Up to {MAX_FILE_MB} MB per file</li>
            <li>
              Deadline: <b>{DEADLINE_TEXT}</b>
            </li>
          </ul>
          <div className="side-note">
            Shortlisted students are told by e-mail, so please check the address you enter.
          </div>
        </Reveal>

        <Reveal from="right">
          <div className="form-card">
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
                  <h3>Your details</h3>
                  <div className="row">
                    <div className="fld">
                      <label htmlFor="name">Full name *</label>
                      <input id="name" autoComplete="name" value={v.name} onChange={set("name")} {...aria("name")} />
                      <Err k="name" />
                    </div>
                    <div className="fld">
                      <label htmlFor="regNo">Registration no. *</label>
                      <input id="regNo" autoCapitalize="characters" value={v.regNo} onChange={set("regNo")} {...aria("regNo")} />
                      <Err k="regNo" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="fld">
                      <label htmlFor="email">E-mail *</label>
                      <input id="email" type="email" autoComplete="email" value={v.email} onChange={set("email")} {...aria("email")} />
                      <Err k="email" />
                    </div>
                    <div className="fld">
                      <label htmlFor="branch">Branch *</label>
                      <select id="branch" value={v.branch} onChange={set("branch")} {...aria("branch")}>
                        <option value="">Select your branch</option>
                        {BRANCHES.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                      <Err k="branch" />
                    </div>
                  </div>
                  <div className="fld">
                    <label htmlFor="title">Title of your idea *</label>
                    <input id="title" value={v.title} onChange={set("title")} {...aria("title")} />
                    <Err k="title" />
                  </div>

                  <div className="fld">
                    <span className="lbl">Domains (pick any that fit)</span>
                    <div className="tags">
                      {DOMAINS.map((d) => (
                        <button type="button" key={d} className={`tag ${domains.includes(d) ? "on" : ""}`} aria-pressed={domains.includes(d)} onClick={() => toggle(d)}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fld">
                    <label htmlFor="collab">People who helped you (optional)</label>
                    <input id="collab" placeholder="Acknowledged only. You are the sole presenter." value={v.collaborators} onChange={set("collaborators")} />
                  </div>

                  <div className="fld">
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
                          <span className="fs">{fmt(file.size)}</span>
                          <button type="button" aria-label="Remove file" onClick={(e) => (e.stopPropagation(), setFile(null), setErrors((s) => ({ ...s, file: undefined })))}>
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <motion.span className="up" aria-hidden animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Icon name="upload" size={26} />
                          </motion.span>
                          <b>Drop your file here, or click to browse</b>
                          <small>Any format · up to {MAX_FILE_MB} MB</small>
                        </>
                      )}
                    </div>
                    <Err k="file" />
                  </div>

                  {/* honeypot: real people never see this */}
                  <div className="hp" aria-hidden="true">
                    <label>
                      Website
                      <input tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} />
                    </label>
                  </div>

                  <label className="consent">
                    <input type="checkbox" checked={consent} onChange={(e) => (setConsent(e.target.checked), setErrors((s) => ({ ...s, consent: undefined })))} {...aria("consent")} />
                    <span>I confirm this is my own idea and that I will be the only presenter.</span>
                  </label>
                  <Err k="consent" />

                  {serverMsg && (
                    <p className="server-err" role="alert">
                      {serverMsg}
                    </p>
                  )}

                  <button className="btn btn-primary btn-lg full" disabled={status === "sending"}>
                    {status === "sending" ? `Uploading… ${progress}%` : "Send my abstract"}
                  </button>
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
