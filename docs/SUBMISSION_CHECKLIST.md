# Submission checklist

Tick every line on the live site and on GitHub, not on your laptop.

## App
- [ ] Live link opens for someone who is not logged in
- [ ] Login works with all test logins in the README
- [ ] At least two roles behave differently (landlord and tenant)
- [ ] Data is in the hosted database and survives a refresh
- [ ] A tenant cannot see another tenant's data

## Engineering
- [ ] Tests exist and pass (`pnpm test`)
- [ ] CI is green on `main` (lint, typecheck, test, build)
- [ ] Work went through Issues, branches and pull requests
- [ ] `main` is protected and requires the `ci` check

## Documents in the repo
- [ ] `BUSINESS.md`
- [ ] `README.md` with live link, Stitch link, Loom link, test logins, screenshots, stack, architecture, run and test steps, known issues
- [ ] `docs/PRD.md`
- [ ] `docs/designs/` with the Stitch exports
- [ ] `IMPLEMENTATION_PLAN.md`

## Last
- [ ] Open the live link in a private window on mobile data and log in with the README logins
- [ ] Open the repo while logged out and click every link in the README
- [ ] Submit before the deadline, not in the last hour

If time runs short, protect these in order: live link, test logins, README, Loom, green CI.
