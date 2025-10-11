"use client";

import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { CompanyLogo } from "~/app/_components/company-logo";

const experiences = [
  {
    id: 1,
    company: "RedCarbon",
    logo: "/logos/redcarbon.png",
    position: "Software Engineer",
    location: "Italy · Remote",
    period: "Sep 2022 - Present",
    type: "Full-time",
    description:
      "Designed, developed, and maintained backend systems and the Google Cloud/Kubernetes infrastructure for a high-availability, multi-tenancy AI Cyber Security platform.",
    achievements: [
      "Architected and maintained high-availability multi-tenancy infrastructure on Google Cloud",
      "Developed backend systems for AI-powered Cyber Security platform",
      "Implemented Infrastructure as Code (IaC) practices",
      "Built and optimized microservices architecture with gRPC",
    ],
    technologies: [
      "Kubernetes",
      "Go",
      "Next.js",
      "GraphQL",
      "Google Cloud",
      "React.js",
      "TypeScript",
      "Infrastructure as Code",
      "gRPC",
      "Ionic Framework",
    ],
  },
  {
    id: 2,
    company: "Milkman Technologies",
    logo: "/logos/milkman-technologies.png",
    position: "DevOps Engineer",
    location: "Verona, Veneto, Italy · Remote",
    period: "Aug 2020 - Sep 2022",
    type: "Full-time",
    description:
      "Worked as an AWS DevOps Engineer where I developed and enhanced high-availability and multi-tenancy infrastructure, and improved developer experience with CI/CD pipelines and ChatOps.",
    achievements: [
      "Developed and enhanced high-availability and multi-tenancy infrastructure on AWS",
      "Improved developer experience with CI/CD pipelines and ChatOps",
      "Implemented infrastructure monitoring and observability with Datadog",
      "Contributed to LinkedIn Top Startups 2020 in Italy",
    ],
    technologies: [
      "PostgreSQL",
      "Kafka",
      "Go",
      "TypeScript",
      "Spring Framework",
      "Clojure",
      "Docker",
      "CI/CD",
      "JavaScript",
      "Python",
      "Java",
      "AWS",
      "Datadog",
      "Infrastructure as Code",
    ],
  },
  {
    id: 4,
    company: "Codemotion",
    logo: "/logos/codemotion.png",
    position: "Information Technology Instructor",
    location: "Italy · Remote",
    period: "Jan 2021 - Apr 2021",
    type: "Freelance",
    description:
      "IT Instructor. I authored modules on Infrastructure as Code, DevOps methodologies, and Cloud Security for the Cloud Engineer career path.",
    achievements: [
      "Created comprehensive modules on Infrastructure as Code (IaC)",
      "Developed DevOps methodology training content",
      "Authored Cloud Security curriculum for aspiring Cloud Engineers",
      "Produced educational content on CI/CD and Log Aggregation",
    ],
    technologies: [
      "Infrastructure as Code",
      "DevOps",
      "Cloud Security",
      "CI/CD",
      "GitHub Actions",
      "Loki",
      "DevSecOps",
    ],
  },
  {
    id: 5,
    company: "ASEM S.r.l.",
    logo: "/logos/asem-s-r-l-.png",
    position: "DevOps Engineer",
    location: "Verona, Veneto, Italy · On-site",
    period: "Dec 2017 - Aug 2020",
    type: "Full-time",
    description:
      "Developed and optimized deployment pipelines and experimented with Docker and containerization for Linux distributions.",
    achievements: [
      "Developed and optimized deployment pipelines",
      "Implemented Docker containerization for Linux distributions",
      "Improved developer experience through automation",
      "Established CI/CD best practices",
    ],
    technologies: [
      "Cross compilation",
      "C#",
      "Docker",
      "CI/CD",
      "InnoSetup",
      "JavaScript",
      "Python",
    ],
  },
  {
    id: 6,
    company: "EDALab Networked Embedded Systems",
    logo: "/logos/edalab-networked-embedded-systems.png",
    position: "Software Engineer",
    location: "Verona, Veneto, Italia · Hybrid",
    period: "Nov 2016 - Sep 2017",
    type: "Internship",
    description:
      "Ported a Qt application to iOS and released it on the Apple AppStore.",
    achievements: [
      "Successfully ported Qt application to iOS platform",
      "Released BOX-IO Visualizer on Apple AppStore",
      "Worked with embedded systems and cross-platform development",
      "Gained experience in mobile application development",
    ],
    technologies: ["C++", "Qt", "iOS", "Mobile Development"],
  },
];

