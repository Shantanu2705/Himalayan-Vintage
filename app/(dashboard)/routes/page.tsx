'use client';
import React, { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { RouteMaster } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatters';
import {
  MapPin,
  PlusCircle,
  Search,
  Trash2,
  Edit,
  Navigation,
  Clock,
  Car,
} from 'lucide-react';

function RoutesHubContent() {
  const { routes, addRoute, deleteRoute } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pickup, setPickup] = useState('Bagdogra Airport (IXB)');
  const [destination, setDestination] = useState('Gangtok MG Marg');
  const [distanceKm, setDistanceKm] = useState(125);
  const [durationHours, setDurationHours] = useState(4.5);
  const [baseRate, setBaseRate] = useState(4500);

  const openNewModal = () => {
    setPickup('Bagdogra Airport (IXB)');
    setDestination('Pelling, West Sikkim');
    setDistanceKm(140);
    setDurationHours(5.5);
    setBaseRate(5500);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute: RouteMaster = {
      id: `rt-${Date.now()}`,
      name: `${pickup} to ${destination}`,
      pickup,
      destination,
      km: Number(distanceKm),
      estHours: Number(durationHours),
      distanceKm: Number(distanceKm),
      durationHours: Number(durationHours),
      baseRates: {
        'Innova Crysta': Number(baseRate),
        'Toyota Innova': Number(baseRate) - 500,
        'Scorpio N / Classic': Number(baseRate) - 800,
      },
    };
    await addRoute(newRoute);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteRoute(id);
  };

  const filtered = routes.filter((r) =>
    (r.pickup || '').toLowerCase().includes(searchTerm.toLowerCase()) || (r.destination || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mountain Routes & Distance Master</h1>
          <p className="text-sm text-muted-foreground">
            Standardize driving distances, estimated durations, and base tariff cards for popular Sikkim-Darjeeling circuits.
          </p>
        </div>
        <Button onClick={openNewModal} className="bg-primary text-primary-foreground font-semibold shadow-sm">
          <PlusCircle className="mr-1.5 h-4 w-4" /> Add Route Tariff
        </Button>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pickup or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </Card>

      <Card className="shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route (Pickup → Destination)</TableHead>
              <TableHead>Distance & Duration</TableHead>
              <TableHead>Innova Crysta Tariff</TableHead>
              <TableHead>Scorpio / Ertiga Tariff</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No routes found in tariff registry.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((rt) => (
                <TableRow key={rt.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-bold text-base text-foreground">
                      <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                      <span>{rt.pickup}</span>
                      <span className="text-muted-foreground">→</span>
                      <span>{rt.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="font-bold bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                        <Navigation className="h-3 w-3 text-primary" /> {rt.distanceKm} KM
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> ~{rt.durationHours} Hrs
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-extrabold font-mono text-primary">
                      {formatCurrency(rt.baseRates?.['Innova Crysta'] || 4500)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-bold font-mono text-foreground">
                      {formatCurrency(rt.baseRates?.['Scorpio N / Classic'] || 3800)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(rt.id)}
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

      {/* Route Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Add Standard Tariff Route
            </DialogTitle>
            <DialogDescription>
              Define distance and default Innova Crysta point-to-point tariff.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Pickup Point *</Label>
              <Input required value={pickup} onChange={(e) => setPickup(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Destination *</Label>
              <Input required value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Distance (KM)</Label>
                <Input type="number" value={distanceKm} onChange={(e) => setDistanceKm(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Est. Hrs</Label>
                <Input type="number" step="0.5" value={durationHours} onChange={(e) => setDurationHours(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Base Rate (₹)</Label>
                <Input type="number" value={baseRate} onChange={(e) => setBaseRate(Number(e.target.value))} className="font-mono font-bold" />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold">Save Route Tariff</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function RoutesPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Routes Master...</div>}>
        <RoutesHubContent />
      </Suspense>
    </DashboardLayout>
  );
}
