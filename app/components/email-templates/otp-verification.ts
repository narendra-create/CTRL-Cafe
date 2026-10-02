/* OTP Verification Email Template */
interface OtpEmailProps {
  otp: string;
  userName?: string;
  expiresInMinutes?: number;
}

export function otpVerificationEmail({
  otp,
  userName,
  expiresInMinutes = 10,
}: OtpEmailProps): { html: string; text: string; subject: string } {
  /* Split OTP digits for individual boxes */
  const digits = otp.split("");

  const digitBoxes = digits
    .map(
      (d) => `
      <td style="padding:0 4px;">
        <div style="
          width:44px;
          height:52px;
          background:#1a2120;
          border:1.5px solid rgba(250,204,21,0.35);
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:26px;
          font-weight:800;
          color:#FACC15;
          letter-spacing:0;
          line-height:52px;
          text-align:center;
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        ">${d}</div>
      </td>`
    )
    .join("");

  const greeting = userName
    ? `Hey <strong style="color:#f7f3ed;">${userName}</strong>,`
    : `Hey there,`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>Your CTRL-CAFE verification code</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="
  margin:0;
  padding:0;
  background-color:#0d1111;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d1111;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px 60px;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

          <!-- ── Logo row ── -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <!-- Yellow icon square -->
                    <div style="
                      width:36px;height:36px;
                      background:#FACC15;
                      border-radius:10px 10px 10px 3px;
                      display:inline-block;
                      transform:rotate(-6deg);
                      line-height:36px;
                      text-align:center;
                      font-size:18px;
                    ">☕</div>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="
                      font-size:17px;
                      font-weight:800;
                      letter-spacing:-0.03em;
                      color:#f7f3ed;
                    ">CTRL-CAFE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Main card ── -->
          <tr>
            <td style="
              background:linear-gradient(160deg,#181e1e 0%,#131919 100%);
              border:1px solid rgba(255,255,255,0.07);
              border-radius:22px;
              overflow:hidden;
            ">

              <!-- Yellow top accent bar -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="
                    height:3px;
                    background:linear-gradient(90deg,transparent,#FACC15 30%,#FACC15 70%,transparent);
                  "></td>
                </tr>
              </table>

              <!-- Card body -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:40px 40px 36px;">

                    <!-- Lock icon badge -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="
                          width:54px;height:54px;
                          background:rgba(250,204,21,0.10);
                          border:1.5px solid rgba(250,204,21,0.22);
                          border-radius:14px;
                          text-align:center;
                          line-height:54px;
                          font-size:24px;
                        ">🔐</td>
                      </tr>
                    </table>

                    <!-- Eyebrow -->
                    <p style="
                      margin:0 0 8px;
                      font-size:10px;
                      font-weight:800;
                      letter-spacing:0.18em;
                      text-transform:uppercase;
                      color:#FACC15;
                    ">Email Verification</p>

                    <!-- Heading -->
                    <h1 style="
                      margin:0 0 16px;
                      font-size:28px;
                      font-weight:850;
                      letter-spacing:-0.05em;
                      line-height:1.1;
                      color:#f7f3ed;
                    ">Verify your email<br/>to grab your seat.</h1>

                    <!-- Greeting -->
                    <p style="
                      margin:0 0 28px;
                      font-size:15px;
                      line-height:1.65;
                      color:#8a9490;
                    ">
                      ${greeting} use the code below to verify your
                      email address and finish creating your CTRL&#8209;CAFE account.
                      This code expires in <strong style="color:#c5c4bb;">${expiresInMinutes} minutes</strong>.
                    </p>

                    <!-- OTP boxes -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                      <tr>${digitBoxes}</tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="height:1px;background:rgba(255,255,255,0.07);"></td>
                      </tr>
                    </table>

                    <!-- Warning note -->
                    <table cellpadding="0" cellspacing="0" border="0" style="
                      background:rgba(250,204,21,0.06);
                      border:1px solid rgba(250,204,21,0.14);
                      border-radius:12px;
                      margin-bottom:28px;
                      width:100%;
                    ">
                      <tr>
                        <td style="padding:14px 16px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="vertical-align:top;padding-right:10px;font-size:15px;line-height:1;">⚠️</td>
                              <td style="
                                font-size:12px;
                                line-height:1.6;
                                color:#9a9890;
                              ">
                                <strong style="color:#c5c4bb;">Never share this code.</strong>
                                CTRL&#8209;CAFE staff will never ask for your verification code.
                                If you didn't request this, you can safely ignore this email.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Footer note -->
                    <p style="
                      margin:0;
                      font-size:12px;
                      line-height:1.6;
                      color:#4a504e;
                      text-align:center;
                    ">
                      This email was sent by CTRL&#8209;CAFE. If you have questions,
                      reply to this email and we'll help you out.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Card footer bar -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
                background:rgba(0,0,0,0.25);
                border-top:1px solid rgba(255,255,255,0.05);
              ">
                <tr>
                  <td style="padding:18px 40px;text-align:center;">
                    <span style="font-size:11px;color:#3a403e;">
                      © ${new Date().getFullYear()} CTRL&#8209;CAFE &nbsp;·&nbsp;
                      <a href="#" style="color:#4a504e;text-decoration:none;">Unsubscribe</a>
                      &nbsp;·&nbsp;
                      <a href="#" style="color:#4a504e;text-decoration:none;">Privacy Policy</a>
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  /* Plain-text fallback */
  const text = `CTRL-CAFE — Email Verification

${userName ? `Hey ${userName},` : "Hey there,"}

Your verification code is: ${otp}

This code expires in ${expiresInMinutes} minutes. Never share it with anyone.

If you didn't request this, you can safely ignore this email.

— CTRL-CAFE Team`;

  const subject = `${otp} is your CTRL-CAFE verification code`;

  return { html, text, subject };
}
