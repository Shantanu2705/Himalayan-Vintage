'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Enquiry, EnquiryType, VehicleType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate, formatPhoneNumber } from '@/utils/formatters';
import {
  MessageSquareQuote,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
  FileText,
  CalendarCheck,
  Trash2,
  Edit,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export default function EnquiriesPage() {
  const router = useRouter();
  const { enquiries, addEnquiry, updateEnquiry, deleteEnquiry } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);

  // Form states
  const [formType, setFormType] = useState<EnquiryType | string>('tourist');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Bagdogra Airport (IXB)');
  const [destination, setDestination] = useState('Gangtok, Sikkim');
  const [vehicle, setVehicle] = useState<VehicleType | string>('Innova Crysta');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(5);
  const [passengers, setPassengers] = useState(4);
  const [notes, setNotes] = useState('');

  const openNewModal = () => {
    setEditingEnquiry(null);
    setCustomerName('');
    setMobile('');
    setEmail('');
    setPickupLocation('Bagdogra Airport (IXB)');
    setDestination('Gangtok & Darjeeling 5N/6D');
    setVehicle('Innova Crysta');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDays(5);
    setPassengers(4);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (e: Enquiry) => {
    setEditingEnquiry(e);
    setFormType((e.type || 'tourist') as any);
    setCustomerName(e.customerName || '');
    setMobile(e.mobile || '');
    setEmail(e.email || '');
    setPickupLocation(e.pickupLocation || '');
    setDestination(e.destination || '');
    setVehicle((e.vehicle || 'SUV') as any);
    setStartDate(e.startDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
    setDays(e.days || 1);
    setPassengers(e.passengers || 2);
    setNotes(e.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !mobile) return;

    if (editingEnquiry) {
      await updateEnquiry({
        ...editingEnquiry,
        type: formType,
        customerName,
        mobile,
        email,
        pickupLocation,
        destination,
        vehicle,
        startDate: new Date(startDate).toISOString(),
        days: Number(days),
        passengers: Number(passengers),
        notes,
      });
    } else {
      const newId = `enq-${Date.now()}`;
      await addEnquiry({
        id: newId,
        enquiryNo: `ENQ-2026-${String(enquiries.length + 101).padStart(3, '0')}`,
        type: formType,
        customerName,
        mobile,
        email,
        pickupLocation,
        destination,
        vehicle,
        startDate: new Date(startDate).toISOString(),
        days: Number(days),
        passengers: Number(passengers),
        status: 'new',
        createdAt: new Date().toISOString(),
        notes,
      });
    }
    setIsModalOpen(false);
  };

  const handleConvertToQuotation = (enq: Enquiry) => {
    router.push(`/quotations/new?enquiryId=${enq.id}`);
  };

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      (e.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.mobile || '').includes(searchTerm) ||
      (e.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.enquiryNo || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customer Enquiries & Leads</h1>
            <p className="text-sm text-muted-foreground">
              Manage incoming taxi requests, tourist multi-day packages, and corporate bookings.
            </p>
          </div>
          <Button onClick={openNewModal} className="bg-primary text-primary-foreground font-semibold shadow-sm">
            <PlusCircle className="mr-1.5 h-4 w-4" /> Log New Enquiry
          </Button>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 shadow-soft">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, mobile, destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <div className="flex flex-wrap gap-1">
                {['all', 'new', 'follow-up', 'quotation-sent', 'confirmed', 'cancelled'].map((st) => (
                  <Button
                    key={st}
                    variant={statusFilter === st ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(st)}
                    className="h-8 text-xs capitalize"
                  >
                    {st.replace(/-/g, ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Enquiries Table */}
        <Card className="shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enquiry No & Date</TableHead>
                <TableHead>Customer Details</TableHead>
                <TableHead>Itinerary & Vehicle</TableHead>
                <TableHead>Trip Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No matching enquiries found. Log a new enquiry to get started!
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-semibold">
                      <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">
                        {e.enquiryNo}
                      </span>
                      <span className="block text-[10px] text-muted-foreground mt-1">
                        {formatDate(e.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground">{e.customerName}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                        <Phone className="h-3 w-3 text-primary" /> {formatPhoneNumber(e.mobile)}
                      </div>
                      {e.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                          <Mail className="h-3 w-3" /> {e.email}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span>{e.pickupLocation} → {e.destination}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-primary uppercase">
                          {e.vehicle}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{e.passengers} Passengers</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold">{formatDate(e.startDate)}</div>
                      <span className="text-[11px] text-muted-foreground">{e.days} Days Duration</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={e.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConvertToQuotation(e)}
                          className="h-8 text-xs font-semibold text-primary border-primary/20 hover:bg-primary/10"
                        >
                          <FileText className="mr-1 h-3.5 w-3.5" /> Quote
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(e)}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteEnquiry(e.id)}
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

        {/* Enquiry Create / Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <MessageSquareQuote className="h-5 w-5 text-primary" />
                {editingEnquiry ? 'Edit Enquiry Details' : 'Log Customer Enquiry'}
              </DialogTitle>
              <DialogDescription>
                Record customer travel requirements for quick quotation generating.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 py-2">
              <Tabs value={formType} onValueChange={(val) => setFormType(val as EnquiryType)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tourist" className="font-semibold">Tourist / Holiday Package</TabsTrigger>
                  <TabsTrigger value="corporate" className="font-semibold">Corporate / Business Trip</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cname" className="text-xs font-semibold">Customer / Contact Name *</Label>
                  <Input id="cname" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Rahul Sharma" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cmob" className="text-xs font-semibold">Mobile Number *</Label>
                  <Input id="cmob" required value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. 9830012345" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cmail" className="text-xs font-semibold">Email Address (Optional)</Label>
                <Input id="cmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. rahul@example.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pickup" className="text-xs font-semibold">Pickup Point</Label>
                  <Input id="pickup" required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dest" className="text-xs font-semibold">Destination / Tour Circuit</Label>
                  <Input id="dest" required value={destination} onChange={(e) => setDestination(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Vehicle Type</Label>
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
                  <Label htmlFor="sdate" className="text-xs font-semibold">Trip Start Date</Label>
                  <Input id="sdate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="pax" className="text-xs font-semibold">Pax</Label>
                    <Input id="pax" type="number" min={1} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tdays" className="text-xs font-semibold">Days</Label>
                    <Input id="tdays" type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="enqnotes" className="text-xs font-semibold">Special Instructions / Notes</Label>
                <Input id="enqnotes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Customer wants roof carrier and English speaking driver" />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-primary-foreground font-semibold">
                  {editingEnquiry ? 'Save Changes' : 'Create Enquiry'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
