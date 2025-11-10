
import React from 'react';
import { Gender, ClothingOption } from '../types';
import { CLOTHING_OPTIONS } from '../constants';

interface ConfigStepProps {
    originalImageUrl: string;
    gender: Gender | null;
    setGender: (gender: Gender) => void;
    clothing: string | null;
    setClothing: (clothing: string) => void;
    onSubmit: () => void;
    onBack: () => void;
}

const ConfigStep: React.FC<ConfigStepProps> = ({ originalImageUrl, gender, setGender, clothing, setClothing, onSubmit, onBack }) => {
    
    const isReady = gender && clothing;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-amber-400 mb-2 text-center">Passo 2: Escolha Seu Estilo</h2>
            <p className="text-slate-400 mb-8 text-center">Selecione o gênero e o estilo de roupa para o seu retrato profissional.</p>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                    <img src={originalImageUrl} alt="Original" className="rounded-lg shadow-lg w-full object-cover aspect-[3/4]" />
                    <p className="text-sm text-slate-500 mt-2 text-center">Sua foto enviada</p>
                </div>

                <div className="md:col-span-2 bg-slate-800 p-6 rounded-lg flex flex-col">
                    <div className="flex-grow">
                        <div className="mb-6">
                            <h3 className="font-bold text-lg mb-3 text-white">Gênero</h3>
                            <div className="flex gap-4">
                                {(['Homem', 'Mulher'] as Gender[]).map((g) => (
                                    <button key={g} onClick={() => { setGender(g); setClothing(null); }} className={`w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 ${gender === g ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
                                        {g === 'Homem' ? 'Masculino' : 'Feminino'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {gender && (
                            <div className="mb-6">
                                <h3 className="font-bold text-lg mb-3 text-white">Estilo de Roupa</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {CLOTHING_OPTIONS[gender].map((option: ClothingOption) => (
                                        <button key={option.key} onClick={() => setClothing(option.key)} className={`py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 text-left ${clothing === option.key ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
                                            {option.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-4">
                        <button
                            onClick={onSubmit}
                            disabled={!isReady}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
                        >
                           Gerar Retratos
                        </button>
                        <button onClick={onBack} className="w-full text-center text-slate-400 hover:text-white transition-colors">
                            &larr; Voltar para o Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigStep;