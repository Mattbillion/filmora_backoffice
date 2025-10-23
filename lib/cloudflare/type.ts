export interface CloudflareError {
  code: number;
  message: string;
  documentation_url?: string;
  source?: {
    pointer?: string;
  };
}

export interface CloudflareMessage {
  code: number;
  message: string;
  documentation_url?: string;
  source?: {
    pointer?: string;
  };
}

export interface StreamInput {
  height: number;
  width: number;
}

export interface StreamPlayback {
  dash?: string;
  hls?: string;
}

export interface StreamMeta {
  name?: string;
}

export interface StreamStatus {
  errorReasonCode?: string;
  errorReasonText?: string;
  pctComplete?: string | number;
  state?: string; // e.g., 'inprogress', 'ready', 'error'
}

export interface StreamWatermark {
  created: string;
  downloadedFrom?: string;
  height: number;
  name?: string;
  opacity?: number;
  padding?: number;
  position?: string; // e.g., 'center', 'top-left'
  scale?: number;
  size?: number;
  uid: string;
  width: number;
}

export interface StreamVideo {
  allowedOrigins?: string[];
  created: string;
  creator?: string;
  duration: number;
  input?: StreamInput;
  liveInput?: string;
  maxDurationSeconds?: number;
  meta?: StreamMeta;
  modified?: string;
  playback?: StreamPlayback;
  preview?: string;
  readyToStream?: boolean;
  readyToStreamAt?: string;
  requireSignedURLs?: boolean;
  scheduledDeletion?: string;
  size?: number;
  status?: StreamStatus;
  thumbnail?: string;
  thumbnailTimestampPct?: number;
  uid: string;
  uploaded?: string;
  uploadExpiry?: string;
  watermark?: StreamWatermark;
}

export interface StreamResponse {
  result: StreamVideo[];
  success: boolean;
  errors: Array<{
    code: number;
    message: string;
    documentation_url?: string;
    source?: {
      pointer: string;
    };
  }>;
  messages: Array<{
    code: number;
    message: string;
    documentation_url?: string;
    source?: {
      pointer: string;
    };
  }>;
  range?: number; // The total number of remaining videos based on cursor position
  total?: number; // The total number of videos that match the provided filters
}
