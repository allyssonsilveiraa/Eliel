
import { ClothingOption, Gender } from './types';

export const CLOTHING_OPTIONS: Record<Gender, ClothingOption[]> = {
  'Homem': [
    { key: 'terno_azul_camisa_branca', name: 'Terno Azul, Camisa Branca' },
    { key: 'terno_bege_camisa_preta', name: 'Terno Bege, Camisa Preta' },
    { key: 'terno_cinza_claro_camisa_branca', name: 'Terno Cinza Claro, Camisa Branca' },
    { key: 'terno_arabesco_camisa_preta', name: 'Terno Estampado, Camisa Preta' },
  ],
  'Mulher': [
    { key: 'social_preto', name: 'Social Preto' },
    { key: 'tons_claros_luxo', name: 'Tons Claros de Luxo' },
    { key: 'brilho_sutil', name: 'Tecido com Brilho Sutil' },
    { key: 'cortes_clean', name: 'Corte Clean' },
  ]
};

export const PROMPT_BASE_COMMON = `professional headshot, studio photography, soft Rembrandt lighting, dark neutral background, extremely sharp, no distracting background, professional appearance, atmosphere of luxury and elegance, controlled low-light, natural expression, editorial quality, hyperrealistic, 8k. The subject's face must be identical to the reference image.`;

export const PROMPT_MASCULINO_VARIANT = `formal men's suit, confident look, upright posture, impeccably tailored suit, visible fabric texture, 3:4 aspect ratio, slight 45-degree angle, lighting that highlights facial contours.`;

export const PROMPT_FEMININO_VARIANT = `formal women's attire in luxury tones, professional soft makeup, elegant hairstyle, serene and confident expression, fine fabric textures, 3:4 aspect ratio, slight 30 to 45-degree angle.`;

export const PROMPT_VARIATION_TYPE_1 = `Generate a subtle variation of the provided image, maintaining the original subject's identity and facial features perfectly. Change ONLY the background to a discreet luxury office, dark wood paneling, or a subtle library. Do not alter the subject, their pose, or their clothing.`;

export const PROMPT_VARIATION_TYPE_2 = `Generate a subtle variation of the provided image, maintaining the original subject's identity and facial features perfectly. Change the background to a discreet luxury office or dark wood paneling AND introduce a minor change in pose, such as a head tilt of +/- 10 degrees or a slight change in camera angle.`;

export const PROMPT_VARIATION_TYPE_3 = `Generate a subtle variation of the provided image, maintaining the original subject's identity and facial features perfectly. Change the background, adjust the pose or camera angle slightly, AND subtly alter the clothing by changing its color or fine details.`;

export const PROMPT_VARIATIONS = [PROMPT_VARIATION_TYPE_1, PROMPT_VARIATION_TYPE_2, PROMPT_VARIATION_TYPE_3];