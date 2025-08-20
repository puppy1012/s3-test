// src/components/S3Tester.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconSparkle } from "./icons";
import { AuthButtons } from "./AuthButtons";
import AuthPopup from "./AuthPopup";
import { Dropzone } from "./Dropzone";
import { GalleryGrid } from "./GalleryGrid";
import { Lightbox } from "./Lightbox";
import {
    s3,
    BUCKET,
    ListObjectsV2Command,
    PutObjectCommand,
    DeleteObjectCommand,
    S3Object,
} from "./s3Client";
import type { PreviewData } from "./GalleryGrid";

const PROVIDERS = ["kakao", "naver", "google"] as const;
export type Provider = (typeof PROVIDERS)[number];

export default function S3Tester() {
    // 파일 목록
    const [files, setFiles] = useState<S3Object[]>([]);
    const [loading, setLoading] = useState(false);
    const [nextToken, setNextToken] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);

    // 프리뷰
    const [preview, setPreview] = useState<PreviewData | null>(null);

    // 로그인 목업
    const [userName, setUserName] = useState<string | null>(null);
    const [authOpen, setAuthOpen] = useState(false);
    const [authProvider, setAuthProvider] = useState<Provider | null>(null);
    const [authLoading, setAuthLoading] = useState(false);
    const isAuthed = !!userName;

    // 업로드
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFilePick = () => fileInputRef.current?.click();

    const uploadFile = async (file: File) => {
        const key = `uploads/${Date.now()}_${file.name}`;
        try {
            const buffer = new Uint8Array(await file.arrayBuffer());
            await s3.send(
                new PutObjectCommand({
                    Bucket: BUCKET,
                    Key: key,
                    Body: buffer,
                    ContentType: file.type,
                })
            );
            await fetchFiles();
        } catch (e) {
            console.error("업로드 실패:", e);
            alert("업로드 실패");
        }
    };

    // 드롭존 파일 처리
    const handleDropFiles = async (list: FileList) => {
        const arr = Array.from(list);
        for (const f of arr) await uploadFile(f);
    };

    // 삭제
    const deleteFile = async (key: string) => {
        if (!window.confirm("삭제할까요?")) return;
        try {
            await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
            setFiles((prev) => prev.filter((f) => f.Key !== key));
            if (preview?.key === key) setPreview(null);
        } catch (e) {
            console.error("삭제 실패:", e);
            alert("삭제 실패");
        }
    };

    // 목록 조회 (로그인 후에만)
    const fetchFiles = useCallback(
        async (token?: string) => {
            if (!isAuthed) return;
            setLoading(true);
            try {
                const res = await s3.send(
                    new ListObjectsV2Command({
                        Bucket: BUCKET,
                        Prefix: "uploads/",
                        MaxKeys: 30,
                        ContinuationToken: token,
                    })
                );
                const contents = res.Contents || [];
                setFiles((prev) => (token ? [...prev, ...contents] : contents));
                setNextToken(res.NextContinuationToken);
                setHasMore(Boolean(res.IsTruncated) && Boolean(res.NextContinuationToken));
            } catch (e) {
                console.error("파일 목록 조회 실패:", e);
            } finally {
                setLoading(false);
            }
        },
        [isAuthed]
    );

    useEffect(() => {
        if (isAuthed) {
            fetchFiles();
        } else {
            setFiles([]);
            setPreview(null);
            setHasMore(true);
            setNextToken(undefined);
        }
    }, [isAuthed, fetchFiles]);

    // 소셜 팝업
    const openAuth = (p: Provider) => {
        setAuthProvider(p);
        setAuthOpen(true);
        setAuthLoading(false);
    };
    const closeAuth = () => {
        if (!authLoading) {
            setAuthOpen(false);
            setAuthProvider(null);
        }
    };
    const doMockLogin = async () => {
        setAuthLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setUserName("이승현");
        setAuthLoading(false);
        setAuthOpen(false);
        fetchFiles();
    };

    // 로그아웃
    const handleLogout = () => {
        setUserName(null);
        setFiles([]);
        setPreview(null);
        setHasMore(true);
        setNextToken(undefined);
    };

    return (
        <div className="dark">
            <div
                className="min-h-screen text-slate-100 bg-slate-950 relative"
                style={{
                    backgroundImage:
                        "radial-gradient(1200px_600px_at_-10%_-20%,rgba(99,102,241,0.18),transparent),radial-gradient(800px_400px_at_110%_120%,rgba(16,185,129,0.15),transparent)",
                }}
            >
                {/* 헤더 */}
                <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md bg-slate-900/40 border-b border-white/10">
                    {/* 상단 1열: 로고/인사/로그인/로그아웃 */}
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-fuchsia-500/60 to-cyan-400/60 ring-1 ring-white/20">
                <IconSparkle className="h-4 w-4 text-white" />
              </span>
                            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-cyan-300 to-emerald-300">
                  S3 인스타 갤러리
                </span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            {isAuthed ? (
                                <>
                                    <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-sm text-slate-300">
                      안녕하세요
                    </span>
                                        <div className="flex items-center gap-3">
                                            {/* 이니셜 아바타 */}
                                            {/*<div className="h-8 w-8 rounded-full bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-sm font-semibold">*/}
                                            {/*    {userName?.[0] ?? "U"}*/}
                                            {/*</div>*/}
                                            {/* 넓은 이름 영역 */}
                                            <div className="min-w-[100px] max-w-[180px] h-8 px-3 rounded-full
                bg-white/10 ring-1 ring-white/15
                text-sm font-medium flex items-center justify-center truncate">
                                                {userName} 님
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/15 text-sm"
                                        title="로그아웃"
                                    >
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <AuthButtons onClick={openAuth} userName={userName} />
                            )}
                        </div>
                    </div>

                    {/* 하단 2열: 업로드 툴바 (로그인 시에만 표시) */}
                    {isAuthed && (
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 border-t border-white/10 bg-slate-900/30">
                            <div className="flex justify-end">
                                <button
                                    onClick={handleFilePick}
                                    className="h-9 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 disabled:opacity-50 ring-1 ring-white/15 shadow-sm"
                                >
                                    업로드
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                            await uploadFile(f);
                                            e.currentTarget.value = "";
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </header>

                {/* 본문: 로그인 가드 */}
                {isAuthed ? (
                    <>
                        {/* 드롭존 */}
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
                            <Dropzone onFiles={handleDropFiles} />
                        </div>

                        {/* 갤러리 */}
                        <main className="mx-auto max-w-7xl px-2 sm:px-6 pb-16">
                            <GalleryGrid
                                files={files}
                                loading={loading}
                                onPreview={setPreview}
                                onDelete={deleteFile}
                            />
                            <div className="flex justify-center">
                                {hasMore && (
                                    <button
                                        disabled={loading}
                                        onClick={() => fetchFiles(nextToken)}
                                        className="mt-6 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/20 disabled:opacity-50 ring-1 ring-white/15 shadow-sm"
                                    >
                                        {loading ? "로딩 중..." : "더 보기"}
                                    </button>
                                )}
                            </div>
                        </main>

                        {/* 라이트박스 */}
                        <Lightbox
                            preview={preview}
                            onClose={() => setPreview(null)}
                            onDelete={deleteFile}
                        />
                    </>
                ) : (
                    // 환영 섹션 (로그인 전)
                    <section className="flex items-center justify-center min-h-screen px-4 sm:px-6">
                        <div className="max-w-3xl w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center ring-1 ring-white/10">
                            <h2 className="text-2xl font-semibold">환영합니다 👋</h2>
                            <p className="mt-3 text-slate-300">
                                소셜 로그인 후 <span className="font-medium">S3 갤러리</span>가 표시됩니다.
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                로그인 없이 데이터는 로드되지 않습니다.
                            </p>
                        </div>
                    </section>

                )}

                {/* 소셜 팝업 */}
                <AuthPopup
                    provider={authProvider}
                    open={authOpen}
                    loading={authLoading}
                    onClose={closeAuth}
                    onLogin={doMockLogin}
                />
            </div>
        </div>
    );
}
