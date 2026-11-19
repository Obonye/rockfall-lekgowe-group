import { useState } from "react"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const LINKS = [
  { href: "#practice-areas", label: "Practice areas" },
  { href: "#process", label: "Process" },
  { href: "#clients", label: "Clients" },
]

/** Hamburger menu shown below the md breakpoint. Sits inside the header, which owns the scrolled state. */
export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Open menu"
            className="text-navy size-11 md:hidden group-data-[scrolled=true]:text-white group-data-[scrolled=true]:hover:bg-white/10 group-data-[scrolled=true]:hover:text-white"
          />
        }
      >
        <MenuIcon className="size-6" />
      </SheetTrigger>
      <SheetContent side="right" className="bg-paper">
        <SheetHeader>
          <SheetTitle className="font-heading text-navy text-xl font-bold">
            Rockfall Lekgowe Group
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-navy border-line border-b py-4 text-2xl font-semibold"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <Button
            variant="accent"
            size="xl"
            className="w-full"
            render={<a href="#consultation" />}
            onClick={() => setOpen(false)}
          >
            Contact us <span aria-hidden="true">↗</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
