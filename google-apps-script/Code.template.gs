/**
 * Foundation Day portal -> Google Drive
 *
 * Paste this whole file into a new Apps Script project (script.google.com) while signed in
 * as the owner of the Drive folder, then deploy it as a Web app (see README.md, "Connect Google Drive").
 *
 * For every submission it creates (or reuses) one sub-folder per student inside FOLDER_ID and saves
 *   - the uploaded abstract
 *   - a details text file (name, registration no., e-mail, branch, title, contributors, prototype link)
 */

// The Drive folder that receives one sub-folder per student
// (the long ID at the end of https://drive.google.com/drive/folders/<ID>)
const FOLDER_ID = "PASTE_YOUR_DRIVE_FOLDER_ID_HERE";

// Must be identical to GOOGLE_SCRIPT_SECRET in the portal's .env.local. Keep it private.
// Generate one with:  node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
const SECRET = "PASTE_A_LONG_RANDOM_SECRET_HERE";

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || d.secret !== SECRET) return reply({ ok: false, error: "unauthorized" });
    if (!d.folder || !d.file || !d.file.name || !d.file.contentBase64) return reply({ ok: false, error: "bad request" });

    // one request at a time, so two quick submissions from the same student cannot create two folders
    lock.waitLock(30000);

    const root = DriveApp.getFolderById(FOLDER_ID);
    const name = String(d.folder).replace(/[\\\/:*?"<>|]/g, "_").slice(0, 100);
    const found = root.getFoldersByName(name);
    const folder = found.hasNext() ? found.next() : root.createFolder(name);

    const bytes = Utilities.base64Decode(d.file.contentBase64);
    const blob = Utilities.newBlob(bytes, d.file.contentType || "application/octet-stream", d.file.name);
    folder.createFile(blob);
    folder.createFile(d.stamp + "_details.txt", d.detailsText || "", MimeType.PLAIN_TEXT);

    return reply({ ok: true, folder: folder.getName() });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

// Opening the web app URL in a browser should say it is alive, and nothing more.
function doGet() {
  return reply({ ok: true, service: "foundation-day-portal" });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
