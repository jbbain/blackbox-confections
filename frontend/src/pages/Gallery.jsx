import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import Section from "../components/Section"
import { api } from "../lib/api"
import useScrollReveal from "../hooks/useScrollReveal"

export default function Gallery() {
  const [items, setItems] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [imageKey, setImageKey] = useState(0)
  const location = useLocation()
  const thumbRefs = useRef([])
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.05 })

  useEffect(() => {
    api.listGallery().then(setItems)
  }, [])

  useEffect(() => {
    if (!location.hash || !items.length) return

    const el = document.querySelector(location.hash)
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    }
  }, [location, items])

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveIndex(null)
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % items.length)
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [activeIndex, items.length])

  useEffect(() => {
    if (activeIndex === null) return
    const el = thumbRefs.current[activeIndex]
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      })
    }
  }, [activeIndex])

  const resolveImageUrl = (path) => {
    if (!path) return ""
    if (path.startsWith("http") || path.startsWith("data:")) return path
    return `${import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:8000"}${path}`
  }

  const openCarousel = (index) => { setActiveIndex(index); setImageKey(k => k + 1) }
  const closeCarousel = () => setActiveIndex(null)

  const showPrev = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
    setImageKey(k => k + 1)
  }

  const showNext = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev + 1) % items.length)
    setImageKey(k => k + 1)
  }

  const activeItem = activeIndex !== null ? items[activeIndex] : null

  return (
    <>
      <Section title="Our Creations">
        <div ref={gridRef} className="grid md:grid-cols-3 gap-6">
          {items.map((g, index) => (
            <button
              key={g.id}
              id={`cake-${g.id}`}
              type="button"
              onClick={() => openCarousel(index)}
              className={`gallery-card bb-card overflow-hidden text-left reveal fade-up ${gridVisible ? 'visible' : ''}`}
              style={{ animationDelay: `${(index % 3) * 0.1}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={resolveImageUrl(g.image_url)}
                  alt={g.caption || "Gallery item"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 text-sm bb-muted">
                {g.caption}
              </div>
            </button>
          ))}
        </div>
      </Section>

      {activeItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 carousel-overlay"
          onClick={closeCarousel}
        >
          <button
            type="button"
            onClick={closeCarousel}
            className="absolute top-4 right-4 bb-btn bg-white/10 text-white border-white/20"
          >
            Close
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrev}
                className="absolute left-4 md:left-6 bb-btn bg-white/10 text-white border-white/20"
              >
                Prev
              </button>

              <button
                type="button"
                onClick={showNext}
                className="absolute right-4 md:right-6 bb-btn bg-white/10 text-white border-white/20"
              >
                Next
              </button>
            </>
          )}

          <div
            className="w-full max-w-6xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
              <img
                key={imageKey}
                src={resolveImageUrl(activeItem.image_url)}
                alt={activeItem.caption || "Gallery item"}
                className="max-w-full max-h-full object-contain carousel-image"
              />
            </div>

            <div className="mt-4 text-center text-white shrink-0">
              <div className="text-sm uppercase tracking-widest opacity-70">
                {activeIndex + 1} / {items.length}
              </div>
              <div className="mt-2 text-base md:text-lg">
                {activeItem.caption}
              </div>
            </div>

            <div className="mt-4 shrink-0">
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-3 min-w-max">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      ref={(el) => {
                        thumbRefs.current[index] = el
                      }}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`relative h-20 w-28 overflow-hidden border ${
                        index === activeIndex
                          ? "border-white"
                          : "border-white/20 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={resolveImageUrl(item.image_url)}
                        alt={item.caption || `Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}