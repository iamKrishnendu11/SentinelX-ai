import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const p1 = path.join(process.cwd(), "public", "downloads", "Sentinel-X-Setup-1.0.0.exe");
  const p2 = path.join(process.cwd(), "public", "downloads", "SentinelX_Desktop_Setup_x64.exe");
  
  const filePath = fs.existsSync(p1) ? p1 : fs.existsSync(p2) ? p2 : null;

  if (!filePath) {
    return NextResponse.json({ error: "Installer executable not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="Sentinel-X-Setup-1.0.0.exe"',
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
