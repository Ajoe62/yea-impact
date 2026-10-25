# Auth email templates

Branded emails for Supabase Auth. Paste each file into **Supabase → Authentication →
Emails → Templates**, with the subject below.

| Template in Supabase | File | Subject |
|---|---|---|
| Confirm sign up | `confirm-signup.html` | Confirm your YEA account |
| Reset password | `reset-password.html` | Reset your YEA password |
| Magic link | `magic-link.html` | Your YEA sign-in link |
| Change email address | `change-email.html` | Confirm your new email address |
| Invite user | `invite.html` | You're invited to YEA |

Every link points at `{{ .SiteURL }}/auth/confirm?token_hash=…&type=…`, so it works in
any browser or device, not only the one that asked for the email. That means:

- **Site URL** (Authentication → URL Configuration) must be `https://www.yeaimpactfoundation.top`.
- The logo is loaded from `{{ .SiteURL }}/email/logo.png` (`public/email/logo.png`).

Emails are sent through Brevo: Authentication → Emails → SMTP Settings, host
`smtp-relay.brevo.com`, port `587`, sender `no-reply@yeaimpactfoundation.top`.
