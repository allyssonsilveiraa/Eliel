
import React from 'react';
import { IconPhotoStudio } from './Icon';

interface HeaderProps {
    onNewProject: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewProject }) => {
    return (
        <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <IconPhotoStudio className="w-8 h-8 text-amber-400" />
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                        Estúdio de Retratos Profissionais com IA
                    </h1>
                </div>
                <button
                    onClick={onNewProject}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                >
                    Novo Projeto
                </button>
            </div>
        </header>
    );
};

export default Header;