import { Heading } from '@/components/custom/heading';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';
import { Separator } from '@/components/ui/separator';
import { getMovie } from '@/services/movies-generated';
import { getSeriesSeason } from '@/services/seasons';

export const dynamic = 'force-dynamic';

export default async function SeasonDetailPage(props: {
  params: Promise<{ 'season-id': string; id: string }>;
}) {
  const params = await props.params;
  const { data: movie } = await getMovie(params.id);
  const { data } = await getSeriesSeason(params['season-id']);

  return (
    <>
      <ReplaceBreadcrumdItem
        data={{
          movies: {
            value: movie.title,
            selector: params.id,
          },
          seasons: {
            value: data.title,
            selector: params['season-id'],
          },
        }}
      />
      <div className="flex items-start justify-between">
        <Heading title={`Seasons: ${data.title}`} />
      </div>
      <Separator />
      {JSON.stringify(data, null, 2)}
    </>
  );
}
