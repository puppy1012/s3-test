// ========================= src/components/GalleryGrid.tsx =========================
import React from "react";
import { S3Object, isImageFile, publicUrlOf } from "./s3Client";
import { IconTrash } from "./icons";

export interface PreviewData { key: string; url: string; size?: number; lastModified?: Date; isImage: boolean }

const SkeletonTile: React.FC = () => (
    <div className="relative w-full pb-[100%] overflow-hidden rounded-xl bg-slate-800/60 animate-pulse ring-1 ring-white/5" />
);

interface Props {
    files: S3Object[];
    loading: boolean;
    onPreview: (p: PreviewData) => void;
    onDelete: (key: string) => void;
}

export const GalleryGrid: React.FC<Props> = ({ files, loading, onPreview, onDelete }) => {
    if (files.length === 0 && !loading) return <p className="text-center text-slate-400">파일이 존재하지 않습니다</p>;
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2">
            {loading && files.length === 0 && Array.from({ length: 8 }).map((_, i) => <SkeletonTile key={i} />)}
            {files.map((f) => {
                const key = f.Key || ""; if (!key || key.endsWith("/")) return null;
                const name = key.replace(/^uploads\//, "");
                const url = publicUrlOf(key);
                const image = isImageFile(name);
                return (
                    <div key={key} className="group relative">
                        <div className="relative w-full pb-[100%] overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
                            {image ? (
                                <img src={url} alt={name} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" onClick={() => onPreview({ key, url, size: f.Size, lastModified: f.LastModified, isImage: true })} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                                <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center text-[11px] sm:text-xs text-cyan-300 underline">{name}</a>
                            )}
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-fuchsia-400/0 group-hover:ring-fuchsia-400/20 transition" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end">
                                <div className="flex w-full items-center justify-between p-2 text-white text-[11px] sm:text-xs">
                                    <span className="truncate max-w-[60%] sm:max-w-[70%] drop-shadow">{name}</span>
                                    <div className="flex items-center gap-2">
                                        {image && (
                                            <button title="미리보기" onClick={() => onPreview({ key, url, size: f.Size, lastModified: f.LastModified, isImage: true })} className="px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm">보기</button>
                                        )}
                                        <button title="삭제" onClick={() => onDelete(key)} className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm">
                                            <IconTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
