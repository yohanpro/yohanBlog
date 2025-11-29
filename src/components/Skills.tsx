"use client";

import { motion } from "framer-motion";

const skills = {
  "Frontend Frameworks": [
    { name: "React", icon: "⚛️" },
    { name: "Vue.js", icon: "💚" },
    { name: "Next.js", icon: "▲" },
  ],
  Languages: [
    { name: "TypeScript", icon: "📘" },
    { name: "JavaScript", icon: "📒" },
  ],
  "Build & Tools": [
    { name: "Vite", icon: "⚡" },
    { name: "Webpack", icon: "📦" },
    { name: "Turborepo", icon: "🔷" },
  ],
  Testing: [
    { name: "Playwright", icon: "🎭" },
    { name: "Jest", icon: "🃏" },
  ],
  DevOps: [
    { name: "Docker", icon: "🐳" },
    { name: "GitLab CI/CD", icon: "🦊" },
    { name: "AWS", icon: "☁️" },
  ],
  Architecture: [
    { name: "Monorepo", icon: "🏗️" },
    { name: "FSD Pattern", icon: "📐" },
    { name: "Layered Architecture", icon: "📚" },
  ],
};

export default function Skills() {
  return (
    <section id="skills" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-accent font-mono">03.</span> Skills & Tools
          </h2>
          <div className="h-px bg-gradient-to-r from-border to-transparent max-w-md" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-4 text-accent">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((skill, i) => (
                  <motion.li
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                    className="flex items-center gap-3 text-muted hover:text-foreground transition-colors"
                  >
                    <span className="text-xl">{skill.icon}</span>
                    <span>{skill.name}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Terminal-style skill summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden max-w-2xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-3 bg-border/30">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-sm text-muted font-mono">
                skills.sh
              </span>
            </div>
            <div className="p-4 font-mono text-sm">
              <p className="text-muted mb-2">
                <span className="text-green-400">$</span> cat core_competencies
              </p>
              <ul className="space-y-1 text-muted ml-2">
                <li>
                  → 대규모 서비스 <span className="text-accent">성능 최적화</span>{" "}
                  (FCP 83% 개선)
                </li>
                <li>
                  → 프레임워크{" "}
                  <span className="text-accent">마이그레이션 설계</span> (Vue →
                  React)
                </li>
                <li>
                  → <span className="text-accent">모노레포</span> 기반 아키텍처
                  설계
                </li>
                <li>
                  → <span className="text-accent">E2E 테스트</span> 자동화 시스템
                  구축
                </li>
              </ul>
              <p className="text-muted mt-4">
                <span className="text-green-400">$</span>{" "}
                <span className="cursor-blink">_</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
