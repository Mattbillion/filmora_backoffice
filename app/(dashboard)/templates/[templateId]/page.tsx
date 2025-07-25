import { promisify } from 'util';
import { gunzip } from 'zlib';

import { Heading } from '@/components/custom/heading';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getBranchesDetail } from '@/features/branches/actions';
import { getHallDetail } from '@/features/halls/actions';
import { getVenuesDetail } from '@/features/venues/actions';
import { SearchParams } from '@/lib/fetch/types';
import { removeHTML } from '@/lib/utils';

import { getTemplates } from '../actions';
import { TemplatesItemType } from '../schema';
import KonvaStagePreview from './components/stage-preview';

const gunzipAsync = promisify(gunzip);

async function getDataFromGzip(url: string): Promise<any> {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const decompressed = await gunzipAsync(buffer);
  return JSON.parse(decompressed.toString('utf-8'));
}

async function getTemplateData(template: TemplatesItemType) {
  const [tickets, mask, stage] = await Promise.all([
    getDataFromGzip(template.tickets_json_url),
    getDataFromGzip(template.mask_json_url),
    getDataFromGzip(template.others_json_url),
  ]);

  return { tickets, mask, stage };
}

export const dynamic = 'force-dynamic';

export default async function TemplateDetailPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ id: string; templateId: string }>;
}) {
  const { id, templateId } = await props.params;
  const searchParams = await props.searchParams;
  const { data } = await getTemplates({
    ...searchParams,
    event_id: id,
    filters: `id=${templateId}`,
  });
  const [template] = data?.data ?? [];

  const [venueData, branchData, hallData, templateJsonData] = await Promise.all(
    [
      template?.venue_id
        ? getVenuesDetail(template?.venue_id)
        : Promise.resolve(null),
      template?.branch_id
        ? getBranchesDetail(template?.branch_id)
        : Promise.resolve(null),
      template?.hall_id
        ? getHallDetail(template?.hall_id)
        : Promise.resolve(null),
      template ? getTemplateData(template) : Promise.resolve(null),
      Promise.resolve(null),
    ],
  );

  return (
    <div className="space-y-6">
      <ReplaceBreadcrumdItem
        data={{
          templates: {
            value: data?.data[0]?.template_name,
            selector: templateId,
          },
        }}
      />
      <Heading title="Template schedules" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Template Name</Label>
              <p className="truncate text-muted-foreground">
                {template?.template_name ?? '-'}
              </p>
            </div>
            <div>
              <Label>Description</Label>
              <p className="truncate text-muted-foreground">
                {removeHTML(template?.template_desc).slice(0, 300) || '-'}
              </p>
            </div>
            <div>
              <Label>Order</Label>
              <p className="truncate text-muted-foreground">
                {template?.template_order || '-'}
              </p>
            </div>
            <div>
              <Label>Status</Label>
              <p className="text-muted-foreground">
                {typeof template?.status === 'undefined'
                  ? '-'
                  : template?.status
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
              <Label>Hall</Label>
              <p className="truncate text-muted-foreground">
                {hallData?.data?.data?.hall_name}
              </p>
            </div>
            <div>
              <Label>Branch</Label>
              <p className="truncate text-muted-foreground">
                {branchData?.data?.data?.branch_name}
              </p>
            </div>
            <div>
              <Label>Venue</Label>
              <p className="truncate text-muted-foreground">
                {venueData?.data?.data?.venue_name}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!!templateJsonData && (
        <Card>
          <CardHeader>
            <CardTitle>Seat Layout Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <KonvaStagePreview json={templateJsonData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
