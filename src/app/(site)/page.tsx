import {
  HeroSection,
  HowIWorkSection,
  InPublicSection,
  NewsletterSection,
  TopicsSection,
} from "../../components/sections";
import { JsonLd } from "../../components/ui/JsonLd";
import { getAllPosts, getAllProjects, getAllTalks, getPostBySlug } from "../../lib/content";
import { loadDrawableCover } from "../../lib/cover-files";
import { getAboutNarrative } from "../../lib/cv";
import { pickBuildingProject, pickRotatingCard, pickSpokenAt } from "../../lib/home-cards";
import { PERSON_SCHEMA } from "../../lib/schema";
import { getShowcase } from "../../lib/shelf";
import { groupByTopic } from "../../lib/topics";

// The retrospective the second principle points at. Referenced by slug and
// resolved loudly: a rename breaks the build instead of the sentence.
const FAILURE_POST = "i-built-a-tool-i-dont-use";

// Shown in IN PUBLIC, in this order, read from projects.json.
const COMMUNITY_SLUGS = ["schrodinger-hat", "os-day"];

// Talks and books carry no cover of their own, so the rotating card has one
// drawing per kind, made for it like a post's (public/images/pages/).
const ROTATING_COVERS = {
  talk: {
    src: "/images/pages/talk/cover.svg",
    alt: "Line drawing of a lectern with a microphone facing a hanging screen, a red pointer dot on the slide",
  },
  reading: {
    src: "/images/pages/reading/cover.svg",
    alt: "Line drawing of an open book with a red ribbon bookmark",
  },
};

// Hourly, like /now: the rotating card under the hero turns over on its own
// when a talk passes or the reading changes, without a deploy.
export const revalidate = 3600;

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  description:
    "Tech Lead at RedCarbon, building AI agents for cybersecurity. Conference speaker on AI, security, and Go. Co-founder of Schrödinger Hat.",
};

export default async function HomePage() {
  const posts = getAllPosts();
  const latestPost = posts[0] ?? null;
  const talks = getAllTalks();
  const projects = getAllProjects();
  const today = new Date();
  const { document: shelf } = await getShowcase();
  const rotating = pickRotatingCard({ talks, reading: shelf.now, today });
  const rotatingArt = rotating && ROTATING_COVERS[rotating.kind === "reading" ? "reading" : "talk"];
  const rotatingDrawing = rotatingArt ? loadDrawableCover(rotatingArt.src) : null;
  const { creed } = getAboutNarrative();

  const building = pickBuildingProject(projects);
  // The project's own post lends the card its drawing, as the latest post does.
  const buildingPost = building?.post ? getPostBySlug(building.post) : null;
  const buildingDrawing = buildingPost?.heroImage
    ? loadDrawableCover(buildingPost.heroImage)
    : null;
  const projectCover =
    buildingPost && buildingDrawing
      ? { drawable: buildingDrawing, alt: buildingPost.heroImageAlt ?? buildingPost.title }
      : null;

  const failure = getPostBySlug(FAILURE_POST);
  if (!failure) throw new Error(`Home: the post "${FAILURE_POST}" does not exist.`);

  const communities = COMMUNITY_SLUGS.map((slug) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) throw new Error(`Home: unknown project "${slug}" in IN PUBLIC.`);
    return {
      title: project.title,
      description: project.description,
      href: project.url ?? "/projects",
    };
  });

  const linkClass = "text-fg border-b border-fg no-underline hover:text-accent hover:border-accent";

  return (
    <>
      <JsonLd data={PERSON_SCHEMA} />
      <JsonLd data={WEBSITE_SCHEMA} />
      <HeroSection
        latestPost={latestPost}
        latestCover={latestPost?.heroImage ? loadDrawableCover(latestPost.heroImage) : null}
        project={building}
        projectCover={projectCover}
        rotating={rotating}
        rotatingCover={
          rotatingArt && rotatingDrawing
            ? { drawable: rotatingDrawing, alt: rotatingArt.alt }
            : null
        }
      />
      <HowIWorkSection
        quote={creed.quote}
        gloss={creed.gloss}
        principles={[
          {
            title: "Decisions get written down.",
            body: "ADRs sit in the repo next to the code they explain, so the reasoning survives the commit.",
          },
          {
            title: "I publish what I learn, including what did not work.",
            body: (
              <>
                <a href={`/blog/${failure.slug}`} className={linkClass}>
                  {failure.title}
                </a>{" "}
                is the retrospective of a tool I shipped, was proud of, and never used.
              </>
            ),
          },
          {
            title: "Then I go say it out loud.",
            body: (
              <>
                On stage, in workshops, in the communities I help run.{" "}
                <a href="/sharing" className={linkClass}>
                  All talks
                </a>
              </>
            ),
          },
        ]}
      />
      <TopicsSection groups={groupByTopic(posts, { exclude: latestPost?.slug })} />
      <InPublicSection communities={communities} spokenAt={pickSpokenAt(talks, today)} />
      <NewsletterSection />
    </>
  );
}
