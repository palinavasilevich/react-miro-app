import { SignJWT, jwtVerify } from "jose";

export type Session = {
  userId: string;
  email: string;
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "your-secret-key",
);
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export function createRefreshTokenCookie(refreshToken: string): string {
  return `refreshToken=${refreshToken}; HttpOnly; Max-Age=604800; Path=/; SameSite=Strict`;
}

export async function generateTokens(session: Session) {
  const accessToken = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return { accessToken, refreshToken };
}

export async function verifyToken(token: string): Promise<Session> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as Session;
}