const education = [
  {
    id: 1,
    institution: "Università degli Studi di Verona",
    degree: "Bachelor's Degree in Computer Science",
    field: "Computer Science",
    period: "2014 - 2017",
    grade: "94/110",
    description:
      "Dissertation: Coaching application in Ionic with NoSQL Database - Mentor Prof. Graziano Pravadelli. Studied Programming (C, Java), Databases (E/R Diagrams, PostgreSQL), Computer Architecture, Operating Systems, Algorithms, Software Engineering, Computer Networks, Network Security, and more.",
    courses: [
      "Programming in C and Java",
      "Databases (E/R Diagrams and PostgreSQL)",
      "Computer Architecture",
      "Operating Systems",
      "Algorithms",
      "Languages and Compilers",
      "Computer Networks",
      "Software Engineering",
      "Network Programming and Network Security",
      "Mathematical Analysis",
      "Discrete Mathematics",
      "Linear Algebra",
      "Probability and Statistics",
    ],
  },
  {
    id: 2,
    institution: "ITI Marconi Verona",
    degree: "High School Diploma",
    field: "Industrial Computer Science",
    period: "2009 - 2014",
    grade: "70/100",
    description:
      "Specialized in computer science and electronics. Activities included tutoring and Arduino projects. Studied Java, Microsoft technologies, UML, computer networks, and fundamentals of electronics.",
    courses: [
      "Java Programming",
      "Windows Server",
      "IIS",
      "Transact-SQL",
      "ASP",
      "Unified Modelling Languages (UML)",
      "Computer Architecture and Networks",
      "Operating Systems",
      "Probability and Statistics",
      "Fundamentals of Electronics",
    ],
  },
];

const volunteering = [
  {
    id: 1,
    organization: "Schrödinger Hat",
    logo: undefined, // Will use fallback initials
    role: "Event & Community Manager",
    location: "Italy · Remote",
    period: "Feb 2022 - Present",
    type: "Non-profit",
    description:
      "Co-founded and organized events, overseeing community management, SH Sessions, and Open Source Day—Italy's largest free-access Open Source conference.",
    achievements: [
      "Co-founded and organize Open Source Day, Italy's largest free-access Open Source conference",
      "Manage community engagement and growth initiatives reaching 20k+ people across Europe",
      "Organize SH Sessions and technical meetups",
      "Build partnerships with companies and speakers across Europe",
    ],
    focus: [
      "Event Management",
      "Community Building",
      "Social Media Marketing",
      "Event Planning",
      "Public Speaking",
    ],
  },
];

const certifications = [
  {
    id: 1,
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialId: "AWS-CSA-123456",
  },
  {
    id: 2,
    name: "Certified Kubernetes Administrator",
    issuer: "Cloud Native Computing Foundation",
    date: "2022",
    credentialId: "CKA-789012",
  },
  {
    id: 3,
    name: "React Developer Certification",
    issuer: "Meta",
    date: "2021",
    credentialId: "META-RDC-345678",
  },
];

const skills = {
  "Programming Languages": ["JavaScript", "TypeScript", "Python", "Java", "Go"],
  Frontend: ["React", "Next.js", "Vue.js", "HTML5", "CSS3", "Tailwind CSS"],
  Backend: ["Node.js", "Express.js", "Fastify", "Django", "Flask"],
  Databases: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "DynamoDB"],
  "Infrastructure & Cloud": [
    "AWS",
    "Docker",
    "Kubernetes",
    "Terraform",
    "CI/CD",
  ],
  "Tools & Methods": ["Git", "Agile", "Scrum", "TDD", "Code Review", "DDD"],
};

