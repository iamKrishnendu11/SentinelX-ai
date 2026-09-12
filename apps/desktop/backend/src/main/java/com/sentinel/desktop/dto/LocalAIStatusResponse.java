package com.sentinel.desktop.dto;

public class LocalAIStatusResponse {
    private boolean ollamaInstalled;
    private boolean ollamaRunning;
    private boolean qwenInstalled;
    private String qwenModel = "qwen2.5-coder:7b";
    private boolean qwenUsable;
    private boolean ready;
    private String message;

    public LocalAIStatusResponse() {}

    public LocalAIStatusResponse(boolean ollamaInstalled, boolean ollamaRunning, boolean qwenInstalled, String qwenModel, boolean qwenUsable, boolean ready, String message) {
        this.ollamaInstalled = ollamaInstalled;
        this.ollamaRunning = ollamaRunning;
        this.qwenInstalled = qwenInstalled;
        this.qwenModel = qwenModel;
        this.qwenUsable = qwenUsable;
        this.ready = ready;
        this.message = message;
    }

    public boolean isOllamaInstalled() { return ollamaInstalled; }
    public void setOllamaInstalled(boolean ollamaInstalled) { this.ollamaInstalled = ollamaInstalled; }

    public boolean isOllamaRunning() { return ollamaRunning; }
    public void setOllamaRunning(boolean ollamaRunning) { this.ollamaRunning = ollamaRunning; }

    public boolean isQwenInstalled() { return qwenInstalled; }
    public void setQwenInstalled(boolean qwenInstalled) { this.qwenInstalled = qwenInstalled; }

    public String getQwenModel() { return qwenModel; }
    public void setQwenModel(String qwenModel) { this.qwenModel = qwenModel; }

    public boolean isQwenUsable() { return qwenUsable; }
    public void setQwenUsable(boolean qwenUsable) { this.qwenUsable = qwenUsable; }

    public boolean isReady() { return ready; }
    public void setReady(boolean ready) { this.ready = ready; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
