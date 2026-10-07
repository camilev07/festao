import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, Search, Star, MapPin, Camera, Palette,
  UtensilsCrossed, Music, Brush, Building2, Heart,
  SlidersHorizontal, Grid3X3, List, Filter
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const categories = [
  { id: 'all', label: 'Todos', icon: Grid3X3 },
  { id: 'fotografia', label: 'Fotografia', icon: Camera },
  { id: 'decoracao', label: 'Decoração', icon: Palette },
  { id: 'buffet', label: 'Buffet', icon: UtensilsCrossed },
  { id: 'musica', label: 'Música/DJ', icon: Music },
  { id: 'maquiagem', label: 'Maquiagem', icon: Brush },
  { id: 'espacos', label: 'Espaços', icon: Building2 },
];

// Mapeia o nome exibido da categoria para o id usado nos filtros.
// Antes, a comparação era feita com o texto (ex.: "decoração" vs "decoracao"),
// o que quebrava os filtros de Decoração, Música/DJ e Espaços.
const categoryIdByLabel: Record<string, string> = {
  'Fotografia': 'fotografia',
  'Decoração': 'decoracao',
  'Buffet': 'buffet',
  'Música/DJ': 'musica',
  'Maquiagem': 'maquiagem',
  'Espaços': 'espacos',
};

