import { NextResponse } from "next/server";
import { handler } from "@/server/http";
import { exportUserData } from "@/server/services/privacy";

export const GET = handler(
  async ({ user, db }) => {
    const data = await exportUserData(db, user.id);
    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="pruefungsklar-export-${new Date().toISOString().slice(0, 10)}.json"`,
        "Cache-Control": "no-store",
      },
    });
  },
  { limit: { key: "export", max: 5, windowMs: 3_600_000 } },
);
