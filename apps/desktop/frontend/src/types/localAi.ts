export interface LocalAIStatusResponse {
  ollamaInstalled: boolean;
  ollamaRunning: boolean;
  qwenInstalled: boolean;
  qwenModel: string;
  qwenUsable: boolean;
  ready: boolean;
  message: string;
}
