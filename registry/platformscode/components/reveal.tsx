"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

export function Reveal({
  children,
  delay = 0,
  amount = 0.25,
  className,
}: {
  children: ReactNode
  delay?: number
  amount?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  )
}
