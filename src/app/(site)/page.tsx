import {
  BuildingSection,
  CommunitySection,
  HeroSection,
  NewsletterSection,
  StageSection,
  WritingSection,
} from "../../components/sections";
import { JsonLd } from "../../components/ui/JsonLd";
import { topicCounts } from "../../lib/blog-index";
import { getAllPosts, getAllProjects, getAllTalks, getPostBySlug } from "../../lib/content";
import { loadDrawableCover } from "../../lib/cover-files";
import { getAboutNarrative } from "../../lib/cv";
import { pickBuildingProject, pickSpokenAt, pickStageTalks } from "../../lib/home-cards";
import { PERSON_SCHEMA } from "../../lib/schema";
import { describeKind, hostedBy, organisedByKind } from "../../lib/sharing";

// The association COMMUNITY presents, read from projects.json; its events are
// the organised talks whose `host` is this slug.
const ASSOCIATION = "schrodinger-hat";

// How many talk cards ON STAGE shows, always that many.
const STAGE_CARDS = 3;

// How many of the latest posts WRITING lists.
const LATEST_POSTS = 4;

// Hourly: ON STAGE moves a talk from Next to the past on its own when its day
// passes, without a deploy.
export const revalidate = 3600;

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  description:
    "Tech Lead at RedCarbon, building AI agents for cybersecurity. Conference speaker on AI, security, and Go. Co-founder of Schrödinger Hat.",
};

// The home tells one story in order: who I am (HERO), what I build (BUILDING),
// what I write (WRITING), where I say it out loud (ON STAGE, titled with the
// Record's creed), the community I run (COMMUNITY), and one way to keep in
// touch (NEWSLETTER).
export default function HomePage() {
  const posts = getAllPosts();
  const talks = getAllTalks();
  const projects = getAllProjects();
  const today = new Date();
  const { creed } = getAboutNarrative();

  const building = pickBuildingProject(projects);
  const buildingPost = building?.post ? getPostBySlug(building.post) : null;
  if (building?.post && !buildingPost) {
    throw new Error(
      `Home: "${building.slug}" names the post "${building.post}", which does not exist.`
    );
  }
  const drawing = buildingPost?.heroImage ? loadDrawableCover(buildingPost.heroImage) : null;
  const buildingHref = building?.github ?? building?.url;

  const association = projects.find((p) => p.slug === ASSOCIATION);
  if (!association?.url) throw new Error(`Home: the association "${ASSOCIATION}" needs a url.`);
  // The conference links to its own site, the project that is part of the association.
  const flagshipEvent = projects.find((p) => p.partOf === ASSOCIATION);
  const events = organisedByKind(hostedBy(talks, ASSOCIATION)).map((kind) => ({
    ...describeKind(kind),
    ...(kind.kind === "Conference" && flagshipEvent?.url ? { href: flagshipEvent.url } : {}),
  }));

  return (
    <>
      <JsonLd data={PERSON_SCHEMA} />
      <JsonLd data={WEBSITE_SCHEMA} />
      <HeroSection
        flagship={building && buildingHref ? { title: building.title, href: buildingHref } : null}
      />
      {building && (
        <BuildingSection
          project={building}
          cover={
            buildingPost && drawing
              ? { drawable: drawing, alt: buildingPost.heroImageAlt ?? buildingPost.title }
              : null
          }
          post={buildingPost}
          others={projects.filter((p) => p.group === "personal" && p.status === "active")}
        />
      )}
      <WritingSection
        posts={posts.slice(0, LATEST_POSTS)}
        topics={topicCounts(posts)}
        total={posts.length}
      />
      <StageSection
        quote={creed.quote}
        stage={pickStageTalks(talks, today, STAGE_CARDS)}
        spokenAt={pickSpokenAt(talks, today)}
        talkCount={talks.length}
      />
      <CommunitySection
        association={{
          title: association.title,
          description: association.description,
          href: association.url,
        }}
        events={events}
      />
      <NewsletterSection />
    </>
  );
}
