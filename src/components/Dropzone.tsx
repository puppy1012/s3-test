import React from "react";


interface Props { onFiles: (files: FileList) => void }
export const Dropzone: React.FC<Props> = ({ onFiles }) => {
    const [dragOver, setDragOver] = React.useState(false);
    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files); }}
            className={`mb-6 w-full rounded-2xl border border-white/10 p-6 sm:p-8 transition relative overflow-hidden ${dragOver ? "bg-white/[0.08] ring-1 ring-white/20" : "bg-white/[0.04]"}`}
        >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-cyan-400/5 to-emerald-400/10 opacity-50" />
            <div className="relative z-10 text-center">
                <p className="text-sm text-slate-300">이곳에 파일을 끌어다 놓거나 <span className="font-medium text-slate-100">업로드</span> 버튼을 클릭하세요.</p>
                <p className="mt-1 text-xs text-slate-400">JPG, PNG, GIF, WEBP 등 이미지 우선 표시</p>
            </div>
        </div>
    );
};