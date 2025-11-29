"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/portfolio";

export default function Projects() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-accent font-mono">02.</span> Featured Projects
          </h2>
          <div className="h-px bg-gradient-to-r from-border to-transparent max-w-md" />
        </motion.div>

        <div className="space-y-24">
          {featuredProjects.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div
                className={`grid md:grid-cols-12 gap-4 items-center ${i % 2 === 1 ? "md:text-right" : ""}`}
              >
                {/* Project Info */}
                <div
                  className={`md:col-span-7 ${i % 2 === 1 ? "md:col-start-6" : ""} relative z-10`}
                >
                  <p className="font-mono text-accent text-sm mb-2">
                    {project.company} · {project.period}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {project.title}
                  </h3>

                  <div className="bg-card border border-border rounded-lg p-6 mb-4">
                    <p className="text-muted mb-4">{project.description}</p>

                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Challenge
                        </h4>
                        <p className="text-muted">{project.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Solution
                        </h4>
                        <p className="text-muted">{project.solution}</p>
                      </div>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Impact</h4>
                    <ul
                      className={`flex flex-wrap gap-2 ${i % 2 === 1 ? "md:justify-end" : ""}`}
                    >
                      {project.impact.map((item, j) => (
                        <li
                          key={j}
                          className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack */}
                  <ul
                    className={`flex flex-wrap gap-3 font-mono text-sm text-muted mb-4 ${i % 2 === 1 ? "md:justify-end" : ""}`}
                  >
                    {project.techStack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>

                  {/* Links */}
                  {project.links && (
                    <div
                      className={`flex gap-4 ${i % 2 === 1 ? "md:justify-end" : ""}`}
                    >
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-accent transition-colors flex items-center gap-2"
                        >
                          {link.label === "GitHub" ? (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          )}
                          <span className="text-sm">{link.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
