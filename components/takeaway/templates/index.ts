// /components/takeaway/templates/index.ts

import GridTemplate from './GridTemplate'
import CarouselTemplate from './CarouselTemplate'
import FeaturedTemplate from './FeaturedTemplate'

export const CATEGORY_TEMPLATES = {
    grid: GridTemplate,       // Grid estándar 3 columnas
    carousel: CarouselTemplate, // Scroll horizontal
    featured: FeaturedTemplate, // Cards grandes destacadas
    compact: GridTemplate      // Grid compacto 4 columnas
}

export type TemplateType = keyof typeof CATEGORY_TEMPLATES