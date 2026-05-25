import { createTransport } from "nodemailer";

const sendOrderConfirmation = async ({
  email,
  subject,
  orderId,
  products,
  totalAmount,
}) => {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const productsHtml = products
    .map(
      (product) => `
  <tr>
    <td style="padding:14px 16px;border-bottom:1px solid #f4f4f5;">
      <p style="margin:0;font-size:14px;font-weight:600;color:#09090b;">${product.name}</p>
    </td>
    <td style="padding:14px 16px;border-bottom:1px solid #f4f4f5;text-align:center;">
      <span style="font-size:13px;color:#71717a;">× ${product.quantity}</span>
    </td>
    <td style="padding:14px 16px;border-bottom:1px solid #f4f4f5;text-align:right;">
      <span style="font-size:14px;font-weight:600;color:#09090b;">₹${(product.price * product.quantity).toLocaleString("en-IN")}</span>
    </td>
  </tr>
`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:520px;background:#ffffff;border-radius:16px;
                 overflow:hidden;border:1px solid #e4e4e7;">

          <tr>
            <td style="background:#09090b;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 16px;font-size:22px;font-weight:700;
                color:#ffffff;letter-spacing:-0.3px;">NexCart</p>
              <!-- Success icon -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
                <tr>
                  <td align="center"
                    style="width:56px;height:56px;border-radius:50%;
                           background:#22c55e;font-size:26px;line-height:56px;
                           color:#ffffff;font-weight:700;">
                    ✓
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">
                Order confirmed!
              </p>
              <p style="margin:4px 0 0;font-size:13px;color:#a1a1aa;">
                We've received your order and it's being processed.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#fafafa;padding:14px 40px;
                       border-bottom:1px solid #f4f4f5;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:600;
                      letter-spacing:1.2px;color:#a1a1aa;text-transform:uppercase;">
                      Order ID
                    </p>
                    <p style="margin:2px 0 0;font-size:13px;font-weight:600;
                      color:#09090b;font-family:'Courier New',monospace;">
                      #${orderId}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;font-weight:600;
                      letter-spacing:1.2px;color:#a1a1aa;text-transform:uppercase;">
                      Date
                    </p>
                    <p style="margin:2px 0 0;font-size:13px;font-weight:600;color:#09090b;">
                      ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#09090b;">
                Hi ${email},
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#71717a;line-height:1.6;">
                Thank you for your purchase! Here's a summary of your order.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f4f4f5;border-radius:10px;
                       overflow:hidden;margin-bottom:0;">
                <!-- Table header -->
                <tr style="background:#f4f4f5;">
                  <td style="padding:10px 16px;font-size:11px;font-weight:600;
                    letter-spacing:1px;color:#a1a1aa;text-transform:uppercase;">
                    Product
                  </td>
                  <td style="padding:10px 16px;font-size:11px;font-weight:600;
                    letter-spacing:1px;color:#a1a1aa;text-transform:uppercase;
                    text-align:center;">
                    Qty
                  </td>
                  <td style="padding:10px 16px;font-size:11px;font-weight:600;
                    letter-spacing:1px;color:#a1a1aa;text-transform:uppercase;
                    text-align:right;">
                    Amount
                  </td>
                </tr>

                ${productsHtml}

              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f4f4f5;border-top:none;
                       border-radius:0 0 10px 10px;overflow:hidden;">
                <tr style="background:#09090b;">
                  <td style="padding:16px;">
                    <p style="margin:0;font-size:13px;font-weight:600;
                      color:#a1a1aa;text-transform:uppercase;letter-spacing:1px;">
                      Total Amount
                    </p>
                  </td>
                  <td style="padding:16px;text-align:right;">
                    <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">
                      ₹${totalAmount.toLocaleString("en-IN")}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#f0fdf4;border:1px solid #bbf7d0;
                       border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:13px;font-weight:600;
                      color:#15803d;">
                      📦 &nbsp;What happens next?
                    </p>
                    <p style="margin:0;font-size:13px;color:#166534;line-height:1.6;">
                      Your order is now being prepared. You'll receive a shipping
                      confirmation email with tracking details once it's on its way.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #f4f4f5;margin:0;"/>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;line-height:1.6;">
                Questions? Reply to this email or contact our support team.
              </p>
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                © ${new Date().getFullYear()} NexCart · All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html,
  });
};

export default sendOrderConfirmation;
