---
sidebar_label: JWT Authentication
description: "JWT authentication explained through access tokens, token storage, revocation, security risks and the trade-offs against session authentication."
date: "September 10, 2026"
---

# JWT Authentication

JWT authentication uses a signed token to let an API recognize a user on each request. In the How to Dev standard, the
Rails API issues a JWT during login, the browser stores it locally, and later requests send it back in the
`Authorization: Bearer <token>` header.

This page focuses on the authentication model, not only the token format. A technically correct JWT is still a weak
authentication design if it stores sensitive data, cannot be revoked, lives in the wrong place, or is treated as a
replacement for authorization.

## How JWT authentication works

The flow in this project is intentionally simple:

```text
1. Browser sends email and password to POST /api/v1/auth/sign_in
2. Rails validates the credentials with Devise
3. devise-jwt signs an access token and returns it in the Authorization header
4. The browser stores the token and user summary
5. Future requests send Authorization: Bearer <token>
6. Rails verifies the signature, expiration and jti before resolving current_user
```

The important detail is that the API does not trust the browser just because a token exists. It verifies the token on
every authenticated request, and authorization still happens after authentication.

## Access token

The JWT used here is an access token: it proves that the request belongs to an authenticated user for a limited time.
The payload stays minimal:

- `sub`: user id
- `scp`: Devise scope
- `jti`: token identifier used for revocation
- `aud`: audience, empty when the client does not send one
- `iat`: issued-at time
- `exp`: expiration time

Name, email, role and permissions are not embedded in the JWT. They are returned as normal JSON in the login response
and can be refreshed from `/api/v1/auth/me`. That matters because JWT payloads are base64url encoded, not encrypted.
Anyone holding the token can decode the payload without the signing key.

## Refresh token

This How to Dev standard does not currently use a refresh token endpoint. When the access token expires, the user logs
in again.

That is less convenient than silent renewal, but it avoids adding a second long-lived credential before the project has
a complete refresh-token rotation policy. If refresh tokens are added later, the design needs rotation, reuse detection,
short access-token lifetime, and a clear storage decision.

## Where should a JWT be stored?

This project stores the access token in `localStorage` and sends it manually in the `Authorization` header. That choice
avoids classic CSRF because the browser does not automatically attach the token to cross-site requests.

The trade-off is XSS exposure: if an attacker can run JavaScript on the page, they can read `localStorage`. That is why
the JWT decision must be read together with the XSS, CSP, CSRF and secure-cookie pages, not as an isolated checklist.

## Security risks

The main JWT risks in this project are handled by explicit constraints:

- Never accept unsigned tokens or algorithm confusion.
- Use a strong signing secret in production.
- Keep claims minimal and non-sensitive.
- Validate expiration.
- Revoke tokens with `jti`, not with a fake logout.
- Treat authentication and authorization as separate controls.
- Protect token storage with XSS prevention and CSP.

The revocation strategy is `Devise::JWT::RevocationStrategies::JTIMatcher`: each user has a current `jti` in the
database, and a token is valid only while its payload `jti` matches the stored value. Logging out changes the stored
`jti`, invalidating older tokens immediately.

## JWT vs session authentication

JWT authentication is useful when an API needs stateless request authentication across clients or services. Cookie
sessions are often simpler for server-rendered apps because the browser handles the cookie automatically and the server
can keep session state.

The trade-off is not "JWT is modern, sessions are old". It is where state, revocation, CSRF exposure and XSS exposure
live. In this project, JWT fits the API-first Rails backend and direct browser-to-API calls, but it still needs
revocation and strict frontend security controls.

## Continue learning

- [Authentication](/padrao-frontend/seguranca/autenticacao)
- [CSRF](/padrao-frontend/seguranca/csrf)
- [XSS](/padrao-frontend/seguranca/xss)
- [Cookies HttpOnly & Secure](/padrao-frontend/seguranca/cookies-httponly-secure)
- [API authentication](/padrao-api/seguranca/autenticacao)
- [RBAC](/padrao-frontend/seguranca/administracao-rbac)
- [Developer Roadmap](/developer-roadmap)

## References

- [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [RFC 7519 - JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [MDN - Authorization header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
