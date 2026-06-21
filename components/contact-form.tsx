"use client"

import { type FormEvent, useState } from "react"
import { Check, LoaderCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type ContactFormProps = {
  goals: string[]
  privacyText: string
}

export function ContactForm({ goals, privacyText }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [goal, setGoal] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          goal: goal ?? "",
          message: String(formData.get("message") ?? ""),
          contactVerification: String(formData.get("contactVerification") ?? ""),
        }),
      })
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean
        error?: string
      } | null

      if (!response.ok || !payload?.success) {
        throw new Error(
          payload?.error ?? "L'envoi du message est temporairement indisponible.",
        )
      }

      setSubmitted(true)
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "L'envoi du message est temporairement indisponible.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="size-7" />
        </div>
        <h2 className="mt-5 font-heading text-2xl font-bold">Message envoyé</h2>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
          Merci pour votre message. Je vous réponds personnellement sous 24h ouvrées.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-full"
          onClick={() => {
            setSubmitted(false)
            setGoal(null)
            setErrorMessage(null)
          }}
        >
          Envoyer un autre message
        </Button>
      </div>
    )
  }

  return (
    <form
      className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
      onSubmit={handleSubmit}
    >
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto size-px overflow-hidden"
      >
        <label htmlFor="contactVerification">Ne pas remplir ce champ</label>
        <input
          id="contactVerification"
          name="contactVerification"
          tabIndex={-1}
          autoComplete="new-password"
          data-1p-ignore="true"
          data-bwignore="true"
          data-lpignore="true"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" required placeholder="Camille" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" required placeholder="Durand" />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="camille@email.fr" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Téléphone (optionnel)</Label>
          <Input id="phone" name="phone" type="tel" placeholder="06 12 34 56 78" />
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        <Label>Votre objectif</Label>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGoal(g)}
              className={
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
                (goal === g
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50")
              }
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        <Label htmlFor="message">Votre message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Parlez-moi de votre projet, votre niveau actuel et vos disponibilités…"
        />
      </div>

      <Button
        type="submit"
        className="mt-6 h-12 w-full rounded-full text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Envoyer le message
          </>
        )}
      </Button>
      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {privacyText}
      </p>
    </form>
  )
}
