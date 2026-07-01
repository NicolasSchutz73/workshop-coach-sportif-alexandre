'use client'

import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, Check, ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const TIME_ZONE = 'Europe/Paris'
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const E164_PHONE = /^\+[1-9]\d{7,14}$/
const MONTH_CACHE_TTL = 30_000

type Month = {
  year: number
  month: number
}

type Slot = {
  start: string
}

type SlotsByDate = Record<string, Slot[]>

type CachedMonth = {
  expiresAt: number
  slotsByDate: SlotsByDate
}

type BookingForm = {
  name: string
  email: string
  phone: string
  message: string
}

type CalBookingWidgetProps = {
  noPaymentText: string
  className?: string
}

const initialForm: BookingForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

function dateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? ''

  return {
    year: Number(part('year')),
    month: Number(part('month')),
    day: Number(part('day')),
  }
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function currentMonth(): Month {
  const { year, month } = dateParts(new Date())
  return { year, month }
}

function firstDateOfMonth({ year, month }: Month) {
  return toDateKey(year, month, 1)
}

function lastDateOfMonth({ year, month }: Month) {
  return toDateKey(year, month, new Date(Date.UTC(year, month, 0)).getUTCDate())
}

function monthCacheKey(month: Month) {
  return `${firstDateOfMonth(month)}:${lastDateOfMonth(month)}`
}

function addMonths({ year, month }: Month, offset: number): Month {
  const date = new Date(Date.UTC(year, month - 1 + offset, 1))
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 }
}

function isSameMonth(a: Month, b: Month) {
  return a.year === b.year && a.month === b.month
}

function monthLabel(month: Month) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: TIME_ZONE,
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(month.year, month.month - 1, 15)))
}

