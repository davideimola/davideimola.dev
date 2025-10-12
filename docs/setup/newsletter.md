# 📧 Kit (formerly ConvertKit) Newsletter Setup Guide

This guide will help you set up the newsletter integration with **Kit** (formerly ConvertKit).

> **Note**: ConvertKit rebranded to "Kit" in October 2024. The API endpoints remain the same (`api.convertkit.com`), but the platform is now accessed at [kit.com](https://kit.com).

## 🚀 Quick Start

### 1. Create a Kit Account

1. Go to [Kit](https://kit.com/)
2. Sign up for a free account (up to 10,000 subscribers on free plan)
3. Complete the onboarding process

### 2. Get Your API Key

1. Log in to your Kit account at [app.kit.com](https://app.kit.com)
2. Go to **Settings** → **Advanced** → **API**
3. You'll see TWO sections:
   - **📘 API Key** ← Use this one! ✅
   - **🔒 API Secret** ← Not needed for basic newsletter ❌
4. In the **"API Key"** section, click "Show"
5. Copy the **API Key** only

> **Important**: For the newsletter subscription form, you only need the **API Key**. The API Secret is not required.

### 3. Create a Form

1. Go to **Grow** → **Forms**
2. Click **New Form**
3. Choose a form template (I recommend "Simple" for a minimal design)
4. Customize the form (or keep it simple since we're using a custom UI)
5. Save the form
6. Find the **Form ID** in the URL: `app.kit.com/forms/[FORM_ID]/edit`

### 4. Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your credentials:
   ```env
   CONVERTKIT_API_KEY=your_actual_api_key_here
   CONVERTKIT_FORM_ID=your_actual_form_id_here
   ```

### 5. Test the Integration

1. Restart your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `/blog`
3. Scroll to the newsletter section
4. Enter your email and click "Subscribe"
5. Check your Kit dashboard at [app.kit.com](https://app.kit.com) to see if the subscriber was added

## 🎨 Customization

### Change the Newsletter Title and Description

In any page where you want to add the newsletter component:

```tsx
import { Newsletter } from "~/app/_components/newsletter";

// Default usage
<Newsletter />

// Custom title and description
<Newsletter 
  title="Join My Tech Newsletter"
  description="Weekly insights on infrastructure, DevOps, and cloud-native technologies."
/>

// Using a specific form (if you have multiple forms)
<Newsletter 
  formId="your_other_form_id"
  title="VIP Newsletter"
  description="Exclusive content for subscribers."
/>
```

### Add Newsletter to Other Pages

You can add the newsletter component to any page:

```tsx
import { Newsletter } from "~/app/_components/newsletter";

export default function YourPage() {
  return (
    <main>
      {/* Your content */}
      
      <Newsletter />
    </main>
  );
}
```

## 🔒 GDPR Compliance

The newsletter component is GDPR compliant by default:

- ✅ Clear opt-in process (no pre-checked boxes)
- ✅ Double opt-in confirmation email (Kit default)
- ✅ Link to Privacy Policy
- ✅ Unsubscribe link in every email (Kit default)

Make sure your Privacy Policy page (`/privacy`) includes:
- Information about newsletter data collection
- How you use email addresses
- How to unsubscribe

## 📊 Analytics & Tracking

### View Subscribers

1. Go to your Kit dashboard at [app.kit.com](https://app.kit.com)
2. Navigate to **Subscribers**
3. View your subscriber list and stats

### Track Conversions

1. Go to **Grow** → **Forms**
2. Click on your form
3. View conversion rate, subscribers, and analytics

### Set Up Automations

1. Go to **Automate** → **Visual Automations**
2. Create a welcome sequence:
   - Trigger: "Subscribes to a form"
   - Action: Send welcome email
   - Wait: 2-3 days
   - Action: Send your first value-packed email

## 🐛 Troubleshooting

### "Newsletter service not configured"

- **Cause**: Missing environment variables
- **Fix**: Make sure `.env.local` exists and contains `CONVERTKIT_API_KEY` and `CONVERTKIT_FORM_ID`
- **Fix**: Restart your development server after adding environment variables

### "This email is already subscribed"

- **Cause**: The email is already in your subscriber list
- **Fix**: This is normal behavior. Kit prevents duplicate subscriptions.

### "Failed to subscribe"

- **Cause**: Invalid API key or Form ID
- **Fix**: Double-check your credentials in `.env.local`
- **Fix**: Make sure the Form ID is a number, not the full URL

### Network Errors

- **Cause**: Kit API might be temporarily down
- **Fix**: Wait a few minutes and try again
- **Fix**: Check [Kit Status](https://status.kit.com/) or the legacy [ConvertKit Status](https://status.convertkit.com/)

## 📚 Resources

- [Kit Official Website](https://kit.com/)
- [Kit API V4 Documentation](https://developers.kit.com/api-reference/overview) (recommended)
- [Kit API V3 Documentation](https://developers.convertkit.com/) (currently used, still supported)
- [Kit Help Center](https://help.kit.com/)
- [Kit Changelog](https://developers.kit.com/changelog)
- [GDPR Compliance Guide](https://help.kit.com/en/articles/2502566-gdpr-compliance)

> **Note on API Versions**: This integration currently uses **API V3** (`api.convertkit.com`), which is still fully supported. Kit has released **API V4** (`api.kit.com`) with enhanced features. See `KIT_API_ANALYSIS.md` for details on both versions.

## 🎯 Next Steps

After setting up your newsletter:

1. **Create a Welcome Sequence**: Set up automated emails for new subscribers
2. **Design Your Emails**: Create beautiful email templates in Kit
3. **Set Up Segments**: Organize subscribers by interests (e.g., "Infrastructure", "Go", "Kubernetes")
4. **Plan Your Content**: Decide on your newsletter frequency (weekly, bi-weekly, monthly)
5. **Promote Your Newsletter**: Add it to your homepage, about page, and blog posts

## 💡 Pro Tips

- **Start Simple**: Don't overwhelm yourself with complex automations at first
- **Be Consistent**: Set a schedule and stick to it
- **Provide Value**: Every email should teach something or provide insights
- **Engage Your Audience**: Ask questions and encourage replies
- **Monitor Metrics**: Track open rates, click rates, and unsubscribes to improve

---

**Need Help?** Check the [Kit Help Center](https://help.kit.com/) or email hello@davideimola.dev

