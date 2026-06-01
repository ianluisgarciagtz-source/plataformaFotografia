export interface Photographer {
  id: string;
  name: string;
  avatar: string;
  coverPhoto: string;
  city: string;
  country: string;
  distance: number; // km
  rating: number;
  reviewCount: number;
  specialties: string[];
  priceFrom: number;
  bio: string;
  portfolio: PortfolioItem[];
  reviews: Review[];
  verified: boolean;
  responseTime: string;
  yearsExperience: number;
  instagram?: string;
  lat: number;
  lng: number;
}

export interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  category: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  category: string;
}

export const SPECIALTIES = [
  "Bodas",
  "Retratos",
  "Paisajes",
  "Moda",
  "Comida",
  "Arquitectura",
  "Eventos",
  "Bebés / Familia",
  "Deportes",
  "Documental",
];

export const PHOTOGRAPHERS: Photographer[] = [
  {
    id: "p1",
    name: "Carlos Ruiz",
    avatar: "https://images.unsplash.com/photo-1575299833801-85ce40813bac?w=200&h=200&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1768777278961-df45d3c2aa22?w=1200&h=500&fit=crop",
    city: "Madrid",
    country: "España",
    distance: 1.2,
    rating: 4.9,
    reviewCount: 128,
    specialties: ["Bodas", "Retratos", "Eventos"],
    priceFrom: 350,
    bio: "Fotógrafo profesional con más de 10 años de experiencia capturando los momentos más especiales. Especializado en bodas y retratos emotivos que cuentan historias únicas.",
    verified: true,
    responseTime: "< 1 hora",
    yearsExperience: 10,
    instagram: "@carlosruizfoto",
    lat: 40.4168,
    lng: -3.7038,
    portfolio: [
      { id: "pi1", url: "https://images.unsplash.com/photo-1768777278961-df45d3c2aa22?w=600&h=400&fit=crop", title: "Boda en jardín", category: "Bodas" },
      { id: "pi2", url: "https://images.unsplash.com/photo-1646526822732-4eb6415320a2?w=600&h=400&fit=crop", title: "Retrato editorial", category: "Retratos" },
      { id: "pi3", url: "https://images.unsplash.com/photo-1574504212584-29a03eb6e41e?w=600&h=400&fit=crop", title: "Evento corporativo", category: "Eventos" },
      { id: "pi4", url: "https://images.unsplash.com/photo-1668952135061-2bd8d2638fda?w=600&h=400&fit=crop", title: "Sesión de moda", category: "Moda" },
      { id: "pi5", url: "https://images.unsplash.com/photo-1665173671867-d61792be97a3?w=600&h=400&fit=crop", title: "Calle nocturna", category: "Documental" },
      { id: "pi6", url: "https://images.unsplash.com/photo-1659025671240-54e686180c06?w=600&h=400&fit=crop", title: "Paisaje montaña", category: "Paisajes" },
    ],
    reviews: [
      { id: "r1", author: "María López", avatar: "https://images.unsplash.com/photo-1773336099065-57893268749f?w=80&h=80&fit=crop&crop=face", rating: 5, text: "Carlos fue increíble en nuestra boda. Capturó cada momento con una sensibilidad única. Las fotos superaron todas nuestras expectativas.", date: "2026-03-15", category: "Bodas" },
      { id: "r2", author: "Pedro Martínez", avatar: "https://images.unsplash.com/photo-1758613654584-86714842a2d5?w=80&h=80&fit=crop&crop=face", rating: 5, text: "Profesional, puntual y con un ojo artístico extraordinario. Mi retrato empresarial quedó perfecto.", date: "2026-02-28", category: "Retratos" },
    ],
  },
  {
    id: "p2",
    name: "Laura Sánchez",
    avatar: "https://images.unsplash.com/photo-1617461073601-b8222743b613?w=200&h=200&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1668952135061-2bd8d2638fda?w=1200&h=500&fit=crop",
    city: "Barcelona",
    country: "España",
    distance: 3.5,
    rating: 4.8,
    reviewCount: 95,
    specialties: ["Moda", "Retratos", "Comida"],
    priceFrom: 280,
    bio: "Directora de fotografía con formación en bellas artes y especialización en moda editorial. Mi trabajo ha aparecido en revistas nacionales e internacionales.",
    verified: true,
    responseTime: "< 2 horas",
    yearsExperience: 7,
    instagram: "@laurasanchezphoto",
    lat: 41.3851,
    lng: 2.1734,
    portfolio: [
      { id: "pi7", url: "https://images.unsplash.com/photo-1668952135061-2bd8d2638fda?w=600&h=400&fit=crop", title: "Editorial moda", category: "Moda" },
      { id: "pi8", url: "https://images.unsplash.com/photo-1646526822732-4eb6415320a2?w=600&h=400&fit=crop", title: "Retrato artístico", category: "Retratos" },
      { id: "pi9", url: "https://images.unsplash.com/photo-1565506130372-ee45c65c4f29?w=600&h=400&fit=crop", title: "Gastronomía", category: "Comida" },
      { id: "pi10", url: "https://images.unsplash.com/photo-1768777278961-df45d3c2aa22?w=600&h=400&fit=crop", title: "Sesión exterior", category: "Retratos" },
    ],
    reviews: [
      { id: "r3", author: "Sofía Herrero", avatar: "https://images.unsplash.com/photo-1617461073601-b8222743b613?w=80&h=80&fit=crop&crop=face", rating: 5, text: "Laura tiene una visión artística increíble. Las fotos para mi marca de moda quedaron espectaculares.", date: "2026-03-20", category: "Moda" },
    ],
  },
  {
    id: "p3",
    name: "Javier Torres",
    avatar: "https://images.unsplash.com/photo-1758613654584-86714842a2d5?w=200&h=200&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1659025671240-54e686180c06?w=1200&h=500&fit=crop",
    city: "Valencia",
    country: "España",
    distance: 8.1,
    rating: 4.7,
    reviewCount: 67,
    specialties: ["Paisajes", "Arquitectura", "Documental"],
    priceFrom: 220,
    bio: "Amante de la naturaleza y la arquitectura. Mis imágenes buscan la belleza en las formas, la luz y los espacios. Trabajo con marcas de turismo y agencias de bienes raíces.",
    verified: false,
    responseTime: "< 4 horas",
    yearsExperience: 5,
    instagram: "@javiertorresfotos",
    lat: 39.4699,
    lng: -0.3763,
    portfolio: [
      { id: "pi11", url: "https://images.unsplash.com/photo-1659025671240-54e686180c06?w=600&h=400&fit=crop", title: "Sierra Nevada", category: "Paisajes" },
      { id: "pi12", url: "https://images.unsplash.com/photo-1763369642202-ca3df9b0ff34?w=600&h=400&fit=crop", title: "Interior moderno", category: "Arquitectura" },
      { id: "pi13", url: "https://images.unsplash.com/photo-1665173671867-d61792be97a3?w=600&h=400&fit=crop", title: "Documental urbano", category: "Documental" },
    ],
    reviews: [
      { id: "r4", author: "Roberto Gómez", avatar: "https://images.unsplash.com/photo-1575299833801-85ce40813bac?w=80&h=80&fit=crop&crop=face", rating: 5, text: "Javier capturó nuestra propiedad de forma magistral. Las fotos inmobiliarias aumentaron el interés en un 40%.", date: "2026-01-10", category: "Arquitectura" },
    ],
  },
  {
    id: "p4",
    name: "Ana Moreno",
    avatar: "https://images.unsplash.com/photo-1773336099065-57893268749f?w=200&h=200&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1761891927440-c27e614c7894?w=1200&h=500&fit=crop",
    city: "Sevilla",
    country: "España",
    distance: 15.3,
    rating: 5.0,
    reviewCount: 42,
    specialties: ["Bebés / Familia", "Retratos", "Bodas"],
    priceFrom: 180,
    bio: "Especialista en fotografía de recién nacidos y familias. Creo un ambiente cálido y tranquilo para capturar los primeros momentos de vida con delicadeza y amor.",
    verified: true,
    responseTime: "< 3 horas",
    yearsExperience: 4,
    lat: 37.3891,
    lng: -5.9845,
    portfolio: [
      { id: "pi14", url: "https://images.unsplash.com/photo-1761891927440-c27e614c7894?w=600&h=400&fit=crop", title: "Sesión newborn", category: "Bebés / Familia" },
      { id: "pi15", url: "https://images.unsplash.com/photo-1646526822732-4eb6415320a2?w=600&h=400&fit=crop", title: "Retrato familiar", category: "Bebés / Familia" },
      { id: "pi16", url: "https://images.unsplash.com/photo-1768777278961-df45d3c2aa22?w=600&h=400&fit=crop", title: "Boda íntima", category: "Bodas" },
    ],
    reviews: [
      { id: "r5", author: "Lucía Fernández", avatar: "https://images.unsplash.com/photo-1617461073601-b8222743b613?w=80&h=80&fit=crop&crop=face", rating: 5, text: "Ana es mágica con los bebés. Nuestro hijo recién nacido estaba completamente tranquilo y las fotos son preciosas.", date: "2026-02-05", category: "Bebés / Familia" },
    ],
  },
  {
    id: "p5",
    name: "Miguel Ángel Vega",
    avatar: "https://images.unsplash.com/photo-1745847768366-d44dcef9ef35?w=200&h=200&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1565506130372-ee45c65c4f29?w=1200&h=500&fit=crop",
    city: "Madrid",
    country: "España",
    distance: 4.8,
    rating: 4.6,
    reviewCount: 53,
    specialties: ["Comida", "Arquitectura", "Moda"],
    priceFrom: 300,
    bio: "Fotógrafo comercial especializado en gastronomía y producto. Mi trabajo ayuda a restaurantes y marcas a comunicar su esencia a través de imágenes poderosas y apetitosas.",
    verified: true,
    responseTime: "< 1 hora",
    yearsExperience: 8,
    instagram: "@miguelangelvegaphoto",
    lat: 40.4100,
    lng: -3.6900,
    portfolio: [
      { id: "pi17", url: "https://images.unsplash.com/photo-1565506130372-ee45c65c4f29?w=600&h=400&fit=crop", title: "Fine dining", category: "Comida" },
      { id: "pi18", url: "https://images.unsplash.com/photo-1763369642202-ca3df9b0ff34?w=600&h=400&fit=crop", title: "Restaurante moderno", category: "Arquitectura" },
      { id: "pi19", url: "https://images.unsplash.com/photo-1668952135061-2bd8d2638fda?w=600&h=400&fit=crop", title: "Producto editorial", category: "Moda" },
    ],
    reviews: [
      { id: "r6", author: "Chef Ramírez", avatar: "https://images.unsplash.com/photo-1758613654584-86714842a2d5?w=80&h=80&fit=crop&crop=face", rating: 5, text: "Las fotos de mi restaurante aumentaron las reservas un 60%. Miguel sabe cómo hacer que la comida sea irresistible en imagen.", date: "2026-03-01", category: "Comida" },
    ],
  },
  {
    id: "p6",
    name: "Elena Castillo",
    avatar: "https://images.unsplash.com/photo-1617461073601-b8222743b613?w=200&h=200&fit=crop&crop=face&h=200&w=200",
    coverPhoto: "https://images.unsplash.com/photo-1574504212584-29a03eb6e41e?w=1200&h=500&fit=crop",
    city: "Bilbao",
    country: "España",
    distance: 22.0,
    rating: 4.8,
    reviewCount: 31,
    specialties: ["Eventos", "Retratos", "Documental"],
    priceFrom: 250,
    bio: "Capturo la energía y emoción de los eventos en tiempo real. Desde conciertos hasta conferencias corporativas, mi objetivo es que cada imagen cuente la historia completa del momento.",
    verified: false,
    responseTime: "< 6 horas",
    yearsExperience: 6,
    instagram: "@elenacastillofoto",
    lat: 43.2627,
    lng: -2.9253,
    portfolio: [
      { id: "pi20", url: "https://images.unsplash.com/photo-1574504212584-29a03eb6e41e?w=600&h=400&fit=crop", title: "Festival de música", category: "Eventos" },
      { id: "pi21", url: "https://images.unsplash.com/photo-1665173671867-d61792be97a3?w=600&h=400&fit=crop", title: "Reportaje urbano", category: "Documental" },
      { id: "pi22", url: "https://images.unsplash.com/photo-1646526822732-4eb6415320a2?w=600&h=400&fit=crop", title: "Sesión individual", category: "Retratos" },
    ],
    reviews: [
      { id: "r7", author: "Festival Nordik", avatar: "https://images.unsplash.com/photo-1773336099065-57893268749f?w=80&h=80&fit=crop&crop=face", rating: 5, text: "Elena cubrió nuestro festival de dos días y cada foto es pura emoción. Seguiremos contando con ella cada año.", date: "2026-03-10", category: "Eventos" },
    ],
  },
  {
    id: "p7",
    name: "Diego Herrera",
    avatar: "https://images.unsplash.com/photo-1758613654584-86714842a2d5?w=200&h=200&fit=crop&crop=face&sat=-100",
    coverPhoto: "https://images.unsplash.com/photo-1665173671867-d61792be97a3?w=1200&h=500&fit=crop",
    city: "Zaragoza",
    country: "España",
    distance: 11.4,
    rating: 4.5,
    reviewCount: 22,
    specialties: ["Documental", "Deportes", "Paisajes"],
    priceFrom: 200,
    bio: "Fotógrafo documental y de deportes con pasión por las historias humanas. He colaborado con medios de comunicación regionales y cubierto competiciones deportivas de nivel nacional.",
    verified: false,
    responseTime: "< 8 horas",
    yearsExperience: 3,
    lat: 41.6561,
    lng: -0.8773,
    portfolio: [
      { id: "pi23", url: "https://images.unsplash.com/photo-1665173671867-d61792be97a3?w=600&h=400&fit=crop", title: "Calle y vida", category: "Documental" },
      { id: "pi24", url: "https://images.unsplash.com/photo-1659025671240-54e686180c06?w=600&h=400&fit=crop", title: "Amanecer en el pico", category: "Paisajes" },
    ],
    reviews: [],
  },
  {
    id: "p8",
    name: "Natalia Vidal",
    avatar: "https://images.unsplash.com/photo-1773336099065-57893268749f?w=200&h=200&fit=crop&crop=face&sat=20",
    coverPhoto: "https://images.unsplash.com/photo-1763369642202-ca3df9b0ff34?w=1200&h=500&fit=crop",
    city: "Málaga",
    country: "España",
    distance: 30.6,
    rating: 4.9,
    reviewCount: 78,
    specialties: ["Arquitectura", "Paisajes", "Comida"],
    priceFrom: 270,
    bio: "Fusiono la fotografía de arquitectura con el diseño de interiores para crear imágenes que venden espacios y estilos de vida. Trabajo principalmente con agencias inmobiliarias premium y hoteles de lujo.",
    verified: true,
    responseTime: "< 2 horas",
    yearsExperience: 9,
    instagram: "@nataliavidalphoto",
    lat: 36.7213,
    lng: -4.4214,
    portfolio: [
      { id: "pi25", url: "https://images.unsplash.com/photo-1763369642202-ca3df9b0ff34?w=600&h=400&fit=crop", title: "Villa de lujo", category: "Arquitectura" },
      { id: "pi26", url: "https://images.unsplash.com/photo-1659025671240-54e686180c06?w=600&h=400&fit=crop", title: "Costa mediterránea", category: "Paisajes" },
      { id: "pi27", url: "https://images.unsplash.com/photo-1565506130372-ee45c65c4f29?w=600&h=400&fit=crop", title: "Gastronomía de hotel", category: "Comida" },
      { id: "pi28", url: "https://images.unsplash.com/photo-1763369642202-ca3df9b0ff34?w=600&h=800&fit=crop", title: "Piscina infinita", category: "Arquitectura" },
    ],
    reviews: [
      { id: "r8", author: "Hotel Príncipe", avatar: "https://images.unsplash.com/photo-1575299833801-85ce40813bac?w=80&h=80&fit=crop&crop=face", rating: 5, text: "Natalia redefinió la imagen visual de nuestro hotel. Sus fotos hablan de lujo sin decirlo explícitamente.", date: "2026-02-14", category: "Arquitectura" },
    ],
  },
];

