'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { QuotationType, VehicleType, ItineraryDay } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { calculateTouristQuotation, calculateCorporateQuotation } from '@/utils/quotation-math';
import { formatCurrency } from '@/utils/formatters';
import {
  FileText,
  ArrowLeft,
  Plus,
  Trash2,
  Calculator,
  Save,
  Send,
  MapPin,
  Car,
  User,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

function SmartQuotationBuilderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enquiryId = searchParams.get('enquiryId');

  const { enquiries, addQuotation, quotations, inclusions: masterInclusions, exclusions: masterExclusions } = useFleetStore();

  const [qType, setQType] = useState<QuotationType | string>('tourist');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');

  const [pickup, setPickup] = useState('Bagdogra Airport (IXB)');
  const [destination, setDestination] = useState('Gangtok, Sikkim & Darjeeling');
  const [vehicle, setVehicle] = useState<VehicleType | string>('Innova Crysta');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(5);
  const [passengers, setPassengers] = useState(4);

  // Tourist pricing
  const [perDayRate, setPerDayRate] = useState(4500);
  const [extraSightseeing, setExtraSightseeing] = useState(2500);
  const [permitCharges, setPermitCharges] = useState(1500);
  const [tollParking, setTollParking] = useState(1000);

  // Corporate pricing
  const [perKmRate, setPerKmRate] = useState(22);
  const [estKm, setEstKm] = useState(500);
  const [driverAllowance, setDriverAllowance] = useState(1000);

  // Day-wise itinerary
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    { day: 1, title: 'Arrival at Bagdogra (IXB) & Transfer to Gangtok', description: 'Meet our driver at airport. 4 hours scenic mountain drive via Teesta river valley. Evening free at MG Marg.' },
    { day: 2, title: 'Tsomgo Lake & Baba Mandir Day Excursion', description: 'Morning drive to 12,400 ft glacial Tsomgo Lake and Baba Harbhajan Singh Shrine. Return to Gangtok.' },
    { day: 3, title: 'Gangtok Local Sightseeing & Transfer to Darjeeling', description: 'Visit Rumtek Monastery, Banjhakri Falls, and Tashi View point. Post lunch drive to Queen of Hills Darjeeling.' },
    { day: 4, title: 'Tiger Hill Sunrise & Darjeeling 7-Point Sightseeing', description: 'Early 4:00 AM visit to Tiger Hill for Mt Kanchenjunga sunrise. Visit Ghoom Monastery, Batasia Loop, and Himalayan Mountaineering Institute.' },
    { day: 5, title: 'Darjeeling to Bagdogra Airport Drop', description: 'After breakfast, check out from hotel and transfer back to Bagdogra airport for onward journey. Trip terminates.' },
  ]);

  // Selected Inclusions & Exclusions
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([
    'Fuel, driver allowance, and vehicle maintenance',
    'Toll tax, state entry taxes, and parking fees',
    'Special permit charges for Tsomgo Lake & Baba Mandir',
    '24/7 dedicated fleet support and emergency backup vehicle',
  ]);
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>([
    'Monument entry tickets and guide fees',
    'Nathu La Pass special permit (₹3,000 extra per vehicle if required)',
    'Personal expenses, room service, and laundry',
    '5% GST transport tax extra on total invoice',
  ]);

  // Prefill from enquiry if present
  useEffect(() => {
    if (enquiryId) {
      const enq = enquiries.find((e) => e.id === enquiryId);
      if (enq) {
        setQType((enq.type || 'tourist') as any);
        setClientName(enq.customerName || '');
        setClientPhone(enq.mobile || '');
        setClientEmail(enq.email || '');
        setPickup(enq.pickupLocation || '');
        setDestination(enq.destination || '');
        setVehicle((enq.vehicle || '') as any);
        if (enq.startDate) setStartDate(enq.startDate.split('T')[0]);
        if (enq.days) setDays(enq.days);
        if (enq.passengers) setPassengers(enq.passengers);
      }
    }
  }, [enquiryId, enquiries]);

  // Calculate totals
  const calcResult =
    qType === 'tourist'
      ? calculateTouristQuotation({ perDay: perDayRate, extraSightseeing, permits: permitCharges, toll: tollParking, parking: 0 }, days)
      : calculateCorporateQuotation({ perKm: perKmRate, perHour: 0, driverAllowance, toll: tollParking, parking: 0 }, estKm, 0);

  const handleAddDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([...itinerary, { day: nextDay, title: `Day ${nextDay} Sightseeing / Transit`, description: '' }]);
  };

  const handleRemoveDay = (index: number) => {
    const updated = itinerary.filter((_, idx) => idx !== index).map((item, idx) => ({ ...item, day: idx + 1 }));
    setItinerary(updated);
  };

  const handleUpdateDay = (index: number, field: 'title' | 'description', val: string) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: val };
    setItinerary(updated);
  };

  const toggleInclusion = (inc: string) => {
    if (selectedInclusions.includes(inc)) {
      setSelectedInclusions(selectedInclusions.filter((i) => i !== inc));
    } else {
      setSelectedInclusions([...selectedInclusions, inc]);
    }
  };

  const toggleExclusion = (exc: string) => {
    if (selectedExclusions.includes(exc)) {
      setSelectedExclusions(selectedExclusions.filter((e) => e !== exc));
    } else {
      setSelectedExclusions([...selectedExclusions, exc]);
    }
  };

  const handleSaveQuotation = async (status: 'draft' | 'sent') => {
    if (!clientName) {
      alert('Please enter Client Name.');
      return;
    }

    const newId = `q-${Date.now()}`;
    const newNo = `Q-2026-${String(quotations.length + 101).padStart(3, '0')}`;

    await addQuotation({
      id: newId,
      quotationNo: newNo,
      type: qType,
      clientName,
      clientPhone,
      clientEmail,
      companyName,
      gstin,
      pickupLocation: pickup,
      destination,
      vehicle,
      startDate: new Date(startDate).toISOString(),
      days: Number(days),
      passengers: Number(passengers),
      baseAmount: calcResult.baseAmount,
      subtotal: calcResult.subtotal,
      gstAmount: calcResult.gstAmount,
      totalAmount: calcResult.totalAmount,
      status,
      createdAt: new Date().toISOString(),
      itinerary,
      inclusions: selectedInclusions,
      exclusions: selectedExclusions,
      touristPricing: qType === 'tourist' ? { perDay: perDayRate, extraSightseeing, permits: permitCharges, toll: tollParking } : undefined,
      corporatePricing: qType === 'corporate' ? { perKm: perKmRate, driverAllowance, toll: tollParking } : undefined,
    });

    router.push('/quotations');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push('/quotations')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Smart Quotation Builder</h1>
            <p className="text-sm text-muted-foreground">
              Build dynamic multi-day tour pricing and customized itineraries with live tax calculation.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSaveQuotation('draft')} className="font-semibold">
            <Save className="mr-1.5 h-4 w-4" /> Save Draft
          </Button>
          <Button onClick={() => handleSaveQuotation('sent')} className="bg-primary text-primary-foreground font-semibold shadow-sm">
            <Send className="mr-1.5 h-4 w-4" /> Generate & Send Quote
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left & Center: Configuration Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quotation Type Selector */}
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Package Pricing Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={qType} onValueChange={(v) => setQType(v as QuotationType)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tourist" className="font-bold">Tourist Package (Per Day Rate)</TabsTrigger>
                  <TabsTrigger value="corporate" className="font-bold">Corporate B2B Contract (Per KM Rate)</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Client Details Card */}
          <Card className="shadow-soft">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" /> Customer / Corporate Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Client / Guest Name *</Label>
                <Input required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Vikramaditya Singh" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mobile Number *</Label>
                <Input required value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="e.g. 9830012345" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address (For PDF delivery)</Label>
                <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="e.g. vikram@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company / Agency Name (Optional)</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. MakeMyTrip India Pvt Ltd" />
              </div>
            </CardContent>
          </Card>

          {/* Trip & Vehicle Route Parameters */}
          <Card className="shadow-soft">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" /> Trip Itinerary & Vehicle Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <Label className="text-xs font-semibold">Pickup Point</Label>
                <Input value={pickup} onChange={(e) => setPickup(e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Tour Destination Circuit</Label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Assigned Vehicle</Label>
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
                <Label className="text-xs font-semibold">Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Days</Label>
                  <Input type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Pax</Label>
                  <Input type="number" min={1} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Calculation Engine */}
          <Card className="shadow-soft border-primary/20 bg-primary/5">
            <CardHeader className="pb-3 border-b border-primary/10">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                <Calculator className="h-4 w-4" /> Commercial Rate Sheet & Cost Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {qType === 'tourist' ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Per Day Rental Rate (₹)</Label>
                    <Input type="number" value={perDayRate} onChange={(e) => setPerDayRate(Number(e.target.value))} className="font-mono font-bold text-base" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Extra Sightseeing (₹)</Label>
                    <Input type="number" value={extraSightseeing} onChange={(e) => setExtraSightseeing(Number(e.target.value))} className="font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Permits & Entry (₹)</Label>
                    <Input type="number" value={permitCharges} onChange={(e) => setPermitCharges(Number(e.target.value))} className="font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Toll & Parking (₹)</Label>
                    <Input type="number" value={tollParking} onChange={(e) => setTollParking(Number(e.target.value))} className="font-mono" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Per KM Rate (₹)</Label>
                    <Input type="number" value={perKmRate} onChange={(e) => setPerKmRate(Number(e.target.value))} className="font-mono font-bold text-base" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Estimated Total KM</Label>
                    <Input type="number" value={estKm} onChange={(e) => setEstKm(Number(e.target.value))} className="font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Driver Allowance (₹)</Label>
                    <Input type="number" value={driverAllowance} onChange={(e) => setDriverAllowance(Number(e.target.value))} className="font-mono" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Day-Wise Itinerary Builder */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Day-Wise Tour Itinerary
                </CardTitle>
                <CardDescription className="text-xs">
                  Customize the daily trip schedule printed on the customer's quotation document.
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddDay} className="text-xs font-semibold">
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Day
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {itinerary.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start border rounded-lg p-3 bg-muted/20 relative group">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs mt-0.5">
                    D{item.day}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdateDay(idx, 'title', e.target.value)}
                      placeholder="e.g. Gangtok to Darjeeling Transfer"
                      className="font-bold text-xs h-8"
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => handleUpdateDay(idx, 'description', e.target.value)}
                      placeholder="Brief description of sightseeing points and driving hours..."
                      className="text-xs min-h-[50px]"
                    />
                  </div>
                  {itinerary.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDay(idx)}
                      className="h-8 w-8 text-destructive opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Inclusions & Exclusions Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-soft">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  Select Inclusions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2 max-h-48 overflow-y-auto">
                {(masterInclusions.length > 0 ? masterInclusions.map((i) => i.title || i.text || '') : selectedInclusions).map((inc, i) => (
                  <div key={`inc-box-${i}-${inc.slice(0, 10)}`} className="flex items-center space-x-2">
                    <Checkbox id={`inc-${i}`} checked={selectedInclusions.includes(inc)} onCheckedChange={() => toggleInclusion(inc)} />
                    <label htmlFor={`inc-${i}`} className="text-xs font-medium cursor-pointer leading-tight">
                      {inc}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-bold text-red-700 dark:text-red-400">
                  Select Exclusions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2 max-h-48 overflow-y-auto">
                {(masterExclusions.length > 0 ? masterExclusions.map((e) => e.title || e.text || '') : selectedExclusions).map((exc, i) => (
                  <div key={`exc-box-${i}-${exc.slice(0, 10)}`} className="flex items-center space-x-2">
                    <Checkbox id={`exc-${i}`} checked={selectedExclusions.includes(exc)} onCheckedChange={() => toggleExclusion(exc)} />
                    <label htmlFor={`exc-${i}`} className="text-xs font-medium cursor-pointer leading-tight">
                      {exc}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: Live Financial Breakdown Summary Panel */}
        <div className="space-y-6">
          <Card className="shadow-medium border-2 border-primary sticky top-20">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg pb-4">
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                <span>Quotation Estimate</span>
                <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">LIVE PREVIEW</span>
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-xs">
                Instant tax calculation & commercial total
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Base Vehicle Rental ({days} Days):</span>
                  <span className="font-mono font-bold">{formatCurrency(calcResult.baseAmount)}</span>
                </div>
                {qType === 'tourist' && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Extra Sightseeing:</span>
                      <span className="font-mono">{formatCurrency(extraSightseeing)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Permits & PAP Charges:</span>
                      <span className="font-mono">{formatCurrency(permitCharges)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Toll Tax & Parking:</span>
                  <span className="font-mono">{formatCurrency(tollParking)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono">{formatCurrency(calcResult.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-primary font-semibold">
                  <span>GST (5% Transport Tax):</span>
                  <span className="font-mono">{formatCurrency(calcResult.gstAmount)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Total Payable Amount</span>
                <div className="text-3xl font-extrabold text-foreground mt-1 font-mono">
                  {formatCurrency(calcResult.totalAmount)}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Includes 50% advance booking deposit required
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <Button onClick={() => handleSaveQuotation('sent')} className="w-full bg-primary font-bold shadow-md h-11 text-sm">
                  <Send className="mr-2 h-4 w-4" /> Issue & Send Proposal
                </Button>
                <Button variant="outline" onClick={() => handleSaveQuotation('draft')} className="w-full font-semibold">
                  <Save className="mr-2 h-4 w-4" /> Save as Draft Quote
                </Button>
              </div>

              <div className="text-[11px] text-center text-muted-foreground border-t pt-3">
                Quotation will be stored in Firestore / local database and ready for 1-click booking conversion.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SmartQuotationBuilderPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Quotation Builder...</div>}>
        <SmartQuotationBuilderForm />
      </Suspense>
    </DashboardLayout>
  );
}
