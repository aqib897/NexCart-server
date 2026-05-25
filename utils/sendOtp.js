import { createTransport } from "nodemailer";

const sendOtp = async (email, subject, otp) => {
  const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,

    auth: {
      user: process.env.BREVO_LOGIN,
      pass: process.env.BREVO_SMTP_KEY,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">

          <tr>
            <td style="background:#09090b;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                NexCart
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 40px 32px;">

              <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#09090b;letter-spacing:-0.3px;">
                Verify your identity
              </p>
              <p style="margin:0 0 32px;font-size:14px;color:#71717a;line-height:1.6;">
                Use the one-time password below to complete your verification.
                This code was requested for <strong style="color:#09090b;">${email}</strong>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center"
                    style="background:#f4f4f5;border-radius:12px;padding:28px 20px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;
                      letter-spacing:1.5px;color:#71717a;text-transform:uppercase;">
                      Your OTP Code
                    </p>
                    <p style="margin:0;font-size:42px;font-weight:700;
                      letter-spacing:10px;color:#09090b;font-family:'Courier New',monospace;">
                      ${otp}
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#fff7ed;border:1px solid #fed7aa;
                    border-radius:8px;padding:12px 16px;">
                    <p style="margin:0;font-size:13px;color:#9a3412;line-height:1.5;">
                      ⏳ &nbsp;This code expires in <strong>5 minutes</strong>.
                      Do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.6;">
                If you didn't request this, you can safely ignore this email.
                Someone may have entered your email address by mistake.
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #f4f4f5;margin:0;"/>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.6;">
                © ${new Date().getFullYear()} NexCart. All rights reserved.<br/>
                This is an automated message — please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  console.log("BREVO LOGIN:", process.env.BREVO_LOGIN);
  console.log("BREVO SENDER:", process.env.BREVO_SENDER);
  console.log("SMTP KEY EXISTS:", !!process.env.BREVO_SMTP_KEY);

  await transporter.verify();
  console.log("SMTP server is ready");

  await transporter.sendMail({
    from: process.env.BREVO_SENDER,
    to: email,
    subject: subject,
    html,
  });
};

export default sendOtp;
