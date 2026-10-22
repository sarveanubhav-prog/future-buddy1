# Future Buddy — VS Code Alternative

A standalone React + Vite career guidance website based on the uploaded Future Buddy Professional project.

## Run in VS Code

1. Install Node.js 20 or newer.
2. Extract this ZIP.
3. Open the extracted folder in VS Code.
4. Open **Terminal → New Terminal**.
5. Run:

```bash
npm install
npm run dev
```

6. Open the localhost URL shown by Vite.

## What is included

- Modern responsive Future Buddy UI
- Home page
- Career explorer + career detail pages
- 15-question career assessment
- Trait scoring and career matching
- Salary comparison
- Skill explorer
- Government job pathways
- Private job pathways
- Career comparison
- Resources
- Dashboard
- Local sign-up/login
- Saved assessment results
- Personalized roadmap
- Profile
- About / Contact / Privacy / Terms

## Important

This version is intentionally **independent of Supabase**. Authentication and assessment results are stored in the browser's `localStorage`, so it runs immediately without database configuration.

For a production deployment, replace local authentication with a real backend/Supabase and never store real passwords in frontend localStorage.
