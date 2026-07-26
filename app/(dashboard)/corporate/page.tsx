'use client';
import React, { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { CorporateClient } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { ImageUploader } from '@/components/shared/image-uploader';
import { formatCurrency, formatPhoneNumber } from '@/utils/formatters';
import {
  Building2,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  Phone,
  Mail,
  Percent,
  FileSpreadsheet,
} from 'lucide-react';

function CorporateHubContent() {
  const { corporateClients, addClient, updateClient, deleteClient } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<CorporateClient | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [gstin, setGstin] = useState('');
  const [contractRate, setContractRate] = useState(22);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'fortnightly' | 'per-trip' | string>('monthly');
  const [status, setStatus] = useState<'active' | 'inactive' | string>('active');
  const [logoUrl, setLogoUrl] = useState('');

  const openNewModal = () => {
    setEditingClient(null);
    setCompanyName('');
    setContactPerson('');
    setEmail('');
    setMobile('');
    setGstin('');
    setContractRate(22);
    setDiscountPercent(10);
    setBillingCycle('monthly');
    setStatus('active');
    setLogoUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: CorporateClient) => {
    setEditingClient(c);
    setCompanyName(c.companyName || '');
    setContactPerson(c.contactPerson || '');
    setEmail(c.email || '');
    setMobile(c.mobile || '');
    setGstin(c.gstin || c.gst || '');
    setContractRate(c.contractRate || 0);
    setDiscountPercent(c.discountPercent || 0);
    setBillingCycle((c.billingCycle as any) || 'monthly');
    setStatus((c.status as any) || 'active');
    setLogoUrl(c.logoUrl || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson) return;

    if (editingClient) {
      await updateClient({
        ...editingClient,
        companyName,
        contactPerson,
        email,
        mobile,
        gstin,
        contractRate: Number(contractRate),
        discountPercent: Number(discountPercent),
        billingCycle,
        status,
        logoUrl,
      });
    } else {
      const newId = `corp-${Date.now()}`;
      await addClient({
        id: newId,
        companyName,
        contactPerson,
        email,
        mobile,
        gstin,
        contractRate: Number(contractRate),
        discountPercent: Number(discountPercent),
        billingCycle,
        status,
        logoUrl,
        createdAt: new Date().toISOString(),
      });
    }
    setIsModalOpen(false);
  };

  const filtered = corporateClients.filter((c) =>
    (c.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.mobile || '').includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Corporate B2B Contracts</h1>
          <p className="text-sm text-muted-foreground">
            Manage enterprise accounts, per-km contract agreements, and bulk invoicing cycles.
          </p>
        </div>
        <Button onClick={openNewModal} className="bg-primary text-primary-foreground font-semibold shadow-sm">
          <PlusCircle className="mr-1.5 h-4 w-4" /> Add Corporate Client
        </Button>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company, contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
      </Card>

      <Card className="shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company & GSTIN</TableHead>
              <TableHead>Contact Personnel</TableHead>
              <TableHead>Contract Pricing</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No corporate B2B clients registered.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-bold text-base text-foreground flex items-center gap-2.5">
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.companyName} className="h-8 w-8 rounded-lg object-contain border p-0.5 bg-white shadow-xs" />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="h-4 w-4 shrink-0" />
                        </div>
                      )}
                      <span>{c.companyName}</span>
                    </div>
                    {c.gstin && (
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5 ml-10">GSTIN: {c.gstin}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-sm text-foreground">{c.contactPerson}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 font-mono">
                      <span>{formatPhoneNumber(c.mobile)}</span>
                    </div>
                    {c.email && <div className="text-[11px] text-muted-foreground truncate">{c.email}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold font-mono text-primary">{formatCurrency(c.contractRate)} / KM</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5">
                      <Percent className="h-3 w-3" /> {c.discountPercent}% Corporate Discount
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold uppercase tracking-wider bg-muted px-2 py-1 rounded">
                      {c.billingCycle}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(c)}>
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => deleteClient(c.id)}
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

      {/* Corporate Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> {editingClient ? 'Edit Corporate Account' : 'Register Corporate Client'}
            </DialogTitle>
            <DialogDescription>
              Set contract per-km pricing, billing cycles, and GSTIN details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="pb-2 border-b flex justify-center">
              <ImageUploader
                label="Corporate Client Logo"
                value={logoUrl}
                onChange={(val) => setLogoUrl(val)}
                onRemove={() => setLogoUrl('')}
                placeholder="Upload Company Logo"
                aspectRatio="banner"
                maxDimension={400}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Company / Enterprise Name *</Label>
              <Input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. MakeMyTrip India Pvt Ltd" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contact Person *</Label>
                <Input required value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="e.g. Rajesh Kumar" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mobile Number *</Label>
                <Input required value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. 9830012345" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rajesh@makemytrip.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company GSTIN</Label>
                <Input value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="19AAAAA0000A1Z5" className="font-mono uppercase" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contract Rate (₹/KM)</Label>
                <Input type="number" min={1} value={contractRate} onChange={(e) => setContractRate(Number(e.target.value))} className="font-mono font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Discount (%)</Label>
                <Input type="number" min={0} max={50} value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Billing Cycle</Label>
                <Select value={billingCycle} onValueChange={(b) => setBillingCycle(b as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="per-trip">Per Trip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold">Save Corporate Contract</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CorporatePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Corporate Contracts...</div>}>
        <CorporateHubContent />
      </Suspense>
    </DashboardLayout>
  );
}
