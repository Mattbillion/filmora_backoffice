import { Plus } from 'lucide-react';
import Link from 'next/link';
import { promisify } from 'util';
import { gunzip } from 'zlib';

import { auth } from '@/app/(auth)/auth';
import KonvaStagePreview from '@/app/(dashboard)/events/[id]/templates/components/stage-preview';
import { getEventDetail } from '@/app/(dashboard)/events/actions';
import { Heading } from '@/components/custom/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getBranchesDetail } from '@/features/branches/actions';
import { getHallDetail } from '@/features/halls/actions';
import { getVenuesDetail } from '@/features/venues/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';
import { removeHTML } from '@/lib/utils';

import { getTemplates } from './actions';

const gunzipAsync = promisify(gunzip);

async function getDataFromGzip(url: string): Promise<any> {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const decompressed = await gunzipAsync(buffer);
  return JSON.parse(decompressed.toString('utf-8'));
}

async function getTemplateData(id: string) {
  const res = await fetch(
    `${process.env.XOOX_DOMAIN}/client/seat_files/${id}`,
    { cache: 'force-cache' },
  );
  const resJson = await res.json();
  const { gzip_tickets_url, gzip_other_url, gzip_mask_url } =
    resJson?.data || {};

  const [tickets, mask, stage] = await Promise.all([
    getDataFromGzip(gzip_tickets_url),
    getDataFromGzip(gzip_mask_url),
    getDataFromGzip(gzip_other_url),
  ]);

  return { tickets, mask, stage };
}

export const dynamic = 'force-dynamic';

export default async function TemplatesPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const { data } = await getTemplates({
    ...searchParams,
    event_id: id,
  });
  const [template] = data?.data ?? [];

  const [eventData, venueData, branchData, hallData, templateJsonData] =
    await Promise.all([
      template?.event_id
        ? getEventDetail(template.event_id)
        : Promise.resolve(null),
      template?.venue_id
        ? getVenuesDetail(template.venue_id)
        : Promise.resolve(null),
      template?.branch_id
        ? getBranchesDetail(template.branch_id)
        : Promise.resolve(null),
      template?.hall_id
        ? getHallDetail(template.hall_id)
        : Promise.resolve(null),
      template ? getTemplateData(id) : Promise.resolve(null),
    ]);

  console.log(templateJsonData);
  return (
    <div className="space-y-6">
      <Heading title="Template" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Template Name</Label>
              <p className="text-muted-foreground">
                {template.template_name ?? '-'}
              </p>
            </div>
            <div>
              <Label>Description</Label>
              <p className="text-muted-foreground">
                {removeHTML(template.template_desc).slice(0, 300) || '-'}
              </p>
            </div>
            <div>
              <Label>Order</Label>
              <p className="text-muted-foreground">
                {template.template_order || '-'}
              </p>
            </div>
            <div>
              <Label>Status</Label>
              <p className="text-muted-foreground">
                {typeof template.status === 'undefined'
                  ? '-'
                  : template.status
                    ? 'Active'
                    : 'Inactive'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Event</Label>
              <p className="text-muted-foreground">
                {eventData?.data?.data?.event_name}
              </p>
            </div>
            <div>
              <Label>Hall</Label>
              <p className="text-muted-foreground">
                {hallData?.data?.data?.hall_name}
              </p>
            </div>
            <div>
              <Label>Branch</Label>
              <p className="text-muted-foreground">
                {branchData?.data?.data?.branch_name}
              </p>
            </div>
            <div>
              <Label>Venue</Label>
              <p className="text-muted-foreground">
                {venueData?.data?.data?.venue_name}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seat Layout Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {(data?.total_count ?? data?.data?.length) === 0 ? (
            checkPermission(session, ['create_template']) && (
              <div className="flex h-[600px] w-full max-w-full flex-col items-center justify-center overflow-auto rounded-md border bg-gray-100">
                <Link
                  href={`/build-template?eventId=${id}`}
                  className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground"
                >
                  <Plus className="h-4 w-4" /> Create new template
                </Link>
              </div>
            )
          ) : templateJsonData ? (
            <KonvaStagePreview json={templateJsonData} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