const professionals = [
  {
    id: 1,
    name: 'Luz & Arte Fotografia',
    category: 'Fotografia',
    categoryIcon: Camera,
    location: 'São Paulo, SP',
    rating: 4.9,
    reviews: 127,
    description: 'Fotografia artística para casamentos e eventos especiais. Capturamos momentos únicos com estilo.',
    price: 'A partir de R$ 2.500',
    featured: true,
    image: '📸',
    tags: ['Casamento', '15 anos', 'Ensaio'],
  },
  {
    id: 2,
    name: 'Ateliê Florescer',
    category: 'Decoração',
    categoryIcon: Palette,
    location: 'Rio de Janeiro, RJ',
    rating: 4.8,
    reviews: 89,
    description: 'Decorações encantadoras que transformam qualquer espaço em um lugar mágico.',
    price: 'A partir de R$ 3.000',
    featured: false,
    image: '🎨',
    tags: ['Casamento', 'Aniversário', 'Baby shower'],
  },
  {
    id: 3,
    name: 'Sabor & Arte Buffet',
    category: 'Buffet',
    categoryIcon: UtensilsCrossed,
    location: 'Belo Horizonte, MG',
    rating: 4.9,
    reviews: 203,
    description: 'Buffet completo com alta gastronomia. Cardápios personalizados para todos os gostos.',
    price: 'A partir de R$ 180/pessoa',
    featured: true,
    image: '🍽️',
    tags: ['Casamento', 'Corporativo', 'Festa'],
  },
  {
    id: 4,
    name: 'DJ Pulse Events',
    category: 'Música/DJ',
    categoryIcon: Music,
    location: 'Curitiba, PR',
    rating: 4.7,
    reviews: 156,
    description: 'Profissional de som e DJ para animar qualquer evento. Equipamento completo incluso.',
    price: 'A partir de R$ 1.800',
    featured: false,
    image: '🎵',
    tags: ['Casamento', 'Festa 15 anos', 'Aniversário'],
  },
  {
    id: 5,
    name: 'Studio Beleza - Camila Reis',
    category: 'Maquiagem',
    categoryIcon: Brush,
    location: 'São Paulo, SP',
    rating: 5.0,
    reviews: 74,
    description: 'Maquiagem profissional para noivas e madrinhas. Traje artístico e duradouro.',
    price: 'A partir de R$ 450',
    featured: false,
    image: '💄',
    tags: ['Noivas', '15 anos', 'Formatura'],
  },
  {
    id: 6,
    name: 'Espaço Jardim Encantado',
    category: 'Espaços',
    categoryIcon: Building2,
    location: 'São Paulo, SP',
    rating: 4.8,
    reviews: 95,
    description: 'Espaço ao ar livre com jardim, piscina e área de festa. Capacidade para até 300 pessoas.',
    price: 'A partir de R$ 15.000',
    featured: true,
    image: '🏛️',
    tags: ['Casamento', 'Aniversário', 'Corporativo'],
  },
  {
    id: 7,
    name: 'Flash & Soul Fotografia',
    category: 'Fotografia',
    categoryIcon: Camera,
    location: 'Porto Alegre, RS',
    rating: 4.6,
    reviews: 68,
    description: 'Fotografia e filmagem com drone. Cobertura completa do evento com entrega rápida.',
    price: 'A partir de R$ 1.800',
    featured: false,
    image: '📷',
    tags: ['Casamento', 'Formatura', 'Empresa'],
  },
  {
    id: 8,
    name: 'Mundo Mágico Decorações',
    category: 'Decoração',
    categoryIcon: Palette,
    location: 'Salvador, BA',
    rating: 4.7,
    reviews: 112,
    description: 'Decorações temáticas para festas de 15 anos e aniversários infantis.',
    price: 'A partir de R$ 1.500',
    featured: false,
    image: '🎪',
    tags: ['15 anos', 'Infantil', 'Aniversário'],
  },
  {
    id: 9,
    name: 'Harmonia Gastronômica',
    category: 'Buffet',
    categoryIcon: UtensilsCrossed,
    location: 'Florianópolis, SC',
    rating: 4.9,
    reviews: 178,
    description: 'Cozinha autoral com ingredientes frescos. Opções veganas, sem glúten e buffet internacional.',
    price: 'A partir de R$ 220/pessoa',
    featured: false,
    image: '👨‍🍳',
    tags: ['Casamento', 'Eventos especiais'],
  },
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProfessionals = professionals.filter(p => {
    const matchesCategory = selectedCategory === 'all' || categoryIdByLabel[p.category] === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto section-padding">
        {/* Breadcrumb */}
        <motion.div initial="hidden" animate="visible">
          <motion.div custom={0} variants={fadeUp} className="flex items-center gap-2 text-sm text-charcoal-light mb-2">
            <Link to="/" className="hover:text-charcoal transition-colors">Início</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-charcoal">Serviços</span>
          </motion.div>
        </motion.div>

        {/* Header */}
        <motion.div initial="hidden" animate="visible" className="mb-8">
          <motion.div custom={1} variants={fadeUp}>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold mb-1 tracking-tight">
              Encontre o <span className="italic text-rose">profissional</span> ideal
            </h1>
            <p className="text-charcoal-light text-lg max-w-xl">
              Marketplace de profissionais verificados para o seu evento. 
              Compare, avalie e contrate com confiança.
            </p>
          </motion.div>
        </motion.div>

        {/* Search + Filters */}
        <motion.div initial="hidden" animate="visible" className="mb-8">
          <motion.div custom={2} variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, categoria ou localização..."
                className="w-full bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm border border-charcoal/10
                           outline-none focus:ring-2 focus:ring-blush/30 transition-shadow"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl border border-charcoal/10 hover:bg-charcoal/5 transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <div className="flex bg-white rounded-xl border border-charcoal/10 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-charcoal text-ivory' : 'hover:bg-charcoal/5'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-charcoal text-ivory' : 'hover:bg-charcoal/5'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Category tabs */}
          <motion.div custom={3} variants={fadeUp} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap
                           transition-all duration-200 flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-charcoal text-ivory'
                    : 'bg-white text-charcoal-light border border-charcoal/10 hover:bg-charcoal/5'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Results count */}
        <motion.div initial="hidden" animate="visible">
          <motion.p custom={4} variants={fadeUp} className="text-sm text-charcoal-light mb-6">
            {filteredProfessionals.length} profissionais encontrados
          </motion.p>
        </motion.div>

        {/* Professionals Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          className={viewMode === 'grid'
            ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'space-y-4'
          }
        >
          {filteredProfessionals.map((pro, i) => (
            <motion.div
              key={pro.id}
              custom={i + 5}
              variants={fadeUp}
            >
              <Link
                to={`/profissional/${pro.id}`}
                className={`block card-base group ${viewMode === 'list' ? 'flex items-start gap-6' : ''}`}
              >
                {/* Image placeholder */}
                <div className={`${
                  viewMode === 'grid'
                    ? 'h-44 -mx-6 -mt-6 mb-4 rounded-t-3xl'
                    : 'w-28 h-28 rounded-2xl flex-shrink-0'
                } bg-cream flex items-center justify-center text-4xl relative overflow-hidden`}>
                  {pro.image}
                  {pro.featured && (
                    <span className="absolute top-3 left-3 bg-blush text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Destaque
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center
                               hover:bg-white transition-colors"
                  >
                    <Heart className="w-4 h-4 text-charcoal-light" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display text-base font-semibold group-hover:text-rose transition-colors truncate">
                      {pro.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-cream px-2 py-0.5 rounded-md text-charcoal-light flex items-center gap-1">
                      <pro.categoryIcon className="w-3 h-3" />
                      {pro.category}
                    </span>
                    <span className="text-xs text-charcoal-light flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {pro.location}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-light leading-relaxed mb-3 line-clamp-2">
                    {pro.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-blush fill-blush" />
                      <span className="text-xs font-semibold">{pro.rating}</span>
                      <span className="text-[10px] text-charcoal-light">({pro.reviews})</span>
                    </div>
                    <span className="text-xs font-semibold text-sage">{pro.price}</span>
                  </div>

                  {viewMode === 'list' && (
                    <div className="flex gap-1.5 mt-3">
                      {pro.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-cream text-charcoal-light px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
