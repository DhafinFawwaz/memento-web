export type MediaSources = {
    videos: string[],
    images: string[]
}

export type Memento = {
    uuid: string,
    created_at: string,
    updated_at: string,
    medias: MediaSources,
    revenue: number
}