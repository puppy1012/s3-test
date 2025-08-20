import React from "react";
import { IconClose } from "./icons";


type Provider = "kakao" | "naver" | "google";
const BRAND = {
    kakao: { label: "카카오", bg: "#FEE500", fg: "#191600", ring: "#00000022" },
    naver: { label: "네이버", bg: "#03C75A", fg: "#0B3B23", ring: "#00000022" },
    google: { label: "Google", bg: "#FFFFFF", fg: "#1f2937", ring: "#00000022" },
} as const;


type Props = {
    provider: Provider | null;
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onLogin: () => void;
};


const AuthPopup: React.FC<Props> = ({ provider, open, loading, onClose, onLogin }) => {
    if (!open || !provider) return null;
    const meta = BRAND[provider];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
<span className="inline-flex h-7 w-7 items-center justify-center rounded-lg ring-1" style={{ background: meta.bg, color: meta.fg, boxShadow: `0 0 0 1px ${meta.ring} inset` }}>
{provider === "google" ? "G" : provider === "naver" ? "N" : "K"}
</span>
                        <p className="text-sm font-semibold text-slate-100">{meta.label} 로그인</p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-slate-200" onClick={onClose}>
                        <IconClose className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 bg-slate-950">
                    <p className="text-sm text-slate-300">계속하려면 {meta.label} 계정으로 로그인하세요.</p>
                    <button onClick={onLogin} disabled={loading} className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ring-1 ring-white/15 bg-white/10 hover:bg-white/15 text-slate-100 disabled:opacity-60">
                        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />}
                        {loading ? "확인 중..." : `${meta.label}로 계속`}
                    </button>

                </div>
            </div>
        </div>
    );
};


export default AuthPopup;