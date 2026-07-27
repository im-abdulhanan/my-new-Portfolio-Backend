import { ContactRequestBody } from '../types/contact.types.js';

export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const ADMIN_EMAIL_SUBJECT = '🚀 New Collaboration Request — Abdul Hanan Portfolio';

export const renderAdminTemplate = (data: ContactRequestBody): { html: string; text: string } => {
  const name = escapeHtml(data.fullName);
  const email = escapeHtml(data.email);
  const company = data.company ? escapeHtml(data.company) : 'N/A';
  const projectType = escapeHtml(data.projectType);
  const budget = data.budget ? escapeHtml(data.budget) : 'N/A';
  const details = escapeHtml(data.projectDetails).replace(/\n/g, '<br/>');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #6c5ce7; padding-bottom: 15px; margin-bottom: 25px; }
    .header h2 { color: #2d3436; margin: 0; font-size: 24px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 12px; font-weight: 700; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .value { font-size: 16px; color: #2d3436; font-weight: 500; }
    .message-box { background: #f8fafc; border-left: 4px solid #6c5ce7; padding: 15px; border-radius: 4px; margin-top: 10px; font-size: 15px; line-height: 1.6; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #a0aec0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🚀 New Portfolio Inquiry</h2>
    </div>
    
    <div class="field">
      <div class="label">Name</div>
      <div class="value">${name}</div>
    </div>
    
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${email}">${email}</a></div>
    </div>
    
    <div class="field">
      <div class="label">Company</div>
      <div class="value">${company}</div>
    </div>
    
    <div class="field">
      <div class="label">Project Type</div>
      <div class="value">${projectType}</div>
    </div>
    
    <div class="field">
      <div class="label">Budget</div>
      <div class="value">${budget}</div>
    </div>
    
    <div class="field">
      <div class="label">Message</div>
      <div class="message-box">${details}</div>
    </div>
    
    <div class="footer">
      Sent from Abdul Hanan Portfolio Contact API
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
🚀 New Portfolio Inquiry

Name: ${data.fullName}
Email: ${data.email}
Company: ${data.company || 'N/A'}
Project Type: ${data.projectType}
Budget: ${data.budget || 'N/A'}

Message:
${data.projectDetails}
  `.trim();

  return { html, text };
};
