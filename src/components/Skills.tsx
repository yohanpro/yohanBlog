"use client";

import { motion } from "framer-motion";
import { techStacks } from "@/data/portfolio";

const skillsWithIcons = {
  frontend: [
    { name: "React", icon: "⚛️", level: "expert" },
    { name: "Vue.js", icon: "💚", level: "expert" },
    { name: "Next.js", icon: "▲", level: "advanced" },
    { name: "TypeScript", icon: "📘", level: "expert" },
  ],
  tools: [
    { name: "Vite", icon: "⚡", level: "advanced" },
    { name: "Webpack", icon: "📦", level: "advanced" },
    { name: "Turborepo", icon: "🔷", level: "intermediate" },
    { name: "Docker", icon: "🐳", level: "intermediate" },
  ],
  testing: [
    { name: "Playwright", icon: "🎭", level: "advanced" },
    { name: "Jest", icon: "🃏", level: "intermediate" },
  ],
  etc: [
    { name: "Git", icon: "🔀", level: "expert" },
    { name: "CI/CD", icon: "🔄", level: "advanced" },
    { name: "AWS", icon: "☁️", level: "intermediate" },
  ],
};

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  tools: "Build & Tools",
  testing: "Testing",
  etc: "DevOps & Others",
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
            <span className="gradient-text font-mono">03.</span> Skills & Tools
          </h2>
          <div className="h-px bg-linear-to-r from-accent via-accent/50 to-transparent max-w-md" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(skillsWithIcons).map(
            ([category, items], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="glass rounded-lg p-6 hover:border-accent/50 transition-all glow-on-hover"
              >
                <h3 className="font-semibold text-lg mb-6 gradient-text">
                  {categoryLabels[category] || category}
                </h3>
                <ul className="space-y-4">
                  {items.map((skill, i) => (
                    <SkillItem key={skill.name} skill={skill} index={i} />
                  ))}
                </ul>
              </motion.div>
            )
          )}
        </div>

        {/* Terminal-style skill summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="glass rounded-lg overflow-hidden max-w-2xl mx-auto glow-on-hover">
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

// Skill Item Component with level bar animation
function SkillItem({
  skill,
  index,
}: {
  skill: { name: string; icon: string; level: string };
  index: number;
}) {
  const levelMap: Record<string, number> = {
    expert: 90,
    advanced: 75,
    intermediate: 60,
  };
  const level = levelMap[skill.level] || 50;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2">
          <motion.span
            whileHover={{
              scale: 1.2,
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{ duration: 0.5 }}
            className="text-xl"
          >
            {skill.icon}
          </motion.span>
          <span className="text-foreground">{skill.name}</span>
        </span>
        <span className="text-xs text-muted font-mono uppercase">
          {skill.level}
        </span>
      </div>

      {/* Level bar */}
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.05, ease: "easeOut" }}
          className="h-full"
          style={{
            background: "linear-gradient(to right, var(--accent-gradient-from), var(--accent-gradient-to))",
            boxShadow: "0 1px 2px rgba(59, 130, 246, 0.3)",
          }}
        />
      </div>
    </motion.div>
  );
}
