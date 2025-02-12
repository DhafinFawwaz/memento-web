"use client";

import { Memento } from "../types";
import { Downloadable, DownloadableSmall } from "./components/downloadable";


export default function MementoUserClient({ memento }: { memento: Memento }) {
    const size = 2000;
    // const result1 = "https://sample-videos.com/gif/3.gif"
    // const result2 = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ6ZRX_uoF1w0RrryJ5uOcVbcyH--EdHElNfRiZESFP04SxsWWV4kXN_-_oXmkLzzdVNP8DkwOcZusq5f_LqahCtQ"
    // const materials = [result1, result2, result1, result1, result2, result1]

    const result1 = memento.medias.results[0];
    const result2 = memento.medias.results[1];
    const materials = memento.medias.materials;

    function showError() {
        alert("Failed to download");
    }

    return <>

<div className="w-screen h-full flex justify-center items-center">
    <div className="max-w-6xl w-full mt-4">
        <div className="w-full flex justify-center items-center flex-col mb-4">
            <h1 className="font-bold text-2xl px-4">Silakan Download Hasilnya!</h1>
            <h3 className="text-sm font-thin">File akan dihapus setelah 7 hari!</h3>
        </div>
    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-12 px-8">
        <Downloadable onDownloadFail={showError} src={result1} size={size}/>
        <Downloadable onDownloadFail={showError} src={result2} size={size}/>
    </div>

    <br />

    <div className="w-full h-0.5 bg-slate-800 mb-8 rounded-full"></div>

    {/* Flex */}
    <div className="flex w-full gap-4 flex-wrap justify-center mb-8">
        { materials.map((src, idx) => <DownloadableSmall key={idx} src={src} size={size} onDownloadFail={showError}/>) }
    </div>
    
    </div>
</div>
    </>
}