import Image from 'next/image';
import Link from 'next/link';

import { getTemplateHash } from '@/app/(dashboard)/templates/actions';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { removeHTML } from '@/lib/utils';

export default async function EventSchedulePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const { data } = await getTemplateHash();
  const templates = Object.values(data || {});

  return (
    <div className="container mx-auto flex-1 overflow-y-auto px-4 py-8">
      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {templates.length} template
        </p>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="group overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
          >
            <div className="relative overflow-hidden">
              <Image
                src={template.preview}
                alt={template.template_name}
                width={400}
                height={400}
                className="aspect-square w-full bg-background object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Link
                  href={`/event-schedule/${eventId}/${template.id}/build`}
                  className={buttonVariants({ size: 'sm' })}
                >
                  Use Template
                </Link>
              </div>
            </div>

            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-semibold transition-colors group-hover:text-primary">
                {template.template_name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {removeHTML(template.template_desc)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
