
export enum AppStep {
  UPLOAD,
  CONFIG,
  GENERATE,
  GALLERY,
}

export type Gender = 'Homem' | 'Mulher';

export type ClothingOption = {
  key: string;
  name: string;
};

export type ImageStatus = 'pending' | 'approved' | 'rejected';

export interface GeneratedImage {
  id: string;
  base64: string;
  prompt: string;
  status: ImageStatus;
  isVariation: boolean;
}
