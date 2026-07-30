'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Quotation } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/status-badge';
import { PdfPreviewModal } from '@/components/shared/pdf-preview-modal';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Printer,
  CalendarCheck,
  Trash2,
  Copy,
  Eye,
  Bus,
  MapPin,
  Phone,
  CheckCircle2,
  Mail,
  Edit,
} from 'lucide-react';

export default function QuotationsListPage() {
  const router = useRouter();
  const { quotations, addQuotation, deleteQuotation, updateQuotation, settings } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);

  const filtered = quotations.filter((q) => {
    const matchesSearch =
      (q.quotationNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((q.clientPhone || q.mobile || '').includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDuplicate = async (q: Quotation) => {
    const newId = `q-${Date.now()}`;
    const newNo = `Q-2026-${String(quotations.length + 101).padStart(3, '0')}`;
    await addQuotation({
      ...q,
      id: newId,
      quotationNo: newNo,
      status: 'draft',
      createdAt: new Date().toISOString(),
    });
  };

  const handleConvertToBooking = (q: Quotation) => {
    router.push(`/bookings?fromQuotationId=${q.id}`);
  };

  const handleEdit = (q: Quotation) => {
    router.push(`/quotations/new?editId=${q.id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quotations & Proposals</h1>
            <p className="text-sm text-muted-foreground">
              Generate custom multi-day itineraries, corporate rate sheets, and branded PDF estimates.
            </p>
          </div>
          <Link href="/quotations/new">
            <Button className="bg-primary text-primary-foreground font-semibold shadow-sm">
              <PlusCircle className="mr-1.5 h-4 w-4" /> Create Quotation
            </Button>
          </Link>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 shadow-soft">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quote #, client, destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <div className="flex flex-wrap gap-1">
                {['all', 'draft', 'sent', 'confirmed', 'rejected', 'expired'].map((st) => (
                  <Button
                    key={`filter-${st}`}
                    variant={statusFilter === st ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(st)}
                    className="h-8 text-xs capitalize"
                  >
                    {st}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Quotations Table */}
        <Card className="shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation # & Date</TableHead>
                <TableHead>Client Information</TableHead>
                <TableHead>Itinerary & Vehicle</TableHead>
                <TableHead>Pricing Summary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No quotations found. Click "Create Quotation" to build a new estimate!
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((q, idx) => (
                  <TableRow key={q.id ? `${q.id}-${idx}` : `quote-${idx}`}>
                    <TableCell className="font-semibold">
                      <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">
                        {q.quotationNo}
                      </span>
                      <span className="block text-[10px] text-muted-foreground mt-1">
                        {formatDate(q.createdAt)}
                      </span>
                      <span className="inline-block text-[9px] uppercase tracking-wider bg-muted px-1.5 py-0.2 mt-1 rounded font-bold text-muted-foreground">
                        {q.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground">{q.clientName}</div>
                      {q.clientPhone && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                          <Phone className="h-3 w-3 text-primary" /> {formatPhoneNumber(q.clientPhone)}
                        </div>
                      )}
                      {q.clientEmail && (
                        <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">{q.clientEmail}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span>{q.pickupLocation} → {q.destination}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-primary uppercase">
                          {q.vehicle}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{q.days} Days ({formatDate(q.startDate)})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-extrabold text-foreground">{formatCurrency(q.totalAmount)}</div>
                      <div className="text-[10px] text-muted-foreground">
                        Base: {formatCurrency(q.baseAmount)} + GST (5%)
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={q.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                          onClick={() => setPreviewQuotation(q)}
                          title="Print / Preview PDF"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          onClick={() => handleConvertToBooking(q)}
                          title="Convert to Confirmed Booking"
                        >
                          <CalendarCheck className="mr-1 h-3.5 w-3.5" /> Book
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDuplicate(q)}
                          title="Duplicate Quotation"
                        >
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 font-semibold"
                          onClick={() => handleEdit(q)}
                          title="Edit Quotation"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteQuotation(q.id)}
                          title="Delete"
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

        {/* PDF / Print Preview Modal */}
        {previewQuotation && (
          <PdfPreviewModal
            isOpen={!!previewQuotation}
            onClose={() => setPreviewQuotation(null)}
            title="Quotation & Proposal Document"
            documentNo={previewQuotation.quotationNo}
          >
            {/* Branded Quotation PDF Document Template */}
            <div className="space-y-6 text-sm">
              {/* Header Header */}
              <div className="flex justify-between items-start border-b-2 border-primary pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    {settings?.logoUrl ? (
                      <img src={settings.logoUrl} alt="Company Logo" className="h-14 w-auto max-w-[180px] object-contain" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl">
                        <Bus className="h-7 w-7" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-extrabold tracking-tight uppercase text-primary">
                        {settings?.companyName || 'Himalayan Vintage Holidays'}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {settings?.address || 'MG Marg, Gangtok, Sikkim — 737101'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-mono space-y-0.5 text-muted-foreground">
                    <div>Phone: {settings?.phone || '+91 98300 12345'}</div>
                    <div>Email: {settings?.email || 'booking@himalayan.co'} | GSTIN: {settings?.gstin || '11AAAAA0000A1Z5'}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-primary uppercase">QUOTATION PROPOSAL</div>
                  <div className="text-sm font-mono font-bold mt-1">{previewQuotation.quotationNo}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Date: {formatDate(previewQuotation.createdAt)}</div>
                  <div className="mt-2">
                    <StatusBadge status={previewQuotation.status} />
                  </div>
                </div>
              </div>

              {/* Client & Trip Info Box */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Prepared For:</div>
                  <div className="font-bold text-base">{previewQuotation.clientName}</div>
                  {previewQuotation.clientPhone && <div className="text-xs font-mono">Mobile: {formatPhoneNumber(previewQuotation.clientPhone)}</div>}
                  {previewQuotation.clientEmail && <div className="text-xs">Email: {previewQuotation.clientEmail}</div>}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Trip Summary:</div>
                  <div className="text-xs font-semibold">Route: {previewQuotation.pickupLocation} → {previewQuotation.destination}</div>
                  <div className="text-xs">Vehicle: <strong className="text-primary">{previewQuotation.vehicle}</strong> ({previewQuotation.passengers} Passengers)</div>
                  <div className="text-xs">Duration: <strong>{previewQuotation.days} Days / {previewQuotation.days - 1} Nights</strong></div>
                  <div className="text-xs">Start Date: {formatDate(previewQuotation.startDate)}</div>
                </div>
              </div>

              {/* Multi-day Itinerary Section */}
              {previewQuotation.itinerary && previewQuotation.itinerary.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-1 text-primary">Day-Wise Tour Itinerary</h3>
                  <div className="space-y-3">
                    {previewQuotation.itinerary.map((item, idx) => (
                      <div key={item.day ? `day-${item.day}-${idx}` : `itinerary-${idx}`} className="border-l-2 border-primary/40 pl-3 py-0.5">
                        <div className="text-xs font-bold text-foreground">
                          Day {item.day}: {item.title}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Breakdown Table */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-1 text-primary">Commercial & Pricing Structure</h3>
                <table className="w-full text-xs border">
                  <thead className="bg-muted font-bold text-left">
                    <tr>
                      <th className="p-2 border-r">Description & Package Details</th>
                      <th className="p-2 border-r text-center">Unit / Days</th>
                      <th className="p-2 border-r text-right">Rate</th>
                      <th className="p-2 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-2 border-r font-medium">
                        {previewQuotation.type === 'tourist' ? 'Tourist Multi-Day Package Rental' : 'Corporate Contract Transportation Charge'}
                        <div className="text-[10px] text-muted-foreground">{previewQuotation.vehicle} with experienced chauffeur</div>
                      </td>
                      <td className="p-2 border-r text-center font-mono">{previewQuotation.days} Days</td>
                      <td className="p-2 border-r text-right font-mono">
                        {formatCurrency(previewQuotation.type === 'tourist' ? previewQuotation.touristPricing?.perDay : previewQuotation.corporatePricing?.perDay)}
                      </td>
                      <td className="p-2 text-right font-mono font-bold">{formatCurrency(previewQuotation.baseAmount)}</td>
                    </tr>
                    {previewQuotation.touristPricing?.extraSightseeing ? (
                      <tr>
                        <td className="p-2 border-r">Additional Sightseeing / Detour Charges</td>
                        <td className="p-2 border-r text-center">-</td>
                        <td className="p-2 border-r text-right">-</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(previewQuotation.touristPricing.extraSightseeing)}</td>
                      </tr>
                    ) : null}
                    {previewQuotation.touristPricing?.permits ? (
                      <tr>
                        <td className="p-2 border-r">State Permit / Protected Area Permit (PAP) Charges</td>
                        <td className="p-2 border-r text-center">-</td>
                        <td className="p-2 border-r text-right">-</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(previewQuotation.touristPricing.permits)}</td>
                      </tr>
                    ) : null}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 font-bold">
                    <tr>
                      <td colSpan={3} className="p-2 text-right border-r">Subtotal Amount:</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(previewQuotation.subtotal)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="p-2 text-right border-r">GST (5% Transport Tax):</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(previewQuotation.gstAmount)}</td>
                    </tr>
                    <tr className="bg-primary/10 text-primary text-sm">
                      <td colSpan={3} className="p-2.5 text-right border-r uppercase">Total Payable Amount:</td>
                      <td className="p-2.5 text-right font-mono font-extrabold">{formatCurrency(previewQuotation.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border rounded p-3 bg-emerald-50/30">
                  <div className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Package Inclusions
                  </div>
                  <ul className="space-y-1.5 mt-2">
                    {(previewQuotation.inclusions || ['Fuel and driver allowance', 'Toll tax and state entry tax', 'Vehicle maintenance and insurance']).map((inc, idx) => (
                      <li key={`inc-${idx}-${inc.slice(0, 5)}`} className="flex items-start gap-2 text-muted-foreground text-xs list-disc ml-4">{inc}</li>
                    ))}
                  </ul>
                </div>

                <div className="border rounded p-3 bg-red-50/30">
                  <div className="text-xs font-bold uppercase text-red-800 dark:text-red-400 mb-1">
                    Package Exclusions
                  </div>
                  <ul className="space-y-1.5 mt-2">
                    {(previewQuotation.exclusions || ['Monument fees and parking', 'Personal expenses and room service', '5% GST extra as applicable']).map((exc, idx) => (
                      <li key={`exc-${idx}-${exc.slice(0, 5)}`} className="flex items-start gap-2 text-muted-foreground text-xs list-disc ml-4">{exc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Terms & Signature */}
              <div className="pt-6 border-t flex justify-between items-end text-xs text-muted-foreground">
                <div>
                  <div className="font-bold text-foreground">Terms & Conditions:</div>
                  <div>1. 50% advance payment required to confirm booking.</div>
                  <div>2. Quotation valid for 15 days from issue date.</div>
                  <div>3. Disputes subject to Gangtok jurisdiction.</div>
                </div>
                <div className="text-center">
                  {settings?.signatureUrl ? (
                    <img src={settings.signatureUrl} alt="Authorized Signatory" className="h-12 w-auto max-w-[150px] mx-auto object-contain mb-1" />
                  ) : (
                    <div className="h-10 border-b mb-1 font-serif italic text-base text-primary flex items-end justify-center pb-1">Himalayan Holidays</div>
                  )}
                  <div className="font-bold text-foreground">Authorized Signatory</div>
                </div>
              </div>
            </div>
          </PdfPreviewModal>
        )}
      </div>
    </DashboardLayout>
  );
}
