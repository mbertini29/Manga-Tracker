
export type Manga = {
    id: string;
    capitolo: number;
    completato: boolean;
};

export type JikanResponse = {
    data: {
        title:string,
        title_english: string | null;
        title_japanese: string | null;
        images: {
            jpg: {
                large_image_url: string;
            };
        };
    }[];
};
