export interface VideoResult {
  video_id: string;
  playback_url?: string;
  duration?: number;
}

export interface UploadResponse {
  task_id: string;
  status: string;
  message?: string;
}

export interface StatusResponse {
  status: 'success' | 'failed' | 'processing' | 'pending';
  result?: VideoResult;
  error?: string;
}
