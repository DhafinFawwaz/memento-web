"use client";

import Image from "next/image";

export function DownloadButton({ onClick }: { onClick?: () => void }) {
    return <button onClick={onClick} className="w-full bg-indigo-600 px-4 h-10 rounded-xl font-bold hover:bg-indigo-700  active:bg-indigo-800">Download</button>
}

async function download(src: string) {
    const response = await fetch(src);
    if(!response.ok) throw new Error("Failed to download");
    try {
        const blob = await response.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = src;
        a.click();
    } catch(e) {
        throw new Error("Failed to download");
    }
}

export function Downloadable({ src, size, onDownloadFail }: { src: string, size: number, onDownloadFail?: () => void }) {
    return <div className="w-full flex flex-col gap-4">
    <Image src={src} alt={src} width={size} height={size} className="h-80 object-contain"/>
    <DownloadButton onClick={() => download(src).catch(onDownloadFail)}/>
</div>
}
export function DownloadableSmall({ src, size, onDownloadFail }: { src: string, size: number, onDownloadFail?: () => void }) {
    return <div className="w-64 flex flex-col gap-4">
    {/* <Image src={src} alt={src} width={size} height={size} className="h-40 object-contain"/> */}
    <video src={src} autoPlay loop></video>
    <DownloadButton onClick={() => download(src).catch(onDownloadFail)}/>
</div>
}