function fullDateLabel(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00Z`))
}

function timeLabel(start: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(start))
}

function monthDays(month: Month) {
  const firstDay = new Date(Date.UTC(month.year, month.month - 1, 1)).getUTCDay()
  const offset = (firstDay + 6) % 7
  const count = new Date(Date.UTC(month.year, month.month, 0)).getUTCDate()

  return [
    ...Array<string | null>(offset).fill(null),
    ...Array.from({ length: count }, (_, index) =>
      toDateKey(month.year, month.month, index + 1),
    ),
  ]
}

function formError(form: BookingForm) {
  if (form.name.trim().length < 2) return 'Saisissez un nom d’au moins 2 caractères.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return 'Saisissez une adresse e-mail valide.'
  }
  if (form.phone.trim() && !E164_PHONE.test(form.phone.trim())) {
    return 'Utilisez le format international pour le téléphone, par exemple +33612345678.'
  }
  if (form.message.trim().length > 3000) {
    return 'Le message ne peut pas dépasser 3 000 caractères.'
  }
  return null
}

export function CalBookingWidget({ noPaymentText, className }: CalBookingWidgetProps) {
  const [initialMonth] = useState(() => currentMonth())
  const [formStartedAt] = useState(() => Date.now())
  const requestId = useRef(0)
  const confirmationRef = useRef<HTMLElement>(null)
  const monthCache = useRef(new Map<string, CachedMonth>())
  const [viewMonth, setViewMonth] = useState<Month>(initialMonth)
  const [slotsByDate, setSlotsByDate] = useState<SlotsByDate>({})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [form, setForm] = useState<BookingForm>(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const days = useMemo(() => monthDays(viewMonth), [viewMonth])
  const selectedSlots = selectedDate ? (slotsByDate[selectedDate] ?? []) : []
  const today = toDateKey(initialMonth.year, initialMonth.month, dateParts(new Date()).day)
  const canGoPrevious = !isSameMonth(viewMonth, initialMonth)

  const loadMonth = useCallback(async (month: Month, forceRefresh = false) => {
    const id = ++requestId.current
    const cacheKey = monthCacheKey(month)
    const cachedMonth = monthCache.current.get(cacheKey)

    if (!forceRefresh && cachedMonth && cachedMonth.expiresAt > Date.now()) {
      setSlotsByDate(cachedMonth.slotsByDate)
      setErrorMessage(null)
      setIsLoading(false)
      return
    }

    try {
      const params = new URLSearchParams({
        start: firstDateOfMonth(month),
        end: lastDateOfMonth(month),
      })
      if (forceRefresh) params.set('refresh', '1')
      const response = await fetch(`/api/cal/slots?${params.toString()}`)
      const payload = (await response.json().catch(() => null)) as {
        slotsByDate?: SlotsByDate
        error?: string
      } | null

      if (!response.ok) {
        throw new Error(payload?.error || 'Impossible de charger les créneaux disponibles.')
      }
      if (id !== requestId.current) return

      const nextSlotsByDate = payload?.slotsByDate ?? {}
      monthCache.current.set(cacheKey, {
        slotsByDate: nextSlotsByDate,
        expiresAt: Date.now() + MONTH_CACHE_TTL,
      })
      setSlotsByDate(nextSlotsByDate)
      setErrorMessage(null)
    } catch (error) {
      if (id !== requestId.current) return
      setSlotsByDate({})
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'Impossible de charger les créneaux disponibles.',
      )
    } finally {
      if (id === requestId.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadMonth(viewMonth)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [loadMonth, viewMonth])

  useEffect(() => {
    if (!confirmation) return

    const frame = window.requestAnimationFrame(() => {
      const confirmationElement = confirmationRef.current
      if (!confirmationElement) return

      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth'
      const top = Math.max(
        confirmationElement.getBoundingClientRect().top + window.scrollY - 96,
        0,
      )

      window.scrollTo({ top, behavior })
      confirmationElement.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [confirmation])

  function changeMonth(offset: number) {
    setSelectedDate(null)
    setSelectedSlot(null)
    setErrorMessage(null)
    setIsLoading(true)
    setViewMonth((month) => addMonths(month, offset))
  }

  function selectDate(date: string) {
    if ((slotsByDate[date] ?? []).length === 0) return
    setSelectedDate(date)
    setSelectedSlot(null)
    setErrorMessage(null)
    setConfirmation(null)
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedSlot || !selectedDate) return

    const validationError = formError(form)
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/cal/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: selectedSlot,
          name: form.name.trim(),
          email: form.email.trim(),
          ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
          ...(form.message.trim() ? { message: form.message.trim() } : {}),
          bookingVerification: '',
          formStartedAt,
        }),
      })
      const payload = (await response.json().catch(() => null)) as {
        success?: boolean
        error?: string
      } | null

      if (response.status === 409) {
        setSelectedSlot(null)
        setErrorMessage('Ce créneau vient d’être pris. Choisissez-en un autre.')
        setIsLoading(true)
        void loadMonth(viewMonth, true)
        return
      }
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || 'La réservation est temporairement indisponible.')
      }

      setSlotsByDate((current) => {
        const remainingSlots = (current[selectedDate] ?? []).filter(
          (slot) => slot.start !== selectedSlot,
        )

        if (remainingSlots.length === 0) {
          const remainingDates = { ...current }
          delete remainingDates[selectedDate]
          monthCache.current.set(monthCacheKey(viewMonth), {
            slotsByDate: remainingDates,
            expiresAt: Date.now() + MONTH_CACHE_TTL,
          })
          return remainingDates
        }

        const remainingDates = { ...current, [selectedDate]: remainingSlots }
        monthCache.current.set(monthCacheKey(viewMonth), {
          slotsByDate: remainingDates,
          expiresAt: Date.now() + MONTH_CACHE_TTL,
        })
        return remainingDates
      })
      setConfirmation(
        `Votre rendez-vous du ${fullDateLabel(selectedDate)} à ${timeLabel(selectedSlot)} est confirmé.`,
      )
      setForm(initialForm)
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'La réservation est temporairement indisponible.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={confirmation ? confirmationRef : undefined}
      tabIndex={confirmation ? -1 : undefined}
      className={cn(
        'scroll-mt-24 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm outline-none',
        className,
      )}
      aria-labelledby="cal-booking-title"
      aria-live={confirmation ? 'polite' : undefined}
    >
      <div className="shrink-0 border-b border-border/60 bg-primary px-6 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <CalendarDays className="size-5 text-primary-foreground" aria-hidden="true" />
          <div>
            <h2 id="cal-booking-title" className="font-heading text-xl font-bold text-primary-foreground">
              {confirmation ? 'Votre rendez-vous est confirmé' : 'Choisissez votre créneau'}
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              {confirmation
                ? 'Un e-mail de confirmation vous sera envoyé.'
                : 'Tous les horaires sont affichés à l’heure de Paris.'}
            </p>
          </div>
        </div>
      </div>

      {confirmation ? (
        <div className="flex min-h-[360px] flex-1 items-center justify-center p-6 sm:p-10">
          <div className="max-w-md text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Check className="size-7" aria-hidden="true" />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-bold">Rendez-vous réservé</h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{confirmation}</p>
            <Button
              className="mt-7 h-11 rounded-full px-5"
              onClick={() => {
                setConfirmation(null)
                setSelectedDate(null)
                setSelectedSlot(null)
              }}
            >
              Réserver un autre créneau
            </Button>
          </div>
        </div>
      ) : (
      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.85fr)]">
        <div className="border-b border-border/60 p-5 sm:p-7 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-lg font-semibold capitalize">{monthLabel(viewMonth)}</h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Mois précédent"
                disabled={!canGoPrevious || isLoading}
                onClick={() => changeMonth(-1)}
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Mois suivant"
                disabled={isLoading}
                onClick={() => changeMonth(1)}
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center" aria-label={`Calendrier ${monthLabel(viewMonth)}`}>
            {DAY_NAMES.map((day) => (
              <span key={day} className="py-2 text-xs font-semibold text-muted-foreground">{day}</span>
            ))}
            {days.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} aria-hidden="true" />
              const isPast = date < today
              const available = (slotsByDate[date] ?? []).length > 0
              const disabled = isLoading || isPast || !available
              const selected = date === selectedDate

              return (
                <button
                  key={date}
                  type="button"
                  disabled={disabled}
                  aria-label={`${fullDateLabel(date)}${available ? ', créneaux disponibles' : ', aucun créneau disponible'}`}
                  aria-pressed={selected}
                  onClick={() => selectDate(date)}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-xl text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                    disabled && 'cursor-not-allowed text-muted-foreground/35',
                    !disabled && !selected && 'hover:bg-secondary',
                    selected && 'bg-primary font-semibold text-primary-foreground',
                  )}
                >
                  {date.slice(-2).replace(/^0/, '')}
                </button>
              )
            })}
          </div>

          <p className="mt-5 flex min-h-5 items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
            {isLoading ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Chargement des disponibilités…</> : 'Sélectionnez une date disponible.'}
          </p>
        </div>

        <div className="p-5 sm:p-7">
          <h3 className="font-heading text-lg font-semibold">
            {selectedDate ? fullDateLabel(selectedDate) : 'Créneaux disponibles'}
          </h3>
          {selectedDate && !isLoading ? (
            selectedSlots.length > 0 ? (
              <div className="mt-5" role="group" aria-label={`Créneaux du ${fullDateLabel(selectedDate)}`}>
                {selectedSlot ? (
                  <div className="rounded-2xl border border-primary/20 bg-accent/45 p-4">
                    <p className="text-xs font-semibold tracking-[0.14em] text-accent-foreground uppercase">Créneau sélectionné</p>
                    <p className="mt-1 font-heading text-xl font-bold text-accent-foreground">{timeLabel(selectedSlot)}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedSlot(null)}
                      className="mt-3 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      Changer d’horaire
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2" aria-label="Liste des horaires disponibles">
                      {selectedSlots.map((slot) => (
                        <button
                          key={slot.start}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot.start)
                            setErrorMessage(null)
                          }}
                          className="rounded-xl border border-border py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {timeLabel(slot.start)}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">Sélectionnez un horaire.</p>
                  </>
                )}
              </div>
            ) : <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Aucun créneau n’est disponible pour cette date.</p>
          ) : !isLoading ? <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Choisissez une date disponible dans le calendrier.</p> : null}

          {errorMessage ? <p role="alert" className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{errorMessage}</p> : null}

          {selectedSlot ? (
            <form className="mt-6 space-y-4" onSubmit={submitBooking} noValidate>
              <div className="space-y-2">
                <Label htmlFor="cal-name">Nom</Label>
                <Input id="cal-name" autoComplete="name" required minLength={2} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cal-email">E-mail</Label>
                <Input id="cal-email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cal-phone">Téléphone <span className="font-normal text-muted-foreground">(facultatif)</span></Label>
                <Input id="cal-phone" type="tel" autoComplete="tel" placeholder="+33612345678" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cal-message">Message <span className="font-normal text-muted-foreground">(facultatif)</span></Label>
                <Textarea id="cal-message" maxLength={3000} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
              </div>
              <Button type="submit" className="h-12 w-full rounded-full text-base" disabled={isSubmitting}>
                {isSubmitting ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Réservation…</> : 'Réserver ce créneau'}
              </Button>
            </form>
          ) : null}
          <p className="mt-4 text-center text-xs text-muted-foreground">{noPaymentText}</p>
        </div>
      </div>
      )}
    </section>
  )
}
