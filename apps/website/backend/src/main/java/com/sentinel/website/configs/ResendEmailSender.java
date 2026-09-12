package com.sentinel.website.configs;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ResendEmailSender implements EmailSender {

  private static final Logger logger = LoggerFactory.getLogger(ResendEmailSender.class);

  private final String apiKey;
  private final String fromEmail;

  public ResendEmailSender(
      @Value("${resend.api-key:${RESEND_API_KEY:}}") String apiKey,
      @Value("${resend.from-email:${RESEND_FROM_EMAIL:Sentinel-X <onboarding@resend.dev>}}") String fromEmail) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  @Override
  public boolean sendOtpEmail(String recipientName, String recipientEmail, String otpCode) {
    String subject = "Verify your Sentinel-X account";
    String htmlBody = """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #050505; color: #F5F5F0; margin: 0; padding: 40px 20px; }
            .card { max-width: 480px; margin: 0 auto; background: #0A0A0A; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; text-align: center; }
            .logo { font-size: 20px; font-weight: bold; color: #B7FF00; letter-spacing: 2px; margin-bottom: 24px; }
            .otp { font-family: monospace; font-size: 36px; font-weight: bold; color: #B7FF00; letter-spacing: 8px; background: rgba(183, 255, 0, 0.05); border: 1px solid rgba(183, 255, 0, 0.2); border-radius: 12px; padding: 16px; margin: 24px 0; }
            .subtext { font-size: 14px; color: #9CA3AF; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">SENTINEL-X</div>
            <h2>Verify Your Account</h2>
            <p class="subtext">Hello %s,</p>
            <p class="subtext">Your Sentinel-X verification code is:</p>
            <div class="otp">%s</div>
            <p class="subtext">This code expires in 10 minutes.</p>
            <p class="subtext" style="font-size: 12px; color: #6B7280; margin-top: 24px;">If you did not create a Sentinel-X account, please ignore this email.</p>
          </div>
        </body>
        </html>
        """
        .formatted(recipientName, otpCode);

    if (apiKey == null || apiKey.trim().isEmpty() || apiKey.startsWith("re_dummy")) {
      logger.info("[DEV MODE] Resend API key not set. Verification code for {}: [{}]", recipientEmail, otpCode);
      return true;
    }

    try {
      String textBody = "Hello %s,\n\nYour Sentinel-X verification code is: %s\n\nThis code expires in 10 minutes.\n\nIf you did not create a Sentinel-X account, please ignore this email."
          .formatted(recipientName, otpCode);

      Resend resend = new Resend(apiKey);
      CreateEmailOptions params = CreateEmailOptions.builder()
          .from(fromEmail)
          .to(recipientEmail)
          .subject(subject)
          .html(htmlBody)
          .text(textBody)
          .build();

      CreateEmailResponse response = resend.emails().send(params);
      logger.info("Resend verification email sent to {}, id: {}", recipientEmail, response.getId());
      return true;
    } catch (Exception e) {
      logger.error("Failed to send email via Resend to {}: {}", recipientEmail, e.getMessage());
      return false;
    }
  }
}