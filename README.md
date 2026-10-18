# Pawsitive Clinic — deployment-reviewed source

Read `DEPLOYMENT_GUIDE.md` before running the updated project.

- Fill `.env.example` values in your private local `.env` or Vercel Production settings.
- Apply the required SQL migrations described in the guide before live requests.
- `npm ci` then `npm run build`.
- Website dev: port 3000. Dashboard dev: port 3001.
- Agent/notifications run only in dashboard. Website wakes it via `DASHBOARD_URL` + shared `CRON_SECRET`.
- No live deployment, Git push or live notification was performed here.
