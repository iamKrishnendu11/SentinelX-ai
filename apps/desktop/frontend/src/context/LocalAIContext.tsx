"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { LocalAIStatusResponse } from "@/types/localAi";
import { fetchLocalAIStatus, triggerLocalAICheck } from "@/services/localAiApi";

interface LocalAIContextType {
  aiStatus: LocalAIStatusResponse;
  isChecking: boolean;
  checkEnvironment: () => Promise<LocalAIStatusResponse>;
}

const initialAIStatus: LocalAIStatusResponse = {
  ollamaInstalled: false,
  ollamaRunning: false,
  qwenInstalled: false,
  qwenModel: "qwen2.5-coder:7b",
  qwenUsable: false,
  ready: false,
  message: "Checking local AI environment...",
};

const LocalAIContext = createContext<LocalAIContextType | undefined>(undefined);

export function LocalAIProvider({ children }: { children: React.ReactNode }) {
  const [aiStatus, setAiStatus] = useState<LocalAIStatusResponse>(initialAIStatus);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkEnvironment = useCallback(async (): Promise<LocalAIStatusResponse> => {
    setIsChecking(true);
    try {
      const status = await triggerLocalAICheck();
      setAiStatus(status);
      return status;
    } catch {
      const fallback: LocalAIStatusResponse = {
        ollamaInstalled: false,
        ollamaRunning: false,
        qwenInstalled: false,
        qwenModel: "qwen2.5-coder:7b",
        qwenUsable: false,
        ready: false,
        message: "Failed to check local AI environment.",
      };
      setAiStatus(fallback);
      return fallback;
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Check initial environment status on mount
  useEffect(() => {
    async function initCheck() {
      setIsChecking(true);
      try {
        const status = await fetchLocalAIStatus();
        setAiStatus(status);
      } catch {
        // Leave initial status
      } finally {
        setIsChecking(false);
      }
    }
    initCheck();
  }, []);

  return (
    <LocalAIContext.Provider
      value={{
        aiStatus,
        isChecking,
        checkEnvironment,
      }}
    >
      {children}
    </LocalAIContext.Provider>
  );
}

export function useLocalAI() {
  const context = useContext(LocalAIContext);
  if (!context) {
    throw new Error("useLocalAI must be used within a LocalAIProvider");
  }
  return context;
}
