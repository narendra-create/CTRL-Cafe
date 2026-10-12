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
      <td style="padding:0 3px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td
              width="46"
              height="54"
              align="center"
              valign="middle"
              style="
                width:46px;
                height:54px;
                background:#1b211f;
                border:1px solid rgba(250,204,21,0.22);
                border-radius:12px;
                color:#FACC15;
                font-size:24px;
                font-weight:800;
                line-height:54px;
                text-align:center;
                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
              "
            >${d}</td>
          </tr>
        </table>
      </td>`
    )
    .join("");

  const greeting = userName
    ? `Hey <strong style="color:#f4f1e9;font-weight:650;">${userName}</strong>,`
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
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="
  margin:0;
  padding:0;
  background-color:#0b0f0f;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
">

  <!-- Outer wrapper -->
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    role="presentation"
    style="width:100%;background-color:#0b0f0f;"
  >
    <tr>
      <td align="center" style="padding:34px 16px 48px;">

        <!-- Card -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          role="presentation"
          style="width:100%;max-width:520px;"
        >

          <!-- ── Logo row ── -->
          <tr>
            <td align="center" style="padding:0 0 22px;">
              <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td style="padding-right:9px;vertical-align:middle;">
                    <!-- Yellow icon square -->
                    <div style="
                      width:32px;
                      height:32px;
                      background:#FACC15;
                      border-radius:9px 9px 9px 3px;
                      display:inline-block;
                      transform:rotate(-6deg);
                      line-height:32px;
                      text-align:center;
                      font-size:16px;
                      font-family:Arial,sans-serif;
                    ">☕</div>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="
                      font-size:16px;
                      font-weight:800;
                      letter-spacing:-0.025em;
                      color:#f4f1e9;
                    ">CTRL-CAFE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Main card ── -->
          <tr>
            <td style="
              background:#151b1a;
              border:1px solid rgba(255,255,255,0.08);
              border-radius:18px;
              overflow:hidden;
            ">

              <!-- Yellow top accent bar -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td style="
                    height:3px;
                    background:#FACC15;
                    font-size:0;
                    line-height:0;
                  ">&nbsp;</td>
                </tr>
              </table>

              <!-- Card body -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td style="padding:36px 38px 34px;">

                    <!-- Lock icon badge -->
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:20px;">
                      <tr>
                        <td style="
                          width:48px;
                          height:48px;
                          background:#1d211d;
                          border:1px solid rgba(250,204,21,0.18);
                          border-radius:13px;
                          text-align:center;
                          line-height:48px;
                          font-size:21px;
                        ">🔐</td>
                      </tr>
                    </table>

                    <!-- Eyebrow -->
                    <p style="
                      margin:0 0 7px;
                      font-size:10px;
                      font-weight:800;
                      letter-spacing:0.16em;
                      text-transform:uppercase;
                      color:#FACC15;
                    ">Email Verification</p>

                    <!-- Heading -->
                    <h1 style="
                      margin:0 0 14px;
                      font-size:27px;
                      font-weight:800;
                      letter-spacing:-0.045em;
                      line-height:1.14;
                      color:#f4f1e9;
                    ">Verify your email<br />to grab your seat.</h1>

                    <!-- Greeting -->
                    <p style="
                      margin:0 0 24px;
                      font-size:14px;
                      line-height:1.65;
                      color:#8f9894;
                    ">
                      ${greeting} use the code below to verify your email address and
                      finish creating your CTRL&#8209;CAFE account.
                      This code expires in
                      <strong style="color:#c7c7bf;font-weight:650;">${expiresInMinutes} minutes</strong>.
                    </p>

                    <!-- OTP boxes -->
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:0 auto 26px;">
                      <tr>
                        ${digitBoxes}
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:20px;">
                      <tr>
                        <td style="height:1px;background:rgba(255,255,255,0.07);font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>

                    <!-- Warning note -->
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      role="presentation"
                      width="100%"
                      style="
                        width:100%;
                        background:#191d19;
                        border:1px solid rgba(250,204,21,0.12);
                        border-radius:11px;
                        margin-bottom:24px;
                      "
                    >
                      <tr>
                        <td style="padding:12px 14px;">
                          <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                            <tr>
                              <td style="vertical-align:top;padding-right:9px;font-size:14px;line-height:1;">⚠️</td>
                              <td style="
                                font-size:11px;
                                line-height:1.6;
                                color:#8f918a;
                              ">
                                <strong style="color:#c8c7bf;font-weight:650;">Never share this code.</strong>
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
                      font-size:11px;
                      line-height:1.6;
                      color:#555d59;
                      text-align:center;
                    ">
                      This email was sent by CTRL&#8209;CAFE. If you have questions,
                      reply to this email and we'll help you out.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Card footer bar -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  background:#111615;
                  border-top:1px solid rgba(255,255,255,0.05);
                "
              >
                <tr>
                  <td style="padding:15px 26px;text-align:center;">
                    <span style="font-size:10px;color:#454c49;">
                      © ${new Date().getFullYear()} CTRL&#8209;CAFE
                      &nbsp;·&nbsp;
                      <a href="#" style="color:#59615d;text-decoration:none;">Privacy Policy</a>
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
