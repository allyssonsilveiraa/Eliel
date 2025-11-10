
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { Gender, GeneratedImage } from "../types";
import { PROMPT_BASE_COMMON, PROMPT_MASCULINO_VARIANT, PROMPT_FEMININO_VARIANT, CLOTHING_OPTIONS, PROMPT_VARIATIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const textModel = 'gemini-2.5-flash';
const imageModel = 'gemini-2.5-flash-image';

export const validateImage = async (base64Image: string, allowGlasses: boolean): Promise<{ isValid: boolean; reason: string }> => {
    try {
        const faceRule = allowGlasses
            ? "4. rosto_descoberto: O rosto não deve ser coberto por chapéus ou outros objetos, mas óculos de grau são aceitáveis."
            : "4. rosto_descoberto: O rosto não deve ser coberto por chapéus, óculos de sol ou outros objetos.";

        const prompt = `Analise esta imagem para um gerador de retratos profissionais. Verifique estas regras:
1.  face_count: Deve ser exatamente 1.
2.  no_other_people: Não deve haver outras pessoas no fundo.
3.  sharpness: O assunto principal deve estar em foco, não embaçado.
${faceRule}
Responda SOMENTE com um objeto JSON neste formato: { "isValid": boolean, "reason": "string descrevendo o problema se não for válido" }`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: textModel,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isValid: { type: Type.BOOLEAN },
                        reason: { type: Type.STRING }
                    },
                    required: ["isValid", "reason"]
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result;
    } catch (error) {
        console.error("Error validating image:", error);
        return { isValid: false, reason: "Não foi possível analisar a imagem devido a um erro na API." };
    }
};

const generateImage = async (base64Image: string, prompt: string): Promise<string> => {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: imageModel,
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: prompt }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image generated");
};

export const generateInitialPortraits = async (base64Image: string, gender: Gender, clothingKey: string): Promise<GeneratedImage[]> => {
    const clothingName = CLOTHING_OPTIONS[gender].find(c => c.key === clothingKey)?.name || clothingKey;
    const genderPrompt = gender === 'Homem' ? PROMPT_MASCULINO_VARIANT : PROMPT_FEMININO_VARIANT;
    const fullPrompt = `${PROMPT_BASE_COMMON} The subject is wearing: ${clothingName}. ${genderPrompt}`;

    const promises = [
        generateImage(base64Image, fullPrompt),
        generateImage(base64Image, `${fullPrompt} Use a slightly different camera angle.`)
    ];

    const results = await Promise.all(promises);

    return results.map(base64 => ({
        id: crypto.randomUUID(),
        base64,
        prompt: fullPrompt,
        status: 'pending',
        isVariation: false,
    }));
};

export const generateVariations = async (approvedImages: GeneratedImage[]): Promise<GeneratedImage[]> => {
    const variationPromises: Promise<GeneratedImage>[] = [];
    const promptsToUse = [PROMPT_VARIATIONS[0], PROMPT_VARIATIONS[1]];

    for (const image of approvedImages) {
        for (const prompt of promptsToUse) {
            const promise = generateImage(image.base64, prompt)
                .then((newBase64): GeneratedImage => ({
                    id: crypto.randomUUID(),
                    base64: newBase64,
                    prompt: prompt,
                    status: 'approved',
                    isVariation: true,
                }));
            variationPromises.push(promise);
        }
    }

    return Promise.all(variationPromises);
};