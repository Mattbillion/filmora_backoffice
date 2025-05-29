import { currencyFormat } from '@interpriz/lib';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

export function MerchDiscountSaleTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length < 0) return null;

  return (
    <div className="flex flex-col gap-1 rounded-xl bg-white p-2">
      <h4 className="font-bold capitalize">{label}</h4>
      {payload.map((item, idx) => {
        const discountType: 'AMOUNT' | 'PERCENT' = item.payload.discount_type;

        return (
          <div key={idx} className="flex flex-col">
            <RenderDiscountValue
              dType={discountType}
              dValue={item.payload.discount}
            />
            <div>
              <span>Нийт борлуулсан: </span>
              <strong>{item.payload.total_quantity_sold}ш</strong>
            </div>

            <div>
              <span>Нэгж үнэ: </span>
              <strong>
                {currencyFormat(item.payload.discounted_total_price)}
              </strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RenderDiscountValue({
  dType,
  dValue,
}: RenderDiscountValueProps) {
  const parsedValue = Number(dValue);

  if (dType === 'AMOUNT') {
    return (
      <div>
        <span>Хямдрал дүнгээр: </span>
        <strong>{currencyFormat(parsedValue)}</strong>
      </div>
    );
  }

  return (
    <div>
      <span>Хямдрал: </span>
      <strong>{parsedValue}%</strong>
    </div>
  );
}

type RenderDiscountValueProps = {
  dType: string; // Better type safety
  dValue: string | number;
};
