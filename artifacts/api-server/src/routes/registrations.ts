import { createHash, randomBytes } from "node:crypto";
import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, registrationsTable, type Registration } from "@workspace/db";
import {
  CreateRegistrationBody,
  CreateRegistrationResponse,
  GetRegistrationParams,
  GetRegistrationResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const requests = new Map<string, { count: number; expires: number }>();
const windowMs = 15 * 60 * 1000;
const abstractDeadline = Date.parse("2026-11-30T23:59:59+05:30");
const hash = (token: string) => createHash("sha256").update(token).digest("hex");

function receipt(row: Registration, token: string) {
  return {
    reference: row.reference,
    token,
    fullName: row.fullName,
    email: row.email,
    category: row.category,
    affiliation: row.affiliation,
    submitAbstract: row.submitAbstract,
    accommodation: row.accommodation,
    ...(row.presentationTitle ? { presentationTitle: row.presentationTitle } : {}),
    ...(row.format ? { format: row.format } : {}),
    createdAt: row.createdAt.toISOString(),
    status: "request_received" as const,
    emailStatus: "not_sent" as const,
  };
}

router.post("/workshop/registrations", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  const now = Date.now();
  for (const [key, value] of requests) {
    if (value.expires < now) requests.delete(key);
  }
  const key = req.ip ?? "unknown";
  const rate = requests.get(key) ?? { count: 0, expires: now + windowMs };
  rate.count += 1;
  requests.set(key, rate);
  if (rate.count > 20) {
    res.setHeader("Retry-After", Math.ceil((rate.expires - now) / 1000));
    res.status(429).json({ error: "Too many registration attempts. Please wait 15 minutes before trying again." });
    return;
  }
  const parsed = CreateRegistrationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please check all required fields, enter a valid email, and accept the registration consent." });
    return;
  }
  const data = parsed.data;
  const fullName = data.fullName.trim();
  const affiliation = data.affiliation.trim();
  const email = data.email.trim().toLowerCase();
  const presentationTitle = data.presentationTitle?.trim();
  const abstract = data.abstract?.trim();
  if (fullName.length < 2 || affiliation.length < 2) {
    res.status(400).json({ error: "Your full name and affiliation must each contain at least two characters." });
    return;
  }
  if (data.accommodation && !data.category.startsWith("external_")) {
    res.status(400).json({ error: "Accommodation requests are available only to external participants." });
    return;
  }
  if (data.submitAbstract) {
    if (now > abstractDeadline) {
      res.status(400).json({ error: "The abstract submission deadline was November 30, 2026 (IST). You may still register without an abstract." });
      return;
    }
    const wordCount = abstract ? abstract.split(/\s+/u).length : 0;
    if (!presentationTitle || !abstract || !data.format || wordCount >= 300) {
      res.status(400).json({ error: "Please provide a presentation title, format, and an abstract strictly under 300 words (maximum 299)." });
      return;
    }
  }
  const token = randomBytes(32).toString("hex");
  const reference = `NU26-${randomBytes(6).toString("hex").toUpperCase()}`;
  try {
    const [row] = await db.insert(registrationsTable).values({
      reference,
      tokenHash: hash(token),
      fullName,
      email,
      category: data.category,
      affiliation,
      submitAbstract: data.submitAbstract,
      presentationTitle: data.submitAbstract ? presentationTitle : null,
      abstract: data.submitAbstract ? abstract : null,
      format: data.submitAbstract ? data.format : null,
      accommodation: data.accommodation,
      dietaryRestrictions: data.dietaryRestrictions?.trim() || null,
      consent: true,
    }).onConflictDoNothing({ target: registrationsTable.email }).returning();
    if (!row) {
      res.status(409).json({ error: "This email already has a registration request. Please use your saved confirmation link or contact stps-workshop@nalandauniv.edu.in for help." });
      return;
    }
    res.status(201).json(CreateRegistrationResponse.parse(receipt(row, token)));
  } catch {
    req.log.error("Unable to save workshop registration");
    res.status(503).json({ error: "We could not save your registration right now. Your form has not been cleared. Please try again." });
  }
});

router.get("/workshop/registrations/:token", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  const parsed = GetRegistrationParams.safeParse(req.params);
  if (!parsed.success || !/^[a-f0-9]{64}$/.test(parsed.data.token)) {
    res.status(404).json({ error: "This confirmation link is invalid. Please check the saved link or contact the organisers." });
    return;
  }
  try {
    const [row] = await db.select().from(registrationsTable).where(eq(registrationsTable.tokenHash, hash(parsed.data.token))).limit(1);
    if (!row) {
      res.status(404).json({ error: "Registration receipt not found. Please check your confirmation link." });
      return;
    }
    res.json(GetRegistrationResponse.parse(receipt(row, parsed.data.token)));
  } catch {
    req.log.error("Unable to retrieve workshop registration");
    res.status(503).json({ error: "Your confirmation is temporarily unavailable. Please try again." });
  }
});

export default router;