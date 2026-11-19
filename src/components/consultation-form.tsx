import { useEffect, useState, type SyntheticEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const MATTERS = [
  { value: "property", label: "Property & conveyancing" },
  { value: "litigation", label: "Litigation & dispute resolution" },
  { value: "commercial", label: "Commercial & corporate" },
  { value: "other", label: "Not sure yet" },
]

type Errors = Partial<Record<"name" | "contact" | "message", string>>

/**
 * Front-end only for the pitch: it validates and shows the success state but
 * does not send anywhere. Wire `onSubmit` to the firm's endpoint to go live.
 */
export function ConsultationForm() {
  const [matter, setMatter] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  // Practice-area links on the page dispatch this event to preselect the matter.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const value = (e as CustomEvent<string>).detail
      if (MATTERS.some((m) => m.value === value)) setMatter(value)
    }
    window.addEventListener("select-matter", onSelect)
    return () => window.removeEventListener("select-matter", onSelect)
  }, [])

  function onSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") ?? "").trim()
    const contact = String(data.get("contact") ?? "").trim()
    const message = String(data.get("message") ?? "").trim()

    const next: Errors = {}
    if (!name) next.name = "Enter your full name so we know who to address."
    if (!contact) {
      next.contact = "Enter an email address or phone number so we can reply."
    } else if (!/^\S+@\S+\.\S+$/.test(contact) && contact.replace(/\D/g, "").length < 7) {
      next.contact = "That does not look like an email or phone number. Check it and try again."
    }
    if (!message) next.message = "Add a sentence or two about your matter."

    setErrors(next)
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0]
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <Card role="status" className="[--card-spacing:--spacing(7)]">
        <CardHeader>
          <CardDescription className="label-caps text-navy">Message received</CardDescription>
          <CardTitle className="text-2xl">Thank you. We have your request.</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-6">
          <p className="text-muted-foreground max-w-prose leading-relaxed">
            A member of the firm will reply by your preferred contact within one
            business day. If it is urgent, call or message us on WhatsApp.
          </p>
          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              setSent(false)
              setMatter(null)
            }}
          >
            Send another request
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="[--card-spacing:--spacing(7)] sm:[--card-spacing:--spacing(8)]">
      <CardHeader>
        <CardTitle className="text-2xl">Send us a message</CardTitle>
        <CardDescription>
          Tell us about your matter. We reply with next steps and a fee estimate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.contact}>
              <FieldLabel htmlFor="contact">Email or phone</FieldLabel>
              <Input
                id="contact"
                name="contact"
                autoComplete="email"
                aria-invalid={!!errors.contact}
              />
              {errors.contact && <FieldError>{errors.contact}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="matter">Type of matter</FieldLabel>
              <Select name="matter" items={MATTERS} value={matter} onValueChange={setMatter}>
                <SelectTrigger id="matter">
                  <SelectValue placeholder="Select a matter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {MATTERS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field data-invalid={!!errors.message}>
              <FieldLabel htmlFor="message">Briefly, what do you need help with?</FieldLabel>
              <Textarea id="message" name="message" rows={4} aria-invalid={!!errors.message} />
              {errors.message && <FieldError>{errors.message}</FieldError>}
            </Field>

            <Field>
              <Button type="submit" variant="brand" size="xl" className="w-full sm:w-fit">
                Send message
              </Button>
              <p className="text-muted-foreground text-xs">
                Your details are used only to reply to this request.
              </p>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
