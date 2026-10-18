# Pawsitive Clinic — deployment steps

Updated 18 October 2026. These packages have not been pushed, deployed, or connected to live services by Codex.

## 1. What changed

- Downloaded dashboard receipt now embeds its own styling. It opens without a missing `style.css`, includes the actual delivery fee, and offers Print / Save as PDF.
- Admin WhatsApp LLM files are now correctly installed in the DASHBOARD. The uploaded website had them under a misspelled helper filename while the dashboard was still on the older implementation.
- Website customer chatbot + My Orders use Checking availability → Pending payment → Paid. A paid record is not labelled pending merely because its stored `order_status` remains `pending`. Cancellation support remains as it already existed; no delivery/dispatch/completed feature was added.
- Dashboard is the only owner of WhatsApp/order notifications. Website saves an order, then wakes the dashboard worker. The dashboard cron recovers if this wake-up fails.
- Incoming webhooks require a secret, are saved before acknowledgement, deduplicated by message ID, and processed under a DB lease across server instances. Failed jobs retry with backoff, then remain in `failed` for review.
- Customer email, WhatsApp text and PDF success are recorded separately for new notifications. Successful parts are skipped during partial-failure retries. Existing combined markers are respected to avoid resending historical receipts.
- Profile/cart/wishlist/order history now require a signed server-side customer session. Checkout calculates product/variant prices from the database and creates the order + items in one SQL transaction.
- Public catalog polling avoids duplicate fetches; it runs on visible shop/product pages every 4 seconds. My Orders still refreshes every 4 seconds when open. Catalog responses may be briefly cached (3 seconds plus a short revalidation window).
- Product uploads are limited to supported image formats and 3 MB before base64 overhead. Production revenue metrics use paid non-cancelled orders.
- Original `.env`, `node_modules`, `.next`, `.git` and logs are not in the deliverable ZIPs. Keep your existing local `.env` privately, then update it using `.env.example`.

## 2. Before you run or deploy

1. Keep a backup of both original project folders and export a Supabase backup.
2. Extract the two UPDATED ZIPs into new folders. Use them as full replacements, not a partial overlay: several obsolete website agent files were removed deliberately.
3. In your EXISTING Supabase project, run:
   - Dashboard: `migrations/20261018_deployment.sql` (required).
   - Website: `migrations/20261018_chatbot.sql` (idempotent OTP/rate-limit prerequisites; safe to rerun).
4. These migrations add infrastructure tables/functions and protect private tables. They do not delete existing products/orders or change your order status values. They assume the existing app's users/orders/order_items/carts/cart_items/wishlist/admins tables already exist.
5. The deployment SQL restricts direct anonymous access to customer/order/admin tables; the updated server APIs use the service role. Public product/category access retains its existing policies.
6. The new customer session secret means customers may need to sign in again once.
7. New logged-in orders are linked to their authenticated account through `customer_orders`. Historical guest orders are NOT attached merely by matching an unverified account email. Those orders remain accessible through the existing email-OTP chatbot flow or clinic support. This is intentional privacy protection.

## 3. Local build commands — PowerShell

Run inside each project, not the parent `yeap` folder.

Website:

```powershell
cd "C:\YOUR-PATH\pawsitive pet clinic website"
npm ci
npm run build
npm run dev
```

Dashboard, in another terminal:

```powershell
cd "C:\YOUR-PATH\pawsitive pet clinic dashboard"
npm ci
npm run build
npm run dev
```

Website is normally port 3000; dashboard dev is 3001. For local website-to-worker wake-up, set website `DASHBOARD_URL=http://localhost:3001`, with the SAME `CRON_SECRET` in both local env files. Stop/restart after env changes. Vercel uses HTTPS production URLs instead.

## 4. Environment variables — WEBSITE Vercel project

Copy names from the website `.env.example`. Add them in Vercel → website project → Settings → Environment Variables → Production.

| Variable | Value / source |
|---|---|
| `SITE_URL` | Final HTTPS website domain, without trailing slash |
| `DASHBOARD_URL` | Final HTTPS dashboard domain, without trailing slash |
| `SUPABASE_URL` | Existing Supabase project URL |
| `SUPABASE_ANON_KEY` | Existing anon/publishable project key compatible with the app |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service-role key; NEVER NEXT_PUBLIC |
| `CUSTOMER_SESSION_SECRET` | New random secret, at least 32 characters |
| `CHATBOT_OTP_SECRET` | Existing OTP secret (32+ chars); keeping it preserves current code hashing |
| `CRON_SECRET` | Same random 32+ character value as dashboard |
| `BREVO_API_KEY` | Brevo transactional-email API key |
| `BREVO_SENDER_EMAIL` | Sender email verified with Brevo; used for order OTP |
| `OPENROUTER_API_KEY` | Working OpenRouter key |
| `OPENROUTER_MODEL` | Working model ID; current example is `openrouter/free` |
| `JINA_API_KEY` | Optional; blank means local ranking fallback |
| `JINA_RERANK_MODEL` | Optional; default `jina-reranker-v2-base-multilingual` |

