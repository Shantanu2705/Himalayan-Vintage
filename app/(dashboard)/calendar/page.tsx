'use client';

import React, { useState, useMemo } from 'react';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Booking, VehicleType, BookingStatus, ClientType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, PlusCircle, Calendar as CalendarIcon, Trash2, Search } from 'lucide-react';
import { cn } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const LEGEND_ITEMS = [
  { label: 'Confirmed', color: 'bg-green-500' },
  { label: 'Pending', color: 'bg-yellow-500' },
  { label: 'Cancelled', color: 'bg-red-500' },
  { label: 'Corporate', color: 'bg-slate-800' },
  { label: 'Tourist', color: 'bg-teal-500' },
];

const getBookingColor = (b: Booking) => {
  if (b.clientType === 'corporate') return 'bg-slate-800/10 text-slate-800 border-slate-800/20';
  if (b.clientType === 'tourist') return 'bg-teal-500/10 text-teal-800 border-teal-500/20';
  if (b.status === 'confirmed') return 'bg-green-100 text-green-800 border-green-200';
  if (b.status === 'cancelled') return 'bg-red-100 text-red-800 border-red-200';
  if (b.status === 'completed') return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-yellow-100 text-yellow-800 border-yellow-200';
};

const getDotColor = (b: Booking) => {
  if (b.clientType === 'corporate') return 'bg-slate-800';
  if (b.clientType === 'tourist') return 'bg-teal-500';
  if (b.status === 'confirmed') return 'bg-green-500';
  if (b.status === 'cancelled') return 'bg-red-500';
  if (b.status === 'completed') return 'bg-blue-500';
  return 'bg-yellow-500';
};

type ViewMode = 'day' | 'week' | 'month';

