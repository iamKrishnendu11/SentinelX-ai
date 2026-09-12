import { LocalAIStatusResponse } from "@/types/localAi";

const DESKTOP_BACKEND_URL =
  process.env.NEXT_PUBLIC_DESKTOP_BACKEND_URL || "http://localhost:8081";

export async function fetchLocalAIStatus(): Promise<LocalAIStatusResponse> {
  try {
    const res = await fetch(`${DESKTOP_BACKEND_URL}/api/local-ai/status`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`HTTP error status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    return {
      ollamaInstalled: false,
      ollamaRunning: false,
      qwenInstalled: false,
      qwenModel: "qwen2.5-coder:7b",
      qwenUsable: false,
      ready: false,
      message: "Could not connect to Sentinel-X desktop backend.",
    };
  }
}

export async function triggerLocalAICheck(): Promise<LocalAIStatusResponse> {
  try {
    const res = await fetch(`${DESKTOP_BACKEND_URL}/api/local-ai/check`, {
      method: "POST",
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`HTTP error status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    return {
      ollamaInstalled: false,
      ollamaRunning: false,
      qwenInstalled: false,
      qwenModel: "qwen2.5-coder:7b",
      qwenUsable: false,
      ready: false,
      message: "Could not connect to Sentinel-X desktop backend.",
    };
  }
}
