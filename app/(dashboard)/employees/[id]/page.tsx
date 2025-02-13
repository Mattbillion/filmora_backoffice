'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { getEmployee } from '@/app/(dashboard)/employees/actions';
import { EmployeeItemType } from '@/app/(dashboard)/employees/schema';

export default function Page() {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState<EmployeeItemType>();
  const [loading, setLoading] = useState(true);
  console.log(employeeData, '<');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEmployee({
      id: id.toString(),
      searchParams: {
        company_id: '11',
      },
    })
      .then((res) => {
        if (res.data?.data) {
          setEmployeeData(res.data?.data);
        }
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, [id]);
  return (
    <div>
      <div className="relative h-[320px] w-[320px] overflow-hidden">
        <Image
          src="https://xoox.mn.s3.us-west-1.amazonaws.com/public/05a07b5f-ae65-4d7f-84ca-233a7405ef9c.png"
          alt={employeeData?.firstname || ''}
          className="aspect-square object-cover"
          unoptimized
          fill
        />
      </div>
    </div>
  );
}
