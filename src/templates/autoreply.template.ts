import { escapeHtml } from './admin.template.js';

export const AUTOREPLY_EMAIL_SUBJECT = 'Inquiry Received — Abdul Hanan';

export const renderAutoReplyTemplate = (fullName: string): { html: string; text: string } => {
  const name = escapeHtml(fullName);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 20px; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { margin-bottom: 20px; }
    .header h2 { color: #2d3436; margin: 0; font-size: 22px; }
    .content { font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 25px; }
    .signature { font-size: 15px; font-weight: 600; color: #2d3436; border-top: 1px solid #e2e8f0; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Hi ${name},</h2>
    </div>
    
    <div class="content">
      <p>Thanks for reaching out!</p>
      <p>I've received your inquiry and will respond within <strong>24–48 hours</strong>.</p>
    </div>
    
    <div class="signature">
      — Abdul Hanan
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Hi ${fullName},

Thanks for reaching out.

I've received your inquiry and I'll respond within 24–48 hours.

— Abdul Hanan
  `.trim();

  return { html, text };
};
