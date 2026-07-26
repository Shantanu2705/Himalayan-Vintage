'use client';
import React, { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Driver } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { ImageUploader } from '@/components/shared/image-uploader';
import { formatDate, formatPhoneNumber } from '@/utils/formatters';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  Phone,
  ShieldCheck,
  Award,
} from 'lucide-react';

function DriversHubContent() {
  const { drivers, addDriver, updateDriver, deleteDriver } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [badgeNo, setBadgeNo] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 500 * 86400000).toISOString().split('T')[0]);
  const [status, setStatus] = useState<'active' | 'on-leave' | 'inactive' | string>('active');
  const [avatarUrl, setAvatarUrl] = useState('');

  const openNewModal = () => {
    setEditingDriver(null);
    setName('');
    setMobile('');
    setLicenseNo('SK-DL-2026-0099');
    setBadgeNo('BDG-8899');
    setExpiryDate(new Date(Date.now() + 500 * 86400000).toISOString().split('T')[0]);
    setStatus('active');
    setAvatarUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (d: Driver) => {
    setEditingDriver(d);
    setName(d.name || '');
    setMobile(d.mobile || '');
    setLicenseNo(d.licenseNo || d.license || '');
    setBadgeNo(d.badgeNo || '');
    setExpiryDate(d.licenseExpiry?.split('T')[0] || new Date().toISOString().split('T')[0]);
    setStatus((d.status || 'active') as any);
    setAvatarUrl(d.avatarUrl || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;

    if (editingDriver) {
      await updateDriver({
        ...editingDriver,
        name,
        mobile,
        licenseNo: licenseNo.toUpperCase(),
        badgeNo,
        licenseExpiry: new Date(expiryDate).toISOString(),
        status,
        avatarUrl,
      });
    } else {
      const newId = `drv-${Date.now()}`;
      await addDriver({
        id: newId,
        name,
        mobile,
        licenseNo: licenseNo.toUpperCase(),
        badgeNo,
        licenseExpiry: new Date(expiryDate).toISOString(),
        status,
        avatarUrl,
        createdAt: new Date().toISOString(),
      });
    }
    setIsModalOpen(false);
  };

  const filtered = drivers.filter((d) => {
    const matchesSearch =
      (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.mobile || '').includes(searchTerm) ||
      (d.licenseNo || d.license || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Drivers Directory & Personnel</h1>
          <p className="text-sm text-muted-foreground">
            Manage chauffeur profiles, mountain driving badges, contact info, and license expirations.
          </p>
        </div>
        <Button onClick={openNewModal} className="bg-primary text-primary-foreground font-semibold shadow-sm">
          <PlusCircle className="mr-1.5 h-4 w-4" /> Add New Driver
        </Button>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search driver name, mobile, DL no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <div className="flex flex-wrap gap-1">
              {['all', 'active', 'on-leave', 'inactive'].map((st) => (
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

      <Card className="shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chauffeur Name</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Driving License & Badge</TableHead>
              <TableHead>License Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No drivers found in personnel directory.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2.5">
                      {d.avatarUrl ? (
                        <img src={d.avatarUrl} alt={d.name} className="h-9 w-9 rounded-full object-cover border-2 border-primary/20 shadow-xs" />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 font-bold text-xs uppercase">
                          {d.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sm">{d.name}</div>
                        <div className="text-[10px] text-muted-foreground">Hill Certified Chauffeur</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-foreground font-medium">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{formatPhoneNumber(d.mobile)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-mono font-bold text-primary">{d.licenseNo}</div>
                    {d.badgeNo && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <Award className="h-3 w-3 text-amber-500" /> Badge: {d.badgeNo}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{formatDate(d.licenseExpiry)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={d.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(d)}>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => deleteDriver(d.id)}
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

      {/* Driver Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> {editingDriver ? 'Edit Chauffeur Profile' : 'Register New Chauffeur'}
            </DialogTitle>
            <DialogDescription>
              Enter personnel contact information and driving license details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="pb-2 border-b flex justify-center">
              <ImageUploader
                label="Chauffeur Profile Photo / Avatar"
                value={avatarUrl}
                onChange={(val) => setAvatarUrl(val)}
                onRemove={() => setAvatarUrl('')}
                placeholder="Upload Driver Photo"
                aspectRatio="square"
                maxDimension={400}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sonam Sherpa" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mobile Number *</Label>
                <Input required value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. 9830012345" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Duty Status</Label>
                <Select value={status} onValueChange={(s) => setStatus(s as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (On Duty)</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Driving License No *</Label>
                <Input required value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} placeholder="SK-DL-2026-0011" className="font-mono uppercase font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hill Badge No (Optional)</Label>
                <Input value={badgeNo} onChange={(e) => setBadgeNo(e.target.value)} placeholder="BDG-1020" className="font-mono" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">License Expiry Date</Label>
              <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold">Save Driver Profile</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DriversPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Drivers Directory...</div>}>
        <DriversHubContent />
      </Suspense>
    </DashboardLayout>
  );
}
