"use client";

import { motion } from "framer-motion";
import { profile, experiences } from "@/data/portfolio";

export default function About() {
  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-accent font-mono">01.</span> About Me
          </h2>
          <div className="h-px bg-gradient-to-r from-border to-transparent max-w-md" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-muted leading-relaxed mb-6 text-lg">
              {profile.summary.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">주요 강점</h3>
              <ul className="space-y-3">
                {[
                  "대규모 트래픽 서비스의 성능 최적화 경험",
                  "Vue → React 점진적 마이그레이션 설계 및 실행",
                  "모노레포 기반 프론트엔드 아키텍처 설계",
                  "E2E 테스트 자동화 시스템 구축",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-accent mt-1">▹</span>
                    <span className="text-muted">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: Experience Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-lg mb-6">경력</h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-8">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                    className="relative pl-6"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-accent -translate-x-1/2" />

                    <div className="bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h4 className="font-medium">{exp.company}</h4>
                        <span className="text-sm text-muted font-mono">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-sm text-accent mb-1">{exp.role}</p>
                      <p className="text-sm text-muted">{exp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mentoring */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="mt-8 p-4 bg-card border border-border rounded-lg"
            >
              <h4 className="font-medium mb-2">프로그래머스 프론트엔드 멘토</h4>
              <p className="text-sm text-muted">
                2021-2023 (1기, 2기, 4기) · 4.9점 최고 평가 획득
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
