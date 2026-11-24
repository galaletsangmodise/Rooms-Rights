# Demo data and Loom script

## Demo accounts

Create these through the live app's sign-up form (confirm email is off in Supabase).

| Role | Email | Password |
|---|---|---|
| Landlord | landlord@roomsandrights.demo | Landlord-Demo-2026 |
| Tenant | tenant@roomsandrights.demo | Tenant-Demo-2026 |
| Admin | admin@roomsandrights.demo | Admin-Demo-2026 |

Make the admin account an admin in the Supabase SQL Editor (nobody can sign up as admin):

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin@roomsandrights.demo');
```

## Fill the demo with this story

1. **Landlord:** add a property ("Mokoena Yard, 12 Vilakazi Street, Soweto") and a room ("Backroom 1", R1 200).
2. **Landlord:** create an agreement for Backroom 1 and copy the invite code.
3. Sign out. **Tenant:** sign up, join with the code, open the agreement and accept it.
4. **Tenant:** upload a photo of the room to the Vault.
5. **Landlord:** upload a signed agreement PDF to the Vault, and set one other file to "Only me".
6. **Landlord:** record the deposit and this month's rent, then open a receipt.
7. **Tenant:** check the rent card on the home page, open the receipt, and confirm "Only me" files are not visible.

## Loom script (5 minutes maximum)

| Time | Say and show |
|---|---|
| 0:00 to 0:30 | **The problem.** Many people rent backrooms with no written agreement, so when a dispute starts there is no proof. Show the welcome screen. |
| 0:30 to 1:15 | **The business.** Landlord pays per room, tenant is free, no public listings because people find rooms door to door. Show BUSINESS.md briefly. |
| 1:15 to 2:30 | **Landlord flow.** Dashboard, create an agreement, show the printable document, show the invite code and QR. |
| 2:30 to 3:30 | **Tenant flow.** Join with the code, accept the agreement, show the rent card and the Vault. |
| 3:30 to 4:15 | **Money.** Record a payment, open the receipt, void one to show the history stays honest. |
| 4:15 to 5:00 | **How it is built.** Next.js, Supabase with row level security, tests and green CI. Show the pull request list. Name one honest known issue. Say where you would take it next. |

Practise once with a timer. Record on the live link in phone view (F12, then the device toolbar).
