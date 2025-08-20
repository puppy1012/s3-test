import React from "react";
import { formatBytes, formatKST } from "./s3Client";
import { IconClose, IconDownload, IconTrash } from "./icons";
import type { PreviewData } from "./GalleryGrid";

interface Props { preview: PreviewData | null; onClose: () => void; onDelete: (key: string) => void }

export const Lightbox: React.FC<Props> = ({ preview, onClose, onDelete }) => {
    if (!preview) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()} tabIndex={-1}>
            <div className="relative w-full max-w-5xl bg-slate-950 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-slate-100">{preview.key.replace(/^uploads\//, "")}</p>
                        <p className="text-xs text-slate-400">{formatKST(preview.lastModified)} · {formatBytes(preview.size)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={preview.url} download className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 text-slate-100 text-sm" title="다운로드">
                            <IconDownload className="w-4 h-4" /> 다운로드
                        </a>
                        <button onClick={() => onDelete(preview.key)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-sm" title="삭제">
                            <IconTrash className="w-4 h-4" /> 삭제
                        </button>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-100" title="닫기">
                            <IconClose className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="bg-black flex items-center justify-center" style={{ maxHeight: "80vh" }}>
                    {preview.isImage ? (
                        <img src={preview.url} alt="preview" className="max-h-[80vh] w-auto object-contain" />
                    ) : (
                        <div className="p-8 text-center text-sm text-slate-300">이 파일은 이미지가 아닙니다. <a className="text-cyan-300 underline" href={preview.url} target="_blank" rel="noreferrer">새 창에서 열기</a></div>
                    )}
                </div>
            </div>
        </div>
    );
};