The website no longer needs `WHAPI_TOKEN`, `ADMIN_WHATSAPP`, admin credentials or follow-up timing variables. Customer chatbot runs through OpenRouter; Jina only ranks knowledge/catalog passages. A free model/router is not an availability guarantee.

## 5. Environment variables — DASHBOARD Vercel project

Copy names from dashboard `.env.example` into dashboard Vercel → Settings → Environment Variables → Production.

| Variable | Value / source |
|---|---|
| `SUPABASE_URL` | Same existing project as website |
| `SUPABASE_ANON_KEY` | Same project anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service-role key |
| `ADMIN_EMAIL` | Dashboard login email |
| `ADMIN_PASSWORD` | Strong dashboard login password |
| `SESSION_SECRET` | Unique random 32+ character secret |
| `CRON_SECRET` | Same secret as WEBSITE `CRON_SECRET` |
| `WHAPI_WEBHOOK_SECRET` | Another unique 32+ character secret; put it in Whapi's custom header too |
| `WHAPI_TOKEN` | Token of the channel connected to the SENDING business WhatsApp number |
| `ADMIN_WHATSAPP` | RECEIVING owner/admin's number: international digits, e.g. `923XXXXXXXXX` |
| `DEFAULT_COUNTRY_CODE` | `92` |
| `SUPPORT_PHONE` | Public Maaz/clinic contact, e.g. `+92 334 3601699` |
| `BREVO_API_KEY` | Brevo transactional-email key |
| `BREVO_SENDER_EMAIL` | Verified sender address |
| `BREVO_SENDER_NAME` | `Pawsitive Clinic` |
| `OWNER_EMAIL` | Email for WhatsApp-failure alerts; otherwise sender email is used |
| `PAYMENT_INSTRUCTIONS` | Actual verified payment account details. Replace the placeholder before launch |
| `STORE_URL` | HTTPS website domain for Go Live button |
| `AGENT_LLM_PROVIDER` | `openrouter` for your current setup |
| `OPENROUTER_API_KEY` | Working OpenRouter key in DASHBOARD too |
| `AGENT_LLM_MODEL` | Your working OpenRouter model ID; example `openrouter/free` |
| `AGENT_DEBUG` | `false` in production; temporarily `true` logs intent/action/scope/filter only |
| `CUSTOMER_INBOUND` | `on` to forward relevant customer support messages to admin; `off` disables that path |
| `ALLOW_ADMIN_SELF_CHAT` | `false` for production; see number setup below |
| Timing/window settings | Next section |

Optional Gemini alternative: set `AGENT_LLM_PROVIDER=gemini`, set `GEMINI_API_KEY`, and use a working Gemini ID in `AGENT_LLM_MODEL` (or omit it and use `GEMINI_MODEL`). Never leave an OpenRouter model ID selected for Gemini. Website chatbot is still OpenRouter.

Do NOT set `PORT`, `VERCEL`, `VERCEL_ENV`, `NEXT_RUNTIME`, `NEXT_PHASE` or `NODE_ENV` manually in Vercel. Do not paste secrets into screenshots or GitHub.

Generate a secret locally (run separately for each unique secret):

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Only `CRON_SECRET` is deliberately shared between projects. Keep session/webhook/OTP secrets separate.

## 6. Follow-up timing: test values vs production recommendation

| Setting | Your uploaded test env | Production example | Meaning |
|---|---:|---:|---|
| `PAYMENT_ASK_AFTER_MINUTES` | 1 | 30 | First admin payment check after availability confirmation |
| `PAYMENT_REASK_HOURS` | 6 | 6 | Delay before asking about that unpaid payment again |
| `PAYMENT_ASK_MAX` | 3 | 3 | Max automated payment questions per order; now enforced |
| `FOLLOWUP_HOURS` | 0.05 (3 minutes) | 3 | General follow-up after admin leaves work waiting |
| `FOLLOWUP_MAX_PER_DAY` | default 3 | 3 | General follow-up cap per Pakistan calendar day |
| `ADMIN_NUDGE_MINUTES` | 2 | 5 | Availability-question reminder spacing |
| `ADMIN_NUDGE_MAX` | 3 | 3 | Availability reminder cap |
| `ADMIN_BUSY_MINUTES` | default 5 | 5 | Silence before pausing certain conversation modes |
| `DIGEST_WAIT_MINUTES` | default 10 | 10 | Minimum digest cooldown |
| `AGENT_HOURS_OFF` | true | false | true bypasses the automated admin-hours restriction |
| `AGENT_START_HOUR` | default 12 | 12 | Admin notification window start, Asia/Karachi |
| `AGENT_END_HOUR` | default 24 | 24 | Admin notification window end, Asia/Karachi |

