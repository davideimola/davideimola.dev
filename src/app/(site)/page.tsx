import {
  BuildingSection,
  HeroSection,
  InPublicSection,
  NewsletterSection,
  WritingSection,
} from "../../components/sections";
import { JsonLd } from "../../components/ui/JsonLd";
import { topicCounts } from "../../lib/blog-index";
import { getAllPosts, getAllProjects, getAllTalks, getPostBySlug } from "../../lib/content";
import { loadDrawableCover } from "../../lib/cover-files";
import { getAboutNarrative } from "../../lib/cv";
import { pickBuildingProject, pickSpokenAt, pickStageTalks } from "../../lib/home-cards";
import { PERSON_SCHEMA } from "../../lib/schema";

// Shown in IN PUBLIC, in this order, read from projects.json.
const COMMUNITY_SLUGS = ["schrodinger-hat", "os-day"];

// How many of the latest posts WRITING lists.
const LATEST_POSTS = 4;

// Hourly: IN PUBLIC moves from "Next on stage" to "Recently on stage" on its
// own when a talk passes, without a deploy.
export const revalidate = 3600;

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  description:
    "Tech Lead at RedCarbon, building AI agents for cybersecurity. Conference speaker on AI, security, and Go. Co-founder of Schrödinger Hat.",
};

// The home tells one story, the Record's creed in order: who I am (HERO), what
// I build (BUILDING), what I write (WRITING), where I say it out loud (IN
// PUBLIC), and one way to keep in touch (NEWSLETTER).
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

  const communities = COMMUNITY_SLUGS.map((slug) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) throw new Error(`Home: unknown project "${slug}" in IN PUBLIC.`);
    return {
      title: project.title,
      description: project.description,
      href: project.url ?? "/projects",
    };
  });

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
      <InPublicSection
        quote={creed.quote}
        stage={pickStageTalks(talks, today)}
        spokenAt={pickSpokenAt(talks, today)}
        communities={communities}
        talkCount={talks.length}
      />
      <NewsletterSection />
    </>
  );
}
