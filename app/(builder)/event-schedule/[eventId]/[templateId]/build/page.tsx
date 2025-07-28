import { promisify } from 'util';
import { gunzip } from 'zlib';

import { BackButton } from '@/app/(builder)/event-schedule/[eventId]/_components/back-button';
import { getEventDetail } from '@/app/(dashboard)/events/actions';
import { getTemplateDetail } from '@/app/(dashboard)/templates/actions';
import { TemplatesDetailType } from '@/app/(dashboard)/templates/schema';
import { getHallDetail } from '@/features/halls/actions';

import { AvatarDropdown } from '../../_components/avatar-dropdown';
import ScheduleBuildClient from './client';

const gunzipAsync = promisify(gunzip);

async function getDataFromGzip(url: string): Promise<any> {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const decompressed = await gunzipAsync(buffer);
  return JSON.parse(decompressed.toString('utf-8'));
}

async function getTemplateData(template: TemplatesDetailType) {
  const [tickets, stage] = await Promise.all([
    getDataFromGzip(template.gzip_tickets_json_url),
    // getDataFromGzip(template.gzip_mask_json_url),
    getDataFromGzip(template.gzip_others_json_url),
  ]);

  return { tickets, stage };
}

export default async function ScheduleBuildPage({
  params,
}: {
  params: Promise<{ eventId: string; templateId: string }>;
}) {
  const { templateId, eventId } = await params;
  const { data } = await getTemplateDetail(templateId);
  const template = data?.data;

  const [eventData, hallData, templateJsonData] = await Promise.all([
    getEventDetail(eventId),
    template?.hall_id
      ? getHallDetail(template?.hall_id)
      : Promise.resolve(null),
    template ? getTemplateData(template) : Promise.resolve(null),
    Promise.resolve(null),
  ]);

  const event = eventData?.data?.data!;
  const hall = hallData?.data?.data;

  return (
    <div className="relative flex-1 overflow-y-auto">
      <div className="absolute left-4 top-4 z-10 flex items-stretch gap-2">
        <BackButton className="relative flex size-[45px] items-center justify-center overflow-hidden rounded-md border border-input bg-white shadow-sm" />
        {hall && (
          <div className="flex min-w-0 max-w-52 flex-1 flex-col justify-center rounded-md border border-input bg-white px-2.5 py-1 shadow-sm">
            <span className="text-[10px] font-medium text-gray-600">
              {hall.hall_name}&#39;s template
            </span>
            <p className="truncate text-sm font-medium">
              {template?.template_name}
            </p>
          </div>
        )}
      </div>
      <AvatarDropdown
        className="absolute bottom-4 left-4 z-10"
        avatarClassName="size-10 bg-white shadow-sm border border-input"
      />
      {!!templateJsonData && (
        <ScheduleBuildClient
          stage={templateJsonData.stage}
          tickets={templateJsonData.tickets}
        >
          <div>
            <span className="text-xs font-medium text-gray-600">
              {event.event_name}
            </span>
            <h1 className="text-xl font-semibold leading-none">
              Тоглолтын хуваарь нэмэх
            </h1>
          </div>
        </ScheduleBuildClient>
      )}
    </div>
  );
}