These are recommendations, not newly verified clinic hours. Owner can choose the admin notification window or set `AGENT_HOURS_OFF=true` for 24-hour prompts. Replies can still be handled outside the automated window, and existing conversation activity may keep the agent active for 30 minutes.

Customer payment-reminder EMAILS are separate: current code spaces them at 12-hour intervals, up to four. Partial notification failures retry no sooner than 5 minutes. Webhook failures retry with backoff, maximum five attempts, then stay `failed` for review.

IMPORTANT: changing env only changes future scheduling. Existing `payment_next_ask_at`/state `followup_at` values already stored by test runs stay as-is until the agent updates them. Paid orders are excluded from unpaid work. Do not run a global status UPDATE to “fix” paid records.

## 7. Vercel projects / scheduler

Recommended target: two Next.js projects on Vercel, Node 22, existing Supabase, Brevo, Whapi, OpenRouter; Jina optional.

- Website project root = website folder (or repository root if its repo contains only website files).
- Dashboard project root = dashboard folder (or repository root if its repo contains only dashboard files).
- Build command: `npm run build`; install: `npm ci`; output directory: leave Next.js default.
- Use production-only live credentials. The dashboard worker ignores Vercel Preview automation to prevent preview-triggered sends.
- Add final domains and envs; redeploy after changing env variables.
- Dashboard `vercel.json` runs `/api/cron/tick` EVERY MINUTE. This requires a plan supporting sub-daily cron; current Vercel Hobby does not. For this commercial clinic deployment, use an appropriate commercial plan (normally Pro).
- The function exports `maxDuration=240` for cron/webhook/payment processing. Keep Fluid Compute enabled; actual hosting limits still apply.
- Do not add a second external cron on top of the included one.

If deliberately using an EXTERNAL scheduler instead of Vercel Cron:

```powershell
Copy-Item .\vercel.external-cron.json .\vercel.json
```

Then schedule one GET every minute to `https://YOUR-DASHBOARD-DOMAIN/api/cron/tick`, with header `Authorization: Bearer YOUR_CRON_SECRET`. Do NOT put this secret in the URL query. External scheduling does not change Vercel's commercial-use terms or function billing.

## 8. Git commands — YOU run these; nothing was pushed

Repository names/URLs were not included with the ZIPs. Replace the placeholders below with your actual GitHub repository URLs.

Website — new local repo / empty remote:

```powershell
cd "C:\YOUR-PATH\pawsitive pet clinic website"
git init
git add .
git status
git commit -m "Prepare website for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_WEBSITE_REPO.git
git push -u origin main
```

Dashboard — new local repo / empty remote:

```powershell
cd "C:\YOUR-PATH\pawsitive pet clinic dashboard"
git init
git add .
git status
git commit -m "Prepare dashboard and WhatsApp worker for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_DASHBOARD_REPO.git
git push -u origin main
```

If you already have local repositories/remotes, do not blindly repeat `remote add`: check `git remote -v`, copy updated source into your checkout, use `git add -A`, inspect `git status`, commit and push normally. Do not force-push. `.env` must not appear in staged files. If a remote has existing commits, integrate them normally rather than force overwriting.

Import each repo in Vercel → New Project → Next.js → set Production env → Deploy. Once domains exist, update website `SITE_URL` + `DASHBOARD_URL` and dashboard `STORE_URL`, then redeploy affected projects.

## 9. WhatsApp number handover — sender and admin recipient are different

There are THREE roles:

1. **Bot/business sender**: the WhatsApp account connected to the Whapi channel. This number sends ALL API messages, to customers and to admin. A `from` env variable does not switch it.
2. **Admin recipient**: `ADMIN_WHATSAPP`. Receives alerts and replies “yes/no” or natural-language requests to the bot. Only this allowlisted incoming sender can issue admin commands.
3. **Customer recipient**: `orders.phone` from checkout. Do not replace customer numbers globally.

Stage A — your current sender sends admin alerts to Maaz:

- Keep your currently connected Whapi channel/token.
- Set dashboard `ADMIN_WHATSAPP` to Maaz's RECEIVING admin number (international digits).
- Keep `SUPPORT_PHONE` as the clinic's public contact.
- `ALLOW_ADMIN_SELF_CHAT=false` because sender and recipient now differ.
- Maaz replies FROM that admin number TO the currently connected bot number.
- Customers still see YOUR currently connected number as sender at this stage.

Stage B — switch customer/admin outgoing messages to the client's business WhatsApp:

