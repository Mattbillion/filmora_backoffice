/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';

const DataTableInfinte = ({
  pageNumber,
  disabled,
  setDisabled,
  onChange = () => {},
  isPending,
}: {
  pageNumber: number;
  onChange: (page: number, pageSize?: number) => void;
  disabled: boolean;
  setDisabled: any;
  isPending: any;
}) => {
  return (
    <div className="flex items-center justify-start">
      {/* <div className="">{pageNumber}</div> */}
      <div className="w flex items-center justify-between space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onChange(pageNumber - 1, 10);

            disabled && setDisabled(false);
          }}
          disabled={pageNumber <= 0 || isPending}
        >
          Previous 60
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onChange(pageNumber + 1, 10);
          }}
          disabled={disabled || isPending}
        >
          Next 60
        </Button>
      </div>
    </div>
  );
};

export default DataTableInfinte;
