// The ruled row PostCard and TalkRow share inside an issue body: hairlines above and
// below, and a row that follows another drops its top rule, so a run of rows reads as
// one ruled list (the way the archive and /sharing do) instead of stacked boxes.
export const ROW_CLASSES =
  "newsletter-row not-prose group block my-6 py-5 border-y border-border no-underline [.newsletter-row+&]:-mt-6 [.newsletter-row+&]:border-t-0";
