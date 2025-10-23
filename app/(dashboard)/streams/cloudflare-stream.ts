export interface CloudflareStreamResponse {
  errors: CloudflareError[];
  messages: CloudflareMessage[];
  success: boolean;
  range: number;
  result: Stream[];
  total: number;
  result_info?: ResultInfo;
}

export interface CloudflareError {
  code: number;
  message: string;
  documentation_url: string;
  source: {
    pointer: string;
  };
}

export interface CloudflareMessage {
  code: number;
  message: string;
  documentation_url: string;
  source: {
    pointer: string;
  };
}

export interface Stream {
  allowedOrigins: string[];
  created: string; // ISO 8601 date string
  creator: string;
  duration: number;
  input: StreamInput;
  liveInput: string;
  maxDurationSeconds: number;
  meta: StreamMeta;
  modified: string; // ISO 8601 date string
  playback: StreamPlayback;
  preview: string;
  readyToStream: boolean;
  readyToStreamAt: string; // ISO 8601 date string
  requireSignedURLs: boolean;
  scheduledDeletion: string; // ISO 8601 date string
  size: number;
  status: StreamStatus;
  thumbnail: string;
  thumbnailTimestampPct: number;
  uid: string;
  uploaded: string; // ISO 8601 date string
  uploadExpiry: string; // ISO 8601 date string
  watermark: StreamWatermark;
}

export interface StreamInput {
  height: number;
  width: number;
}

export interface StreamMeta {
  name: string;
  [key: string]: any; // Allow additional custom metadata
}

export interface StreamPlayback {
  dash: string;
  hls: string;
}

export interface StreamStatus {
  errorReasonCode: string;
  errorReasonText: string;
  pctComplete: string;
  state: StreamState;
}

export type StreamState =
  | 'inprogress'
  | 'ready'
  | 'error'
  | 'queued'
  | 'downloading';

export interface StreamWatermark {
  created: string; // ISO 8601 date string
  downloadedFrom: string;
  height: number;
  name: string;
  opacity: number;
  padding: number;
  position: WatermarkPosition;
  scale: number;
  size: number;
  uid: string;
  width: number;
}

export type WatermarkPosition =
  | 'center'
  | 'upperRight'
  | 'upperLeft'
  | 'lowerRight'
  | 'lowerLeft';

export interface ResultInfo {
  page: number;
  per_page: number;
  count: number;
  total_count: number;
}
