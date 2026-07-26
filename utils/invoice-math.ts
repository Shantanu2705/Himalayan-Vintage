import { InvoiceItem, PaymentStatus } from '@/types';

export interface InvoiceCalculationResult {
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  balanceAmount: number;
  status: PaymentStatus;
}

export const calculateInvoiceTotals = (
  items: InvoiceItem[],
  gstPercent: number = 5,
  paidAmount: number = 0,
  currentStatus: PaymentStatus = 'unpaid'
): InvoiceCalculationResult => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);
  const gstAmount = Math.round((subtotal * gstPercent) / 100);
  const totalAmount = subtotal + gstAmount;
  const balanceAmount = Math.max(0, totalAmount - paidAmount);

  let status: PaymentStatus = currentStatus;
  if (currentStatus !== 'cancelled') {
    if (paidAmount >= totalAmount && totalAmount > 0) {
      status = 'paid';
    } else if (paidAmount > 0 && paidAmount < totalAmount) {
      status = 'partially-paid';
    } else if (paidAmount === 0 && currentStatus !== 'overdue') {
      status = 'unpaid';
    }
  }

  return {
    subtotal,
    gstAmount,
    totalAmount,
    balanceAmount,
    status,
  };
};
