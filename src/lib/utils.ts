import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic 10-digit account number derived from the member's reference number. */
export function generateAccountNumber(ref: string): string {
  let h = 5381;
  for (let i = 0; i < ref.length; i++) {
    h = Math.imul(h, 31) + ref.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString().padStart(10, "7").slice(-10);
}

/** Format a 10-digit account number as ••••  ••••  XXXX */
export function maskAccountNumber(num: string): string {
  return `••••  ••••  ${num.slice(-4)}`;
}

/** Deterministic external linked-account info derived from the member ref. */
export function getLinkedAccount(ref: string) {
  let h = 0;
  for (let i = 0; i < ref.length; i++) {
    h = Math.imul(h, 37) + ref.charCodeAt(i);
    h |= 0;
  }
  const abs = Math.abs(h);
  const last4 = abs.toString().padStart(4, "0").slice(-4);
  const routing = "0" + ((abs % 900_000_000) + 100_000_000).toString();
  const banks = ["Chase Bank", "Bank of America", "Wells Fargo", "Citibank", "Capital One"];
  const bankName = banks[abs % banks.length];
  return { bankName, last4, routing, accountType: "Checking" };
}
