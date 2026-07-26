'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Booking, VehicleType, BookingStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { QrPaymentModal } from '@/components/shared/qr-payment-modal';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';
import {
  CalendarCheck,
  PlusCircle,
  Search,
  Filter,
  Receipt,
  Trash2,
  Edit,
  User,
  MapPin,
  Car,
  QrCode,
  Phone,
  CheckCircle2,
} from 'lucide-react';

function BookingsHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQuotationId = searchParams.get('fromQuotationId');

  const { bookings, addBooking, updateBooking, deleteBooking, drivers, vehicles, quotations } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // QR Payment modal state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedBookingForQr, setSelectedBookingForQr] = useState<Booking | null>(null);

  // Form states
  const [clientName, setClientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pickup, setPickup] = useState('Bagdogra Airport (IXB)');
  const [destination, setDestination] = useState('Gangtok & Darjeeling Circuit');
  const [vehicle, setVehicle] = useState<VehicleType | string>('Innova Crysta');
  const [driverId, setDriverId] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]);
  const [amount, setAmount] = useState(25000);
  const [advance, setAdvance] = useState(12500);
  const [status, setStatus] = useState<BookingStatus>('confirmed');
  const [notes, setNotes] = useState('');

  // Auto conversion from quotation
  useEffect(() => {
    if (fromQuotationId) {
      const q = quotations.find((item) => item.id === fromQuotationId);
      if (q) {
        setClientName(q.clientName || '');
        setMobile(q.clientPhone || q.mobile || '');
        setPickup(q.pickupLocation || '');
        setDestination(q.destination || '');
        setVehicle(q.vehicle || '');
        if (q.startDate) {
          setStartDate(q.startDate.split('T')[0]);
          const eD = new Date(new Date(q.startDate).getTime() + ((q.days || 1) - 1) * 86400000);
          setEndDate(eD.toISOString().split('T')[0]);
        }
        setAmount(q.totalAmount || 0);
        setAdvance(Math.round((q.totalAmount || 0) * 0.5));
        setEditingBooking(null);
        setIsModalOpen(true);
      }
    }
  }, [fromQuotationId, quotations]);

  const openNewModal = () => {
    setEditingBooking(null);
    setClientName('');
    setMobile('');
    setPickup('Bagdogra Airport (IXB)');
    setDestination('Gangtok & Darjeeling Circuit');
    setVehicle('Innova Crysta');
    setDriverId(drivers[0]?.id || '');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]);
    setAmount(25000);
    setAdvance(12500);
    setStatus('confirmed');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Booking) => {
    setEditingBooking(b);
    setClientName(b.clientName || '');
    setMobile(b.mobile || '');
    setPickup(b.pickup || '');
    setDestination(b.destination || '');
    setVehicle((b.vehicle || '') as any);
    setDriverId(b.driverId || '');
    setStartDate(b.startDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
    setEndDate(b.endDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
    setAmount(b.amount || 0);
    setAdvance(b.advance || 0);
    setStatus((b.status || 'confirmed') as any);
    setNotes(b.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !mobile) return;

    if (editingBooking) {
      await updateBooking({
        ...editingBooking,
        clientName,
        mobile,
        pickup,
        destination,
        vehicle,
        driverId: driverId || undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        amount: Number(amount),
        advance: Number(advance),
        status,
        notes,
      });
    } else {
      const newId = `b-${Date.now()}`;
      await addBooking({
        id: newId,
        bookingNo: `BKG-2026-${String(bookings.length + 101).padStart(3, '0')}`,
        clientName,
        mobile,
        pickup,
        destination,
        vehicle,
        driverId: driverId || undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        amount: Number(amount),
        advance: Number(advance),
        status,
        createdAt: new Date().toISOString(),
        notes,
      });
    }
    setIsModalOpen(false);
  };

  const handleConvertToInvoice = (b: Booking) => {
    router.push(`/billing?fromBookingId=${b.id}`);
  };

  const handleOpenQrPay = (b: Booking) => {
    setSelectedBookingForQr(b);
    setQrModalOpen(true);
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      (b.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.bookingNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.mobile || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings & Dispatch Master</h1>
          <p className="text-sm text-muted-foreground">
            Manage trip reservations, assign drivers and vehicles, and track collection statuses.
          </p>
        </div>
        <Button onClick={openNewModal} className="bg-primary text-primary-foreground font-semibold shadow-sm">
          <PlusCircle className="mr-1.5 h-4 w-4" /> Log Booking
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search booking #, client name, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <div className="flex flex-wrap gap-1">
              {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((st) => (
                <Button
                  key={st}
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

      {/* Bookings Table */}
      <Card className="shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking # & Date</TableHead>
              <TableHead>Client Details</TableHead>
              <TableHead>Route & Dates</TableHead>
              <TableHead>Driver Assigned</TableHead>
              <TableHead>Payment & Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No bookings found. Click "Log Booking" to schedule a trip!
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => {
                const drv = drivers.find((d) => d.id === b.driverId);
                const balance = (b.amount || 0) - (b.advance || 0);
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-semibold">
                      <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">
                        {b.bookingNo}
                      </span>
                      <span className="block text-[10px] text-muted-foreground mt-1">
                        {formatDate(b.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground">{b.clientName}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                        <Phone className="h-3 w-3 text-primary" /> {formatPhoneNumber(b.mobile)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span className="truncate max-w-[150px]">{b.pickup} → {b.destination}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-primary uppercase">
                          {b.vehicle}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{formatDate(b.startDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {drv ? (
                        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> {drv.name}
                          </div>
                          <span className="block text-[10px] text-muted-foreground font-mono">{drv.mobile}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                          Unassigned Driver
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-bold text-foreground">{formatCurrency(b.amount)}</div>
                      <div className="text-[10px] text-muted-foreground">
                        Adv: <span className="text-emerald-600 font-semibold">{formatCurrency(b.advance)}</span> | Bal:{' '}
                        <span className="text-red-600 font-semibold">{formatCurrency(balance)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold text-primary border-primary/20 hover:bg-primary/10"
                          onClick={() => handleConvertToInvoice(b)}
                          title="Generate Invoice"
                        >
                          <Receipt className="mr-1 h-3.5 w-3.5" /> Invoice
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          onClick={() => handleOpenQrPay(b)}
                          title="Show Payment QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(b)}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteBooking(b.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              {editingBooking ? 'Edit Booking Reservation' : 'Log New Booking Trip'}
            </DialogTitle>
            <DialogDescription>
              Assign vehicle and driver to confirm trip reservation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cname" className="text-xs font-semibold">Client Name *</Label>
                <Input id="cname" required value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cmob" className="text-xs font-semibold">Mobile Number *</Label>
                <Input id="cmob" required value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pickup" className="text-xs font-semibold">Pickup Point</Label>
                <Input id="pickup" required value={pickup} onChange={(e) => setPickup(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dest" className="text-xs font-semibold">Destination Circuit</Label>
                <Input id="dest" required value={destination} onChange={(e) => setDestination(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Vehicle Assigned</Label>
                <Select value={vehicle} onValueChange={(v) => setVehicle(v as VehicleType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Innova Crysta">Innova Crysta</SelectItem>
                    <SelectItem value="Toyota Innova">Toyota Innova</SelectItem>
                    <SelectItem value="Scorpio N / Classic">Scorpio N / Classic</SelectItem>
                    <SelectItem value="Maruti Ertiga / Rumion">Maruti Ertiga / Rumion</SelectItem>
                    <SelectItem value="Force Traveller 12-Seater">Force Traveller 12-Seater</SelectItem>
                    <SelectItem value="Force Traveller 17-Seater">Force Traveller 17-Seater</SelectItem>
                    <SelectItem value="Luxury Coach 25-Seater">Luxury Coach 25-Seater</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Assign Driver</Label>
                <Select value={driverId} onValueChange={(v) => setDriverId(v)}>
                  <SelectTrigger><SelectValue placeholder="Select Driver..." /></SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.mobile})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Booking Status</Label>
                <Select value={status} onValueChange={(s) => setStatus(s as BookingStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Total Amount (₹)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="font-mono font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Advance Paid (₹)</Label>
                <Input type="number" value={advance} onChange={(e) => setAdvance(Number(e.target.value))} className="font-mono text-emerald-600 font-bold" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bnotes" className="text-xs font-semibold">Driver Instructions / Notes</Label>
              <Input id="bnotes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Flight lands at 12:30 PM, meet at terminal exit with name board" />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold">
                {editingBooking ? 'Save Reservation' : 'Confirm & Log Booking'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR Code Payment Modal */}
      {selectedBookingForQr && (
        <QrPaymentModal
          isOpen={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setSelectedBookingForQr(null);
          }}
          amount={(selectedBookingForQr.amount || 0) - (selectedBookingForQr.advance || 0)}
          referenceNo={selectedBookingForQr.bookingNo}
          clientName={selectedBookingForQr.clientName}
        />
      )}
    </div>
  );
}

export default function BookingsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Bookings Hub...</div>}>
        <BookingsHubContent />
      </Suspense>
    </DashboardLayout>
  );
}
