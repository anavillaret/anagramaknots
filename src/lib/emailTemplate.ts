// Shared branded email template for all Anagrama transactional emails

const TEAL = '#0F7A75'
const LINEN = '#F7E7DD'
const INK = '#1a1a1a'
const STONE = '#8A837C'

function emailHeader() {
  return `
    <div style="background:${TEAL};padding:28px 40px;text-align:center;">
      <p style="margin:0;font-size:11px;letter-spacing:0.4em;color:rgba(255,255,255,0.6);text-transform:uppercase;font-family:Georgia,serif;">※</p>
      <p style="margin:4px 0 0;font-size:18px;letter-spacing:0.35em;color:#ffffff;text-transform:uppercase;font-weight:600;font-family:Georgia,serif;">ANAGRAMA</p>
      <p style="margin:3px 0 0;font-size:10px;letter-spacing:0.25em;color:rgba(255,255,255,0.65);text-transform:uppercase;font-family:sans-serif;">Art in Knots</p>
    </div>
  `
}

function emailFooter() {
  return `
    <div style="margin-top:40px;padding:24px 40px;border-top:1px solid #ece8e3;text-align:center;">
      <p style="margin:0;font-size:11px;color:${STONE};letter-spacing:0.1em;">
        <a href="https://anagramaknots.com" style="color:${TEAL};text-decoration:none;">anagramaknots.com</a>
        &nbsp;·&nbsp;
        <a href="https://instagram.com/anagrama_knots" style="color:${TEAL};text-decoration:none;">@anagrama_knots</a>
      </p>
      <p style="margin:6px 0 0;font-size:10px;color:#bbb;letter-spacing:0.05em;">Handmade in Portugal · Art in Knots</p>
    </div>
  `
}

export function brandedEmail(bodyHtml: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f5f1ed;">
      <div style="max-width:600px;margin:32px auto;background:#ffffff;font-family:Inter,Helvetica,sans-serif;color:${INK};">
        ${emailHeader()}
        <div style="padding:36px 40px;">
          ${bodyHtml}
        </div>
        ${emailFooter()}
      </div>
    </body>
    </html>
  `
}

export function divider() {
  return `<hr style="border:none;border-top:1px solid #ece8e3;margin:24px 0;" />`
}

export function infoTable(rows: Array<{ label: string; value: string }>) {
  return `
    <table style="width:100%;border-collapse:collapse;">
      ${rows.map(r => `
        <tr>
          <td style="padding:8px 0;color:${STONE};font-size:12px;width:130px;border-bottom:1px solid #f0ebe6;">${r.label}</td>
          <td style="padding:8px 0;font-size:13px;border-bottom:1px solid #f0ebe6;">${r.value}</td>
        </tr>
      `).join('')}
    </table>
  `
}

export function linedBlock(content: string) {
  return `<div style="padding:16px 20px;background:${LINEN};font-size:13px;line-height:1.8;color:${INK};white-space:pre-wrap;border-left:3px solid ${TEAL};">${content}</div>`
}

export { TEAL, LINEN, INK, STONE }
