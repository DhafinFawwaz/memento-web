"use client";

import Image from "next/image";

export function DownloadButton({ onClick }: { onClick?: () => void }) {
    return <button onClick={onClick} className="w-full bg-indigo-600 px-4 h-10 rounded-xl font-bold hover:bg-indigo-700  active:bg-indigo-800">Download</button>
}

async function download(src: string) {
    const a = document.createElement('a');
    a.href = src + "?download=";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function Downloadable({ src, size, onDownloadFail }: { src: string, size: number, onDownloadFail?: () => void }) {
    
    const isVideo = src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".ogg");
    
    return <div className="w-full flex flex-col gap-4">
    {isVideo ? 
    <video src={src} autoPlay loop muted width={size} height={size} className="h-80 object-contain"></video>
    :
    <Image src={src} alt={src} width={size} height={size} className="h-80 object-contain"/>
    }
    <DownloadButton onClick={() => download(src).catch(onDownloadFail)}/>
</div>
}
export function DownloadableSmall({ src, size, onDownloadFail }: { src: string, size: number, onDownloadFail?: () => void }) {
    return <div className="w-64 flex flex-col gap-4">
    {/* <Image src={src} alt={src} width={size} height={size} className="h-40 object-contain"/> */}
    <video src={src} autoPlay loop muted></video>
    <DownloadButton onClick={() => download(src).catch(onDownloadFail)}/>
</div>
}