- Connect the client's business WhatsApp account to the chosen Whapi channel using its supported QR/linking flow. If you create/use a different channel, replace dashboard `WHAPI_TOKEN` with that channel's token.
- Set that channel's webhook to the PRODUCTION dashboard URL below.
- Keep `ADMIN_WHATSAPP` as a separate authorized admin/owner phone. Do not set it to the same business sender number for normal production.
- If Maaz has only ONE phone/WhatsApp number and it is also the connected bot sender, normal incoming-admin replies and bot-output echoes become hard to distinguish. Keep a separate admin phone for this setup. Self-chat remains a LOCAL TEST option only (`ALLOW_ADMIN_SELF_CHAT=true`), not the recommended client deployment.
- Provider plan/sandbox recipient restrictions still apply. Connecting a channel does not bypass them.

Whapi webhook configuration:

```text
URL: https://YOUR-DASHBOARD-DOMAIN/api/whapi-webhook
Method: POST
Mode: Body
Events: incoming message creation (messages.post)
Additional header:
x-webhook-secret: SAME_VALUE_AS_WHAPI_WEBHOOK_SECRET
```

Use the channel's webhook test and inspect your server logs. Old webhook URLs without the new header will be rejected with 401. Successful ingress means the event is stored; it does not by itself prove the action/customer message completed.

## 10. Public clinic contact locations

If the public Maaz/clinic support contact changes, update these WEBSITE files, then rebuild/redeploy:

- `src/components/FloatingIcons.jsx`
- `src/components/Footer.jsx`
- `src/components/pages/PaymentPage.jsx`
- `src/components/pages/GuidePage.jsx`
- `public/js/script.js` (payment/support links)
- `src/lib/server/chatbotData.js`
- `src/lib/server/chatbotOrders.js`
- `src/lib/server/chatbot.js` (fallback contact if hardcoded)
- `src/app/[[...slug]]/page.js` (SEO contact)

DASHBOARD: `SUPPORT_PHONE` env and `src/components/ReceiptModal.jsx` footer. Change `ADMIN_WHATSAPP` separately if the admin recipient changes. Changing the connected sender alone does NOT require changing all public clinic links.

## 11. Launch smoke test

1. Run the SQL migrations and set both env lists.
2. Open website and dashboard; log in to dashboard. `/api/health` should return `ok:true`.
3. Send “all orders”, then “good”, then “paid hain saray?” FROM the allowlisted admin phone to the connected bot.
4. Place ONE labelled test order using email/phone numbers you control. Confirm it appears once in dashboard.
5. Reply yes to availability. Check Pending payment, payment instructions and unpaid receipt.
6. Verify actual test payment/authorized test funds before marking paid. Reply yes to payment check. Check Paid on dashboard, website My Orders and OTP chatbot; confirm customer email/text/PDF.
7. Download receipt HTML, open the saved file offline, check styling and totals; Print → Save as PDF.
8. Wait for an actual scheduled cron tick and confirm logs. Verify private APIs return 401 without login.
9. Check that a duplicate webhook does not repeat an order action. Inspect failed jobs if any:

```sql
select id, attempts, created_at, next_attempt_at
from public.agent_webhook_jobs
where status = 'failed'
order by created_at desc;
```

Inspect and resolve the cause before explicitly resetting a failed job for retry. Message sends are at-least-once integrations: a provider accepting a send immediately before a network/process failure can still cause a duplicate. There is no claim of perfect exactly-once delivery.

## 12. Verified here / still to verify live

Verified: production builds for both projects; real receipt component/export DOM; signed-session ownership/tamper checks; server checkout pricing and validation; PostgreSQL migration rerun/permissions/atomic rollback/lease behavior; durable-job dedupe/retry behavior; actual partial-notification retry code with provider stubs; 27 admin conversation regressions using mock model/DB.

Not verified here: real Supabase credentials/schema execution, real email/Whapi delivery, real model interpretation for every wording, Vercel domain/cron configuration. These remain the launch smoke test. Visual browser testing was unavailable (local browser download failed and remote browser timed out); no visual-pass claim is made. Existing WhatsApp PDF renderer was retained; the reported broken HTML export is the one corrected.

Known launch content checks: Guide still has a clearly-labelled sample flower demo video; replace with your real tutorial when available. Public clinic opening hours in the footer/knowledge must be confirmed by Maaz (the existing strings were not silently reinterpreted). Stock testimonial imagery and the third testimonial were retained as requested earlier.

## References checked

- https://vercel.com/docs/cron-jobs/usage-and-pricing
- https://vercel.com/docs/functions/configuring-functions/duration
- https://vercel.com/docs/functions/limitations
- https://vercel.com/docs/plans/hobby
- https://support.whapi.cloud/help-desk/receiving/webhooks/detailed-webhook-settings
- https://whapi.readme.io/reference/updatechannelsettings
