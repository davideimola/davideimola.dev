// Throwaway verification spike for the Kit (formerly ConvertKit) free "Newsletter" plan.
//
// Why this exists: ADR-0002 / issue #71. The newsletter integration rests on two
// assumptions that the research (docs/research/newsletter-free-tier-comparison.md)
// could only verify by inference:
//   (a) creating AND sending a broadcast via the Kit API works on the free plan, and
//   (b) a subscriber CREATED VIA THE API triggers Kit's double opt-in confirmation
//       email — or, if not, whether routing through a Kit Form is required.
// This probe answers both against a live free-tier key BEFORE any integration code
// is written. It is deliberately dependency-free (native fetch on Node 22) and prints
// every request/response verbatim so the exact contract can be transcribed into
// docs/research/kit-api-verification-spike.md.
//
// It is a one-shot spike harness, not production code and not a CI test: it talks to
// the live Kit API, creates a real subscriber, and (with --send) sends a real email.
//
// Usage:
//   KIT_API_KEY=... KIT_TEST_EMAIL=you@example.com node scripts/verify-kit-free-tier.mjs
//
// Env:
//   KIT_API_KEY    (required) v4 API key — sent as the X-Kit-Api-Key header.
//   KIT_TEST_EMAIL (required) an inbox you control; used for BOTH the subscriber
//                  tests and the broadcast recipient. Use a real inbox so you can
//                  confirm the double opt-in / broadcast emails actually arrive.
//   KIT_FORM_ID    (optional) id of a double-opt-in-enabled Kit Form. If unset, the
//                  form path is skipped and the script prints the forms it found so
//                  you can pick one and re-run.
//
// Flags:
//   --send     Actually schedule/send the test broadcast (default: create a draft
//              only, never send). The broadcast is scheduled a few minutes out so it
//              can be cancelled from the Kit dashboard if needed.
//   --cleanup  Delete the artifacts this run creates (test broadcast draft; the test
//              subscriber is left in place so you can inspect the confirmation email).
//   --json <path>  Write the machine-readable findings summary to <path>.
//
// Re-verify before trusting: Kit's free-tier limits and API surfaces change (the
// research notes this explicitly). Re-run this months from now rather than assuming.

const BASE_URL = "https://api.kit.com/v4";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const optValue = (name) => {
  const i = args.indexOf(name);
  return i !== -1 && i + 1 < args.length ? args[i + 1] : undefined;
};

const API_KEY = process.env.KIT_API_KEY;
const TEST_EMAIL = process.env.KIT_TEST_EMAIL;
const FORM_ID = process.env.KIT_FORM_ID;
const DO_SEND = flag("--send");
const DO_CLEANUP = flag("--cleanup");
const JSON_OUT = optValue("--json");

// Findings we accumulate and print (and optionally write) at the end.
const findings = {
  ranAt: new Date().toISOString(),
  base_url: BASE_URL,
  auth: { header: "X-Kit-Api-Key", ok: null, account: null },
  directSubscriber: { attempted: false, state: null, doubleOptIn: null },
  formSubscriber: { attempted: false, formId: FORM_ID ?? null, state: null, doubleOptIn: null },
  broadcastCreate: { attempted: false, id: null, status: null, ok: null },
  broadcastSend: { attempted: false, ok: null, planRestricted: null, sendAt: null },
  verdicts: {},
};

function redact(key) {
  if (!key) return "(unset)";
  return key.length <= 8 ? "****" : `${key.slice(0, 4)}…${key.slice(-2)}`;
}

function section(title) {
  console.log(`\n${"─".repeat(72)}\n${title}\n${"─".repeat(72)}`);
}

// Classify a subscriber-create response into { state, doubleOptIn }. Kit subscriber
// states are: active | inactive | bounced | complained | cancelled. Only `inactive`
// means "double opt-in pending" (awaiting the confirmation click); `active` means the
// subscriber is live with NO confirmation step; any other state (bounced, etc.) is not
// a double-opt-in signal and is reported as inconclusive (null) rather than mis-read.
function classifySubscriber(data) {
  const state = (data?.subscriber ?? data)?.state ?? null;
  const doubleOptIn = state === "inactive" ? true : state === "active" ? false : null;
  return { state, doubleOptIn };
}

// The direct-path test (step 1) makes TEST_EMAIL `active`, and Kit will not re-send a
// confirmation to an already-active subscriber — so the Form path (step 3) must use a
// DISTINCT address or its double opt-in can never be observed. A plus-tag keeps it in
// the same inbox (davide@x.com → davide+form@x.com) while being a new subscriber to Kit.
function plusTag(email, tag) {
  const [local, domain] = email.split("@");
  return domain ? `${local}+${tag}@${domain}` : email;
}

