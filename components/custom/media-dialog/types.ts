export type Media = {
    id: string;
    image_url: string;
    file_name: string;
    file_size: number;
    content_type: string;
    created_at: string;
}

export type Pagination = {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}

export type MediaResponse = {
    data: Media[];
    pagination: Pagination;
}