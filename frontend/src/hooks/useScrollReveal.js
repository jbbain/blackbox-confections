import { useEffect, useRef, useState } from 'react'

/**
 * Intersection-observer hook that returns a ref + boolean.
 * Attach the ref to any element → `isVisible` becomes true once it
 * scrolls into view (and stays true so the animation only plays once).
 *
 * @param {{ threshold?: number, rootMargin?: string }} opts
 */
export default function useScrollReveal(opts = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el) // only fire once
        }
      },
      { threshold: opts.threshold ?? 0.12, rootMargin: opts.rootMargin ?? '0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [opts.threshold, opts.rootMargin])

  return [ref, isVisible]
}
