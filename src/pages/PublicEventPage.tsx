import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Map, ExternalLink, Gift, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { eventTypeMeta, safeHex, getCountdown, formatBRL } from '../lib/eventUtils';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

export default function PublicEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const events = useStore((s) => s.events);
  const event = events.find((e) => e.slug === slug && e.published);
  const [heroFailed, setHeroFailed] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);

  if (!event) {
    return (
      <main className="min-h-screen bg-cream">
        <div className="max-w-2xl mx-auto section-padding py-12 sm:py-16">
          <div className="card-base text-center">
            <span className="text-4xl block mb-4">🎉</span>
            <h1 className="font-display text-2xl font-semibold mb-3">Página não encontrada</h1>
            <p className="text-sm text-charcoal-light mb-6 leading-relaxed">
              Esta página não está disponível. Ela pode não ter sido publicada ou foi aberta em outro
              navegador (nesta demonstração os dados ficam salvos no navegador onde o evento foi criado).
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2 text-sm">
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const meta = eventTypeMeta[event.type] ?? eventTypeMeta.outro;
  const p = event.personalization;
  const primaryHex = safeHex(p.primaryColor, '#D4A89C');
  const secondaryHex = safeHex(p.secondaryColor, '#C47D6B');
  const countdown = getCountdown(event.date, event.time, now);
  const confirmedCount = event.guests.filter((g) => g.rsvp === 'confirmed').length;
  const mapQuery = encodeURIComponent(`${event.venue} ${event.city}`.trim());

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto section-padding py-8 sm:py-12 space-y-6">
        {/* Hero */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <div
            className="relative overflow-hidden rounded-3xl border border-charcoal/5 shadow-soft"
            style={{ backgroundColor: primaryHex + '15' }}
          >
            {p.heroImage && !heroFailed && (
              <>
                <img
                  src={p.heroImage}
                  alt=""
                  onError={() => setHeroFailed(true)}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ backgroundColor: primaryHex + '66' }} />
              </>
            )}
            <div className="relative px-6 py-10 text-center">
              <span className="text-4xl block mb-3">{meta.emoji}</span>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: secondaryHex }}>
                {meta.label}
              </p>
              <p className="text-sm text-charcoal-light mb-1">{event.hosts}</p>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
                {event.name || 'Evento sem nome'}
              </h1>
              {p.tagline && (
                <p className="text-sm italic text-charcoal-light">"{p.tagline}"</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Countdown */}
        {p.showCountdown && (
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <div className="card-base text-center">
              {countdown.status === 'future' ? (
                <>
                  <p className="text-xs uppercase tracking-widest text-charcoal-light mb-4">Faltam</p>
                  <div className="flex justify-center gap-3">
                    {[
                      { v: String(countdown.days), l: 'dias' },
                      { v: String(countdown.hours), l: 'horas' },
                      { v: String(countdown.minutes), l: 'min' },
                    ].map((u, i) => (
                      <div
                        key={i}
                        className="rounded-xl px-4 py-3 shadow-soft min-w-[4.5rem]"
                        style={{ backgroundColor: primaryHex + '15' }}
                      >
                        <p className="font-display text-2xl font-semibold" style={{ color: secondaryHex }}>
                          {u.v}
                        </p>
                        <p className="text-[10px] text-charcoal-light">{u.l}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="font-display text-xl font-semibold" style={{ color: secondaryHex }}>
                  {countdown.status === 'today' ? 'É hoje! 🎉' : 'Evento realizado'}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Detalhes */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <div className="card-base">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: secondaryHex }} />
                <span>
                  {event.date
                    ? new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Data a definir'}
                </span>
              </li>
              {event.time && (
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 flex-shrink-0" style={{ color: secondaryHex }} />
                  <span>{event.time}</span>
                </li>
              )}
              {(event.venue || event.city) && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: secondaryHex }} />
                  <span className="flex-1">
                    {event.venue}
                    {event.city ? `, ${event.city}` : ''}
                  </span>
                </li>
              )}
            </ul>
            {(event.venue || event.city) && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs inline-flex items-center gap-1.5 mt-4"
              >
                <Map className="w-3.5 h-3.5" />
                Ver no mapa
              </a>
            )}
          </div>
        </motion.div>

        {/* Mensagem */}
        {event.description && (
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <div className="card-base">
              <p className="text-xs uppercase tracking-widest text-charcoal-light mb-2">
                Mensagem para os convidados
              </p>
              <p className="text-sm text-charcoal-light leading-relaxed italic">
                "{event.description}"
              </p>
            </div>
          </motion.div>
        )}

        {/* Contagem de convidados */}
        {p.showGuestCount && (
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
            <div className="card-base flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: primaryHex + '25' }}
              >
                <Users className="w-5 h-5" style={{ color: secondaryHex }} />
              </div>
              <p className="text-sm text-charcoal-light">
                {event.guests.length} convidados · {confirmedCount} confirmados
              </p>
            </div>
          </motion.div>
        )}

        {/* Presentes */}
        {p.showGiftList && event.gifts.length > 0 && (
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
            <div className="card-base">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5" style={{ color: secondaryHex }} />
                <h2 className="font-display text-lg font-semibold">Lista de presentes</h2>
              </div>
              <div className="space-y-1">
                {event.gifts.map((gift) => {
                  const bestPrice = gift.options.length > 0
                    ? Math.min(...gift.options.map((o) => o.price))
                    : null;
                  const bestOption = gift.options.find((o) => o.price === bestPrice);
                  return (
                    <div
                      key={gift.id}
                      className="flex items-start justify-between gap-3 py-3 border-b border-charcoal/5 last:border-0 last:pb-0 first:pt-0"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{gift.image}</span>
                          <p className="font-medium text-sm">{gift.name}</p>
                          {gift.received && (
                            <span className="text-[10px] bg-sage/10 text-sage px-2 py-0.5 rounded-full">
                              Já presenteado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-charcoal-light mt-0.5">{gift.category}</p>
                        {bestOption && bestOption.url && isHttpUrl(bestOption.url) && (
                          <a
                            href={bestOption.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs inline-flex items-center gap-1 mt-1 hover:underline"
                            style={{ color: secondaryHex }}
                          >
                            Ver na loja
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {bestPrice !== null && (
                        <span
                          className="font-display text-base font-semibold whitespace-nowrap"
                          style={{ color: secondaryHex }}
                        >
                          {formatBRL(bestPrice)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Rodapé */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="text-center pt-2 pb-2">
          <p className="text-xs text-charcoal-light">
            Criado com{' '}
            <Link to="/" className="font-semibold hover:underline" style={{ color: secondaryHex }}>
              Festão
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
