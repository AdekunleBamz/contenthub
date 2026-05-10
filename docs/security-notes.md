# Security Notes

- Keep Pinata JWTs in server-only environment variables.
- Do not paste wallet private keys into `NEXT_PUBLIC_*` variables.
- Rotate Pinata credentials immediately if they appear in logs or screenshots.
- Confirm treasury recipient addresses before contract deployment.
- Review API error payloads before sharing production logs.
- Keep WalletConnect project ids in project settings rather than screenshots or public tickets.