// Single place that talks to Kit. Logs the request (key redacted) and the response
// verbatim so the real contract is captured no matter what the shapes turn out to be.
async function kit(method, path, body) {
  const url = `${BASE_URL}${path}`;
  console.log(`\n→ ${method} ${url}`);
  console.log(
    `  headers: { "X-Kit-Api-Key": "${redact(API_KEY)}", "Content-Type": "application/json" }`
  );
  if (body !== undefined) console.log(`  body: ${JSON.stringify(body)}`);

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        "X-Kit-Api-Key": API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    console.log(`  ✗ network error: ${err.message}`);
    return { status: 0, ok: false, data: null, error: err };
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // non-JSON response — keep the raw text
  }
  console.log(`← ${res.status} ${res.statusText}`);
  console.log(`  body: ${typeof data === "string" ? data : JSON.stringify(data, null, 2)}`);
  return { status: res.status, ok: res.ok, data };
}

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

// ── Preconditions ─────────────────────────────────────────────────────────────
if (!API_KEY)
  fail("KIT_API_KEY is required. Create a free-tier key in Kit → Settings → Developer.");
if (!TEST_EMAIL) fail("KIT_TEST_EMAIL is required. Use a real inbox you control.");

console.log("Kit free-tier verification spike (issue #71)");
console.log(`  api key:    ${redact(API_KEY)}`);
console.log(`  test email: ${TEST_EMAIL}`);
console.log(`  form id:    ${FORM_ID ?? "(none — form path will be skipped)"}`);
console.log(
  `  send:       ${DO_SEND ? "YES — a real broadcast will be scheduled" : "no (draft only)"}`
);
console.log(`  cleanup:    ${DO_CLEANUP ? "yes" : "no"}`);

// ── 0. Auth sanity check ────────────────────────────────────────────────────────
section("0. Auth — GET /account (confirms the X-Kit-Api-Key header is accepted)");
{
  const { ok, data } = await kit("GET", "/account");
  findings.auth.ok = ok;
  findings.auth.account = ok ? (data?.account ?? data) : null;
  if (!ok) fail("Auth failed. The API key is rejected — fix it before continuing.");
  console.log("  ✓ API key accepted.");
}

// ── 1. Direct subscriber create (does POST /subscribers trigger double opt-in?) ──
section("1. Direct subscriber — POST /subscribers { email_address }");
console.log("  Assumption under test: does a subscriber created directly via the API");
console.log("  come back INACTIVE (double opt-in pending) or ACTIVE (no confirmation)?");
{
  findings.directSubscriber.attempted = true;
  const { ok, data } = await kit("POST", "/subscribers", { email_address: TEST_EMAIL });
  const { state, doubleOptIn } = classifySubscriber(data);
  findings.directSubscriber.state = state;
  findings.directSubscriber.doubleOptIn = doubleOptIn;
  if (ok) {
    console.log(`  → resulting state: ${state ?? "(not reported)"}`);
    console.log(
      doubleOptIn === false
        ? "  ⚠ state=active → NO double opt-in on the direct path. The Form path (step 2) is REQUIRED."
        : doubleOptIn === true
          ? `  → state=inactive → double opt-in pending. CONFIRM the email arrived in ${TEST_EMAIL}.`
          : `  → state=${state} → not an opt-in signal; inspect the response above.`
    );
  } else {
    console.log("  ⚠ direct create failed — see response above.");
  }
}

// ── 2. Form subscriber create (the double opt-in fallback path) ──────────────────
section("2. Discover forms — GET /forms");
let resolvedFormId = null;
{
  const { ok, data } = await kit("GET", "/forms");
  const forms = data?.forms ?? [];
  if (ok && forms.length) {
    // The v4 list does NOT expose the double-opt-in setting, so it can't be printed
    // here — it is observed empirically from the subscriber state in step 3.
    console.log("  Forms found (id — uid — name — format):");
    for (const f of forms) {
      console.log(`   • id=${f.id} — uid=${f.uid ?? "?"} — ${f.name} — ${f.format ?? "?"}`);
    }
    // The API expects the numeric `id`; the embed URL/JS uses the string `uid`. Accept
    // either in KIT_FORM_ID and resolve to the numeric id so the URL gotcha can't bite.
    if (FORM_ID) {
      const match = forms.find(
        (f) => String(f.id) === String(FORM_ID) || f.uid === String(FORM_ID)
      );
      if (match) {
        resolvedFormId = match.id;
        if (String(match.id) !== String(FORM_ID)) {
          console.log(`  KIT_FORM_ID=${FORM_ID} is a uid → resolved to numeric id ${match.id}.`);
        }
      } else {
        console.log(`  ⚠ KIT_FORM_ID=${FORM_ID} matches no form id/uid — the form path will 404.`);
      }
    } else {
      resolvedFormId = forms[0].id;
      console.log(`  No KIT_FORM_ID set — defaulting to the first form: ${resolvedFormId}`);
      console.log("  For a clean test, set KIT_FORM_ID to a form with double opt-in enabled.");
    }
  } else {
    console.log(
      "  ⚠ No forms found (or the call failed). Create a double-opt-in Form in Kit and set KIT_FORM_ID."
    );
  }
}