export default function Experience() {
  return (
    <>
      <Header />
      <main className="bg-gray-950">
        {/* Hero Section */}
        <section className="px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Professional Experience
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              A comprehensive overview of my career journey, education, and
              technical expertise in software engineering.
            </p>
            <div className="mt-8">
              <a
                href="/davide-imola-cv.pdf"
                className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download PDF Resume
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl border-t border-gray-800 px-6 py-16 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-12 lg:col-span-2">
              {/* Work Experience */}
              <section>
                <h2 className="mb-8 text-2xl font-bold text-gray-100">
                  Work Experience
                </h2>
                <div className="space-y-8">
                  {experiences.map((experience, index) => (
                    <div key={experience.id} className="relative">
                      {index !== experiences.length - 1 && (
                        <div className="absolute top-12 left-6 h-full w-px bg-gray-800" />
                      )}
                      <div className="flex items-start gap-4">
                        <CompanyLogo
                          company={experience.company}
                          logo={experience.logo}
                          size="md"
                        />
                        <div className="flex-grow">
                          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-blue-500/50">
                            <div className="mb-2 flex flex-wrap items-center justify-between">
                              <h3 className="text-xl font-semibold text-gray-100">
                                {experience.position}
                              </h3>
                              <span className="text-sm font-medium text-blue-400">
                                {experience.period}
                              </span>
                            </div>
                            <div className="mb-3 flex items-center text-gray-400">
                              <span className="font-medium">
                                {experience.company}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{experience.location}</span>
                              <span className="mx-2">•</span>
                              <span className="rounded bg-gray-800 px-2 py-1 text-sm">
                                {experience.type}
                              </span>
                            </div>
                            <p className="mb-4 text-gray-400">
                              {experience.description}
                            </p>

                            {experience.achievements && (
                              <div className="mb-4">
                                <h4 className="mb-2 text-sm font-medium text-gray-100">
                                  Key Achievements:
                                </h4>
                                <ul className="space-y-1">
                                  {experience.achievements.map(
                                    (achievement, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start text-sm text-gray-400"
                                      >
                                        <span className="mr-2 text-blue-400">
                                          •
                                        </span>
                                        {achievement}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="inline-block rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400 ring-1 ring-blue-500/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <h2 className="mb-8 text-2xl font-bold text-gray-100">
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="rounded-lg border border-gray-800 bg-gray-900 p-6"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-100">
                          {edu.degree}
                        </h3>
                        <span className="text-sm font-medium text-blue-400">
                          {edu.period}
                        </span>
                      </div>
                      <div className="mb-2 text-gray-400">
                        <span className="font-medium">{edu.institution}</span> •{" "}
                        <span>{edu.field}</span>
                      </div>
                      {edu.grade && (
                        <div className="mb-2 text-sm text-gray-400">
                          <span className="font-medium">Grade:</span>{" "}
                          {edu.grade}
                        </div>
                      )}
                      <p className="text-sm text-gray-400">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Volunteering & Community */}
              <section>
                <h2 className="mb-8 text-2xl font-bold text-gray-100">
                  Volunteering & Community
                </h2>
                <div className="space-y-6">
                  {volunteering.map((volunteer) => (
                    <div
                      key={volunteer.id}
                      className="flex gap-4 rounded-lg border border-gray-800 bg-gray-900 p-6"
                    >
                      <CompanyLogo
                        company={volunteer.organization}
                        logo={volunteer.logo}
                        size="md"
                      />
                      <div className="flex-grow">
                        <div className="mb-2 flex flex-wrap items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-100">
                            {volunteer.role}
                          </h3>
                          <span className="text-sm font-medium text-blue-400">
                            {volunteer.period}
                          </span>
                        </div>
                        <div className="mb-3 flex items-center text-gray-400">
                          <span className="font-medium">
                            {volunteer.organization}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{volunteer.location}</span>
                          <span className="mx-2">•</span>
                          <span className="rounded bg-purple-500/10 px-2 py-1 text-sm text-purple-400">
                            {volunteer.type}
                          </span>
                        </div>
                        <p className="mb-4 text-gray-400">
                          {volunteer.description}
                        </p>

                        {volunteer.achievements &&
                          volunteer.achievements.length > 0 && (
                            <div className="mb-4">
                              <h4 className="mb-2 text-sm font-semibold text-gray-300">
                                Key Achievements
                              </h4>
                              <ul className="space-y-1">
                                {volunteer.achievements.map(
                                  (achievement, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start text-sm text-gray-400"
                                    >
                                      <span className="mt-1.5 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                                      {achievement}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                        <div className="flex flex-wrap gap-2">
                          {volunteer.focus.map((item) => (
                            <span
                              key={item}
                              className="inline-block rounded-full bg-purple-500/10 px-2 py-1 text-xs text-purple-400 ring-1 ring-purple-500/20"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8 lg:col-span-1">
              {/* Skills */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-6 text-lg font-semibold text-gray-100">
                  Technical Skills
                </h3>
                <div className="space-y-4">
                  {Object.entries(skills).map(([category, skillList]) => (
                    <div key={category}>
                      <h4 className="mb-2 text-sm font-medium text-gray-300">
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {skillList.map((skill) => (
                          <span
                            key={skill}
                            className="inline-block rounded border border-gray-800 bg-gray-800 px-2 py-1 text-xs text-gray-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-6 text-lg font-semibold text-gray-100">
                  Certifications
                </h3>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-lg border border-gray-800 bg-gray-800 p-4"
                    >
                      <h4 className="mb-1 font-medium text-gray-100">
                        {cert.name}
                      </h4>
                      <p className="mb-1 text-sm text-gray-400">
                        {cert.issuer}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {cert.date}
                        </span>
                        <span className="text-xs text-blue-400">
                          ID: {cert.credentialId}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-6 text-lg font-semibold text-gray-100">
                  Languages
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Italian</span>
                    <span className="text-sm text-gray-400">Native</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">English</span>
                    <span className="text-sm text-gray-400">Fluent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Spanish</span>
                    <span className="text-sm text-gray-400">Intermediate</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-100">
                  Contact
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-400">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    hello@davideimola.dev
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    Verona, Italy
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                      />
                    </svg>
                    Open to remote work
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
