export const formatCurrency = (amount: number | undefined | null): string => {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
};

export const formatPhoneNumber = (phone: string | undefined | null): string => {
  if (!phone) return '-';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

export const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const s = status.toLowerCase();
  if (['confirmed', 'active', 'paid', 'completed'].includes(s)) return 'default';
  if (['pending', 'follow-up', 'quotation-sent', 'partially-paid', 'on-leave', 'sent'].includes(s)) return 'secondary';
  if (['cancelled', 'inactive', 'overdue', 'unpaid'].includes(s)) return 'destructive';
  return 'outline';
};
