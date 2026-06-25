"use client"

import { type FormEvent, useState } from "react"
import { Check, LoaderCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

type FieldProps = {
  id: string
  label: string
  type?: string
  placeholder: string
  optional?: boolean
}

function Field({ id, label, type = "text", placeholder, optional }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground/80">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted-foreground">(optionnel)</span>
        ) : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={!optional}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-border bg-transparent px-4 text-[15px] text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </div>
  )
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
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
      <div className="rounded-[2rem] border border-border/60 bg-card/70 p-7 text-center shadow-[0_20px_60px_-25px_rgba(31,81,50,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-semibold">Message envoyé</h2>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          Merci pour votre message. Je vous réponds personnellement sous 24h ouvrées.
        </p>
        <Button
          variant="outline"
          className="mt-5 rounded-xl"
          onClick={() => {
            setSubmitted(false)
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
      className="relative rounded-[2rem] border border-border/60 bg-card/70 p-5 shadow-[0_20px_60px_-25px_rgba(31,81,50,0.35)] backdrop-blur-xl sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contactVerification">Ne pas remplir ce champ</label>
        <input
          id="contactVerification"
          name="contactVerification"
          tabIndex={-1}
          autoComplete="new-password"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field id="firstName" label="Prénom" placeholder="Camille" />
        <Field id="lastName" label="Nom" placeholder="Durand" />
        <Field id="email" label="Email" type="email" placeholder="camille@email.fr" />
        <Field id="phone" label="Téléphone" type="tel" placeholder="06 12 34 56 78" optional />
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-foreground/80">
          Votre message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={3}
          placeholder="Parlez-moi de votre projet, votre niveau actuel et vos disponibilités…"
          className="w-full resize-none rounded-2xl border border-border bg-transparent px-4 py-3.5 text-[15px] leading-relaxed text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-4 h-11 w-full rounded-2xl text-base shadow-[0_12px_30px_-10px_rgba(31,81,50,0.6)] transition-transform hover:-translate-y-0.5"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-[18px] animate-spin" aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send className="size-[18px]" aria-hidden="true" />
            Envoyer le message
          </>
        )}
      </Button>
      {errorMessage ? (
        <p role="alert" className="mt-3 text-center text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Vos informations restent confidentielles et ne sont jamais partagées.
      </p>
    </form>
  )
}
