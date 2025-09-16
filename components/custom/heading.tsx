import { ReactNode } from 'react';

interface HeadingProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {!!description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
};
