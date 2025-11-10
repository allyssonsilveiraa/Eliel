
import React from 'react';

interface SpinnerProps {
    message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
    return (
        <div className="absolute inset-0 bg-slate-800/80 flex flex-col items-center justify-center z-20 rounded-lg">
            <div className="w-12 h-12 border-4 border-t-amber-400 border-r-slate-600 border-b-slate-600 border-l-slate-600 rounded-full animate-spin"></div>
            {message && <p className="mt-4 text-white font-semibold">{message}</p>}
        </div>
    );
};

export default Spinner;
