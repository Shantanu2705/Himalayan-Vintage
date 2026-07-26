import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeVariant } from '@/utils/formatters';

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'active', className }) => {
  const variant = getStatusBadgeVariant(status);
  const formatted = status.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <Badge variant={variant} className={className}>
      {formatted}
    </Badge>
  );
};
