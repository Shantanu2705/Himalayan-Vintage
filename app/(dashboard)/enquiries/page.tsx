'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Enquiry, EnquiryType, VehicleType, ClientType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/components/ui/button';
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
  Truck,
  Palmtree,
  Sparkles,
} from 'lucide-react';

export default function EnquiriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { enquiries, addEnquiry, updateEnquiry, deleteEnquiry, isInitialized } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);

  // Form states
  const [formType, setFormType] = useState<EnquiryType | string>('tourist');
  const [enquiryPrefix, setEnquiryPrefix] = useState<'TR' | 'PKG'>('TR');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Bagdogra Airport (IXB)');
  const [destination, setDestination] = useState('Gangtok, Sikkim');
  const [vehicle, setVehicle] = useState<VehicleType | string>('Sedan');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(2);
  const [whatsapp, setWhatsapp] = useState('');
  const [clientType, setClientType] = useState<ClientType | string>('B2C');
  const [ticketConfirmed, setTicketConfirmed] = useState(true);
  const [hotelConfirmed, setHotelConfirmed] = useState(false);
  const [hotelType, setHotelType] = useState('Without Hotel');
  const [interestedPlaces, setInterestedPlaces] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [customerRemarks, setCustomerRemarks] = useState('');
  const [enquiryStatus, setEnquiryStatus] = useState('new');

  const openNewModal = () => {
    setIsTypeSelectorOpen(true);
  };

  const handleTypeSelect = (type: 'transport' | 'package') => {
    setIsTypeSelectorOpen(false);
    
    setEditingEnquiry(null);
    setEnquiryPrefix(type === 'package' ? 'PKG' : 'TR');
    setFormType(type === 'package' ? 'tourist' : 'corporate');
    setCustomerName('');
    setMobile('');
    setEmail('');
    setPickupLocation('Bagdogra Airport (IXB)');
    setDestination(type === 'package' ? 'Gangtok & Darjeeling 5N/6D' : 'Gangtok');
    setVehicle('Innova Crysta');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setPassengers(2);
    setWhatsapp('');
    setClientType('B2C');
    setTicketConfirmed(true);
    setHotelConfirmed(false);
    setHotelType('Without Hotel');
    setInterestedPlaces('');
    setSpecialRequirements('');
    setInternalNotes('');
    setCustomerRemarks('');
    setEnquiryStatus('new');
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
    setVehicle((e.vehicle || 'Sedan') as any);
    setStartDate(e.startDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
    setEndDate(e.endDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
    setPassengers(e.passengers || 2);
    setWhatsapp(e.whatsapp || '');
    setClientType(e.clientType || 'B2C');
    setTicketConfirmed(e.ticketRequired ?? true);
    setHotelConfirmed(e.hotelRequired ?? false);
    setHotelType(e.hotelType || 'Without Hotel');
    setInterestedPlaces(e.places || '');
    setSpecialRequirements(e.specialRequirements || '');
    setInternalNotes(e.internalNotes || '');
    setCustomerRemarks(e.customerRemarks || '');
    setEnquiryStatus(e.status || 'new');
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isInitialized && editId && enquiries.length > 0) {
      const enq = enquiries.find(e => e.id === editId);
      if (enq && !isModalOpen) {
        openEditModal(enq);
        // Clear the query parameter so it doesn't re-trigger on refresh
        router.replace('/enquiries');
      }
    }
  }, [isInitialized, editId, enquiries, router]); // omitted isModalOpen to prevent re-triggering

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
        endDate: new Date(endDate).toISOString(),
        days: Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))),
        passengers: Number(passengers),
        whatsapp,
        clientType,
        ticketRequired: ticketConfirmed,
        hotelRequired: hotelConfirmed,
        hotelType,
        places: interestedPlaces,
        specialRequirements,
        internalNotes,
        customerRemarks,
        status: enquiryStatus,
      });
    } else {
      const newId = `enq-${Date.now()}`;
      const typeEnquiries = enquiries.filter(e => (e.type === 'tourist' ? 'PKG' : 'TR') === enquiryPrefix);
      const nextNum = typeEnquiries.length + 1;
      
      await addEnquiry({
        id: newId,
        enquiryNo: `${enquiryPrefix}-${new Date().getFullYear()}-${String(nextNum).padStart(4, '0')}`,
        type: formType,
        customerName,
        mobile,
        email,
        pickupLocation,
        destination,
        vehicle,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        days: Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))),
        passengers: Number(passengers),
        whatsapp,
        clientType,
        ticketRequired: ticketConfirmed,
        hotelRequired: hotelConfirmed,
        hotelType,
        places: interestedPlaces,
        specialRequirements,
        internalNotes,
        customerRemarks,
        status: enquiryStatus,
        createdAt: new Date().toISOString(),
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

  const getFallbackEnquiryNo = (e: Enquiry) => {
    if (e.enquiryNo) return e.enquiryNo;
    const pfx = e.type === 'tourist' ? 'PKG' : 'TR';
    const typeEnquiries = enquiries.filter(eq => (eq.type === 'tourist' ? 'PKG' : 'TR') === pfx);
    const idx = typeEnquiries.findIndex(eq => eq.id === e.id);
    const year = new Date(e.createdAt || Date.now()).getFullYear();
    return `${pfx}-${year}-${String(idx + 1).padStart(4, '0')}`;
  };

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
              <TableRow className="bg-[#effdf5] hover:bg-[#effdf5] border-b-0">
                <TableHead className="font-semibold text-gray-700 text-[13px] h-11 rounded-tl-xl">Serial</TableHead>
                <TableHead className="font-semibold text-gray-700 text-[13px] h-11">Customer</TableHead>
                <TableHead className="font-semibold text-gray-700 text-[13px] h-11">Type</TableHead>
                <TableHead className="font-semibold text-gray-700 text-[13px] h-11">Client</TableHead>
                <TableHead className="font-semibold text-gray-700 text-[13px] h-11">Trip</TableHead>
                <TableHead className="font-semibold text-gray-700 text-[13px] h-11">Vehicle</TableHead>
                <TableHead className="font-semibold text-gray-700 text-[13px] h-11">Dates</TableHead>
                <TableHead className="font-semibold text-gray-700 text-[13px] h-11">Ticket</TableHead>
                <TableHead className="font-semibold text-gray-700 text-[13px] h-11">Status</TableHead>
                <TableHead className="text-right font-semibold text-gray-700 text-[13px] h-11 rounded-tr-xl">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                    No matching enquiries found. Log a new enquiry to get started!
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((e, index) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-[12px] font-medium text-gray-500">
                      {getFallbackEnquiryNo(e)}
                    </TableCell>
                    <TableCell>
                      <div 
                        onClick={() => router.push(`/enquiries/${e.id}`)}
                        className="font-bold text-[13px] text-[#334155] cursor-pointer hover:text-[#0f172a] hover:underline"
                      >
                        {e.customerName}
                      </div>
                      <div className="text-[12px] text-gray-500 mt-0.5">
                        {e.mobile}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center px-3 py-1 border border-gray-200 rounded-full text-[12px] font-semibold text-[#1e293b]">
                        {e.enquiryNo?.startsWith('PKG') ? 'Package' : 'Transport'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center px-3 py-1 border border-gray-200 rounded-full text-[12px] font-semibold text-[#1e293b]">
                        {e.clientType || 'B2B'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-[13px] text-[#334155]">
                        {e.pickupLocation} → {e.destination}
                      </div>
                      <div className="text-[12px] text-[#64748b] mt-0.5 font-medium">
                        {e.passengers} passengers · {e.days} days
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] font-medium text-[#334155]">
                      {e.vehicle}
                    </TableCell>
                    <TableCell className="text-[13px] font-medium text-[#475569]">
                      {e.startDate && (() => {
                        const start = new Date(e.startDate);
                        const end = new Date(start.getTime() + ((e.days || 1) - 1) * 24 * 60 * 60 * 1000);
                        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                      })()}
                    </TableCell>
                    <TableCell>
                      {e.ticketRequired ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 bg-[#e5fcf0] border border-[#064e3b]/10 rounded-full text-[11px] font-bold text-[#064e3b]">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-[11px] font-bold text-gray-500">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select value={e.status} onValueChange={(val) => updateEnquiry({ ...e, status: val as any })}>
                        <SelectTrigger className={cn(
                          "border-0 h-8 px-3 py-0 rounded-full text-[11px] font-bold focus:ring-0 shadow-none text-left flex items-center justify-between min-w-[125px]",
                          e.status === 'new' ? "bg-blue-100 text-blue-700" :
                          e.status === 'confirmed' ? "bg-green-100 text-green-700" :
                          e.status === 'cancelled' ? "bg-red-100 text-red-700" :
                          e.status === 'quotation-sent' ? "bg-[#e2e8f0] text-[#334155]" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="quotation-sent">Quotation Sent</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button 
                          onClick={() => openEditModal(e)}
                          className="text-[13px] font-semibold text-[#475569] hover:text-[#0f172a] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleConvertToQuotation(e)}
                          className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#422006] text-[12px] font-bold transition-colors"
                        >
                          <Sparkles className="h-3.5 w-3.5" /> Quote
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Enquiry Type Selector Modal */}
        <Dialog open={isTypeSelectorOpen} onOpenChange={setIsTypeSelectorOpen}>
          <DialogContent className="sm:max-w-[550px] p-8 bg-[#f0fdf4] border-0 shadow-lg rounded-[24px]">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-[22px] font-bold text-[#064e3b]">Choose enquiry type</DialogTitle>
              <DialogDescription className="text-[15px] text-gray-500 mt-1 font-medium">
                A serial number is generated automatically after you save.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              <button 
                onClick={() => handleTypeSelect('transport')}
                className="flex flex-col items-start p-6 text-left border border-gray-200/60 rounded-[20px] bg-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
              >
                <Truck className="h-[26px] w-[26px] text-yellow-500 mb-4 stroke-[1.5]" />
                <h3 className="font-bold text-[#064e3b] text-[17px] mb-2 tracking-tight">Transport enquiry</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                  Vehicle hire, transfers, routes. Serial TR-YYYY-####
                </p>
              </button>
              
              <button 
                onClick={() => handleTypeSelect('package')}
                className="flex flex-col items-start p-6 text-left border border-gray-200/60 rounded-[20px] bg-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
              >
                <Palmtree className="h-[26px] w-[26px] text-yellow-500 mb-4 stroke-[1.5]" />
                <h3 className="font-bold text-[#064e3b] text-[17px] mb-2 tracking-tight">Tour package enquiry</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                  Multi-day itinerary with sightseeing. Serial PKG-YYYY-####
                </p>
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enquiry Create / Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl p-0 bg-[#effdf5] border-0 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="px-6 py-5 border-b border-gray-100 bg-[#effdf5]">
              <DialogTitle className="text-[20px] font-bold text-[#064e3b]">
                {editingEnquiry ? 'Edit ' : 'New '}{enquiryPrefix === 'PKG' ? 'tour package' : 'transport'} enquiry
              </DialogTitle>
              <DialogDescription className="hidden">Log customer enquiry</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-7 px-6 py-5 overflow-y-auto custom-scrollbar flex-1">
              
              {/* ENQUIRY */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enquiry</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Type</Label>
                    <Select value={enquiryPrefix} onValueChange={(v) => setEnquiryPrefix(v as any)}>
                      <SelectTrigger className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-gray-700 text-[14px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PKG">Tour package enquiry</SelectItem>
                        <SelectItem value="TR">Transport enquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Client type</Label>
                    <Select value={clientType} onValueChange={setClientType as any}>
                      <SelectTrigger className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-gray-700 text-[14px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B2C">B2C</SelectItem>
                        <SelectItem value="B2B">B2B</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Customer name</Label>
                    <Input required className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Mobile</Label>
                    <Input required className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">WhatsApp</Label>
                    <Input className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Email</Label>
                    <Input type="email" className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* TRAVEL */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Travel</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Pickup</Label>
                    <Input required className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="e.g. NJP / IXB / Siliguri" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Destination</Label>
                    <Input required className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Type or pick a destination" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Start date</Label>
                    <Input type="date" className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-gray-600 text-[14px]" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">End date</Label>
                    <Input type="date" className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-gray-600 text-[14px]" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Passengers</Label>
                    <Input type="number" min={1} className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Vehicle</Label>
                    <Select value={vehicle} onValueChange={(v) => setVehicle(v as VehicleType)}>
                      <SelectTrigger className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Innova Crysta">Innova Crysta</SelectItem>
                        <SelectItem value="Tempo Traveller">Tempo Traveller</SelectItem>
                        <SelectItem value="22 Seater Bus">22 Seater Bus</SelectItem>
                        <SelectItem value="27 Seater Bus">27 Seater Bus</SelectItem>
                        <SelectItem value="Premium Coach">Premium Coach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* SERVICES */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Services</h4>
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Ticket Confirmed</Label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setTicketConfirmed(true)} className={cn("px-5 py-1.5 rounded-full text-[13px] font-semibold border transition-colors", ticketConfirmed ? "bg-[#e5fcf0] border-[#064e3b]/20 text-[#064e3b]" : "bg-transparent border-gray-200/80 text-gray-500 hover:bg-black/5")}>Yes</button>
                      <button type="button" onClick={() => setTicketConfirmed(false)} className={cn("px-5 py-1.5 rounded-full text-[13px] font-semibold border transition-colors", !ticketConfirmed ? "bg-red-50 border-red-200 text-red-600" : "bg-transparent border-gray-200/80 text-gray-500 hover:bg-black/5")}>No</button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Hotel Confirmed</Label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setHotelConfirmed(true)} className={cn("px-5 py-1.5 rounded-full text-[13px] font-semibold border transition-colors", hotelConfirmed ? "bg-[#e5fcf0] border-[#064e3b]/20 text-[#064e3b]" : "bg-transparent border-gray-200/80 text-gray-500 hover:bg-black/5")}>Yes</button>
                      <button type="button" onClick={() => setHotelConfirmed(false)} className={cn("px-5 py-1.5 rounded-full text-[13px] font-semibold border transition-colors", !hotelConfirmed ? "bg-red-50 border-red-200 text-red-600" : "bg-transparent border-gray-200/80 text-gray-500 hover:bg-black/5")}>No</button>
                    </div>
                  </div>
                  <div className="space-y-1.5 w-full sm:w-[48%]">
                    <Label className="text-[13px] font-semibold text-gray-800">Hotel type</Label>
                    <Select value={hotelType} onValueChange={setHotelType}>
                      <SelectTrigger className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="With Hotel">With Hotel</SelectItem>
                        <SelectItem value="Without Hotel">Without Hotel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* ADDITIONAL DETAILS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional details</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Interested places</Label>
                    <Textarea className="bg-transparent border-gray-200/80 shadow-none rounded-[16px] min-h-[90px] resize-none text-[14px]" value={interestedPlaces} onChange={(e) => setInterestedPlaces(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Special requirements</Label>
                    <Textarea className="bg-transparent border-gray-200/80 shadow-none rounded-[16px] min-h-[90px] resize-none text-[14px]" value={specialRequirements} onChange={(e) => setSpecialRequirements(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Internal notes</Label>
                    <Textarea className="bg-transparent border-gray-200/80 shadow-none rounded-[16px] min-h-[90px] resize-none text-[14px]" value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Customer remarks</Label>
                    <Textarea className="bg-transparent border-gray-200/80 shadow-none rounded-[16px] min-h-[90px] resize-none text-[14px]" value={customerRemarks} onChange={(e) => setCustomerRemarks(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-800">Status</Label>
                    <Select value={enquiryStatus} onValueChange={setEnquiryStatus}>
                      <SelectTrigger className="bg-transparent border-gray-200/80 shadow-none h-10 rounded-[12px] text-[14px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="quotation-sent">Quotation-sent</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200/50 bg-[#effdf5] px-6 py-4 flex justify-end gap-3 rounded-b-xl shrink-0 mt-2">
                <Button type="button" variant="outline" className="rounded-full px-6 font-semibold border-gray-300 text-gray-700 bg-transparent hover:bg-black/5" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-full px-7 font-bold shadow-none border-0">
                  {editingEnquiry ? 'Save Changes' : 'Create enquiry'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
