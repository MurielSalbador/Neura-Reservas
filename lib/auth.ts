import crypto from "crypto";

const SALT = "tuReserva2024_salt";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + SALT).digest("hex");
}

export function comparePassword(plain: string, hashed: string): boolean {
  return hashPassword(plain) === hashed;
}
