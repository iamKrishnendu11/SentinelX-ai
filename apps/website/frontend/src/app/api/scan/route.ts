import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// This replaces the Python FastAPI backend
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { repo_url } = body;

        if (!repo_url) {
            return NextResponse.json({ error: "repo_url is required" }, { status: 400 });
        }

        // Simulate backend processing time if needed
        // await new Promise(resolve => setTimeout(resolve, 500));

        const scan = {
            id: uuidv4(),
            repo_url: repo_url,
            status: "COMPLETE",
            score: 94,
            findings: {
                critical: 2,
                high: 5,
                medium: 11,
                low: 8
            },
            patches: 2,
            duration_s: 187,
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json(scan);
    } catch (error) {
        return NextResponse.json({ error: "Failed to process scan request" }, { status: 500 });
    }
}
