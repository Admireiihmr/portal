# Foundation Day Idea Presentation – student portal

Next.js site for IIHMR Bangalore / ADMIRE. Students read the rules, then submit **name, registration no., branch, a description (up to 500 words), a prototype file (PDF, DOCX or image) and an optional prototype link**. Each submission is saved to Google Drive in **one folder per student**.

```
<your Drive folder>/
  IIH2401_Asha Rao/
    20261119-1028_My Prototype final.pdf      ← the uploaded prototype
    20261119-1028_details.txt                ← name, reg no., e-mail, branch, title, contributors, prototype link, description
  IIH2402_Meera Nair/
    ...
```

Submitting again with the same registration number adds the new files (timestamped) to the same folder, so nothing is overwritten.

## Run it

```bash
npm install
npm run dev                    # http://localhost:3000
npm run build && npm start     # production
```

Until Google Drive is connected, `npm run dev` saves submissions to `./submissions/` on this computer so you can try the form. In production the form says *"Submissions are not available"* instead of silently losing files.

## Connect Google Drive (about 5 minutes, no Google Cloud project, no admin)

A website cannot write into a Drive folder just because it has the folder link, so a tiny Google Apps Script does the saving. It runs **as you** (the folder owner), and only accepts requests that carry a secret that only your site knows.

1. Open <https://script.google.com> while signed in to the Google account that owns the folder, and click **New project**.
2. Delete the sample code, then paste the whole of [`google-apps-script/Code.template.gs`](google-apps-script/Code.template.gs) and fill in the two values at the top: `FOLDER_ID` (the long ID at the end of your Drive folder's link) and `SECRET` (any long random string; put the same string in `.env.local` as `GOOGLE_SCRIPT_SECRET`).
3. Click **Deploy → New deployment → ⚙ Select type → Web app** and set:
   * **Execute as:** *Me*
   * **Who has access:** *Anyone*  (the secret protects it, not the access list)
4. Click **Deploy**, approve the permission prompt (*Review permissions → choose your account → Advanced → Go to … (unsafe) → Allow*; this is your own script asking to use your Drive), and copy the **Web app URL** (ends in `/exec`).
5. Paste it into `.env.local`:
   ```
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXX/exec
   ```
   `GOOGLE_SCRIPT_SECRET` is already there and matches the script.
6. Restart the site and submit a test prototype. A folder named like `IIH2401_Asha Rao` appears in your Drive folder within a few seconds.

**If you change the script later:** *Deploy → Manage deployments → ✏ → Version: New version → Deploy*. The URL stays the same.

**Keep your filled-in script and `.env.local` private** (`.env.local` is git-ignored, and so is a local `google-apps-script/Code.gs` if you keep one): they contain the secret. If it ever leaks, generate a new random string, put it in both places and redeploy.

### Limits to know

* Apps Script accepts roughly 50 MB per request, and files are sent base64-encoded (about 33 % bigger), so keep `NEXT_PUBLIC_MAX_FILE_MB` at 25 or below.
* Google caps Apps Script usage per day (generous for a student event; consumer accounts allow around 20,000 URL calls a day and a Drive file-creation quota of the same order).
* The folder must stay owned by, or shared as *Editor* with, the account that deployed the script.

## Settings (`.env.local`)

| Variable | Meaning |
| --- | --- |
| `GOOGLE_SCRIPT_URL` / `GOOGLE_SCRIPT_SECRET` | Where to send submissions (see above) |
| `NEXT_PUBLIC_SUBMISSIONS_OPEN` | `false` shows "Submissions open soon" instead of the form |
| `NEXT_PUBLIC_DEADLINE_TEXT` | Text shown as the deadline, e.g. `7 December 2026, 5 pm` |
| `NEXT_PUBLIC_MAX_FILE_MB` | Max prototype size (default 25) |
| `ALLOW_LOCAL_STORAGE` | `true` lets a single self-hosted server save to its own disk |

Branches and the allowed file types (PDF, DOCX, images) are in `src/lib/config.ts`. Page text is in `src/lib/content.ts`.

## Hero photo

The hero uses `public/images/iihmr-building.jpg`, a crop of the building photo from the institute's website banner (low resolution). Replace that file with a high-resolution photo of the building (landscape, at least 2400 px wide) for the best result.

## Deploying on Vercel

The site is live at https://portal-virid-chi-54.vercel.app/. In the Vercel project, open **Settings → Environment Variables** and add:

| Name | Value |
| --- | --- |
| `GOOGLE_SCRIPT_URL` | the Apps Script Web app URL (ends in `/exec`) |
| `GOOGLE_SCRIPT_SECRET` | the same secret you put in the script |
| `NEXT_PUBLIC_DEADLINE_TEXT` | e.g. `7 December 2026, 5 pm` (optional) |

Then redeploy. Without the first two, the live form shows "Submissions are not available".

Vercel accepts about 4.5 MB per request, so on Vercel the prototype limit defaults to **4 MB** (set `NEXT_PUBLIC_MAX_FILE_MB` to change it; going above 4 will fail there).

## Deploying elsewhere

* Needs a Node host (a VM, Azure App Service, Railway, Render, etc.). **Vercel's serverless limit is ~4.5 MB per request**, so with 25 MB uploads use a Node server, or lower `NEXT_PUBLIC_MAX_FILE_MB` to 4.
* Set the environment variables on the host; never commit `.env.local`.
* The rate limiter is in memory (per server instance).

## Safety built in

* Server-side validation of every field and the file: only PDF (`.pdf`), Word (`.docx`) and image files are accepted, and the file contents are checked so a renamed file is rejected.
* Folder and file names are sanitised, so a student cannot write outside their own folder.
* Hidden honeypot field plus per-IP and per-registration-number rate limits.
* The Drive script only answers requests that carry the shared secret, and the secret never reaches the browser.
