'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { CompanySettings } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FleetDatabase } from '@/services/db';
import { ImageUploader } from '@/components/shared/image-uploader';
import {
  Building,
  CreditCard,
  QrCode,
  Save,
  CheckCircle2,
  FileText,
  HelpCircle,
  Sparkles,
  Database,
  RefreshCw,
} from 'lucide-react';

function SettingsHubContent() {
  const { settings, updateSettings, inclusions, exclusions } = useFleetStore();
  const [savedMsg, setSavedMsg] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('Himalayan Vintage Holidays');
  const [address, setAddress] = useState('MG Marg, Gangtok, Sikkim — 737101');
  const [phone, setPhone] = useState('+91 98300 12345 / +91 98300 54321');
  const [email, setEmail] = useState('booking@himalayan.co');
  const [website, setWebsite] = useState('https://himalayan.billingapps.online');
  const [gstin, setGstin] = useState('11AAAAA0000A1Z5');

  // Bank & UPI QR
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50200012345678');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('himalayantaxi@hdfc');
  const [qrCodeUrl, setQrCodeUrl] = useState('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=himalayantaxi@hdfc&pn=Himalayan%20Holidays&cu=INR');
  const [logoUrl, setLogoUrl] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');

  // Terms
  const [terms, setTerms] = useState(
    '1. 50% advance booking deposit required to confirm tour reservation.\n2. Quotation estimates are valid for 15 days from issue date.\n3. AC will not operate in hill areas or high altitudes above 5,000 ft.\n4. All disputes subject to Gangtok, Sikkim jurisdiction only.'
  );

  useEffect(() => {
    if (settings) {
      if (settings.companyName) setCompanyName(settings.companyName);
      if (settings.address) setAddress(settings.address);
      if (settings.phone) setPhone(settings.phone);
      if (settings.email) setEmail(settings.email);
      if (settings.website) setWebsite(settings.website);
      if (settings.gstin) setGstin(settings.gstin);
      if (settings.bankName) setBankName(settings.bankName);
      if (settings.accountNumber) setAccountNumber(settings.accountNumber);
      if (settings.ifsc) setIfsc(settings.ifsc);
      if (settings.upiId) setUpiId(settings.upiId);
      if (settings.qrCodeUrl) setQrCodeUrl(settings.qrCodeUrl);
      if (settings.logoUrl) setLogoUrl(settings.logoUrl);
      if (settings.signatureUrl) setSignatureUrl(settings.signatureUrl);
      if (settings.termsAndConditions) setTerms(settings.termsAndConditions);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CompanySettings = {
      ...settings,
      companyName,
      address,
      phone,
      email,
      website,
      gstin,
      bankName,
      accountNumber,
      ifsc,
      upiId,
      qrCodeUrl,
      logoUrl,
      signatureUrl,
      termsAndConditions: terms,
    };
    await updateSettings(updated);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleQrUrlChange = (val: string) => {
    setQrCodeUrl(val);
    if (!val || val.includes('api.qrserver.com')) {
      const autoUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(companyName)}&cu=INR`;
      setQrCodeUrl(autoUrl);
    }
  };

  const handleSeedDatabase = async () => {
    setSeedLoading(true);
    setSeedStatus(null);
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      const res = await response.json();
      setSeedStatus({ success: res.success, message: res.message });
      if (res.success) {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (e: any) {
      setSeedStatus({ success: false, message: e.message || 'Error seeding database' });
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System & Company Configuration</h1>
          <p className="text-sm text-muted-foreground">
            Configure printed document branding, bank collection accounts, and UPI payment QR codes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full animate-fade-in">
              <CheckCircle2 className="h-4 w-4" /> Settings Saved to Database!
            </span>
          )}
          <Button onClick={handleSave} className="bg-primary text-primary-foreground font-semibold shadow-sm">
            <Save className="mr-1.5 h-4 w-4" /> Save All Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: General & Bank Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" /> Company Profile & Branding
              </CardTitle>
              <CardDescription className="text-xs">
                This information appears on header headers for Quotations, Invoices, and Bookings.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 pb-2 border-b">
                <ImageUploader
                  label="Company Logo Photo (Displays Live on Header & Invoices)"
                  value={logoUrl}
                  onChange={(val) => setLogoUrl(val)}
                  onRemove={() => setLogoUrl('')}
                  placeholder="Upload Official Company Logo (PNG / WEBP recommended)"
                  aspectRatio="banner"
                  maxDimension={600}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Company Display Name *</Label>
                <Input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Headquarters Address *</Label>
                <Input required value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contact Phone / Support Numbers *</Label>
                <Input required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Support Email Address</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Official Website URL</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company GSTIN Number</Label>
                <Input value={gstin} onChange={(e) => setGstin(e.target.value)} className="font-mono uppercase font-bold" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600" /> Bank Account & UPI Collection Details
              </CardTitle>
              <CardDescription className="text-xs">
                Bank transfer instructions displayed on invoices for direct customer remittances.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Bank Name</Label>
                <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Account Number</Label>
                <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="font-mono font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">IFSC Code</Label>
                <Input value={ifsc} onChange={(e) => setIfsc(e.target.value)} className="font-mono uppercase font-semibold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">UPI ID / VPA Address</Label>
                <Input value={upiId} onChange={(e) => {
                  setUpiId(e.target.value);
                  handleQrUrlChange('');
                }} className="font-mono font-bold text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" /> Default Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                rows={5}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="text-xs font-mono"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Col: QR Payment Photo Configuration */}
        <div className="space-y-6">
          <Card className="shadow-medium border-2 border-emerald-600/40">
            <CardHeader className="bg-emerald-600 text-white rounded-t-lg pb-4">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span className="flex items-center gap-2"><QrCode className="h-5 w-5" /> Payment QR Photo</span>
                <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded">NO GATEWAY NEEDED</span>
              </CardTitle>
              <CardDescription className="text-white/80 text-xs">
                Dynamic UPI scan code printed on invoices and booking slips
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <ImageUploader
                label="UPI Payment QR Code Photo"
                value={qrCodeUrl}
                onChange={(val) => setQrCodeUrl(val)}
                onRemove={() => setQrCodeUrl('')}
                placeholder="Upload GPay / PhonePe / Paytm QR Photo"
                aspectRatio="square"
                maxDimension={500}
              />

              <div className="space-y-1.5 text-left pt-2 border-t">
                <Label className="text-xs font-semibold">Or Paste QR Code Image URL</Label>
                <Input
                  value={qrCodeUrl}
                  onChange={(e) => setQrCodeUrl(e.target.value)}
                  placeholder="https://example.com/my-qr.png"
                  className="text-xs font-mono"
                />
                <p className="text-[10px] text-muted-foreground">
                  By default, we generate a real-time NPCI UPI QR string from your UPI ID ({upiId}). You can also upload your merchant photo!
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-left border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-bold flex items-center gap-1 mb-1">
                  <Sparkles className="h-3.5 w-3.5" /> Instant Scan & Pay
                </span>
                When clients scan this QR with any UPI app (GPay, PhonePe, Paytm), it automatically inputs your company name and outstanding bill amount!
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 pt-3 pb-3 border-t">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Update QR Photo
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-soft border-2 border-blue-500/20">
            <CardHeader className="pb-3 border-b bg-blue-50/50 dark:bg-blue-950/20">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <FileText className="h-4 w-4" /> Official Seal & Authorized Signature
              </CardTitle>
              <CardDescription className="text-xs">
                Upload your company stamp/signature photo for automatic attachment to PDF Quotations & Invoices.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ImageUploader
                label="Authorized Stamp & Signature Image"
                value={signatureUrl}
                onChange={(val) => setSignatureUrl(val)}
                onRemove={() => setSignatureUrl('')}
                placeholder="Upload Stamp or Signature (PNG transparent background recommended)"
                aspectRatio="video"
                maxDimension={500}
              />
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Database & Cloud Seeding Section */}
      <Card className="shadow-soft border-primary/20 bg-gradient-to-r from-slate-50 to-primary/5 dark:from-slate-900 dark:to-primary/10">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
            <Database className="h-4 w-4" /> Live Firestore Database Management & Seeding
          </CardTitle>
          <CardDescription className="text-xs">
            Push all 100+ items of enterprise mock data (Vehicles, Drivers, Bookings, Quotations, Routes, Inclusions) directly to your live Firebase Cloud Firestore!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            This will populate your cloud database collections (<code>vehicles</code>, <code>drivers</code>, <code>corporate</code>, <code>enquiries</code>, <code>bookings</code>, <code>quotations</code>, etc.) so your team can test real-time synchronization immediately.
          </p>
          {seedStatus && (
            <div className={`p-3 rounded-lg text-xs font-semibold ${seedStatus.success ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'}`}>
              {seedStatus.message}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/30 pt-3 pb-3 border-t flex justify-end">
          <Button
            type="button"
            onClick={handleSeedDatabase}
            disabled={seedLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${seedLoading ? 'animate-spin' : ''}`} />
            {seedLoading ? 'Seeding Firestore Database...' : 'Seed Live Firestore Database Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Company Settings...</div>}>
        <SettingsHubContent />
      </Suspense>
    </DashboardLayout>
  );
}
