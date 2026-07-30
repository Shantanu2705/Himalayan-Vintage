'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Invoice, Receipt, PaymentStatus, PaymentMethod } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { QrPaymentModal } from '@/components/shared/qr-payment-modal';
import { PdfPreviewModal } from '@/components/shared/pdf-preview-modal';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { calculateInvoiceTotals } from '@/utils/invoice-math';
import {
  Receipt as ReceiptIcon,
  PlusCircle,
  Search,
  Printer,
  Trash2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Bus,
  Plus,
} from 'lucide-react';

function BillingHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromBookingId = searchParams.get('fromBookingId');

  const { invoices, receipts, addInvoice, deleteInvoice, addReceipt, deleteReceipt, bookings, settings } = useFleetStore();
  const [activeTab, setActiveTab] = useState<'invoices' | 'receipts'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');

  // Invoice Modal State
  const [invModalOpen, setInvModalOpen] = useState(false);
  const [invClientName, setInvClientName] = useState('');
  const [invClientPhone, setInvClientPhone] = useState('');
  const [invGstin, setInvGstin] = useState('');
  const [invBookingId, setInvBookingId] = useState('');
  const [invItems, setInvItems] = useState<{ description: string; quantity: number; rate: number }[]>([
    { description: 'Transport Rental & Chauffeur Services', quantity: 1, rate: 25000 },
  ]);
  const [invPaid, setInvPaid] = useState(0);
  const [invDueDate, setInvDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);

  // Receipt Modal State
  const [recModalOpen, setRecModalOpen] = useState(false);
  const [recInvoiceId, setRecInvoiceId] = useState('');
  const [recClientName, setRecClientName] = useState('');
  const [recAmount, setRecAmount] = useState(10000);
  const [recMethod, setRecMethod] = useState<PaymentMethod>('upi');
  const [recRef, setRecRef] = useState('UPI/2026/0987654');

  // Preview State
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<Receipt | null>(null);

  // QR Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrTarget, setQrTarget] = useState<{ amount: number; ref: string; client: string } | null>(null);

  // Auto populate invoice from booking
  useEffect(() => {
    if (fromBookingId) {
      const b = bookings.find((item) => item.id === fromBookingId);
      if (b) {
        setInvClientName(b.clientName || '');
        setInvClientPhone(b.mobile || '');
        setInvBookingId(b.id || '');
        setInvItems([
          { description: `${b.vehicle || 'Vehicle'} Rental for ${b.pickup || ''} to ${b.destination || ''}`, quantity: 1, rate: b.amount || 0 },
        ]);
        setInvPaid(b.advance || 0);
        setInvModalOpen(true);
      }
    }
  }, [fromBookingId, bookings]);

  const invTotals = calculateInvoiceTotals(invItems, 5, invPaid, 'unpaid');

  const handleAddInvItem = () => {
    setInvItems([...invItems, { description: 'Additional Sightseeing / Permit Charge', quantity: 1, rate: 1500 }]);
  };

  const handleUpdateInvItem = (index: number, field: string, val: any) => {
    const updated = [...invItems];
    updated[index] = { ...updated[index], [field]: val };
    setInvItems(updated);
  };

  const handleRemoveInvItem = (index: number) => {
    setInvItems(invItems.filter((_, i) => i !== index));
  };

  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClientName) return;

    const newId = `inv-${Date.now()}`;
    const newNo = `INV-2026-${String(invoices.length + 101).padStart(3, '0')}`;
    const totals = calculateInvoiceTotals(invItems, 5, invPaid, 'unpaid');

    await addInvoice({
      id: newId,
      invoiceNo: newNo,
      bookingId: invBookingId || undefined,
      clientName: invClientName,
      clientPhone: invClientPhone,
      clientGstin: invGstin,
      issueDate: new Date().toISOString(),
      dueDate: new Date(invDueDate).toISOString(),
      items: invItems,
      subtotal: totals.subtotal,
      gstPercent: 5,
      gstAmount: totals.gstAmount,
      totalAmount: totals.totalAmount,
      paidAmount: invPaid,
      balanceAmount: totals.balanceAmount,
      status: totals.status,
    });

    setInvModalOpen(false);
  };

  const handleOpenReceiptModal = (inv?: Invoice) => {
    if (inv) {
      setRecInvoiceId(inv.id || '');
      setRecClientName(inv.clientName || '');
      setRecAmount(inv.balanceAmount || 0);
    } else {
      setRecInvoiceId('');
      setRecClientName('');
      setRecAmount(5000);
    }
    setRecMethod('upi');
    setRecRef(`UPI/2026/${Math.floor(100000 + Math.random() * 900000)}`);
    setRecModalOpen(true);
  };

  const handleSaveReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recClientName || !recAmount) return;

    const newId = `rec-${Date.now()}`;
    const newNo = `REC-2026-${String(receipts.length + 101).padStart(3, '0')}`;

    await addReceipt({
      id: newId,
      receiptNo: newNo,
      invoiceId: recInvoiceId || undefined,
      clientName: recClientName,
      amount: Number(recAmount),
      date: new Date().toISOString(),
      paymentMethod: recMethod,
      method: recMethod,
      referenceNo: recRef,
    });

    setRecModalOpen(false);
  };

  const filteredInvoices = invoices.filter((i) =>
    (i.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (i.invoiceNo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReceipts = receipts.filter((r) =>
    (r.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (r.receiptNo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing, Invoices & QR Receipts</h1>
          <p className="text-sm text-muted-foreground">
            Generate GST-compliant tax invoices, record customer payments, and show UPI payment QR codes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setInvModalOpen(true)} className="bg-primary text-primary-foreground font-semibold shadow-sm">
            <PlusCircle className="mr-1.5 h-4 w-4" /> New Invoice
          </Button>
          <Button variant="outline" onClick={() => handleOpenReceiptModal()} className="font-semibold">
            <CreditCard className="mr-1.5 h-4 w-4 text-emerald-600" /> Record Receipt
          </Button>
        </div>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="invoices" className="font-semibold px-6">Tax Invoices ({invoices.length})</TabsTrigger>
              <TabsTrigger value="receipts" className="font-semibold px-6">Payment Receipts ({receipts.length})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
      </Card>

      {/* Invoices Tab Content */}
      {activeTab === 'invoices' && (
        <Card className="shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice # & Date</TableHead>
                <TableHead>Client & GSTIN</TableHead>
                <TableHead>Amount Summary</TableHead>
                <TableHead>Balance Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No invoices recorded yet. Click "New Invoice" to issue a bill!
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-semibold">
                      <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">
                        {inv.invoiceNo}
                      </span>
                      <span className="block text-[10px] text-muted-foreground mt-1">
                        Issued: {formatDate(inv.issueDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground">{inv.clientName}</div>
                      {inv.clientPhone && <div className="text-xs text-muted-foreground font-mono">{inv.clientPhone}</div>}
                      {inv.clientGstin && <div className="text-[10px] text-primary font-mono font-bold">GSTIN: {inv.clientGstin}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-extrabold text-foreground">{formatCurrency(inv.totalAmount)}</div>
                      <div className="text-[10px] text-muted-foreground">Sub: {formatCurrency(inv.subtotal)} + GST (5%)</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-bold text-red-600 dark:text-red-400">{formatCurrency(inv.balanceAmount)}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Paid: {formatCurrency(inv.paidAmount)}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                          onClick={() => setPreviewInvoice(inv)}
                          title="Print / PDF Invoice"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          onClick={() => {
                            setQrTarget({ amount: inv.balanceAmount || 0, ref: inv.invoiceNo || '', client: inv.clientName || '' });
                            setQrModalOpen(true);
                          }}
                          title="Show UPI Payment QR"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        {inv.balanceAmount > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-semibold text-emerald-700 border-emerald-300"
                            onClick={() => handleOpenReceiptModal(inv)}
                          >
                            Pay
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteInvoice(inv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Receipts Tab Content */}
      {activeTab === 'receipts' && (
        <Card className="shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt # & Date</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Payment Method & Ref</TableHead>
                <TableHead>Amount Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No payment receipts recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceipts.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-semibold">
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 text-xs bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        {rec.receiptNo}
                      </span>
                      <span className="block text-[10px] text-muted-foreground mt-1">
                        {formatDate(rec.date)}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-foreground">{rec.clientName}</TableCell>
                    <TableCell>
                      <div className="text-xs font-bold uppercase text-primary">{rec.method}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{rec.referenceNo || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(rec.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary"
                          onClick={() => setPreviewReceipt(rec)}
                          title="Print Receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteReceipt(rec.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Invoice Modal */}
      <Dialog open={invModalOpen} onOpenChange={setInvModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ReceiptIcon className="h-5 w-5 text-primary" /> Issue Tax Invoice
            </DialogTitle>
            <DialogDescription>
              Create GST transport bill for customer booking or corporate account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveInvoice} className="space-y-4 py-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Client Name *</Label>
                <Input required value={invClientName} onChange={(e) => setInvClientName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Phone Number</Label>
                <Input value={invClientPhone} onChange={(e) => setInvClientPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Client GSTIN (Optional)</Label>
                <Input value={invGstin} onChange={(e) => setInvGstin(e.target.value)} placeholder="e.g. 19AAAAA0000A1Z5" className="font-mono" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Line Items / Transport Charges</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddInvItem} className="h-7 text-xs font-semibold">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Item
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {invItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-muted/20 p-2 rounded border">
                    <Input
                      value={item.description}
                      onChange={(e) => handleUpdateInvItem(idx, 'description', e.target.value)}
                      placeholder="Description"
                      className="text-xs flex-1 h-8"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleUpdateInvItem(idx, 'quantity', Number(e.target.value))}
                      className="text-xs w-16 h-8 text-center"
                    />
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleUpdateInvItem(idx, 'rate', Number(e.target.value))}
                      className="text-xs w-24 h-8 font-mono text-right font-semibold"
                    />
                    {invItems.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveInvItem(idx)} className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-primary/5 p-3 rounded-lg border border-primary/20">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Advance / Already Paid Amount (₹)</Label>
                <Input type="number" value={invPaid} onChange={(e) => setInvPaid(Number(e.target.value))} className="font-mono font-bold text-emerald-600" />
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs text-muted-foreground">Subtotal: {formatCurrency(invTotals.subtotal)}</div>
                <div className="text-xs text-primary font-semibold">GST (5%): {formatCurrency(invTotals.gstAmount)}</div>
                <div className="text-sm font-extrabold text-foreground">Total: {formatCurrency(invTotals.totalAmount)}</div>
                <div className="text-xs font-bold text-red-600">Balance Due: {formatCurrency(invTotals.balanceAmount)}</div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setInvModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold">Issue Tax Invoice</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={recModalOpen} onOpenChange={setRecModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" /> Record Payment Receipt
            </DialogTitle>
            <DialogDescription>
              Log UPI, Bank Transfer, or Cash collection against client account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveReceipt} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Client Name *</Label>
              <Input required value={recClientName} onChange={(e) => setRecClientName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Amount Received (₹) *</Label>
                <Input required type="number" value={recAmount} onChange={(e) => setRecAmount(Number(e.target.value))} className="font-mono font-bold text-emerald-600" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Payment Method</Label>
                <Select value={recMethod} onValueChange={(m) => setRecMethod(m as PaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI / GPay / PhonePe</SelectItem>
                    <SelectItem value="bank-transfer">NEFT / IMPS Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash Collection</SelectItem>
                    <SelectItem value="cheque">Bank Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Transaction Reference / UTR Number</Label>
              <Input value={recRef} onChange={(e) => setRecRef(e.target.value)} placeholder="e.g. UPI/2026/12345678" className="font-mono" />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setRecModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Log Receipt</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      {qrTarget && (
        <QrPaymentModal
          isOpen={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setQrTarget(null);
          }}
          amount={qrTarget.amount}
          referenceNo={qrTarget.ref}
          clientName={qrTarget.client}
        />
      )}

      {/* Invoice PDF Preview */}
      {previewInvoice && (
        <PdfPreviewModal
          isOpen={!!previewInvoice}
          onClose={() => setPreviewInvoice(null)}
          title="Tax Invoice Document"
          documentNo={previewInvoice.invoiceNo}
        >
          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-start border-b-2 border-primary pb-6">
              <div>
                <div className="flex items-center gap-3">
                  {settings?.logoUrl ? (
                    <img src={settings.logoUrl} alt="Company Logo" className="h-14 w-auto max-w-[180px] object-contain" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f172a] shadow-sm">
                      <img src="/logo-icon.svg" className="h-9 w-9 object-contain" alt="Logo" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight uppercase text-primary">
                      {settings?.companyName || 'Himalayan Vintage Holidays'}
                    </h2>
                    <p className="text-xs text-muted-foreground">{settings?.address || 'MG Marg, Gangtok, Sikkim — 737101'}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs font-mono space-y-0.5 text-muted-foreground">
                  <div>GSTIN: {settings?.gstin || '11AAAAA0000A1Z5'} | Phone: {settings?.phone || '+91 98300 12345'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-primary uppercase">TAX INVOICE</div>
                <div className="text-sm font-mono font-bold mt-1">{previewInvoice.invoiceNo}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Date: {formatDate(previewInvoice.issueDate)}</div>
                <div className="mt-2"><StatusBadge status={previewInvoice.status} /></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Billed To:</div>
                <div className="font-bold text-base">{previewInvoice.clientName}</div>
                {previewInvoice.clientPhone && <div className="text-xs font-mono">Mobile: {previewInvoice.clientPhone}</div>}
                {previewInvoice.clientGstin && <div className="text-xs font-mono font-bold text-primary mt-1">Buyer GSTIN: {previewInvoice.clientGstin}</div>}
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Payment Summary:</div>
                <div className="text-xs">Subtotal: <strong className="font-mono">{formatCurrency(previewInvoice.subtotal)}</strong></div>
                <div className="text-xs">GST (5%): <strong className="font-mono">{formatCurrency(previewInvoice.gstAmount)}</strong></div>
                <div className="text-sm font-bold text-foreground mt-1">Total Bill: <span className="font-mono">{formatCurrency(previewInvoice.totalAmount)}</span></div>
                <div className="text-xs text-red-600 font-bold mt-1">Balance Due: <span className="font-mono">{formatCurrency(previewInvoice.balanceAmount)}</span></div>
              </div>
            </div>

            <table className="w-full text-xs border">
              <thead className="bg-muted font-bold text-left">
                <tr>
                  <th className="p-2 border-r">#</th>
                  <th className="p-2 border-r">Description of Service / Transport</th>
                  <th className="p-2 border-r text-center">Qty / Days</th>
                  <th className="p-2 border-r text-right">Rate</th>
                  <th className="p-2 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {previewInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border-r font-mono text-center">{idx + 1}</td>
                    <td className="p-2 border-r font-medium">{item.description}</td>
                    <td className="p-2 border-r text-center font-mono">{item.quantity}</td>
                    <td className="p-2 border-r text-right font-mono">{formatCurrency(item.rate)}</td>
                    <td className="p-2 text-right font-mono font-bold">{formatCurrency(item.quantity * item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-8 border-t flex justify-between items-end text-xs text-muted-foreground">
              <div>
                <div className="font-bold text-foreground mb-1">Bank Payment & UPI Instructions:</div>
                <div>UPI ID: <strong className="text-foreground font-mono">{settings?.upiId || 'himalayantaxi@hdfc'}</strong></div>
                <div>Bank Account: <strong className="text-foreground">{settings?.accountNumber || '50200012345678'}</strong> ({settings?.bankName || 'HDFC Bank'})</div>
                <div>IFSC Code: <strong className="text-foreground font-mono">{settings?.ifsc || 'HDFC0001234'}</strong></div>
              </div>
              <div className="text-center">
                {settings?.signatureUrl ? (
                  <img src={settings.signatureUrl} alt="Authorized Signatory" className="h-12 w-auto max-w-[150px] mx-auto object-contain mb-1" />
                ) : (
                  <div className="h-12 border-b mb-1 font-serif italic text-base text-primary flex items-end justify-center pb-1">Himalayan Fleet</div>
                )}
                <div className="font-bold text-foreground">Authorized Signatory</div>
              </div>
            </div>
          </div>
        </PdfPreviewModal>
      )}

      {/* Receipt PDF Preview */}
      {previewReceipt && (
        <PdfPreviewModal
          isOpen={!!previewReceipt}
          onClose={() => setPreviewReceipt(null)}
          title="Official Payment Receipt"
          documentNo={previewReceipt.receiptNo}
        >
          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-6">
              <div className="flex items-center gap-3">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt="Company Logo" className="h-12 w-auto max-w-[160px] object-contain" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xl">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight uppercase text-emerald-700">PAYMENT RECEIPT</h2>
                  <p className="text-xs text-muted-foreground">{settings?.companyName || 'Himalayan Vintage Holidays'} — {settings?.address?.split(',').slice(-2).join(', ') || 'Gangtok, Sikkim'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-foreground">{previewReceipt.receiptNo}</div>
                <div className="text-xs text-muted-foreground">Date: {formatDate(previewReceipt.date)}</div>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-6 space-y-3">
              <div className="text-xs uppercase font-bold text-emerald-800">Received With Thanks From:</div>
              <div className="text-lg font-bold text-foreground">{previewReceipt.clientName}</div>
              <div className="flex items-center justify-between pt-2 border-t border-emerald-200 text-sm">
                <span>Payment Method: <strong className="uppercase">{previewReceipt.method}</strong> ({previewReceipt.referenceNo || 'No Ref'})</span>
                <div className="text-2xl font-extrabold text-emerald-700 font-mono">{formatCurrency(previewReceipt.amount)}</div>
              </div>
            </div>

            <div className="pt-8 text-right text-xs text-muted-foreground flex justify-end">
              <div className="text-center">
                {settings?.signatureUrl ? (
                  <img src={settings.signatureUrl} alt="Authorized Signatory" className="h-12 w-auto max-w-[150px] mx-auto object-contain mb-1" />
                ) : (
                  <div className="h-10 border-b mb-1 inline-block w-40 font-serif italic text-base text-emerald-700 text-center flex items-end justify-center pb-1">Himalayan Cashier</div>
                )}
                <div className="font-bold text-foreground">Accounts Department</div>
              </div>
            </div>
          </div>
        </PdfPreviewModal>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Billing & Receipts...</div>}>
        <BillingHubContent />
      </Suspense>
    </DashboardLayout>
  );
}
