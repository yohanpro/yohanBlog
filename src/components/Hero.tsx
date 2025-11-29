"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { profile, achievements } from "@/data/portfolio";
import { useEffect, useState, useRef } from "react";

// Counter animation hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      setCount(Math.floor(easeOutQuad(progress) * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return { count, setHasStarted };
};

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient with parallax */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 bg-linear-to-br from-background via-background to-blue-50"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="font-mono text-accent text-sm">
            {"// "}안녕하세요, 저는
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          {profile.name}
          <span className="text-muted text-3xl md:text-4xl ml-4 font-normal">
            {profile.nameEn}
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-4xl text-muted mb-8"
        >
          {profile.tagline}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mb-12"
        >
          <div className="font-mono text-sm bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 text-muted">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2">about.ts</span>
            </div>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap">
              <code>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-400">developer</span> = {"{"}
                {"\n"}
                {"  "}
                <span className="text-green-400">experience</span>:{" "}
                <span className="text-yellow-400">
                  &quot;{profile.experience}&quot;
                </span>
                ,{"\n"}
                {"  "}
                <span className="text-green-400">focus</span>: [
                <span className="text-yellow-400">
                  &quot;React&quot;, &quot;Vue&quot;, &quot;Performance&quot;
                </span>
                ],{"\n"}
                {"  "}
                <span className="text-green-400">passion</span>:{" "}
                <span className="text-yellow-400">
                  &quot;사용자 경험 최적화&quot;
                </span>
                {"\n"}
                {"}"};
              </code>
            </pre>
          </div>
        </motion.div>

        {/* Achievement metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.label}
              achievement={achievement}
              index={index}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#projects"
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg transition-all font-medium glow-on-hover"
          >
            프로젝트 보기
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-border hover:border-accent text-foreground rounded-lg transition-all font-medium hover:shadow-md hover:shadow-accent/20"
          >
            연락하기
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-muted rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Achievement Card Component with counter animation
function AchievementCard({
  achievement,
  index,
}: {
  achievement: { value: number; suffix: string; label: string };
  index: number;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { count, setHasStarted } = useCountUp(achievement.value);
  const isDecimal = achievement.value % 1 !== 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayValue = isMounted ? (isDecimal ? count / 10 : count) : achievement.value;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onViewportEnter={() => {
        if (isMounted) {
          setHasStarted(true);
        }
      }}
      className="glass rounded-lg p-6 text-center hover:border-accent/50 transition-all glow-on-hover"
    >
      <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
        {displayValue}
        <span className="text-accent">{achievement.suffix}</span>
      </div>
      <div className="text-sm text-muted">{achievement.label}</div>
    </motion.div>
  );
}
