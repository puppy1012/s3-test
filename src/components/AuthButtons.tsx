import React from "react";


type Provider = "kakao" | "naver" | "google";
interface Props { onClick: (p: Provider) => void; userName?: string | null }


export const AuthButtons: React.FC<Props> = ({ onClick, userName }) => {
    if (userName) return null;
    return (
        <div className="flex items-center gap-2">
            <button onClick={() => onClick("kakao")} className="h-9 px-3 rounded-xl text-sm font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 flex items-center gap-2" title="카카오 로그인">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#FEE500] text-[#191600] font-bold">K</span>
                <span className="hidden sm:inline">카카오</span>
            </button>
            <button onClick={() => onClick("naver")} className="h-9 px-3 rounded-xl text-sm font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 flex items-center gap-2" title="네이버 로그인">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#03C75A] text-white font-bold">N</span>
                <span className="hidden sm:inline">네이버</span>
            </button>
            <button onClick={() => onClick("google")} className="h-9 px-3 rounded-xl text-sm font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 flex items-center gap-2" title="Google 로그인">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white text-slate-800 font-bold">G</span>
                <span className="hidden sm:inline">Google</span>
            </button>
        </div>
    );
};