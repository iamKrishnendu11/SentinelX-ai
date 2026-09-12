package com.sentinel.website.configs;

public interface EmailSender {
    boolean sendOtpEmail(String recipientName, String recipientEmail, String otpCode);
}
