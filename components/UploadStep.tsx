
import React, { useState, useCallback } from 'react';
import Spinner from './Spinner';
import { IconUpload, IconCheckCircle, IconXCircle } from './Icon';

interface UploadStepProps {
    onImageUpload: (file: File, allowGlasses: boolean) => void;
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
}

const QualityChecklistItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center gap-2">
        <IconCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
        <span>{children}</span>
    </li>
);

const UploadStep: React.FC<UploadStepProps> = ({ onImageUpload, isLoading, loadingMessage, error }) => {
    const [dragActive, setDragActive] = useState(false);
    const [allowGlasses, setAllowGlasses] = useState(false);

    const handleFile = useCallback((files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                onImageUpload(file, allowGlasses);
            }
        }
    }, [onImageUpload, allowGlasses]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFile(e.dataTransfer.files);
    }, [handleFile]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files);
    }, [handleFile]);

    return (
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-amber-400 mb-2">Passo 1: Envie Sua Foto</h2>
            <p className="text-slate-400 mb-8">Envie uma foto de alta qualidade para começar. Siga as diretrizes abaixo para obter os melhores resultados.</p>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div 
                    onDragEnter={handleDrag} 
                    onDragLeave={handleDrag} 
                    onDragOver={handleDrag} 
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-8 transition-colors duration-300 ${dragActive ? 'border-amber-400 bg-slate-700' : 'border-slate-600 hover:border-amber-500'}`}
                >
                    <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleChange} disabled={isLoading} />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                        <IconUpload className="w-12 h-12 text-slate-400 mb-4" />
                        <span className="font-semibold text-white">Arraste e solte ou clique para enviar</span>
                        <span className="text-sm text-slate-500 mt-1">PNG, JPG, WEBP</span>
                        {isLoading && <Spinner message={loadingMessage} />}
                    </label>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg text-left">
                    <h3 className="font-bold text-lg mb-4 text-white">Checklist de Qualidade</h3>
                    <ul className="space-y-3 text-slate-300">
                        <QualityChecklistItem>Apenas uma pessoa na foto</QualityChecklistItem>
                        <QualityChecklistItem>Imagem nítida e clara (não embaçada)</QualityChecklistItem>
                        <QualityChecklistItem>Rosto claramente visível e descoberto</QualityChecklistItem>
                        <QualityChecklistItem>Fundo neutro é preferível</QualityChecklistItem>
                    </ul>
                     <div className="mt-4 border-t border-slate-700 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                                type="checkbox"
                                checked={allowGlasses}
                                onChange={(e) => setAllowGlasses(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                            />
                            <span>Permitir óculos na foto</span>
                        </label>
                    </div>
                </div>
            </div>
            
            {error && (
                <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
                    <IconXCircle className="w-6 h-6" />
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default UploadStep;