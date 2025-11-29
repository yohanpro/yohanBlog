"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-8 border-t border-border"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm font-mono">
            Built with Next.js & Tailwind CSS
          </p>
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} Yohan Kim. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
