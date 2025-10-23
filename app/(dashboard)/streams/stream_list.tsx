// app/streams/StreamList.tsx
import StreamCard from '@/app/(dashboard)/streams/components/stream_card';
import { fetchStreams } from '@/lib/cloudflare';

import { Stream } from './cloudflare-stream';

type Props = {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  };
};

export async function StreamList({ searchParams }: Props) {
  const data = await fetchStreams(searchParams);

  console.log(data, 'data');

  // Handle error or no data
  if (!data) {
    return <div className="text-red-500">Failed to load streams</div>;
  }

  // Handle API errors
  if (!data.success) {
    return (
      <div className="text-red-500">
        <p>Failed to load streams</p>
        {data.errors?.map((error: any, i: number) => (
          <div key={i} className="mt-2">
            Error {error.code}: {error.message}
          </div>
        ))}
      </div>
    );
  }

  // Handle empty results
  if (!data.result || data.result.length === 0) {
    return <div className="text-gray-500">No streams found</div>;
  }

  return (
    <div>
      <p className="mb-4 text-gray-600">
        Showing {data.result.length} of {data.total} streams
      </p>

      <div className="grid grid-cols-5 gap-4">
        {data.result.map((stream: Stream) => (
          <StreamCard key={stream.uid} stream={stream} />
        ))}
      </div>
    </div>
  );
}

// Stream Card Component
// function StreamCard({ stream }: { stream: Stream }) {
//   return (
//     <div className="rounded-lg border p-4 shadow transition hover:shadow-md">
//       {/* Thumbnail */}
//       {stream.thumbnail && (
//         <img
//           src={stream.thumbnail}
//           alt={stream.meta?.name || 'Stream thumbnail'}
//           className="mb-4 h-48 w-full rounded object-cover"
//         />
//       )}
//
//       {/* Title */}
//       <h3 className="mb-2 text-lg font-semibold">
//         {stream.meta?.name || stream.uid}
//       </h3>
//
//       {/* Status Badge */}
//       <div className="mb-2">
//         <StatusBadge state={stream.status?.state} />
//       </div>
//
//       {/* Details */}
//       <div className="space-y-1 text-sm text-gray-600">
//         <p>Duration: {stream.duration}s</p>
//         <p>Size: {(stream.size / 1024 / 1024).toFixed(2)} MB</p>
//         <p>Created: {new Date(stream.created).toLocaleDateString()}</p>
//         <p>
//           Resolution: {stream.input?.width}x{stream.input?.height}
//         </p>
//       </div>
//
//       {/* Error Message */}
//       {stream.status?.state === 'error' && (
//         <div className="mt-3 rounded border border-red-200 bg-red-50 p-2">
//           <p className="font-medium text-red-700">
//             {stream.status.errorReasonCode}
//           </p>
//           <p className="text-sm text-red-600">
//             {stream.status.errorReasonText}
//           </p>
//         </div>
//       )}
//
//       {/* Progress Bar */}
//       {stream.status?.state === 'inprogress' && stream.status.pctComplete && (
//         <div className="mt-3">
//           <div className="h-2 w-full rounded-full bg-gray-200">
//             <div
//               className="h-2 rounded-full bg-blue-500 transition-all"
//               style={{ width: `${stream.status.pctComplete}%` }}
//             />
//           </div>
//           <p className="mt-1 text-xs text-gray-500">
//             Processing: {stream.status.pctComplete}%
//           </p>
//         </div>
//       )}
//
//       {/* Actions */}
//       {stream.readyToStream && (
//         <div className="mt-4 flex gap-2">
//           <a
//             href={stream.preview}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
//           >
//             Preview
//           </a>
//           <a
//             href={stream.playback?.hls}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
//           >
//             HLS
//           </a>
//           <a
//             href={stream.playback?.dash}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
//           >
//             DASH
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

// Status Badge Component
function StatusBadge({ state }: { state?: string }) {
  const getStatusColor = (state?: string) => {
    switch (state) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'inprogress':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'queued':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-medium ${getStatusColor(state)}`}
    >
      {state || 'unknown'}
    </span>
  );
}
