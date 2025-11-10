
import React from 'react';
import { GeneratedImage } from '../types';
import Spinner from './Spinner';
import { IconDownload } from './Icon';

interface GalleryStepProps {
    approvedImages: GeneratedImage[];
    variations: GeneratedImage[];
    onGenerateVariations: () => void;
    isLoading: boolean;
    loadingMessage: string;
    onBack: () => void;
}

const FinalImageCard: React.FC<{ image: GeneratedImage }> = ({ image }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${image.base64}`;
        link.download = `portrait-${image.id.substring(0, 8)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative group">
            <img src={`data:image/png;base64,${image.base64}`} alt="Final portrait" className="rounded-lg shadow-lg w-full object-cover aspect-[3/4]" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                <button onClick={handleDownload} className="bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 transition-transform hover:scale-110">
                    <IconDownload className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

const GalleryStep: React.FC<GalleryStepProps> = ({ approvedImages, variations, onGenerateVariations, isLoading, loadingMessage, onBack }) => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-amber-400 mb-2">Galeria Final</h2>
                <p className="text-slate-400 mb-8">Aqui estão seus retratos aprovados e suas variações geradas. Baixe seus favoritos!</p>
            </div>
            
            <div className="mb-12">
                <h3 className="text-2xl font-semibold text-white border-b-2 border-slate-700 pb-2 mb-6 text-left">Originais Aprovados</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {approvedImages.map(img => (
                        <FinalImageCard key={img.id} image={img} />
                    ))}
                </div>
            </div>

             {variations.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-2xl font-semibold text-white border-b-2 border-slate-700 pb-2 mb-6 text-left">Variações Geradas</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {variations.map(img => (
                            <FinalImageCard key={img.id} image={img} />
                        ))}
                    </div>
                </div>
            )}
            
            <div className="text-center mt-12">
                {isLoading ? (
                    <Spinner message={loadingMessage} />
                ) : (
                    <button
                        onClick={onGenerateVariations}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-200 text-lg"
                    >
                        Gerar Mais Variações
                    </button>
                )}
                 <button onClick={onBack} className="block w-full max-w-xs mx-auto mt-4 text-slate-400 hover:text-white transition-colors">
                    &larr; Voltar para Aprovações
                </button>
            </div>
        </div>
    );
};

export default GalleryStep;