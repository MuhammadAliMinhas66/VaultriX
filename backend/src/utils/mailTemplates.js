const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const shell = (title, bodyHtml) => `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f7f7f8;font-family:Inter,Arial,sans-serif;color:#111114;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #e5e5e7;border-radius:12px;">
            <tr>
              <td style="padding:24px 32px;border-bottom:1px solid #e5e5e7;font-size:20px;letter-spacing:2px;font-weight:700;text-transform:uppercase;">Vaultrix</td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;">${escapeHtml(title)}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 24px;font-size:12px;color:#6b6b70;">This message was sent by Vaultrix. If you did not expect it, you can ignore it.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const otpEmail = ({ name, code, minutes }) => ({
  subject: `${code} is your Vaultrix verification code`,
  text: `Hi ${name || 'there'},\n\nYour Vaultrix password reset code is ${code}.\nIt expires in ${minutes} minutes.\n\nIf you did not ask to reset your password, you can ignore this email. Your password will not change.\n`,
  html: shell(
    'Reset your password',
    `<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#3b3b40;">Hi ${escapeHtml(name || 'there')}, use this code to reset your Vaultrix password.</p>
     <div style="margin:0 0 20px;padding:18px 0;text-align:center;background:#f7f7f8;border:1px solid #e5e5e7;border-radius:10px;font-family:'SFMono-Regular',Consolas,monospace;font-size:32px;font-weight:700;letter-spacing:10px;">${escapeHtml(code)}</div>
     <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#3b3b40;">The code expires in ${minutes} minutes and can only be used once.</p>
     <p style="margin:0;font-size:14px;line-height:1.6;color:#3b3b40;">If you did not ask for this, ignore this email. Your password will not change.</p>`
  ),
});

export const googleAccountEmail = ({ name }) => ({
  subject: 'Sign in to Vaultrix with Google',
  text: `Hi ${name || 'there'},\n\nSomeone asked to reset the password for this email on Vaultrix. This account signs in with Google, so there is no password to reset. Use the Continue with Google button on the sign in page.\n\nIf this was not you, you can ignore this email.\n`,
  html: shell(
    'This account uses Google sign in',
    `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#3b3b40;">Hi ${escapeHtml(name || 'there')}, someone asked to reset the password for this email on Vaultrix.</p>
     <p style="margin:0;font-size:14px;line-height:1.6;color:#3b3b40;">This account signs in with Google, so there is no password to reset. Use the Continue with Google button on the sign in page.</p>`
  ),
});

export const passwordChangedEmail = ({ name }) => ({
  subject: 'Your Vaultrix password was changed',
  text: `Hi ${name || 'there'},\n\nThe password for your Vaultrix account was just changed and all other sessions were signed out.\n\nIf this was not you, reset your password again right away.\n`,
  html: shell(
    'Your password was changed',
    `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#3b3b40;">Hi ${escapeHtml(name || 'there')}, the password for your Vaultrix account was just changed and other sessions were signed out.</p>
     <p style="margin:0;font-size:14px;line-height:1.6;color:#3b3b40;">If this was not you, reset your password again right away.</p>`
  ),
});
