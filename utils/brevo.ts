import "dotenv/config";
import * as Brevo from "@getbrevo/brevo";

interface EmailPayload {
  email: string;
  subject: string;
  html: string;
}

export class EmailError extends Error {
  code = "BREVO_EMAIL_FAILED";
  status?: number;
  brevoMessage: string;

  constructor(message: string, status?: number, brevoMessage = "") {
    super(message);
    this.name = "EmailError";
    if (status !== undefined) {
      this.status = status;
    }
    this.brevoMessage = brevoMessage;
  }
}

export const sendSingleEmail = async (payload: EmailPayload): Promise<void> => {
  console.log("Sending email to:", payload.email);
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

    const senderName = process.env.BREVO_SENDER_NAME;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    if (!senderName || !senderEmail) {
      throw new Error("BREVO_SENDER_NAME and BREVO_SENDER_EMAIL must be configured");
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = payload.subject;
    sendSmtpEmail.to = [{ email: payload.email }];
    sendSmtpEmail.sender = {
      name: senderName,
      email: senderEmail,
    };
    sendSmtpEmail.htmlContent = payload.html;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent to:", payload.email);
  } catch (error: any) {
    const status: number | undefined = error?.response?.status;
    const brevoMessage: string = error?.response?.data?.message || error.message;

    console.error("Brevo email failed:", {
      recipient: payload.email,
      status,
      message: brevoMessage,
    });

    throw new EmailError(
      `Email not sent to ${payload.email}: ${brevoMessage}`,
      status,
      brevoMessage
    );
  }
};