if (resolvedFormId) {
  // The real double-opt-in flow is TWO calls: create the subscriber `inactive`, then
  // associate it with a double-opt-in Form — the association is what makes Kit send the
  // "confirm your subscription" email. A distinct address (plus-tag) keeps the direct
  // test (step 1) from pre-activating it and masking the pending state.
  const formEmail = plusTag(TEST_EMAIL, "form");
  section("3. Double opt-in flow — create inactive, then associate with the Form");
  console.log(`  Using a fresh address for this path: ${formEmail}`);
  findings.formSubscriber.attempted = true;
  findings.formSubscriber.formId = resolvedFormId;
  // 3a. Create as inactive (no email yet).
  await kit("POST", "/subscribers", { email_address: formEmail, state: "inactive" });
  // 3b. Associate with the opt-in Form — this triggers the confirmation email.
  const { ok, data } = await kit("POST", `/forms/${resolvedFormId}/subscribers`, {
    email_address: formEmail,
  });
  const { state, doubleOptIn } = classifySubscriber(data);
  findings.formSubscriber.state = state;
  findings.formSubscriber.doubleOptIn = doubleOptIn;
  if (ok) {
    console.log(`  → resulting state: ${state ?? "(not reported)"}`);
    console.log(
      doubleOptIn === true
        ? `  ✓ state=inactive → double opt-in pending. CONFIRM the "confirm your subscription" email arrived in ${formEmail}.`
        : "  ⚠ state is not 'inactive' — check the form has double opt-in enabled in the Kit UI."
    );
  }
} else {
  section("3. Form subscriber — SKIPPED (no form id available)");
}

// ── 4. Broadcast create (draft) ──────────────────────────────────────────────────
section("4. Broadcast create — POST /broadcasts (draft)");
let broadcastId = null;
{
  findings.broadcastCreate.attempted = true;
  // Only documented create fields, so the captured response shape is the real
  // draft-create contract and not perturbed by an undocumented field.
  const { ok, data } = await kit("POST", "/broadcasts", {
    subject: "[SPIKE TEST] Kit free-tier verification — ignore",
    content:
      "<p>This is an automated verification of the Kit free Newsletter plan (issue #71). Safe to ignore/delete.</p>",
    public: false,
  });
  const b = data?.broadcast ?? data;
  broadcastId = b?.id ?? null;
  findings.broadcastCreate.ok = ok;
  findings.broadcastCreate.id = broadcastId;
  findings.broadcastCreate.status = b?.status ?? null;
  if (ok && broadcastId) {
    console.log(`  ✓ broadcast draft created: id=${broadcastId} status=${b?.status ?? "?"}`);
  } else {
    console.log(
      "  ⚠ broadcast create failed — see response above. This would block the whole integration."
    );
  }
}

