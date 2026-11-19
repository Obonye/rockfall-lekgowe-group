"use client"

import { useEffect, useState } from "react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export type PracticeArea = {
  n: string
  key: string
  title: string
  body: string
  typical: string[]
}

/* Decorative background glyphs, one per card. Drawn in currentColor so each card tints its own. */
const GLYPHS = [
  // Property: a pitched roof over a doorway, with a frame offset behind
  <svg key="property" viewBox="0 0 200 200" fill="none" className="size-full" aria-hidden="true">
    <rect x="34" y="62" width="130" height="130" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <path d="M18 98 100 28l82 70v94H18z" fill="currentColor" opacity="0.14" />
    <path d="M18 98 100 28l82 70" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    <path d="M82 192v-52h36v52" stroke="currentColor" strokeWidth="2" opacity="0.6" />
  </svg>,
  // Litigation: balance scales
  <svg key="litigation" viewBox="0 0 200 200" fill="none" className="size-full" aria-hidden="true">
    <path d="M100 24v152M62 176h76" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    <path d="M36 56h128" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    <path d="M36 56 14 112h44zM164 56l-22 56h44z" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <path d="M14 112a22 22 0 0 0 44 0zM142 112a22 22 0 0 0 44 0z" fill="currentColor" opacity="0.18" />
    <rect x="88" y="14" width="24" height="24" transform="rotate(45 100 26)" fill="currentColor" opacity="0.14" />
  </svg>,
  // Commercial: classical columns under a pediment
  <svg key="commercial" viewBox="0 0 200 200" fill="none" className="size-full" aria-hidden="true">
    <path d="M20 70 100 22l80 48z" fill="currentColor" opacity="0.14" />
    <path d="M20 70 100 22l80 48zM28 84h144M28 180h144" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    <path d="M48 84h20v96H48zM90 84h20v96H90zM132 84h20v96h-20z" fill="currentColor" opacity="0.14" />
    <path d="M48 84v96M68 84v96M90 84v96M110 84v96M132 84v96M152 84v96" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
  </svg>,
]

/* Each card recolours itself through the shadcn tokens, so Card, CardDescription and the link
   Button all pick up the right colours without class overrides. */
const THEMES = [
  {
    vars: "[--card:var(--navy)] [--card-foreground:white] [--muted-foreground:var(--navy-tint)] [--primary:white]",
    glyph: "text-white",
  },
  {
    vars: "[--card:var(--burgundy)] [--card-foreground:white] [--muted-foreground:var(--burgundy-tint)] [--primary:white]",
    glyph: "text-white",
  },
  { vars: "", glyph: "text-navy" },
] as const

/**
 * Practice-area carousel. Layout and motion adapted from Skiper UI "Carousel_006"
 * (https://skiper-ui.com, free tier: attribution to Skiper UI required).
 * Cards fill the row on desktop and scroll on smaller screens.
 */
export function PracticeCarousel({ areas }: { areas: PracticeArea[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", containScroll: "trimSnaps", loop: false }}
      className="w-full"
      aria-label="Practice areas"
    >
      <CarouselContent className="-ml-4 py-4">
        {areas.map((a, i) => {
          const t = THEMES[i % THEMES.length]
          return (
            <CarouselItem key={a.key} className="basis-[88%] pl-4 sm:basis-1/2 lg:basis-1/3">
              <Card
                className={cn(
                  "relative isolate h-full min-h-[24rem] [--card-spacing:--spacing(7)] sm:[--card-spacing:--spacing(8)]",
                  t.vars
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -right-12 -bottom-12 -z-10 size-64 opacity-60 [mask-image:linear-gradient(to_top_left,black_25%,transparent_80%)]",
                    t.glyph
                  )}
                >
                  {GLYPHS[i % GLYPHS.length]}
                </div>
                <CardHeader>
                  <CardTitle className="text-fluid-card font-semibold">{a.title}</CardTitle>
                  <CardDescription className="mt-2 text-base leading-relaxed">{a.body}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
                    {a.typical.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardContent className="mt-auto">
                  <Button
                    variant="link"
                    className="h-auto px-0 font-semibold underline"
                    render={<a href="#consultation" />}
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("select-matter", { detail: a.key }))
                    }
                  >
                    Ask about {a.title.split(" &")[0].toLowerCase()}
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          )
        })}
      </CarouselContent>

      <div className="mt-6 flex items-center justify-between gap-4 lg:hidden">
        <div className="flex items-center gap-2">
          {areas.map((a, i) => (
            <button
              key={a.key}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to ${a.title}`}
              aria-current={current === i}
              className={cn(
                "h-2 rounded-full transition-all",
                current === i ? "bg-navy w-8" : "bg-line w-2"
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <CarouselPrevious variant="tint" size="icon-lg" className="static! size-11! translate-y-0!" />
          <CarouselNext variant="tint" size="icon-lg" className="static! size-11! translate-y-0!" />
        </div>
      </div>
    </Carousel>
  )
}
