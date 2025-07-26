import { promisify } from 'util';
import { gunzip } from 'zlib';

import { getEventDetail } from '@/app/(dashboard)/events/actions';
import { getTemplateDetail } from '@/app/(dashboard)/templates/actions';
import { TemplatesDetailType } from '@/app/(dashboard)/templates/schema';
import { getBranchesDetail } from '@/features/branches/actions';
import { getHallDetail } from '@/features/halls/actions';
import { getVenuesDetail } from '@/features/venues/actions';

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

  const [venueData, eventData, branchData, hallData, templateJsonData] =
    await Promise.all([
      template?.venue_id
        ? getVenuesDetail(template?.venue_id)
        : Promise.resolve(null),
      getEventDetail(eventId),
      template?.branch_id
        ? getBranchesDetail(template?.branch_id)
        : Promise.resolve(null),
      template?.hall_id
        ? getHallDetail(template?.hall_id)
        : Promise.resolve(null),
      template ? getTemplateData(template) : Promise.resolve(null),
      Promise.resolve(null),
    ]);

  return (
    <div className="flex-1 overflow-y-auto">
      {!!templateJsonData && (
        <ScheduleBuildClient
          stage={templateJsonData.stage}
          tickets={templateJsonData.tickets}
        />
      )}
    </div>
  );
}
