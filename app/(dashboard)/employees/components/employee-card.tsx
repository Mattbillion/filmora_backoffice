import { VerifiedIcon } from 'lucide-react';
import Image from 'next/image';

import { EmployeeItemType } from '@/app/(dashboard)/employees/schema';
import { Card, CardContent } from '@/components/ui/card';

export function EmployeeCard({ userData }: { userData: EmployeeItemType }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full">
            <Image
              src={userData.profile || ''}
              alt={userData.firstname || ''}
              className="aspect-square object-cover"
              unoptimized
              fill
            />
          </div>
          <div className="w-full">
            <h4 className="text-lg font-bold">{`${userData.firstname} ${userData.lastname}`}</h4>
            <div className="flex items-center gap-1">
              {userData.email_verified && <VerifiedIcon size={16} />}
              <h5 className="text-base text-secondary-foreground">
                {userData.email}
              </h5>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
