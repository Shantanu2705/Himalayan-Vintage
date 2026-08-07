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
import { QuotationPdfTemplate } from '@/components/pdf/quotation-template';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    const newNo = `HVH/${new Date().getFullYear()}/${String(quotations.length + 1001).padStart(4, '0')}`;
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
              <TableRow className="border-b-gray-100">
                <TableHead className="font-semibold text-gray-500">Quotation #</TableHead>
                <TableHead className="font-semibold text-gray-500">Customer</TableHead>
                <TableHead className="font-semibold text-gray-500">Destination</TableHead>
                <TableHead className="font-semibold text-gray-500">Travel Date</TableHead>
                <TableHead className="font-semibold text-gray-500">Type</TableHead>
                <TableHead className="font-semibold text-gray-500">Status</TableHead>
                <TableHead className="font-semibold text-gray-500 text-right">Total</TableHead>
                <TableHead className="font-semibold text-gray-500 text-center w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No quotations found. Click "Create Quotation" to build a new estimate!
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((q, idx) => (
                  <TableRow key={q.id ? `${q.id}-${idx}` : `quote-${idx}`} className="border-b-gray-50 hover:bg-gray-50/50">
                    <TableCell className="font-bold text-gray-900">
                      <div onClick={() => handleEdit(q)} className="cursor-pointer hover:text-primary hover:underline transition-colors">
                        {q.quotationNo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{q.clientName || q.customerName}</div>
                      {(q.clientPhone || q.mobile) && (
                        <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                          {q.clientPhone || q.mobile}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600 font-medium text-sm">
                      {q.destination}
                    </TableCell>
                    <TableCell className="text-gray-600 font-medium text-sm">
                      {formatDate(q.startDate)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800 capitalize tracking-wide">
                        {q.type || q.clientType || 'Tourist'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={q.status || 'draft'} 
                        onValueChange={(val) => updateQuotation({ ...q, status: val })}
                      >
                        <SelectTrigger className={`h-8 w-[100px] text-[11px] font-bold border-0 shadow-none focus:ring-0 rounded-full ${
                          q.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          q.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          q.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft" className="text-xs font-bold text-orange-800">Draft</SelectItem>
                          <SelectItem value="sent" className="text-xs font-bold text-blue-800">Sent</SelectItem>
                          <SelectItem value="confirmed" className="text-xs font-bold text-emerald-800">Confirmed</SelectItem>
                          <SelectItem value="cancelled" className="text-xs font-bold text-red-800">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-extrabold text-gray-900 text-sm text-right">
                      {formatCurrency(q.totalAmount || (q as any).grandTotal || 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this quotation?")) {
                            deleteQuotation(q.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
            <div className="overflow-hidden bg-white">
              <QuotationPdfTemplate quotation={previewQuotation} settings={settings} />
            </div>
          </PdfPreviewModal>
        )}
      </div>
    </DashboardLayout>
  );
}
