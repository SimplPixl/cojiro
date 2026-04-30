import { NextApiRequest, NextApiResponse } from "next";
import parseSeed, { SeedReturnType } from "../../utils/parseSeed";
import { db } from "../../server/db";
import { env } from "../../env.mjs";
import jwt from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { spoilerLog } = req.body as { spoilerLog: string };

    if (!spoilerLog || typeof spoilerLog !== "string") {
      return res.status(400).json({ error: "Missing spoilerLog in request body" });
    }

    let apiSeed: SeedReturnType;
    try {
      apiSeed = JSON.parse(spoilerLog) as SeedReturnType;
    } catch {
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    const seed = parseSeed(apiSeed);

    const startingItems: string[] = [];
    if (apiSeed.settings?.starting_items) {
      const items = apiSeed.settings.starting_items;
      for (const el of Object.keys(items)) {
        const count = Math.min(items[el]!, 5);
        for (let i = 0; i < count; i++) {
          startingItems.push(el);
        }
      }
    }

    const playthrough = await db.playthrough.create({
      data: {
        seed: {
          create: {
            ...seed,
            rawLog: JSON.stringify(apiSeed),
          },
        },
        known_paths: {},
        known_locations: {},
        known_barren: [],
        items: startingItems,
      },
    });

    // Handle JWT for guest users
    const token = jwt.sign(
      { playthroughs: [playthrough.id] },
      env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      id: playthrough.id,
      token,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