export default function CalendarPage() {
  const { bookings, addBooking, updateBooking, deleteBooking } = useFleetStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientType, setClientType] = useState<ClientType>('tourist');
  const [vehicle, setVehicle] = useState<VehicleType | string>('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState<BookingStatus>('confirmed');

  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const lower = searchQuery.toLowerCase();
    return bookings.filter(b => 
      b.clientName?.toLowerCase().includes(lower) ||
      b.vehicle?.toLowerCase().includes(lower) ||
      b.destination?.toLowerCase().includes(lower) ||
      b.pickup?.toLowerCase().includes(lower)
    );
  }, [bookings, searchQuery]);

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() - 1);
    if (viewMode === 'week') next.setDate(next.getDate() - 7);
    if (viewMode === 'day') next.setDate(next.getDate() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    if (viewMode === 'week') next.setDate(next.getDate() + 7);
    if (viewMode === 'day') next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Header Title Formatting
  const headerTitle = useMemo(() => {
    if (viewMode === 'month') {
      return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    if (viewMode === 'day') {
      return currentDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      const startMonth = start.toLocaleString('default', { month: 'short' });
      const endMonth = end.toLocaleString('default', { month: 'short' });
      
      if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
      }
      if (start.getFullYear() === end.getFullYear()) {
        return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${startMonth} ${start.getDate()}, ${start.getFullYear()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
    }
    return '';
  }, [currentDate, viewMode]);

  // Modal Handlers
  const openNewModal = (dateStr?: string) => {
    setEditingBooking(null);
    setClientName('');
    setClientType('tourist');
    setVehicle('');
    setPickup('');
    setDestination('');
    const today = new Date().toISOString().split('T')[0];
    setStartDate(dateStr || today);
    setEndDate(dateStr || today);
    setAmount(0);
    setStatus('confirmed');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Booking) => {
    setEditingBooking(b);
    setClientName(b.clientName || '');
    setClientType(b.clientType || 'tourist');
    setVehicle(b.vehicle || '');
    setPickup(b.pickup || '');
    setDestination(b.destination || '');
    setStartDate(b.startDate?.split('T')[0] || '');
    setEndDate(b.endDate?.split('T')[0] || '');
    setAmount(b.amount || 0);
    setStatus(b.status || 'confirmed');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !vehicle || !startDate || !endDate) return;

    if (editingBooking) {
      await updateBooking({
        ...editingBooking,
        clientName,
        clientType,
        vehicle,
        pickup,
        destination,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        amount: Number(amount),
        status,
      });
    } else {
      const newId = `cal-b-${Date.now()}`;
      await addBooking({
        id: newId,
        bookingNo: `CAL-${String(bookings.length + 101).padStart(3, '0')}`,
        clientName,
        clientType,
        vehicle,
        pickup,
        destination,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        amount: Number(amount),
        status,
        advance: 0,
        createdAt: new Date().toISOString(),
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!editingBooking) return;
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await deleteBooking(editingBooking.id);
      setIsModalOpen(false);
    }
  };

  // Rendering logic for cells
  const renderCell = (date: Date, isMonthView: boolean = true) => {
    const dateStr = date.toISOString().split('T')[0];
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    
    const dayBookings = filteredBookings.filter(b => {
      if (!b.startDate) return false;
      const start = b.startDate.split('T')[0];
      const end = b.endDate?.split('T')[0] || start;
      return dateStr >= start && dateStr <= end;
    });

    return (
      <div 
        key={dateStr} 
        className={cn(
          "border-r border-b p-1.5 transition-colors group flex flex-col bg-card relative",
          isToday && "bg-primary/5",
          isMonthView ? "min-h-[120px]" : "min-h-[300px]"
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <span className={cn(
            "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
            isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}>
            {date.getDate()}
          </span>
          <div 
            className="p-1.5 rounded-full hover:bg-primary/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openNewModal(dateStr);
            }}
            title="Add booking"
          >
            <PlusCircle className="h-4 w-4 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {dayBookings.map(b => (
            <div
              key={b.id}
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(b);
              }}
              className={cn(
                "p-2 rounded-md border shadow-xs cursor-pointer hover:brightness-95 transition-all text-xs",
                getBookingColor(b)
              )}
              title={`${b.clientName} - ${b.vehicle}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={cn("h-2 w-2 rounded-full shrink-0", getDotColor(b))} />
                <span className="font-semibold truncate">{b.clientName}</span>
              </div>
              <div className="truncate opacity-80 text-[10px] pl-3">{b.vehicle}</div>
              {b.destination && <div className="truncate opacity-70 text-[10px] pl-3">{b.destination}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Generate grids
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="border-r border-b bg-muted/20 p-2" />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push(renderCell(new Date(year, month, i), true));
    }

    return (
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/40 text-center">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {cells}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    
    const cells = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }

    return (
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/40 text-center">
          {cells.map((d, i) => (
            <div key={i} className="py-2.5 flex flex-col items-center justify-center gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{DAYS_OF_WEEK[d.getDay()]}</span>
              <span className={cn(
                "text-sm font-bold h-7 w-7 flex items-center justify-center rounded-full",
                d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] 
                  ? "bg-primary text-primary-foreground" 
                  : "text-foreground"
              )}>
                {d.getDate()}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map(d => renderCell(d, false))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="border-b bg-muted/40 text-center py-4">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            {DAYS_OF_WEEK[currentDate.getDay()]}
          </span>
          <span className={cn(
            "text-xl font-bold h-10 w-10 mx-auto flex items-center justify-center rounded-full",
            currentDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] 
              ? "bg-primary text-primary-foreground" 
              : "text-foreground"
          )}>
            {currentDate.getDate()}
          </span>
        </div>
        <div className="grid grid-cols-1">
          {renderCell(currentDate, false)}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Header Row matching screenshot */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" onClick={handlePrev} className="h-9 w-9 rounded-full bg-slate-50 hover:bg-slate-100">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleToday} className="h-9 rounded-full px-4 bg-slate-50 hover:bg-slate-100 font-semibold">
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext} className="h-9 w-9 rounded-full bg-slate-50 hover:bg-slate-100">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h1 className="text-2xl font-bold tracking-tight min-w-[200px]">
              {headerTitle}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search bookings..." 
                className="pl-9 rounded-full bg-slate-50 focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as ViewMode)} className="w-full sm:w-auto">
              <TabsList className="rounded-full p-1 bg-slate-100">
                <TabsTrigger value="day" className="rounded-full px-4">Day</TabsTrigger>
                <TabsTrigger value="week" className="rounded-full px-4">Week</TabsTrigger>
                <TabsTrigger value="month" className="rounded-full px-4">Month</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={() => openNewModal()} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm ml-2">
              <PlusCircle className="mr-1.5 h-4 w-4" /> Add Booking
            </Button>
          </div>
        </div>

        {/* Legend Row */}
        <div className="flex flex-wrap items-center gap-4 px-2 pb-2">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}

        {/* Booking Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-4 bg-muted/30 border-b">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {editingBooking ? 'Edit Calendar Booking' : 'New Calendar Booking'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client Name *</Label>
                  <Input 
                    value={clientName} 
                    onChange={e => setClientName(e.target.value)} 
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Client Type</Label>
                  <Select value={clientType} onValueChange={(val: ClientType) => setClientType(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourist">Tourist</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Name / Type *</Label>
                  <Input 
                    value={vehicle} 
                    onChange={e => setVehicle(e.target.value)} 
                    placeholder="e.g., Innova Crysta"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(val: BookingStatus) => setStatus(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pickup Location</Label>
                  <Input 
                    value={pickup} 
                    onChange={e => setPickup(e.target.value)} 
                    placeholder="e.g., Bagdogra Airport"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Input 
                    value={destination} 
                    onChange={e => setDestination(e.target.value)} 
                    placeholder="e.g., Darjeeling"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Amount (₹)</Label>
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(Number(e.target.value))} 
                    className="max-w-[50%]"
                  />
                </div>
              </div>

              <DialogFooter className="pt-4 mt-6 border-t flex flex-col sm:flex-row sm:justify-between gap-4">
                {editingBooking ? (
                  <Button type="button" variant="destructive" onClick={handleDelete} className="font-semibold flex items-center gap-2 mr-auto">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2 sm:ml-auto">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Close
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground font-semibold">
                    Save Changes
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
