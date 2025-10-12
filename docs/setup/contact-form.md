# Contact Form Setup Guide

This guide explains how to set up the contact form with Resend email API.

## Overview

The contact form uses [Resend](https://resend.com/) to send emails. Resend is a modern email API designed for developers.

**Features:**
- Simple REST API
- High deliverability
- Generous free tier (100 emails/day, 3,000/month)
- Beautiful email templates
- Real-time email logs

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Log into your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "davideimola.dev Contact Form")
5. Select permissions: **Full Access** (recommended) or **Send Email** (minimum)
6. Copy the API key (starts with `re_`)

⚠️ **Important:** Store this key securely! You can't view it again after creation.

### 3. Configure Domain (Recommended)

For better deliverability, verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain: `davideimola.dev`
4. Add the provided DNS records (SPF, DKIM, DMARC) to your DNS provider
5. Wait for verification (usually a few minutes to hours)

**DNS Records Example:**
```
Type: TXT
Name: @ (or davideimola.dev)
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Name: resend._domainkey
Value: [provided by Resend]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@davideimola.dev
```

### 4. Set Environment Variables

Add the following to your `.env` file (local) or Vercel environment variables (production):

```bash
# Resend API Key
RESEND_API_KEY=re_your_api_key_here

# Email to receive contact form submissions
CONTACT_EMAIL=hello@davideimola.dev
```

#### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your Resend API key

#### For Production (Vercel):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `RESEND_API_KEY`: Your Resend API key
   - `CONTACT_EMAIL`: Your email address

### 5. Configure "From" Address

Once your domain is verified, update the `from` address in:

**File:** `src/app/api/contact/route.ts`

```typescript
from: "Contact Form <contact@davideimola.dev>",
```

**Options:**
- `contact@davideimola.dev` (recommended)
- `noreply@davideimola.dev`
- `hello@davideimola.dev`

⚠️ The "From" address **must** use your verified domain.

### 6. Test the Contact Form

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to [http://localhost:3000/contact](http://localhost:3000/contact)

3. Fill out and submit the form

4. Check:
   - Browser console for any errors
   - Resend dashboard for email logs
   - Your inbox for the email

## Troubleshooting

### Error: "Missing Resend API key"

**Cause:** The `RESEND_API_KEY` environment variable is not set.

**Solution:**
1. Check your `.env` file (local) or Vercel environment variables (production)
2. Ensure the variable is named exactly `RESEND_API_KEY`
3. Restart your development server after adding the variable

### Error: "Failed to send message"

**Cause:** Various API-related issues.

**Solution:**
1. Check the terminal/logs for the specific error message
2. Verify your API key is correct
3. Check Resend dashboard for rate limits or account issues
4. Ensure your domain is verified (if using custom domain)

### Emails not arriving

**Possible causes:**
1. **Spam folder:** Check recipient's spam/junk folder
2. **Domain not verified:** Verify your domain in Resend dashboard
3. **DNS records:** Ensure SPF, DKIM, DMARC records are correctly set
4. **Rate limits:** Check Resend dashboard for quota limits

**Debugging:**
1. Go to Resend dashboard → **Logs**
2. Find the email in question
3. Check delivery status and any error messages

### 403 Forbidden Error

**Cause:** API key doesn't have required permissions.

**Solution:**
1. Create a new API key with **Full Access** or **Send Email** permission
2. Update your environment variables
3. Restart your application

## Free Tier Limits

Resend free tier includes:
- **100 emails per day**
- **3,000 emails per month**
- 1 verified domain
- Email logs (30 days retention)

For a personal website contact form, this is more than sufficient.

## Paid Plans (Optional)

If you need more:
- **Pro:** $20/month - 50,000 emails/month
- **Business:** Custom pricing

See [resend.com/pricing](https://resend.com/pricing) for details.

## Alternative: Development/Testing Without Resend

For testing locally without setting up Resend:

1. Comment out the Resend API call in `src/app/api/contact/route.ts`
2. Add a mock response:
   ```typescript
   // Mock success for testing
   console.log("Contact form submission:", { name, email, subject, message });
   return NextResponse.json({ success: true, message: "Test mode - email not sent" }, { status: 200 });
   ```

⚠️ Remember to uncomment before deploying to production!

## Email Template Customization

To customize the email template, edit:

**File:** `src/app/api/contact/route.ts`

Functions:
- `generateEmailHtml()` - HTML version
- `generateEmailText()` - Plain text version

The current template includes:
- Brand colors (#C91F37)
- Professional layout
- All form fields
- Reply-to functionality

## Support

- **Resend Documentation:** [resend.com/docs](https://resend.com/docs)
- **Resend API Reference:** [resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **Resend Support:** [resend.com/support](https://resend.com/support)

## Security Notes

1. **Never commit `.env` to git** - It's already in `.gitignore`
2. **Rotate API keys** if they're ever exposed
3. **Use environment-specific keys** (separate for dev/staging/production)
4. **Rate limiting:** Consider adding rate limiting to the API route if needed
5. **Validation:** The form validates all inputs server-side

## Next Steps

Once configured, the contact form will:
1. ✅ Accept submissions from `/contact`
2. ✅ Validate all inputs (name, email, subject, message)
3. ✅ Send formatted emails via Resend
4. ✅ Set reply-to address to the submitter's email
5. ✅ Display success/error messages to users
6. ✅ Log all activity for debugging

**Your contact form is ready to use!** 🎉