// ── 5. Broadcast send (only with --send) ─────────────────────────────────────────
let scheduledBroadcastId = null;
if (DO_SEND) {
  section("5. Broadcast send — POST /broadcasts with send_at (REAL SEND)");
  // Per the primary-source contract (docs/research/newsletter-free-tier-comparison.md):
  // POST /v4/broadcasts with a send_at ISO-8601 timestamp SCHEDULES the send — there is
  // no separate "send" verb to prove. So we create a fresh broadcast with send_at a few
  // minutes out; a non-2xx (esp. 402/403) is the plan restriction the spike hunts for.
  // The offset gives a cancel window in the Kit dashboard before it actually goes out.
  const sendAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  findings.broadcastSend.attempted = true;
  findings.broadcastSend.sendAt = sendAt;
  console.log(`  Scheduling a send for ${sendAt} (cancel from the dashboard if needed).`);
  const { ok, status, data } = await kit("POST", "/broadcasts", {
    subject: "[SPIKE TEST] Kit free-tier scheduled send — ignore",
    content: "<p>Automated free-tier send verification (issue #71). Safe to ignore/delete.</p>",
    public: false,
    send_at: sendAt,
  });
  scheduledBroadcastId = (data?.broadcast ?? data)?.id ?? null;
  findings.broadcastSend.ok = ok;
  // MailerLite-style hard plan block would surface as 402/403 with a plan message.
  findings.broadcastSend.planRestricted = status === 402 || status === 403;
  if (ok) {
    console.log(`  ✓ Free plan ACCEPTED a scheduled send (status ${status}).`);
    console.log(`    Watch ${TEST_EMAIL} at ${sendAt}, then confirm delivery.`);
  } else if (findings.broadcastSend.planRestricted) {
    console.log(
      `  ✗ Send appears PLAN-RESTRICTED (status ${status}) — the free plan may forbid API sending.`
    );
    console.log("    This is the failure the spike was meant to catch. Document the fallback.");
  } else {
    console.log(
      `  ⚠ Scheduled send returned ${status}. Inspect the body above — the shape may differ.`
    );
    console.log(`    (data: ${typeof data === "string" ? data : JSON.stringify(data)})`);
  }
} else {
  section("5. Broadcast send — SKIPPED");
  console.log(
    DO_SEND ? "  (no broadcast id to send)" : "  Pass --send to perform a real scheduled send."
  );
}

// ── 6. Cleanup (optional) ────────────────────────────────────────────────────────
if (DO_CLEANUP && (broadcastId || scheduledBroadcastId)) {
  section("6. Cleanup — DELETE /broadcasts/{id}");
  // Delete the draft AND the scheduled broadcast — the latter would otherwise actually
  // send at send_at, so cleanup doubles as the cancel for a --send run.
  for (const id of [broadcastId, scheduledBroadcastId].filter(Boolean)) {
    await kit("DELETE", `/broadcasts/${id}`);
  }
  console.log("  (Test subscriber left in place so you can inspect the confirmation email.)");
} else if (DO_SEND && scheduledBroadcastId) {
  console.log(
    `\n  ⚠ A real send is scheduled (broadcast ${scheduledBroadcastId}). Cancel it in the Kit`
  );
  console.log("    dashboard, or re-run with --cleanup, if you do not want it to go out.");
}

// ── Summary + verdicts ───────────────────────────────────────────────────────────
section("VERDICTS");
findings.verdicts.authWorks = findings.auth.ok === true;
findings.verdicts.broadcastCreateWorks = findings.broadcastCreate.ok === true;
findings.verdicts.freeTierSend = DO_SEND
  ? findings.broadcastSend.ok === true
    ? "ALLOWED"
    : findings.broadcastSend.planRestricted
      ? "PLAN-RESTRICTED"
      : "INCONCLUSIVE (see response)"
  : "NOT TESTED (run with --send)";
findings.verdicts.doubleOptIn = (() => {
  const direct = findings.directSubscriber.doubleOptIn;
  const form = findings.formSubscriber.doubleOptIn;
  if (direct === true) return "DIRECT create triggers double opt-in (no Form needed)";
  if (form === true)
    return "WORKS via v4: create inactive → associate with a double-opt-in Form (confirm email sent)";
  if (direct === false && form !== true)
    return "NO double opt-in observed — check the form has double opt-in enabled";
  return "INCONCLUSIVE — confirm the inbox manually";
})();

console.log(`  Auth works ..................... ${findings.verdicts.authWorks ? "YES" : "NO"}`);
console.log(
  `  Broadcast create works ......... ${findings.verdicts.broadcastCreateWorks ? "YES" : "NO"}`
);
console.log(`  Free-tier API send ............. ${findings.verdicts.freeTierSend}`);
console.log(`  Double opt-in .................. ${findings.verdicts.doubleOptIn}`);
console.log("\n  NOTE: the API only reveals subscriber STATE. Whether the confirmation and");
console.log(`  broadcast emails actually LAND is a human check — confirm both in ${TEST_EMAIL}.`);

if (JSON_OUT) {
  const { writeFile } = await import("node:fs/promises");
  await writeFile(JSON_OUT, `${JSON.stringify(findings, null, 2)}\n`);
  console.log(`\n  Findings written to ${JSON_OUT}`);
}

console.log(
  "\nDone. Transcribe the shapes above into docs/research/kit-api-verification-spike.md."
);
