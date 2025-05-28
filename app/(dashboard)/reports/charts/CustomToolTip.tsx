import { currencyFormat } from '@interpriz/lib';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || payload.length === 0) return null;

  // Group by merch name
  const grouped: Record<string, { quantity?: number; revenue?: number }> = {};

  payload.forEach((item) => {
    const key = item.dataKey as string;
    const nameMatch = key.match(/^(.*)_(quantity_sold|total_sales_amount)$/);
    if (!nameMatch) return;

    const [_, merchKey, type] = nameMatch;
    if (!grouped[merchKey]) grouped[merchKey] = {};
    grouped[merchKey][type === 'quantity_sold' ? 'quantity' : 'revenue'] =
      item.value as number;
  });

  const mnt = new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency: 'MNT',
    minimumFractionDigits: 0,
  });

  return (
    <div className="rounded border bg-white p-2 shadow-sm">
      <div className="mb-1 font-bold">{label}</div>
      {Object.entries(grouped).map(([name, { quantity, revenue }]) => (
        <div key={name} className="mb-1">
          <div className="font-medium">{name.replace(/_/g, ' ')}</div>
          {quantity !== undefined && <div>• Зарагдсан тоо: {quantity}</div>}
          {revenue !== undefined && (
            <div>• Орлого: {currencyFormat(revenue)}</div>
          )}
        </div>
      ))}
    </div>
  );
};
