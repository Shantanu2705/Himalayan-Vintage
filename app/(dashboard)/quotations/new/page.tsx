'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Trash2, Plus, Download, Printer, Mail, MessageCircle, Settings, Check, X, ChevronDown } from 'lucide-react';
import { PdfPreviewModal } from '@/components/shared/pdf-preview-modal';
import { QuotationPdfTemplate } from '@/components/pdf/quotation-template';

interface VehicleEntry {
  id: string;
  vehicle: string;
  qty: number;
  days: number;
  rate: number;
  packagePrice: string;
  total: number;
  tbd1: string;
  tbd2: string;
  driverDetails: string;
}

function SmartQuotationBuilderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enquiryId = searchParams.get('enquiryId');
  const editId = searchParams.get('editId');
  
  const { enquiries, quotations, updateQuotation, addQuotation, deleteQuotation, settings } = useFleetStore();

  const [status, setStatus] = useState('Draft');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Section 1 & 2
  const [qType, setQType] = useState('Tour package');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [destination, setDestination] = useState('');
  const [persons, setPersons] = useState('15');
  const [clientType, setClientType] = useState('B2B');
  
  const [startDate, setStartDate] = useState('2026-08-30');
  const [endDate, setEndDate] = useState('2026-09-03');
  const [packageDuration, setPackageDuration] = useState('3N / 4D');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');

  // Itinerary
  const [itinerary, setItinerary] = useState([
    { id: '1', title: 'Arrival at Siliguri', desc: 'Pickup and transfer to Pelling.' },
    { id: '2', title: 'Sightseeing Day 2', desc: 'Full-day sightseeing.' },
    { id: '3', title: 'Sightseeing Day 3', desc: 'Full-day sightseeing.' },
    { id: '4', title: 'Departure from Siliguri', desc: 'Full-day sightseeing.' },
  ]);

  // Vehicles
  const [vehicles, setVehicles] = useState<VehicleEntry[]>([
    { id: 'v1', vehicle: 'Sedan', qty: 1, days: 4, rate: 0, packagePrice: 'Fixed deal', total: 0, tbd1: 'TBD', tbd2: 'TBD', driverDetails: 'Driver phone (+91 9876543210)' }
  ]);

  // Rate Card
  const [rateCard, setRateCard] = useState({
    perKm: 0, perHour: 0, extraKm: 0, extraHour: 0,
    driverAllowance: 0, nightCharge: 0, toll: 0, parking: 0,
    gst: 0, additional: 0,
    perDay: 0, packagePrice: 0, permits: 0, extraVehicle: 0,
  });

  // Advance
  const [advancePercent, setAdvancePercent] = useState(30);

  // Inclusions/Exclusions/Permits
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [permits, setPermits] = useState<string[]>([]);
  const [extraSightseeing, setExtraSightseeing] = useState<string[]>([]);

  // Accordions
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [pickupTiming, setPickupTiming] = useState('');
  const [dropTiming, setDropTiming] = useState('');
  const [driverInstructions, setDriverInstructions] = useState('');
  const [vehicleNotes, setVehicleNotes] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [remarks, setRemarks] = useState('');
  useEffect(() => {
    if (enquiryId) {
      const enq = enquiries.find(e => e.id === enquiryId);
      if (enq) {
        setCustomerName(enq.customerName || '');
        setMobile(enq.mobile || '');
        setDestination(enq.destination || '');
        setPersons(String(enq.passengers || 2));
        setClientType(enq.clientType || 'B2B');
        setPickup(enq.pickupLocation || '');
        setDrop(enq.destination || '');
        if (enq.startDate) setStartDate(enq.startDate.split('T')[0]);
      }
    }
    
    if (editId) {
      const quote = quotations.find(q => q.id === editId) as any;
      if (quote) {
        setCustomerName(quote.clientName || quote.customerName || '');
        setMobile(quote.clientPhone || quote.mobile || '');
        setDestination(quote.destination || '');
        setPersons(String(quote.passengers || 2));
        setClientType(quote.type || quote.clientType || 'B2B');
        setPickup(quote.pickupLocation || '');
        setDrop(quote.drop || quote.destination || '');
        if (quote.startDate) setStartDate(quote.startDate.split('T')[0]);
        if (quote.endDate) setEndDate(quote.endDate.split('T')[0]);
        if (quote.packageDuration) setPackageDuration(quote.packageDuration);
        setStatus(quote.status || 'Draft');
        setQType(quote.qType || quote.type || 'Tour package');
        
        if (quote.itinerary && quote.itinerary.length > 0) setItinerary(quote.itinerary);
        
        if (quote.vehicles && quote.vehicles.length > 0) {
          setVehicles(quote.vehicles);
        } else {
          setVehicles([{ id: 'v1', vehicle: quote.vehicle || 'Sedan', qty: 1, days: quote.days || 1, rate: quote.baseAmount || 0, packagePrice: '', total: quote.baseAmount || 0, tbd1: '', tbd2: '', driverDetails: '' }]);
        }
        
        if (quote.rateCard) {
          setRateCard(quote.rateCard);
        } else {
          setRateCard({
            perKm: 0, perHour: 0, extraKm: 0, extraHour: 0,
            driverAllowance: 0, nightCharge: 0, toll: 0, parking: 0,
            gst: quote.gstPercent || 0, additional: 0,
            perDay: 0, packagePrice: 0, permits: 0, extraVehicle: 0,
          });
        }
        
        if (quote.advancePercent !== undefined) setAdvancePercent(quote.advancePercent);
        if (quote.inclusions) setInclusions(quote.inclusions);
        if (quote.exclusions) setExclusions(quote.exclusions);
        if (quote.permits) setPermits(quote.permits);
        if (quote.extraSightseeing) setExtraSightseeing(quote.extraSightseeing);
        
        setAdditionalDetails(quote.additionalDetails || '');
        setPickupTiming(quote.pickupTiming || '');
        setDropTiming(quote.dropTiming || '');
        setDriverInstructions(quote.driverInstructions || '');
        setVehicleNotes(quote.vehicleNotes || '');
        setAdditionalNotes(quote.additionalNotes || '');
        setRemarks(quote.remarks || '');
      }
    }
  }, [enquiryId, editId, enquiries, quotations]);

  const handleSave = () => {
    const payload = {
      clientName: customerName,
      customerName: customerName,
      clientPhone: mobile,
      mobile: mobile,
      destination,
      passengers: parseInt(persons) || 2,
      type: clientType,
      clientType,
      pickupLocation: pickup,
      drop,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      packageDuration,
      status: status.toLowerCase(),
      qType,
      itinerary,
      vehicles,
      rateCard,
      advancePercent,
      inclusions,
      exclusions,
      permits,
      extraSightseeing,
      additionalDetails,
      pickupTiming,
      dropTiming,
      driverInstructions,
      vehicleNotes,
      additionalNotes,
      remarks,
      baseAmount: subtotal,
      totalAmount: grandTotal,
      grandTotal: grandTotal,
      gstAmount: gstAmount,
    };

    if (editId) {
      const quoteToUpdate = quotations.find(q => q.id === editId);
      if (quoteToUpdate) {
        updateQuotation({ ...quoteToUpdate, ...payload });
      }
    } else {
      addQuotation({
        id: 'q-' + Date.now(),
        date: new Date().toISOString(),
        ...payload
      } as any);
    }
    router.push('/quotations');
  };

  // Math
  const vTotal = vehicles.reduce((acc, v) => acc + (Number(v.total) || 0), 0);
  const toll = Number(rateCard?.toll) || 0;
  const parking = Number(rateCard?.parking) || 0;
  const additional = Number(rateCard?.additional) || 0;
  const driverAllowance = Number(rateCard?.driverAllowance) || 0;
  const gst = Number(rateCard?.gst) || 0;
  const advPct = Number(advancePercent) || 0;

  const packagePrice = Number(rateCard?.packagePrice) || 0;
  const permitsAmt = Number(rateCard?.permits) || 0;
  const extraVehicle = Number(rateCard?.extraVehicle) || 0;

  const subtotal = (packagePrice || vTotal) + permitsAmt + toll + parking + extraVehicle + additional;

  const gstAmount = (subtotal * gst) / 100;
  const grandTotal = subtotal + gstAmount;
  const advanceAmount = (grandTotal * advPct) / 100;
  const balance = grandTotal - advanceAmount;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#effdf5] pb-24 font-sans text-[#1e293b]">
        
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-[#effdf5] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="h-9 px-4 rounded-full bg-[#f1ebd6] flex items-center text-sm font-semibold text-[#422006] hover:bg-[#e8dcb9] transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quotations
            </button>
          </div>
          <div className="flex items-center gap-2">
            {editId ? (
              <>
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this quotation?")) {
                      deleteQuotation(editId);
                      router.push('/quotations');
                    }
                  }}
                  className="h-9 px-4 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 flex items-center text-[13px] font-bold text-red-600 transition-colors shadow-sm"
                  title="Delete Quotation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={handleSave}
                  className="h-9 px-5 rounded-full bg-primary hover:bg-primary/90 flex items-center text-[13px] font-bold text-primary-foreground transition-colors shadow-sm"
                >
                  <Check className="h-4 w-4 mr-2" /> Update Quotation
                </button>
              </>
            ) : (
              <button 
                onClick={handleSave}
                className="h-9 px-5 rounded-full bg-primary hover:bg-primary/90 flex items-center text-[13px] font-bold text-primary-foreground transition-colors shadow-sm"
              >
                <Check className="h-4 w-4 mr-2" /> Save Quotation
              </button>
            )}
            <button className="h-9 px-4 rounded-full border border-gray-200 bg-white/50 flex items-center text-[13px] font-semibold text-gray-700 hover:bg-white transition-colors">
              <MessageCircle className="h-3.5 w-3.5 mr-2" /> WhatsApp
            </button>
            <button className="h-9 px-4 rounded-full border border-gray-200 bg-white/50 flex items-center text-[13px] font-semibold text-gray-700 hover:bg-white transition-colors">
              <Mail className="h-3.5 w-3.5 mr-2" /> Email
            </button>
            <button onClick={() => setIsPreviewOpen(true)} className="h-9 px-5 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] flex items-center text-[13px] font-bold text-[#422006] transition-colors shadow-sm">
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </button>
          </div>
        </div>

        {/* PDF Preview Modal */}
        {isPreviewOpen && (
          <PdfPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            title="Quotation Document"
            documentNo={`Ref: ${editId ? editId.substring(0,8).toUpperCase() : 'NEW'}`}
          >
            <QuotationPdfTemplate 
              quotation={{
                id: editId || 'NEW',
                clientName: customerName,
                customerName: customerName,
                clientPhone: mobile,
                clientType,
                pickupLocation: pickup,
                destination: destination || drop,
                packageDuration,
                passengers: persons,
                startDate,
                itinerary,
                vehicles,
                baseAmount: subtotal,
                gstAmount: gstAmount,
                grandTotal: grandTotal,
                advancePercent: advancePercent,
                rateCard,
                inclusions,
                exclusions,
                remarks
              }} 
              settings={settings} 
            />
          </PdfPreviewModal>
        )}

        <div className="max-w-[1200px] mx-auto px-6 space-y-4">
          
          {/* Customer & Tour */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[17px] font-bold text-[#1e293b]">Customer & tour</h2>
                <p className="text-[12px] text-gray-500 font-medium">Quotation HVH/2026/5366 - Package</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-colors
                  ${status === 'Draft' ? 'text-orange-500 bg-orange-50 border-orange-100' :
                    status === 'Sent' ? 'text-blue-500 bg-blue-50 border-blue-100' :
                    status === 'Confirmed' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' :
                    status === 'Cancelled' ? 'text-rose-500 bg-rose-50 border-rose-100' : ''
                  }`}
                >
                  {status}
                </span>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className={`h-8 w-[110px] border font-bold text-[12px] rounded-full focus:ring-0 transition-colors
                    ${status === 'Draft' ? 'bg-orange-50 border-orange-200/50 text-orange-700' :
                      status === 'Sent' ? 'bg-blue-50 border-blue-200/50 text-blue-700' :
                      status === 'Confirmed' ? 'bg-emerald-50 border-emerald-200/50 text-emerald-700' :
                      status === 'Cancelled' ? 'bg-rose-50 border-rose-200/50 text-rose-700' : ''
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Type</Label>
                <Select value={qType} onValueChange={setQType}>
                  <SelectTrigger className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tour package">Tour package</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Customer name</Label>
                <Input className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Mobile</Label>
                <Input className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none" value={mobile} onChange={e=>setMobile(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Destination</Label>
                <Input className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none" value={destination} onChange={e=>setDestination(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Persons</Label>
                <Input className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none" value={persons} onChange={e=>setPersons(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Client type</Label>
                <Select value={clientType} onValueChange={setClientType}>
                  <SelectTrigger className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">B2B</SelectItem>
                    <SelectItem value="B2C">B2C</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Travel Info */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50">
            <h2 className="text-[17px] font-bold text-[#1e293b] mb-6">Travel information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Travel start date</Label>
                <div className="relative">
                   <Input type="date" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none pl-4" value={startDate} onChange={e=>setStartDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Travel end date</Label>
                <div className="relative">
                   <Input type="date" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none pl-4" value={endDate} onChange={e=>setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Package duration</Label>
                <Input className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none" value={packageDuration} onChange={e=>setPackageDuration(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Pickup location</Label>
                <Input className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none" value={pickup} onChange={e=>setPickup(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-gray-700">Drop location</Label>
                <Input className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none" value={drop} onChange={e=>setDrop(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Day-wise itinerary */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[17px] font-bold text-[#1e293b]">Day-wise itinerary</h2>
                <p className="text-[12px] text-gray-500 font-medium">First day auto-suggests arrival at {pickup || 'location'}; last day departure. All editable.</p>
              </div>
              <Button onClick={() => setItinerary([...itinerary, { id: Date.now().toString(), title: '', desc: '' }])} variant="outline" className="h-9 px-4 rounded-full bg-[#e5fcf0] border-[#e5fcf0] text-[#064e3b] font-bold hover:bg-[#d1fae5] shadow-none transition-colors">
                <Plus className="h-4 w-4 mr-1.5" /> Add day
              </Button>
            </div>
            
            <div className="space-y-4">
              {itinerary.map((day, idx) => (
                <div key={day.id || `day-${idx}`} className="relative pl-12">
                  {/* Timeline line */}
                  {idx !== itinerary.length - 1 && <div className="absolute left-6 top-10 bottom-[-24px] w-[1px] bg-gray-200"></div>}
                  
                  {/* Day marker */}
                  <div className="absolute left-1.5 top-3 flex items-center justify-center w-[30px] h-[30px] rounded-full bg-[#fffbeb] text-[#d97706] text-[13px] font-bold shadow-[0_0_0_4px_white] z-10">
                    {idx + 1}
                  </div>
                  <div className="absolute left-[-16px] top-4 text-gray-300">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                  </div>

                  <div className="border border-gray-200 rounded-[16px] overflow-hidden bg-white group transition-colors shadow-[0_2px_4px_0_rgba(0,0,0,0.01)]">
                    <div className="flex items-center px-4 py-2 border-b border-gray-100">
                      <Input className="h-9 border-0 bg-transparent px-0 font-medium text-[15px] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400" value={day.title} onChange={e => {
                        const newI = [...itinerary]; newI[idx].title = e.target.value; setItinerary(newI);
                      }} placeholder="Enter day title..." />
                      <button onClick={() => setItinerary(itinerary.filter(i => i.id !== day.id))} className="text-red-400 hover:text-red-600 p-2 transition-opacity ml-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Textarea 
                      className="border-0 bg-transparent px-4 py-3 min-h-[60px] text-[14px] text-gray-600 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none placeholder:text-gray-400"
                      value={day.desc}
                      placeholder="Enter day description..."
                      onChange={e => {
                        const newI = [...itinerary]; newI[idx].desc = e.target.value; setItinerary(newI);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicles */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[17px] font-bold text-[#1e293b]">Vehicles</h2>
              <Button onClick={() => setVehicles([...vehicles, { id: Date.now().toString(), vehicle: 'Sedan', qty: 1, days: 1, rate: 0, packagePrice: '', total: 0, tbd1: '', tbd2: '', driverDetails: '' }])} variant="outline" className="h-9 px-4 rounded-full bg-[#e5fcf0] border-[#e5fcf0] text-[#064e3b] font-bold shadow-none hover:bg-[#d1fae5] transition-colors">
                <Plus className="h-4 w-4 mr-1.5" /> Add vehicle
              </Button>
            </div>
            
            <div className="space-y-4">
              {vehicles.map((v, idx) => (
                <div key={v.id || `veh-${idx}`} className="border border-gray-100 rounded-[16px] p-4 bg-[#f8fafc]">
                  <div className="flex flex-wrap lg:flex-nowrap gap-3 items-end mb-3">
                    <div className="w-full lg:w-48 space-y-1.5">
                      <Label className="text-[11px] font-bold text-gray-700">Vehicle</Label>
                      <Select value={v.vehicle} onValueChange={(val) => { const nv=[...vehicles]; nv[idx].vehicle=val; setVehicles(nv); }}>
                        <SelectTrigger className="h-11 rounded-[12px] border-gray-200 bg-white text-[13px] font-medium shadow-sm"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Sedan">Sedan</SelectItem><SelectItem value="SUV">SUV</SelectItem><SelectItem value="Innova">Innova</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="w-28 space-y-1.5">
                      <Label className="text-[11px] font-bold text-gray-700">Qty</Label>
                      <div className="flex items-center h-11 rounded-[12px] border border-gray-200 bg-white px-2 shadow-sm">
                        <button className="text-gray-400 hover:text-gray-700 font-bold px-2 w-8 h-full flex items-center justify-center rounded-l" onClick={() => {const nv=[...vehicles]; nv[idx].qty=Math.max(1, nv[idx].qty-1); nv[idx].total = nv[idx].qty * nv[idx].days * nv[idx].rate; setVehicles(nv);}}>-</button>
                        <input className="w-full text-center text-[13px] font-medium border-0 focus:ring-0 p-0" value={v.qty} onChange={e=>{const nv=[...vehicles]; nv[idx].qty=Number(e.target.value); nv[idx].total = nv[idx].qty * nv[idx].days * nv[idx].rate; setVehicles(nv);}} />
                        <button className="text-[#064e3b] hover:text-[#064e3b] font-bold px-2 w-8 h-full flex items-center justify-center rounded-r" onClick={() => {const nv=[...vehicles]; nv[idx].qty+=1; nv[idx].total = nv[idx].qty * nv[idx].days * nv[idx].rate; setVehicles(nv);}}>+</button>
                      </div>
                    </div>
                    <div className="w-24 space-y-1.5">
                      <Label className="text-[11px] font-bold text-gray-700">Days</Label>
                      <Input type="number" className="h-11 rounded-[12px] border-gray-200 bg-white text-[13px] font-medium shadow-sm" value={v.days} onChange={e=>{const nv=[...vehicles]; nv[idx].days=Number(e.target.value); nv[idx].total = nv[idx].qty * nv[idx].days * nv[idx].rate; setVehicles(nv);}} />
                    </div>
                    <div className="w-32 space-y-1.5">
                      <Label className="text-[11px] font-bold text-gray-700">Rate (₹)</Label>
                      <Input type="number" className="h-11 rounded-[12px] border-gray-200 bg-white text-[13px] font-medium shadow-sm" value={v.rate} onChange={e=>{const nv=[...vehicles]; nv[idx].rate=Number(e.target.value); nv[idx].total = nv[idx].qty * nv[idx].days * nv[idx].rate; setVehicles(nv);}} />
                    </div>
                    <div className="w-full lg:w-40 space-y-1.5">
                      <Label className="text-[11px] font-bold text-gray-700">Package price (₹)</Label>
                      <Input className="h-11 rounded-[12px] border-gray-200 bg-white text-[13px] font-medium shadow-sm" value={v.packagePrice} onChange={e=>{const nv=[...vehicles]; nv[idx].packagePrice=e.target.value; setVehicles(nv);}} />
                    </div>
                    <div className="w-full lg:w-40 space-y-1.5">
                      <Label className="text-[11px] font-bold text-gray-700">Total</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-[13px] font-bold text-gray-900">₹</span>
                        <Input type="number" className="h-11 pl-7 rounded-[12px] border-gray-200 bg-white text-[13px] font-bold shadow-sm text-gray-900" value={v.total} onChange={e=>{const nv=[...vehicles]; nv[idx].total=Number(e.target.value); setVehicles(nv);}} />
                      </div>
                    </div>
                    <button onClick={() => setVehicles(vehicles.filter(item => item.id !== v.id))} className="h-11 px-3 text-red-400 hover:text-red-600 transition-colors flex items-center pb-2 lg:pb-0 lg:h-11">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
                    <Input className="h-11 rounded-[12px] border-gray-200 bg-white text-[13px] font-medium shadow-sm text-gray-500" value={v.tbd1} onChange={e=>{const nv=[...vehicles]; nv[idx].tbd1=e.target.value; setVehicles(nv);}} />
                    <Input className="h-11 rounded-[12px] border-gray-200 bg-white text-[13px] font-medium shadow-sm lg:col-span-2 text-gray-500" value={v.driverDetails} onChange={e=>{const nv=[...vehicles]; nv[idx].driverDetails=e.target.value; setVehicles(nv);}} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50">
            <h2 className="text-[17px] font-bold text-[#1e293b]">Inclusions & exclusions</h2>
            <p className="text-[12px] text-gray-500 font-medium mb-6">Everything covered — and everything not covered — in this quotation.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-[#064e3b]/10 rounded-[16px] p-5 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-[#059669] flex items-center"><Check className="h-4 w-4 mr-1.5" /> Inclusions</h3>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={(val) => {
                      if (!inclusions.includes(val)) setInclusions([...inclusions, val]);
                    }}>
                      <SelectTrigger className="h-8 w-48 rounded-full border-gray-200 bg-transparent text-[12px] font-semibold text-gray-500 shadow-none"><SelectValue placeholder="From master..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Accommodation">Accommodation</SelectItem>
                        <SelectItem value="Breakfast & Dinner">Breakfast & Dinner</SelectItem>
                        <SelectItem value="Private Vehicle">Private Vehicle</SelectItem>
                        <SelectItem value="Driver Allowance">Driver Allowance</SelectItem>
                        <SelectItem value="Toll Tax">Toll Tax</SelectItem>
                        <SelectItem value="Parking Charges">Parking Charges</SelectItem>
                        <SelectItem value="Fuel Charges">Fuel Charges</SelectItem>
                        <SelectItem value="Airport / Railway Station Pickup & Drop">Airport / Railway Station Pickup & Drop</SelectItem>
                        <SelectItem value="Sightseeing as per itinerary">Sightseeing as per itinerary</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => {
                      const val = window.prompt("Enter custom inclusion:");
                      if (val && !inclusions.includes(val)) setInclusions([...inclusions, val]);
                    }} className="h-8 px-3 rounded-full bg-[#e5fcf0] border-[#e5fcf0] text-[#059669] font-bold text-[12px] shadow-none hover:bg-[#d1fae5] transition-colors"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
                  </div>
                </div>
                {inclusions.length === 0 ? (
                  <p className="text-[13px] text-gray-400 font-medium">No inclusions added.</p>
                ) : (
                  <ul className="space-y-2">
                    {inclusions.map((i, idx) => <li key={idx} className="text-[13px] text-gray-700 flex items-center justify-between">{i} <Trash2 className="h-3.5 w-3.5 text-gray-300 cursor-pointer hover:text-red-400" onClick={() => setInclusions(inclusions.filter((_, idx2)=>idx!==idx2))} /></li>)}
                  </ul>
                )}
              </div>
              <div className="border border-red-100 rounded-[16px] p-5 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-red-500 flex items-center"><X className="h-4 w-4 mr-1.5" /> Exclusions</h3>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={(val) => {
                      if (!exclusions.includes(val)) setExclusions([...exclusions, val]);
                    }}>
                      <SelectTrigger className="h-8 w-48 rounded-full border-gray-200 bg-transparent text-[12px] font-semibold text-gray-500 shadow-none"><SelectValue placeholder="From master..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Airfare / Train Tickets">Airfare / Train Tickets</SelectItem>
                        <SelectItem value="Personal Expenses">Personal Expenses</SelectItem>
                        <SelectItem value="Entry Fees">Entry Fees</SelectItem>
                        <SelectItem value="Camera Charges">Camera Charges</SelectItem>
                        <SelectItem value="Lunch">Lunch</SelectItem>
                        <SelectItem value="Travel Insurance">Travel Insurance</SelectItem>
                        <SelectItem value="GST (if applicable)">GST (if applicable)</SelectItem>
                        <SelectItem value="Extra Sightseeing">Extra Sightseeing</SelectItem>
                        <SelectItem value="Anything not mentioned in the inclusions">Anything not mentioned in the inclusions</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => {
                      const val = window.prompt("Enter custom exclusion:");
                      if (val && !exclusions.includes(val)) setExclusions([...exclusions, val]);
                    }} className="h-8 px-3 rounded-full bg-red-50 border-red-50 text-red-600 font-bold text-[12px] shadow-none hover:bg-red-100 transition-colors"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
                  </div>
                </div>
                {exclusions.length === 0 ? (
                  <p className="text-[13px] text-gray-400 font-medium">No exclusions added.</p>
                ) : (
                  <ul className="space-y-2">
                    {exclusions.map((i, idx) => <li key={idx} className="text-[13px] text-gray-700 flex items-center justify-between">{i} <Trash2 className="h-3.5 w-3.5 text-gray-300 cursor-pointer hover:text-red-400" onClick={() => setExclusions(exclusions.filter((_, idx2)=>idx!==idx2))} /></li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Permits */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[#1e293b] mb-1">Permits</h2>
                {permits.length === 0 && <p className="text-[13px] text-gray-400 font-medium mt-1">No permits added.</p>}
              </div>
              <div className="flex items-start gap-2">
                <Select onValueChange={(val) => {
                  if (!permits.includes(val)) setPermits([...permits, val]);
                }}>
                  <SelectTrigger className="h-9 w-48 rounded-full border-gray-200 bg-transparent text-[13px] font-semibold text-gray-500 shadow-none"><SelectValue placeholder="Add from master..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nathula Permit — ₹3,500">Nathula Permit — ₹3,500</SelectItem>
                    <SelectItem value="North Sikkim Permit — ₹2,500">North Sikkim Permit — ₹2,500</SelectItem>
                    <SelectItem value="Bhutan Permit — ₹4,500">Bhutan Permit — ₹4,500</SelectItem>
                    <SelectItem value="Sikkim Entry Permit — ₹500">Sikkim Entry Permit — ₹500</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  const val = window.prompt("Enter custom permit:");
                  if (val && !permits.includes(val)) setPermits([...permits, val]);
                }} className="h-9 px-4 rounded-full bg-[#e5fcf0] border-[#e5fcf0] text-[#064e3b] font-bold text-[13px] shadow-none hover:bg-[#d1fae5] transition-colors"><Plus className="h-4 w-4 mr-1.5" /> Custom</Button>
              </div>
            </div>
            {permits.length > 0 && (
              <ul className="space-y-2 mt-2 w-full lg:w-1/2">
                {permits.map((i, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <input
                      className="bg-transparent border-none outline-none text-[13px] text-gray-700 w-full font-medium"
                      value={i}
                      onChange={(e) => {
                        const newPermits = [...permits];
                        newPermits[idx] = e.target.value;
                        setPermits(newPermits);
                      }}
                    />
                    <Trash2 className="h-3.5 w-3.5 text-gray-400 cursor-pointer hover:text-red-500 ml-3 shrink-0" onClick={() => setPermits(permits.filter((_, idx2)=>idx!==idx2))} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Extra sightseeing */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[#1e293b] mb-1">Extra sightseeing</h2>
                {extraSightseeing.length === 0 && <p className="text-[13px] text-gray-400 font-medium mt-1">No sightseeing added.</p>}
              </div>
              <div className="flex items-start gap-2">
                <Select onValueChange={(val) => {
                  if (!extraSightseeing.includes(val)) setExtraSightseeing([...extraSightseeing, val]);
                }}>
                  <SelectTrigger className="h-9 w-48 rounded-full border-gray-200 bg-transparent text-[13px] font-semibold text-gray-500 shadow-none"><SelectValue placeholder="Add from master..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Changu Lake — ₹1,800">Changu Lake — ₹1,800</SelectItem>
                    <SelectItem value="Baba Mandir — ₹800">Baba Mandir — ₹800</SelectItem>
                    <SelectItem value="Yumthang Valley — ₹3,500">Yumthang Valley — ₹3,500</SelectItem>
                    <SelectItem value="Zero Point — ₹2,500">Zero Point — ₹2,500</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  const val = window.prompt("Enter custom sightseeing:");
                  if (val && !extraSightseeing.includes(val)) setExtraSightseeing([...extraSightseeing, val]);
                }} className="h-9 px-4 rounded-full bg-[#e5fcf0] border-[#e5fcf0] text-[#064e3b] font-bold text-[13px] shadow-none hover:bg-[#d1fae5] transition-colors"><Plus className="h-4 w-4 mr-1.5" /> Custom</Button>
              </div>
            </div>
            {extraSightseeing.length > 0 && (
              <ul className="space-y-2 mt-2 w-full lg:w-1/2">
                {extraSightseeing.map((i, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <input
                      className="bg-transparent border-none outline-none text-[13px] text-gray-700 w-full font-medium"
                      value={i}
                      onChange={(e) => {
                        const newSightseeing = [...extraSightseeing];
                        newSightseeing[idx] = e.target.value;
                        setExtraSightseeing(newSightseeing);
                      }}
                    />
                    <Trash2 className="h-3.5 w-3.5 text-gray-400 cursor-pointer hover:text-red-500 ml-3 shrink-0" onClick={() => setExtraSightseeing(extraSightseeing.filter((_, idx2)=>idx!==idx2))} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rate Card Dynamic */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50">
            <h2 className="text-[15px] font-bold text-[#1e293b]">Rate card</h2>
            <p className="text-[12px] text-gray-500 font-medium mb-6">Used when vehicle rates are not set. Otherwise the summary uses qty × days × rate above.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Per Day</Label>
                <Input type="number" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[13px] font-medium shadow-none" value={rateCard.perDay} onChange={e=>setRateCard({...rateCard, perDay: Number(e.target.value)})} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Package Price</Label>
                <Input type="number" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[13px] font-medium shadow-none" value={rateCard.packagePrice} onChange={e=>setRateCard({...rateCard, packagePrice: Number(e.target.value)})} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Permits</Label>
                <Input type="number" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[13px] font-medium shadow-none" value={rateCard.permits} onChange={e=>setRateCard({...rateCard, permits: Number(e.target.value)})} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Toll</Label>
                <Input type="number" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[13px] font-medium shadow-none" value={rateCard.toll} onChange={e=>setRateCard({...rateCard, toll: Number(e.target.value)})} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Parking</Label>
                <Input type="number" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[13px] font-medium shadow-none" value={rateCard.parking} onChange={e=>setRateCard({...rateCard, parking: Number(e.target.value)})} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Extra Vehicle</Label>
                <Input type="number" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[13px] font-medium shadow-none" value={rateCard.extraVehicle} onChange={e=>setRateCard({...rateCard, extraVehicle: Number(e.target.value)})} />
              </div>
              
              {/* Spacers to force next row to align left */}
              <div className="hidden md:block"></div>
              <div className="hidden md:block"></div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">GST %</Label>
                <Input type="number" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[13px] font-medium shadow-none" value={rateCard.gst} onChange={e=>setRateCard({...rateCard, gst: Number(e.target.value)})} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Additional charges</Label>
                <Input type="number" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[13px] font-medium shadow-none" value={rateCard.additional} onChange={e=>setRateCard({...rateCard, additional: Number(e.target.value)})} />
              </div>
            </div>
          </div>

          {/* Auto-calculated summary */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50">
            <h2 className="text-[15px] font-bold text-[#1e293b] mb-6">Auto-calculated summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-3.5 text-[14px]">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span className="text-gray-400">Base fare ({vehicles.length > 0 ? (vehicles[0].days || 0) : 0} days · {vehicles.length} veh)</span> 
                  <span className="text-gray-900 font-bold">₹{(packagePrice || vTotal).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium"><span>Driver allowance</span> <span className="text-gray-900 font-bold">₹0</span></div>
                <div className="flex justify-between text-gray-500 font-medium"><span>Extras</span> <span className="text-gray-900 font-bold">₹{extraVehicle.toFixed(0)}</span></div>
                <div className="flex justify-between text-gray-500 font-medium"><span>Permits</span> <span className="text-gray-900 font-bold">₹{permitsAmt.toFixed(0)}</span></div>
                <div className="flex justify-between text-gray-500 font-medium"><span>Toll</span> <span className="text-gray-900 font-bold">₹{toll.toFixed(0)}</span></div>
                <div className="flex justify-between text-gray-500 font-medium"><span>Parking</span> <span className="text-gray-900 font-bold">₹{parking.toFixed(0)}</span></div>
                <div className="flex justify-between text-gray-500 font-medium"><span>Additional</span> <span className="text-gray-900 font-bold">₹{additional.toFixed(0)}</span></div>
              </div>

              <div className="space-y-3.5">
                <div className="flex justify-between text-[15px] font-bold text-[#1e293b] pt-1">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-500 font-medium border-b border-gray-100 pb-5">
                  <span>GST @ {gst}%</span>
                  <span className="text-gray-900 font-bold">₹{gstAmount.toFixed(0)}</span>
                </div>
                
                <div className="flex justify-between text-[18px] font-bold text-[#1e293b]">
                  <span>Grand total</span>
                  <span className="text-yellow-500">₹{grandTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-500 font-medium">
                  <span>Advance ({advPct}%)</span>
                  <span className="text-gray-900 font-bold">₹{advanceAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-500 font-medium border-b border-gray-100 pb-5">
                  <span>Balance</span>
                  <span className="text-gray-900 font-bold">₹{balance.toFixed(0)}</span>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-10 w-[140px] rounded-full border-gray-200 bg-white text-[13px] font-medium shadow-sm focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200 shadow-lg p-1">
                      {['Draft', 'Sent', 'Confirmed', 'Cancelled'].map((s) => (
                        <SelectItem key={s} value={s} className="text-[13px] cursor-pointer rounded-lg py-2 focus:bg-[#fef3c7] focus:text-[#92400e] data-[state=checked]:bg-[#fef3c7] data-[state=checked]:text-[#92400e]">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSave} className="h-10 px-6 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#422006] font-bold text-[14px] shadow-sm transition-colors">
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Advance payment */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/50">
            <h2 className="text-[15px] font-bold text-[#1e293b] mb-6">Advance payment</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Advance %</Label>
                <Input type="number" className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] font-medium shadow-none" value={advancePercent} onChange={e=>setAdvancePercent(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Grand total</Label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[14px] font-bold text-gray-900">₹</span>
                  <Input readOnly className="h-11 pl-8 rounded-[16px] border-gray-200 bg-gray-50/50 text-[14px] font-bold shadow-none text-gray-900" value={grandTotal.toFixed(0)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Advance amount</Label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[14px] font-bold text-yellow-600">₹</span>
                  <Input readOnly className="h-11 pl-8 rounded-[16px] border-orange-100 bg-orange-50/50 text-[14px] font-bold shadow-none text-yellow-600" value={advanceAmount.toFixed(0)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-gray-700">Balance</Label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[14px] font-bold text-gray-900">₹</span>
                  <Input readOnly className="h-11 pl-8 rounded-[16px] border-gray-200 bg-gray-50/50 text-[14px] font-bold shadow-none text-gray-900" value={balance.toFixed(0)} />
                </div>
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="space-y-3">
            {[
              { id: 'details', title: 'Additional details' },
              { id: 'transport', title: 'Transport details' },
              { id: 'notes', title: 'Additional notes' },
              { id: 'remarks', title: 'Remarks' },
            ].map((acc) => (
              <div key={acc.id} className="bg-white rounded-[20px] border border-gray-100/50 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-[14px] font-bold text-[#1e293b] hover:bg-gray-50/50 transition-colors"
                >
                  {acc.title}
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openAccordion === acc.id ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === acc.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                    {acc.id === 'details' && (
                      <Textarea value={additionalDetails} onChange={e=>setAdditionalDetails(e.target.value)} className="min-h-[100px] border-gray-200 rounded-[16px] bg-transparent text-[14px] shadow-none mt-2" placeholder="General extra information" />
                    )}
                    {acc.id === 'transport' && (
                      <div className="space-y-4 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-gray-700">Pickup timing</Label>
                            <Input value={pickupTiming} onChange={e=>setPickupTiming(e.target.value)} className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] shadow-none" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-gray-700">Drop timing</Label>
                            <Input value={dropTiming} onChange={e=>setDropTiming(e.target.value)} className="h-11 rounded-[16px] border-gray-200 bg-transparent text-[14px] shadow-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold text-gray-700">Driver instructions</Label>
                          <Textarea value={driverInstructions} onChange={e=>setDriverInstructions(e.target.value)} className="min-h-[80px] border-gray-200 rounded-[16px] bg-transparent text-[14px] shadow-none" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-bold text-gray-700">Vehicle notes</Label>
                          <Textarea value={vehicleNotes} onChange={e=>setVehicleNotes(e.target.value)} className="min-h-[80px] border-gray-200 rounded-[16px] bg-transparent text-[14px] shadow-none" />
                        </div>
                      </div>
                    )}
                    {acc.id === 'notes' && (
                      <Textarea value={additionalNotes} onChange={e=>setAdditionalNotes(e.target.value)} className="min-h-[100px] border-gray-200 rounded-[16px] bg-transparent text-[14px] shadow-none mt-2" />
                    )}
                    {acc.id === 'remarks' && (
                      <Textarea value={remarks} onChange={e=>setRemarks(e.target.value)} className="min-h-[100px] border-gray-200 rounded-[16px] bg-transparent text-[14px] shadow-none mt-2" placeholder="Displayed before the quotation footer" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <SmartQuotationBuilderForm />
    </Suspense>
  );
}
