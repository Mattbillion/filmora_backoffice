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
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {!!description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
