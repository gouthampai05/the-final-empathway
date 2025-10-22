/**
 * Email Template Generator
 *
 * Generates HTML email templates with psychologist profile information,
 * similar to the public blog page layout.
 */

export interface EmailTemplateData {
  subject: string;
  content: string; // HTML content from TipTap editor
  authorName: string;
  authorCompany?: string;
  authorYearsExperience?: number;
  unsubscribeLink?: string;
  preferencesLink?: string;
}

/**
 * Generates a complete HTML email template with inline CSS
 * (required for email clients)
 */
export function generateEmailTemplate(data: EmailTemplateData): string {
  const {
    subject,
    content,
    authorName,
    authorCompany,
    authorYearsExperience,
    unsubscribeLink,
    preferencesLink,
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <style>
    /* Reset styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* Base styles */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 32px;
      text-align: center;
      color: #ffffff;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.2;
    }

    .content {
      padding: 40px 32px;
    }

    .content h1 { font-size: 32px; font-weight: 700; margin-top: 32px; margin-bottom: 16px; color: #111827; line-height: 1.2; }
    .content h2 { font-size: 24px; font-weight: 600; margin-top: 28px; margin-bottom: 12px; color: #1f2937; line-height: 1.3; }
    .content h3 { font-size: 20px; font-weight: 600; margin-top: 24px; margin-bottom: 10px; color: #374151; line-height: 1.4; }
    .content p { margin-bottom: 16px; color: #4b5563; }
    .content a { color: #667eea; text-decoration: none; }
    .content a:hover { text-decoration: underline; }
    .content ul, .content ol { margin-bottom: 16px; padding-left: 24px; }
    .content li { margin-bottom: 8px; }
    .content blockquote {
      border-left: 4px solid #667eea;
      padding-left: 20px;
      margin-left: 0;
      margin-right: 0;
      font-style: italic;
      color: #6b7280;
    }
    .content pre {
      background-color: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 16px;
    }
    .content code {
      background-color: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    .content img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 24px auto;
      border-radius: 8px;
    }
    .content hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 32px 0;
    }

    .author-section {
      background-color: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      margin-top: 40px;
      border: 1px solid #e5e7eb;
    }

    .author-header {
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    .author-name {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }

    .author-details {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.5;
    }

    .author-details-item {
      margin-bottom: 6px;
    }

    .footer {
      background-color: #f9fafb;
      padding: 32px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }

    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 12px;
    }

    .footer-links {
      font-size: 14px;
    }

    .footer-links a {
      color: #667eea;
      text-decoration: none;
      margin: 0 12px;
    }

    .footer-links a:hover {
      text-decoration: underline;
    }

    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .header { padding: 32px 20px !important; }
      .header h1 { font-size: 24px !important; }
      .content { padding: 32px 20px !important; }
      .content h1 { font-size: 28px !important; }
      .content h2 { font-size: 22px !important; }
      .author-section { padding: 20px !important; }
      .footer { padding: 24px 20px !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${escapeHtml(subject)}</h1>
    </div>

    <!-- Main Content -->
    <div class="content">
      ${content}
    </div>

    <!-- Author Section -->
    <div class="content">
      <div class="author-section">
        <div class="author-header">Written by</div>
        <div class="author-name">${escapeHtml(authorName)}</div>
        <div class="author-details">
          ${authorCompany ? `<div class="author-details-item">${escapeHtml(authorCompany)}</div>` : ''}
          ${authorYearsExperience ? `<div class="author-details-item">${authorYearsExperience} years of experience in psychology and therapy</div>` : ''}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        You're receiving this email because you subscribed to our newsletter.
      </div>
      <div class="footer-links">
        ${preferencesLink ? `<a href="${escapeHtml(preferencesLink)}">Manage Preferences</a>` : ''}
        ${unsubscribeLink ? `<a href="${escapeHtml(unsubscribeLink)}">Unsubscribe</a>` : ''}
      </div>
      <div class="footer-text" style="margin-top: 16px; font-size: 12px;">
        © ${new Date().getFullYear()} ${escapeHtml(authorCompany || 'EmpathWay')}. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Generate a preview/test email template
 */
export function generatePreviewTemplate(data: EmailTemplateData): string {
  return generateEmailTemplate({
    ...data,
    unsubscribeLink: '#',
    preferencesLink: '#',
  });
}

/**
 * Extract plain text from HTML content (for email preview text)
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#039;/g, "'") // Replace &#039; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}
