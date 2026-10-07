import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import { eventTypeMeta } from '../lib/eventUtils';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function PublicEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const events = useStore((s) => s.events);
  const event = events.find((e) => e.slug === slug && e.published);

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

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto section-padding py-8 sm:py-12 space-y-6">
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-center">
          <span className="text-4xl block mb-3">{meta.emoji}</span>
          <p className="text-xs uppercase tracking-widest text-charcoal-light mb-3">{meta.label}</p>
          <p className="text-sm text-charcoal-light mb-1">{event.hosts}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            {event.name || 'Evento sem nome'}
          </h1>
        </motion.div>

        {/* Detalhes */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <div className="card-base">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blush flex-shrink-0" />
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
                  <Clock className="w-4 h-4 text-blush flex-shrink-0" />
                  <span>{event.time}</span>
                </li>
              )}
              {(event.venue || event.city) && (
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blush flex-shrink-0" />
                  <span>
                    {event.venue}
                    {event.city ? `, ${event.city}` : ''}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
