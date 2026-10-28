import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { emailColors as c, emailFonts as f } from "./theme";
import { SITE_URL } from "./url";

// The whole email around an issue's body: the document, the header with the brand lockup,
// and the footer with the unsubscribe link. It used to be Kit's account template, pasted by
// hand into Kit's dashboard; since the newsletter is sent by newsletter-svc (ADR-0006) the
// site renders all of it, so it lives here, versioned with everything else.
//
// Always light: a dark body does not survive mail clients (iCloud strips it and
// auto-inverts). The only image is the lockup, the same file for every reader, so it tells
// nobody who opened what. There is no pixel and no tracked link anywhere in the email.

/**
 * Where each reader's own unsubscribe link goes. newsletter-svc refuses an issue without it,
 * and Kannon replaces it per recipient at send time.
 */
export const UNSUBSCRIBE_URL = "{{ unsubscribe_url }}";

// The lockup as a hosted image, copied from @davideimola/brand by `pnpm brand:sync`. The
// wordmark is drawn, so it is never retyped as text. On the www host, where the site is
// served: the apex answers with a redirect, and some mail clients do not follow one for an
// image.
const LOCKUP_URL = "https://www.davideimola.dev/brand/lockup-1200.png";

const footerMono = {
  fontFamily: f.mono,
  fontSize: "12px",
  lineHeight: 1.6,
  color: c.text3,
  textAlign: "center" as const,
  margin: "0 0 8px",
};

interface NewsletterEmailProps {
  /** The inbox preview line, hidden in the body. */
  previewText?: string;
  children: ReactNode;
}

export function NewsletterEmail({ previewText, children }: NewsletterEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      {previewText ? <Preview>{previewText}</Preview> : null}
      <Body style={{ margin: 0, padding: 0, backgroundColor: c.bg, fontFamily: f.sans }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: c.bg }}>
          <Section
            style={{
              padding: "40px 20px 30px",
              textAlign: "center",
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            <Link href={SITE_URL}>
              <Img
                src={LOCKUP_URL}
                width="180"
                height="35"
                alt="Davide Imola"
                style={{ display: "block", margin: "0 auto" }}
              />
            </Link>
          </Section>

          <Section
            style={{
              padding: "30px 20px",
              fontFamily: f.sans,
              fontSize: "16px",
              lineHeight: 1.65,
              color: c.text2,
            }}
          >
            {children}
          </Section>

          <Section
            style={{
              padding: "30px 20px",
              borderTop: `1px solid ${c.border}`,
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontFamily: f.sans,
                fontSize: "14px",
                lineHeight: 1.5,
                color: c.text3,
                textAlign: "center",
                margin: "0 0 12px",
              }}
            >
              What you learn, you must share.
            </Text>
            <Text style={footerMono}>
              <Link href="https://github.com/davideimola" style={{ color: c.text1 }}>
                GitHub
              </Link>
              {" · "}
              <Link href="https://linkedin.com/in/davideimola" style={{ color: c.text1 }}>
                LinkedIn
              </Link>
              {" · "}
              <Link href={SITE_URL} style={{ color: c.text1 }}>
                davideimola.dev
              </Link>
            </Text>
            <Text style={footerMono}>
              You get this because you subscribed at davideimola.dev and confirmed it. No pixel, no
              tracked links.
            </Text>
            <Text style={{ ...footerMono, margin: 0 }}>
              <Link href={UNSUBSCRIBE_URL} style={{ color: c.text3, textDecoration: "underline" }}>
                Unsubscribe
              </Link>
              {" · "}
              <Link
                href={`${SITE_URL}/privacy`}
                style={{ color: c.text3, textDecoration: "underline" }}
              >
                Privacy
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
