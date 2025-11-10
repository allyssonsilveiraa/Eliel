
import React, { useState, useCallback, useMemo } from 'react';
import { AppStep, Gender, GeneratedImage } from './types';
import UploadStep from './components/UploadStep';
import ConfigStep from './components/ConfigStep';
import GenerationStep from './components/GenerationStep';
import GalleryStep from './components/GalleryStep';
import Header from './components/Header';
import { validateImage, generateInitialPortraits, generateVariations } from './services/geminiService';

const App: React.FC = () => {
    const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
    const [originalImage, setOriginalImage] = useState<{ file: File; url: string; base64: string } | null>(null);
    const [gender, setGender] = useState<Gender | null>(null);
    const [clothing, setClothing] = useState<string | null>(null);
    const [initialGenerations, setInitialGenerations] = useState<GeneratedImage[]>([]);
    const [approvedGallery, setApprovedGallery] = useState<GeneratedImage[]>([]);
    const [variations, setVariations] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const resetState = () => {
        setStep(AppStep.UPLOAD);
        setOriginalImage(null);
        setGender(null);
        setClothing(null);
        setInitialGenerations([]);
        setApprovedGallery([]);
        setVariations([]);
        setIsLoading(false);
        setLoadingMessage('');
        setError(null);
    };

    const handleImageUpload = useCallback(async (file: File, allowGlasses: boolean) => {
        setIsLoading(true);
        setLoadingMessage('Validando imagem...');
        setError(null);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const { isValid, reason } = await validateImage(base64, allowGlasses);
                if (isValid) {
                    setOriginalImage({ file, url: URL.createObjectURL(file), base64 });
                    setStep(AppStep.CONFIG);
                } else {
                    setError(`A validação falhou: ${reason}`);
                }
                setIsLoading(false);
            };
            reader.onerror = () => {
                setError('Falha ao ler o arquivo.');
                setIsLoading(false);
            };
        } catch (e) {
            setError('Ocorreu um erro durante a validação da imagem.');
            setIsLoading(false);
        }
    }, []);

    const handleConfigSubmit = useCallback(async () => {
        if (!originalImage || !gender || !clothing) return;
        setIsLoading(true);
        setLoadingMessage('Gerando retratos iniciais...');
        setError(null);
        try {
            const results = await generateInitialPortraits(originalImage.base64, gender, clothing);
            setInitialGenerations(results);
            setStep(AppStep.GENERATE);
        } catch (e) {
            setError('Falha ao gerar os retratos iniciais. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, gender, clothing]);
    
    const handleApprove = useCallback((image: GeneratedImage) => {
        if (approvedGallery.length < 5) {
            setApprovedGallery(prev => [...prev, { ...image, status: 'approved' }]);
            setInitialGenerations(prev => prev.map(img => img.id === image.id ? { ...img, status: 'approved' } : img));
        }
    }, [approvedGallery.length]);

    const handleReject = useCallback((image: GeneratedImage) => {
         setInitialGenerations(prev => prev.map(img => img.id === image.id ? { ...img, status: 'rejected' } : img));
    }, []);

    const handleGenerateVariations = useCallback(async () => {
        if (approvedGallery.length === 0) return;
        setIsLoading(true);
        setLoadingMessage('Criando variações...');
        setError(null);
        try {
            const variationResults = await generateVariations(approvedGallery);
            setVariations(prev => [...prev, ...variationResults]);
        } catch (e) {
            setError('Falha ao gerar variações.');
        } finally {
            setIsLoading(false);
        }
    }, [approvedGallery]);

    const handleGoBack = () => {
        if (step === AppStep.GALLERY) {
            setStep(AppStep.GENERATE);
        } else if (step === AppStep.GENERATE) {
            setStep(AppStep.CONFIG);
        } else if (step === AppStep.CONFIG) {
            setStep(AppStep.UPLOAD);
        }
    };
    
    const renderStep = () => {
        switch (step) {
            case AppStep.UPLOAD:
                return <UploadStep onImageUpload={handleImageUpload} isLoading={isLoading} loadingMessage={loadingMessage} error={error} />;
            case AppStep.CONFIG:
                return originalImage && <ConfigStep originalImageUrl={originalImage.url} gender={gender} setGender={setGender} clothing={clothing} setClothing={setClothing} onSubmit={handleConfigSubmit} onBack={handleGoBack} />;
            case AppStep.GENERATE:
                return <GenerationStep images={initialGenerations} onApprove={handleApprove} onReject={handleReject} onComplete={() => setStep(AppStep.GALLERY)} approvedCount={approvedGallery.length} onBack={handleGoBack} />;
            case AppStep.GALLERY:
                 return <GalleryStep approvedImages={approvedGallery} variations={variations} onGenerateVariations={handleGenerateVariations} isLoading={isLoading} loadingMessage={loadingMessage} onBack={handleGoBack} />;
            default:
                return <UploadStep onImageUpload={handleImageUpload} isLoading={isLoading} loadingMessage={loadingMessage} error={error} />;
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans">
            <Header onNewProject={resetState} />
            <main className="container mx-auto px-4 py-8">
                {renderStep()}
            </main>
        </div>
    );
};

export default App;