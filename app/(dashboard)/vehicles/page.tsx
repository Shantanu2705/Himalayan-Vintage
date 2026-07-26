'use client';
import React, { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Vehicle, VehicleType } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { ImageUploader } from '@/components/shared/image-uploader';
import { formatDate } from '@/utils/formatters';
import {
  Car,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ShieldAlert,
} from 'lucide-react';

function VehiclesHubContent() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<VehicleType | string>('Innova Crysta');
  const [seatingCapacity, setSeatingCapacity] = useState(7);
  const [fuelType, setFuelType] = useState<'diesel' | 'petrol' | 'ev' | string>('diesel');
  const [status, setStatus] = useState<'active' | 'maintenance' | 'inactive' | string>('active');
  const [permitExpiry, setPermitExpiry] = useState(new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]);
  const [insuranceExpiry, setInsuranceExpiry] = useState(new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');

  const openNewModal = () => {
    setEditingVehicle(null);
    setRegNo('SK-01-XX-0000');
    setName('Toyota Innova Crysta');
    setType('Innova Crysta');
    setSeatingCapacity(7);
    setFuelType('diesel');
    setStatus('active');
    setPermitExpiry(new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]);
    setInsuranceExpiry(new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]);
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setRegNo(v.regNo || v.registration || '');
    setName(v.name || '');
    setType((v.type || v.category || 'SUV') as any);
    setSeatingCapacity(v.seatingCapacity || 7);
    setFuelType((v.fuelType || 'Diesel') as any);
    setStatus((v.status || 'active') as any);
    setPermitExpiry(v.permitExpiry?.split('T')[0] || new Date().toISOString().split('T')[0]);
    setInsuranceExpiry(v.insuranceExpiry?.split('T')[0] || new Date().toISOString().split('T')[0]);
    setImageUrl(v.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo || !name) return;

    if (editingVehicle) {
      await updateVehicle({
        ...editingVehicle,
        regNo: regNo.toUpperCase(),
        name,
        type,
        seatingCapacity: Number(seatingCapacity),
        fuelType,
        status,
        permitExpiry: new Date(permitExpiry).toISOString(),
        insuranceExpiry: new Date(insuranceExpiry).toISOString(),
        imageUrl,
      });
    } else {
      const newId = `v-${Date.now()}`;
      await addVehicle({
        id: newId,
        regNo: regNo.toUpperCase(),
        name,
        type,
        seatingCapacity: Number(seatingCapacity),
        fuelType,
        status,
        permitExpiry: new Date(permitExpiry).toISOString(),
        insuranceExpiry: new Date(insuranceExpiry).toISOString(),
        imageUrl,
        createdAt: new Date().toISOString(),
      });
    }
    setIsModalOpen(false);
  };

  const filtered = vehicles.filter((v) => {
    const matchesSearch =
      (v.regNo || v.registration || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.type || v.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles Fleet Master</h1>
          <p className="text-sm text-muted-foreground">
            Monitor luxury coaches, SUVs, and mountain transport vehicles with compliance tracking.
          </p>
        </div>
        <Button onClick={openNewModal} className="bg-primary text-primary-foreground font-semibold shadow-sm">
          <PlusCircle className="mr-1.5 h-4 w-4" /> Add New Vehicle
        </Button>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reg no, model, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <div className="flex flex-wrap gap-1">
              {['all', 'active', 'maintenance', 'inactive'].map((st) => (
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

      <Card className="shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Photo</TableHead>
              <TableHead>Registration No</TableHead>
              <TableHead>Vehicle Make & Model</TableHead>
              <TableHead>Category & Specs</TableHead>
              <TableHead>Compliance & Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No vehicles found in fleet registry.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((v) => {
                const isPermitClose = v.permitExpiry ? new Date(v.permitExpiry).getTime() - Date.now() < 30 * 86400000 : false;
                return (
                  <TableRow key={v.id}>
                    <TableCell>
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.name} className="h-12 w-16 rounded-md object-cover border shadow-xs" />
                      ) : (
                        <div className="h-12 w-16 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground border">
                          <Car className="h-5 w-5 opacity-40" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">
                      <span className="font-mono text-primary text-sm bg-primary/10 px-2.5 py-1 rounded font-extrabold border border-primary/20">
                        {v.regNo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground text-sm">{v.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{v.type}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold bg-muted px-2 py-0.5 rounded">{v.seatingCapacity} Seater</span>
                        <span className="uppercase text-[10px] font-mono text-muted-foreground">{v.fuelType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Permit:</span>
                          <strong className={isPermitClose ? 'text-red-500 flex items-center gap-1' : 'text-foreground'}>
                            {formatDate(v.permitExpiry)}
                            {isPermitClose && <ShieldAlert className="h-3.5 w-3.5 text-red-500" />}
                          </strong>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-muted-foreground">Ins:</span>
                          <strong>{formatDate(v.insuranceExpiry)}</strong>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(v)}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteVehicle(v.id)}
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

      {/* Vehicle Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" /> {editingVehicle ? 'Edit Vehicle Registry' : 'Add Vehicle to Fleet'}
            </DialogTitle>
            <DialogDescription>
              Enter registration number, seating capacity, and permit dates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="pb-2 border-b">
              <ImageUploader
                label="Vehicle Photo (Exterior / Interior)"
                value={imageUrl}
                onChange={(val) => setImageUrl(val)}
                onRemove={() => setImageUrl('')}
                placeholder="Upload real photo of this vehicle (PNG / JPG / WEBP)"
                aspectRatio="video"
                maxDimension={600}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Registration No *</Label>
                <Input required value={regNo} onChange={(e) => setRegNo(e.target.value)} placeholder="SK-01-AB-1234" className="font-mono uppercase font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Vehicle Category *</Label>
                <Select value={type} onValueChange={(t) => setType(t as VehicleType)}>
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
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vehicle Make & Display Name *</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Toyota Innova Crysta ZX 2.4" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Seating Capacity</Label>
                <Input type="number" min={2} max={50} value={seatingCapacity} onChange={(e) => setSeatingCapacity(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Fuel Type</Label>
                <Select value={fuelType} onValueChange={(f) => setFuelType(f as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="ev">Electric (EV)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Fleet Status</Label>
                <Select value={status} onValueChange={(s) => setStatus(s as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Permit Expiry Date</Label>
                <Input type="date" value={permitExpiry} onChange={(e) => setPermitExpiry(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Insurance Expiry Date</Label>
                <Input type="date" value={insuranceExpiry} onChange={(e) => setInsuranceExpiry(e.target.value)} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold">Save Vehicle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Vehicles Fleet...</div>}>
        <VehiclesHubContent />
      </Suspense>
    </DashboardLayout>
  );
}
