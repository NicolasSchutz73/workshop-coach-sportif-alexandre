'use client'

import { type FormEvent, useMemo, useRef, useState } from 'react'
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  LoaderCircle,
  MapPin,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { BookingContent } from '@/lib/booking'
import { cn } from '@/lib/utils'

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const monthNames = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

type AvailableSlot = {
  id: string
  date: string
  startTime: string
  sessionTypeId: string
  sessionTypeSlug: string
}

type BookingForm = {
  clientName: string
  clientEmail: string
  clientPhone: string
  message: string
}

type BookingWidgetProps = Pick<
  BookingContent,
  'sessionTypes' | 'closedWeekdays' | 'noPaymentText'
>

const initialForm: BookingForm = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  message: '',
}

const sessionIconByKey = {
  video: Video,
  localisation: MapPin,
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isSameDay(a: Date | null, b: Date | null) {
  return !!a && !!b && formatDateKey(a) === formatDateKey(b)
}

export function BookingWidget({
  sessionTypes,
  closedWeekdays,
  noPaymentText,
}: BookingWidgetProps) {
  const requestIdRef = useRef(0)
  const sessionTypesWithIcons = useMemo(
    () =>
      sessionTypes.map((type) => ({
        ...type,
        icon: sessionIconByKey[type.icon],
      })),
    [sessionTypes],
  )
  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const [sessionTypeSlug, setSessionTypeSlug] = useState(
    sessionTypes[0]?.id ?? '',
  )
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(
    () => new Set(),
  )
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<BookingForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [emailWarning, setEmailWarning] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const selectedSlot =
    slots.find((slot) => slot.id === selectedSlotId) ?? null
  const activeType =
    sessionTypesWithIcons.find((type) => type.id === sessionTypeSlug) ??
    sessionTypesWithIcons[0]
  const days = useMemo(() => {
    const first = startOfMonth(viewMonth)
    const offset = (first.getDay() + 6) % 7
    const daysInMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + 1,
      0,
    ).getDate()
    const cells: (Date | null)[] = []

    for (let index = 0; index < offset; index += 1) cells.push(null)
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day))
    }

    return cells
  }, [viewMonth])
  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() &&
      viewMonth.getMonth() > today.getMonth())

  function isDisabled(date: Date) {
    return (
      date < today ||
      closedWeekdays.includes(date.getDay()) ||
      unavailableDates.has(formatDateKey(date))
    )
  }

  async function loadSlots(date: Date) {
    const requestId = ++requestIdRef.current
    const dateKey = formatDateKey(date)

    setIsLoadingSlots(true)
    setErrorMessage(null)
    setEmailWarning(null)
    setSlots([])

    try {
      const params = new URLSearchParams({
        date: dateKey,
        sessionTypeSlug,
      })
      const response = await fetch(`/api/slots?${params.toString()}`, {
        cache: 'no-store',
      })
      const payload = (await response.json()) as {
        slots?: AvailableSlot[]
        error?: string
      }

      if (!response.ok) {
        throw new Error(payload.error)
      }

      if (requestId !== requestIdRef.current) return

      const nextSlots = payload.slots ?? []
      setSlots(nextSlots)

      if (nextSlots.length === 0) {
        setUnavailableDates((current) => {
          const next = new Set(current)
          next.add(dateKey)
          return next
        })
      }
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'Impossible de charger les créneaux disponibles.',
      )
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoadingSlots(false)
      }
    }
  }

  function selectSessionType(slug: string) {
    requestIdRef.current += 1
    setSessionTypeSlug(slug)
    setSelectedDate(null)
    setSelectedSlotId(null)
    setSlots([])
    setUnavailableDates(new Set())
    setShowForm(false)
    setErrorMessage(null)
    setEmailWarning(null)
  }

  function selectDate(date: Date) {
    setSelectedDate(date)
    setSelectedSlotId(null)
    setShowForm(false)
    setEmailWarning(null)
    void loadSlots(date)
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedSlot) return

    setIsSubmitting(true)
    setErrorMessage(null)
    setEmailWarning(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          message: form.message || undefined,
          timeSlotId: selectedSlot.id,
          sessionTypeId: selectedSlot.sessionTypeId,
        }),
      })
      const payload = (await response.json()) as {
        success?: boolean
        emailsSent?: boolean
        error?: string
      }

      if (response.status === 409) {
        setSelectedSlotId(null)
        setShowForm(false)
        setErrorMessage(
          "Ce créneau vient d'être pris, veuillez en choisir un autre",
        )
        if (selectedDate) void loadSlots(selectedDate)
        return
      }

      if (!response.ok || !payload.success) {
        throw new Error(payload.error)
      }

      if (payload.emailsSent === false) {
        setEmailWarning(
          "La réservation est enregistrée, mais l'email n'a pas pu être envoyé. Vérifiez la configuration Resend.",
        )
      }

      setConfirmed(true)
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'Impossible d’enregistrer la réservation.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (confirmed && selectedDate && selectedSlot && activeType) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="size-7" />
        </div>
        <h2 className="mt-5 font-heading text-2xl font-bold">Demande envoyée</h2>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
          Votre demande de réservation a bien été enregistrée.
          {emailWarning
            ? " L'email de confirmation n'a pas pu être envoyé automatiquement."
            : ' Je vous confirme le créneau par email sous 24h.'}
        </p>
        {emailWarning ? (
          <p className="mx-auto mt-4 max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            {emailWarning}
          </p>
        ) : null}
        <div className="mx-auto mt-6 max-w-xs rounded-2xl border border-border bg-background p-4 text-left text-sm">
          <p className="flex items-center gap-2">
            <activeType.icon className="size-4 text-primary" />
            {activeType.label}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            {selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            {selectedSlot.startTime}
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-6 rounded-full"
          onClick={() => {
            setConfirmed(false)
            setSelectedDate(null)
            setSelectedSlotId(null)
            setSlots([])
            setShowForm(false)
            setForm(initialForm)
            setEmailWarning(null)
          }}
        >
          Réserver un autre créneau
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="border-b border-border/60 p-6">
        <h2 className="font-heading text-lg font-semibold">Type de séance</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {sessionTypesWithIcons.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => selectSessionType(type.id)}
              className={cn(
                'flex flex-col gap-1 rounded-2xl border p-4 text-left transition-colors',
                sessionTypeSlug === type.id
                  ? 'border-primary bg-accent'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <type.icon className="size-5 text-primary" />
              <span className="mt-1 text-sm font-semibold">{type.label}</span>
              <span className="text-xs text-muted-foreground">
                {type.duration} · {type.mode}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        <div className="border-b border-border/60 p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold">
              {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Mois précédent"
                disabled={!canGoPrev}
                onClick={() =>
                  setViewMonth(
                    new Date(
                      viewMonth.getFullYear(),
                      viewMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-30"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Mois suivant"
                onClick={() =>
                  setViewMonth(
                    new Date(
                      viewMonth.getFullYear(),
                      viewMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {dayNames.map((day) => (
              <span
                key={day}
                className="py-2 text-xs font-medium text-muted-foreground"
              >
                {day}
              </span>
            ))}
            {days.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} />

              const disabled = isDisabled(date)
              const selected = isSameDay(date, selectedDate)

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDate(date)}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-xl text-sm transition-colors',
                    disabled && 'cursor-not-allowed text-muted-foreground/40',
                    !disabled && !selected && 'hover:bg-secondary',
                    selected && 'bg-primary font-semibold text-primary-foreground',
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-heading text-base font-semibold">
            {selectedDate
              ? selectedDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })
              : 'Sélectionnez une date'}
          </h3>

          {selectedDate ? (
            <>
              {isLoadingSlots ? (
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" />
                  Chargement des créneaux…
                </div>
              ) : slots.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        setSelectedSlotId(slot.id)
                        setShowForm(false)
                        setErrorMessage(null)
                      }}
                      className={cn(
                        'rounded-xl border py-3 text-sm font-medium transition-colors',
                        selectedSlotId === slot.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              ) : !errorMessage ? (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Aucun créneau n’est disponible pour cette date.
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Choisissez un jour dans le calendrier pour voir les créneaux
              disponibles. Les jours sans disponibilité sont ensuite grisés.
            </p>
          )}

          {errorMessage ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {errorMessage}
            </p>
          ) : null}

          {showForm && selectedSlot ? (
            <form className="mt-6 space-y-4" onSubmit={submitBooking}>
              <div className="space-y-2">
                <Label htmlFor="booking-name">Nom</Label>
                <Input
                  id="booking-name"
                  name="clientName"
                  autoComplete="name"
                  required
                  minLength={2}
                  value={form.clientName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      clientName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-email">Email</Label>
                <Input
                  id="booking-email"
                  name="clientEmail"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.clientEmail}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      clientEmail: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-phone">Téléphone</Label>
                <Input
                  id="booking-phone"
                  name="clientPhone"
                  type="tel"
                  autoComplete="tel"
                  required
                  minLength={6}
                  value={form.clientPhone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      clientPhone: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-message">Message (optionnel)</Label>
                <Textarea
                  id="booking-message"
                  name="message"
                  maxLength={3000}
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                />
              </div>
              <Button
                type="submit"
                className="h-12 w-full rounded-full text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  'Envoyer la demande'
                )}
              </Button>
            </form>
          ) : (
            <Button
              className="mt-6 h-12 w-full rounded-full text-base"
              disabled={!selectedSlot || isLoadingSlots}
              onClick={() => {
                setShowForm(true)
                setErrorMessage(null)
              }}
            >
              Confirmer la réservation
            </Button>
          )}

          <p className="mt-3 text-center text-xs text-muted-foreground">
            {noPaymentText}
          </p>
        </div>
      </div>
    </div>
  )
}