export const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    name: "Básico",
    price: 80,
    period: "mes",
    description: "Perfecto para empezar",
    features: [
      "Perfil público verificado",
      "Hasta 20 fotos en portafolio",
      "Apareces en búsquedas locales",
      "Estadísticas básicas de visitas",
      "Soporte por email",
    ],
    notIncluded: [
      "Posicionamiento destacado",
      "Insignia de verificación Pro",
      "Estadísticas avanzadas",
    ],
    color: "gray",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 160,
    period: "mes",
    description: "Para fotógrafos en crecimiento",
    features: [
      "Todo lo del plan Básico",
      "Hasta 100 fotos en portafolio",
      "Posicionamiento destacado en búsquedas",
      "Insignia ✓ Verificado Pro",
      "Estadísticas avanzadas de visitas",
      "Integración con redes sociales",
      "Soporte prioritario",
    ],
    notIncluded: ["Portafolio ilimitado", "Anuncios en landing"],
    color: "amber",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 220,
    period: "mes",
    description: "Máxima visibilidad y herramientas",
    features: [
      "Todo lo del plan Pro",
      "Portafolio ilimitado",
      "Apareces en el banner de la landing",
      "Perfil destacado en tu ciudad",
      "Soporte dedicado 24/7",
    ],
    notIncluded: [],
    color: "purple",
    popular: false,
  },
];