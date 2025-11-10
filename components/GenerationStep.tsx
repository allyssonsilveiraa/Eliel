
import React from 'react';
import { GeneratedImage } from '../types';
import { IconCheck, IconX } from './Icon';

interface GenerationStepProps {
    images: GeneratedImage[];
    onApprove: (image: GeneratedImage) => void;
    onReject: (image: GeneratedImage) => void;
    onComplete: () => void;
    approvedCount: number;
    onBack: () => void;
}

const ImageCard: React.FC<{
    image: GeneratedImage;
    onApprove: (image: GeneratedImage) => void;
    onReject: (image: GeneratedImage) => void;
    isApprovalDisabled: boolean;
}> = ({ image, onApprove, onReject, isApprovalDisabled }) => {
    const isPending = image.status === 'pending';
    const isApproved = image.status === 'approved';
    const isRejected = image.status === 'rejected';

    return (
        <div className="relative group">
            <img src={`data:image/png;base64,${image.base64}`} alt="Generated portrait" className={`rounded-lg shadow-lg w-full object-cover aspect-[3/4] transition-all duration-300 ${isRejected ? 'opacity-40 grayscale' : 'opacity-100'}`} />
            {isApproved && (
                 <div className="absolute inset-0 bg-green-900/50 flex items-center justify-center rounded-lg">
                     <span className="text-white font-bold text-xl">Aprovado</span>
                 </div>
            )}
            {isPending && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 rounded-lg">
                    <button onClick={() => onApprove(image)} disabled={isApprovalDisabled} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-full p-4 transition-transform hover:scale-110">
                        <IconCheck className="w-6 h-6" />
                    </button>
                    <button onClick={() => onReject(image)} className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-transform hover:scale-110">
                        <IconX className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};

const GenerationStep: React.FC<GenerationStepProps> = ({ images, onApprove, onReject, onComplete, approvedCount, onBack }) => {
    const isApprovalDisabled = approvedCount >= 5;

    return (
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-amber-400 mb-2">Passo 3: Aprove Seus Favoritos</h2>
            <p className="text-slate-400 mb-8">Revise os retratos gerados. Aprove até 5 para adicioná-los à sua galeria para o passo final.</p>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                {images.map(img => (
                    <ImageCard key={img.id} image={img} onApprove={onApprove} onReject={onReject} isApprovalDisabled={isApprovalDisabled} />
                ))}
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg flex items-center justify-between gap-6 sticky bottom-4 z-10 max-w-lg mx-auto shadow-lg w-full">
                <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors font-semibold">&larr; Voltar</button>
                <p className="font-semibold text-white">
                    Aprovados: <span className="text-amber-400">{approvedCount} / 5</span>
                </p>
                <button
                    onClick={onComplete}
                    disabled={approvedCount === 0}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                    Criar Variações &rarr;
                </button>
            </div>
             {isApprovalDisabled && approvedCount >= 5 && <p className="text-amber-400 mt-4">Você atingiu o número máximo de aprovações.</p>}
        </div>
    );
};

export default GenerationStep;