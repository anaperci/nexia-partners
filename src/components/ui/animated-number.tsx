"use client"

import { useEffect, useRef } from "react"
import { animate } from "framer-motion"

export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v).toString()
      },
    })
    return controls.stop
  }, [value])

  return <span ref={ref} className={className}>{value}</span>
}
