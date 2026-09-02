import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  initialVehicles,
  initialDrivers,
  initialCorporateClients,
  initialEnquiries,
  initialBookings,
  initialQuotations,
  initialRoutes,
  initialDestinations,
  initialPermits,
  initialSightseeings,
  initialInclusions,
  initialExclusions,
  initialNotifications,
  initialSettings,
  initialSerialCounters,
} from '@/lib/firebase/seed-data';
import {
  Vehicle,
  Driver,
  CorporateClient,
  Enquiry,
  Booking,
  Quotation,
  RouteMaster,
  DestinationMaster,
  PermitMaster,
  SightseeingMaster,
  InclusionMaster,
  ExclusionMaster,
  Notification,
  CompanySettings,
  SerialCounters,
  Invoice,
  Receipt,
} from '@/types';

// Helper to check if Firebase is configured with real credentials
const isFirebaseConfigured = (): boolean => {
  const isConfigured = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'demo-api-key' &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-himalayan-project'
  );
  if (!isConfigured) {
    console.warn("⚠️ FIREBASE NOT CONFIGURED. Falling back to local storage. API_KEY length:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.length, "PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  } else {
    console.log("✅ FIREBASE IS CONFIGURED. Project:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  }
  return isConfigured;
};

// Generic helper for localStorage synchronization in dev/demo mode
const getLocalData = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(`hfm-db-${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    console.warn(`💾 SAVING ${key} TO LOCAL STORAGE INSTEAD OF FIREBASE!`);
    window.localStorage.setItem(`hfm-db-${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save local DB data:', e);
  }
};

export class FleetDatabase {
  // --- VEHICLES ---
  static async getVehicles(): Promise<Vehicle[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'vehicles'));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Vehicle));
      } catch (e) {
        console.warn('Firestore fetch failed, falling back to local DB:', e);
      }
    }
    return getLocalData<Vehicle[]>('vehicles', initialVehicles);
  }

  static async upsertVehicle(vehicle: Vehicle): Promise<Vehicle> {
    if (isFirebaseConfigured() && db) {
      try {
        const id = vehicle.id || `v-${Date.now()}`;
        const newVehicle = { ...vehicle, id };
        await setDoc(doc(db, 'vehicles', id), newVehicle);
        return newVehicle;
      } catch (e) {
        console.warn('Firestore upsert failed, using local DB:', e);
      }
    }
    const current = getLocalData<Vehicle[]>('vehicles', initialVehicles);
    const id = vehicle.id || `v-${Date.now()}`;
    const newVehicle = { ...vehicle, id };
    const index = current.findIndex((v) => v.id === id);
    if (index >= 0) current[index] = newVehicle;
    else current.unshift(newVehicle);
    setLocalData('vehicles', current);
    return newVehicle;
  }

  static async deleteVehicle(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'vehicles', id));
        return;
      } catch (e) {
        console.warn('Firestore delete failed, using local DB:', e);
      }
    }
    const current = getLocalData<Vehicle[]>('vehicles', initialVehicles);
    setLocalData('vehicles', current.filter((v) => v.id !== id));
  }

  // --- DRIVERS ---
  static async getDrivers(): Promise<Driver[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'drivers'));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Driver));
      } catch (e) {
        console.warn('Firestore fetch failed:', e);
      }
    }
    return getLocalData<Driver[]>('drivers', initialDrivers);
  }

  static async upsertDriver(driver: Driver): Promise<Driver> {
    const id = driver.id || `d-${Date.now()}`;
    const newDriver = { ...driver, id };
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'drivers', id), newDriver);
        return newDriver;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Driver[]>('drivers', initialDrivers);
    const index = current.findIndex((d) => d.id === id);
    if (index >= 0) current[index] = newDriver;
    else current.unshift(newDriver);
    setLocalData('drivers', current);
    return newDriver;
  }

  static async deleteDriver(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'drivers', id));
        return;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Driver[]>('drivers', initialDrivers);
    setLocalData('drivers', current.filter((d) => d.id !== id));
  }

  // --- CORPORATE CLIENTS ---
  static async getCorporateClients(): Promise<CorporateClient[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'corporate_clients'));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CorporateClient));
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    return getLocalData<CorporateClient[]>('corporate_clients', initialCorporateClients);
  }

  static async upsertCorporateClient(client: CorporateClient): Promise<CorporateClient> {
    const id = client.id || `c-${Date.now()}`;
    const newClient = { ...client, id };
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'corporate_clients', id), newClient);
        return newClient;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<CorporateClient[]>('corporate_clients', initialCorporateClients);
    const index = current.findIndex((c) => c.id === id);
    if (index >= 0) current[index] = newClient;
    else current.unshift(newClient);
    setLocalData('corporate_clients', current);
    return newClient;
  }

  static async deleteCorporateClient(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'corporate_clients', id));
        return;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<CorporateClient[]>('corporate_clients', initialCorporateClients);
    setLocalData('corporate_clients', current.filter((c) => c.id !== id));
  }

  // --- ENQUIRIES ---
  static async getEnquiries(): Promise<Enquiry[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'enquiries'));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enquiry));
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    return getLocalData<Enquiry[]>('enquiries', initialEnquiries);
  }

  static async upsertEnquiry(enq: Enquiry): Promise<Enquiry> {
    const id = enq.id || `e-${Date.now()}`;
    const newEnq = { ...enq, id };
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'enquiries', id), newEnq);
        return newEnq;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Enquiry[]>('enquiries', initialEnquiries);
    const index = current.findIndex((e) => e.id === id);
    if (index >= 0) current[index] = newEnq;
    else current.unshift(newEnq);
    setLocalData('enquiries', current);
    return newEnq;
  }

  static async deleteEnquiry(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'enquiries', id));
        return;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Enquiry[]>('enquiries', initialEnquiries);
    setLocalData('enquiries', current.filter((e) => e.id !== id));
  }

  // --- BOOKINGS ---
  static async getBookings(): Promise<Booking[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'bookings'));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    return getLocalData<Booking[]>('bookings', initialBookings);
  }

  static async upsertBooking(booking: Booking): Promise<Booking> {
    const id = booking.id || `b-${Date.now()}`;
    const newBooking = { ...booking, id };
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'bookings', id), newBooking);
        return newBooking;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Booking[]>('bookings', initialBookings);
    const index = current.findIndex((b) => b.id === id);
    if (index >= 0) current[index] = newBooking;
    else current.unshift(newBooking);
    setLocalData('bookings', current);
    return newBooking;
  }

  static async deleteBooking(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
        return;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Booking[]>('bookings', initialBookings);
    setLocalData('bookings', current.filter((b) => b.id !== id));
  }

  // --- QUOTATIONS ---
  static async getQuotations(): Promise<Quotation[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'quotations'));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Quotation));
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    return getLocalData<Quotation[]>('quotations', initialQuotations);
  }

  static async upsertQuotation(quotation: Quotation): Promise<Quotation> {
    const id = quotation.id || `q-${Date.now()}`;
    const newQuotation = { ...quotation, id };
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'quotations', id), newQuotation);
        return newQuotation;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Quotation[]>('quotations', initialQuotations);
    const index = current.findIndex((q) => q.id === id);
    if (index >= 0) current[index] = newQuotation;
    else current.unshift(newQuotation);
    setLocalData('quotations', current);
    return newQuotation;
  }

  static async deleteQuotation(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'quotations', id));
        return;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Quotation[]>('quotations', initialQuotations);
    setLocalData('quotations', current.filter((q) => q.id !== id));
  }

  // --- INVOICES & RECEIPTS ---
  static async getInvoices(): Promise<Invoice[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'invoices'));
        if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invoice));
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    return getLocalData<Invoice[]>('invoices', []);
  }

  static async upsertInvoice(invoice: Invoice): Promise<Invoice> {
    const id = invoice.id || `inv-${Date.now()}`;
    const newInv = { ...invoice, id };
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'invoices', id), newInv);
        return newInv;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Invoice[]>('invoices', []);
    const index = current.findIndex((i) => i.id === id);
    if (index >= 0) current[index] = newInv;
    else current.unshift(newInv);
    setLocalData('invoices', current);
    return newInv;
  }

  static async deleteInvoice(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'invoices', id));
        return;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Invoice[]>('invoices', []);
    setLocalData('invoices', current.filter((i) => i.id !== id));
  }

  static async getReceipts(): Promise<Receipt[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'receipts'));
        if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Receipt));
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    return getLocalData<Receipt[]>('receipts', []);
  }

  static async upsertReceipt(receipt: Receipt): Promise<Receipt> {
    const id = receipt.id || `rec-${Date.now()}`;
    const newRec = { ...receipt, id };
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'receipts', id), newRec);
        return newRec;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Receipt[]>('receipts', []);
    const index = current.findIndex((r) => r.id === id);
    if (index >= 0) current[index] = newRec;
    else current.unshift(newRec);
    setLocalData('receipts', current);
    return newRec;
  }

  static async deleteReceipt(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'receipts', id));
        return;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    const current = getLocalData<Receipt[]>('receipts', []);
    setLocalData('receipts', current.filter((r) => r.id !== id));
  }

  // --- MASTERS & SETTINGS ---
  static async getRoutes(): Promise<RouteMaster[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'routes'));
        if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as RouteMaster));
      } catch (e) { console.warn('Firestore error:', e); }
    }
    return getLocalData<RouteMaster[]>('routes', initialRoutes);
  }
  static async upsertRoute(route: RouteMaster): Promise<RouteMaster> {
    const id = route.id || `r-${Date.now()}`;
    const newRoute = { ...route, id };
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'routes', id), newRoute);
        return newRoute;
      } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<RouteMaster[]>('routes', initialRoutes);
    const idx = current.findIndex((r) => r.id === id);
    if (idx >= 0) current[idx] = newRoute;
    else current.unshift(newRoute);
    setLocalData('routes', current);
    return newRoute;
  }
  static async deleteRoute(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try { await deleteDoc(doc(db, 'routes', id)); return; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<RouteMaster[]>('routes', initialRoutes);
    setLocalData('routes', current.filter((r) => r.id !== id));
  }

  static async getDestinations(): Promise<DestinationMaster[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'destinations'));
        if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DestinationMaster));
      } catch (e) { console.warn('Firestore error:', e); }
    }
    return getLocalData<DestinationMaster[]>('destinations', initialDestinations);
  }
  static async upsertDestination(dest: DestinationMaster): Promise<DestinationMaster> {
    const id = dest.id || `dest-${Date.now()}`;
    const newDest = { ...dest, id };
    if (isFirebaseConfigured() && db) {
      try { await setDoc(doc(db, 'destinations', id), newDest); return newDest; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<DestinationMaster[]>('destinations', initialDestinations);
    const idx = current.findIndex((d) => d.id === id);
    if (idx >= 0) current[idx] = newDest; else current.unshift(newDest);
    setLocalData('destinations', current);
    return newDest;
  }
  static async deleteDestination(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try { await deleteDoc(doc(db, 'destinations', id)); return; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<DestinationMaster[]>('destinations', initialDestinations);
    setLocalData('destinations', current.filter((d) => d.id !== id));
  }

  static async getPermits(): Promise<PermitMaster[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'permits'));
        if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PermitMaster));
      } catch (e) { console.warn('Firestore error:', e); }
    }
    return getLocalData<PermitMaster[]>('permits', initialPermits);
  }
  static async upsertPermit(permit: PermitMaster): Promise<PermitMaster> {
    const id = permit.id || `perm-${Date.now()}`;
    const newPermit = { ...permit, id };
    if (isFirebaseConfigured() && db) {
      try { await setDoc(doc(db, 'permits', id), newPermit); return newPermit; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<PermitMaster[]>('permits', initialPermits);
    const idx = current.findIndex((p) => p.id === id);
    if (idx >= 0) current[idx] = newPermit; else current.unshift(newPermit);
    setLocalData('permits', current);
    return newPermit;
  }
  static async deletePermit(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try { await deleteDoc(doc(db, 'permits', id)); return; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<PermitMaster[]>('permits', initialPermits);
    setLocalData('permits', current.filter((p) => p.id !== id));
  }

  static async getSightseeings(): Promise<SightseeingMaster[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'sightseeings'));
        if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SightseeingMaster));
      } catch (e) { console.warn('Firestore error:', e); }
    }
    return getLocalData<SightseeingMaster[]>('sightseeings', initialSightseeings);
  }
  static async upsertSightseeing(sight: SightseeingMaster): Promise<SightseeingMaster> {
    const id = sight.id || `st-${Date.now()}`;
    const newSight = { ...sight, id };
    if (isFirebaseConfigured() && db) {
      try { await setDoc(doc(db, 'sightseeings', id), newSight); return newSight; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<SightseeingMaster[]>('sightseeings', initialSightseeings);
    const idx = current.findIndex((s) => s.id === id);
    if (idx >= 0) current[idx] = newSight; else current.unshift(newSight);
    setLocalData('sightseeings', current);
    return newSight;
  }
  static async deleteSightseeing(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try { await deleteDoc(doc(db, 'sightseeings', id)); return; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<SightseeingMaster[]>('sightseeings', initialSightseeings);
    setLocalData('sightseeings', current.filter((s) => s.id !== id));
  }

  static async getInclusions(): Promise<InclusionMaster[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'inclusions'));
        if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as InclusionMaster));
      } catch (e) { console.warn('Firestore error:', e); }
    }
    return getLocalData<InclusionMaster[]>('inclusions', initialInclusions as any) as any;
  }
  static async upsertInclusion(inc: InclusionMaster): Promise<InclusionMaster> {
    const id = inc.id || `inc-${Date.now()}`;
    const newInc = { ...inc, id };
    if (isFirebaseConfigured() && db) {
      try { await setDoc(doc(db, 'inclusions', id), newInc); return newInc; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<InclusionMaster[]>('inclusions', initialInclusions as any);
    const idx = current.findIndex((i) => i.id === id);
    if (idx >= 0) current[idx] = newInc; else current.unshift(newInc);
    setLocalData('inclusions', current);
    return newInc;
  }
  static async deleteInclusion(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try { await deleteDoc(doc(db, 'inclusions', id)); return; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<InclusionMaster[]>('inclusions', initialInclusions as any);
    setLocalData('inclusions', current.filter((i) => i.id !== id));
  }

  static async getExclusions(): Promise<ExclusionMaster[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'exclusions'));
        if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ExclusionMaster));
      } catch (e) { console.warn('Firestore error:', e); }
    }
    return getLocalData<ExclusionMaster[]>('exclusions', initialExclusions);
  }
  static async upsertExclusion(exc: ExclusionMaster): Promise<ExclusionMaster> {
    const id = exc.id || `exc-${Date.now()}`;
    const newExc = { ...exc, id };
    if (isFirebaseConfigured() && db) {
      try { await setDoc(doc(db, 'exclusions', id), newExc); return newExc; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<ExclusionMaster[]>('exclusions', initialExclusions);
    const idx = current.findIndex((e) => e.id === id);
    if (idx >= 0) current[idx] = newExc; else current.unshift(newExc);
    setLocalData('exclusions', current);
    return newExc;
  }
  static async deleteExclusion(id: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try { await deleteDoc(doc(db, 'exclusions', id)); return; } catch (e) { console.warn('Firestore error:', e); }
    }
    const current = getLocalData<ExclusionMaster[]>('exclusions', initialExclusions);
    setLocalData('exclusions', current.filter((e) => e.id !== id));
  }

  static async getNotifications(): Promise<Notification[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'notifications'));
        if (!snap.empty) return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
      } catch (e) { console.warn('Firestore error:', e); }
    }
    return getLocalData<Notification[]>('notifications', initialNotifications);
  }

  static async getSettings(): Promise<CompanySettings> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'company'));
        if (snap.exists()) return snap.data() as CompanySettings;
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    return getLocalData<CompanySettings>('settings', initialSettings);
  }

  static async updateSettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'settings', 'company'), updated);
      } catch (e) {
        console.warn('Firestore error:', e);
      }
    }
    setLocalData('settings', updated);
    return updated;
  }

  static async nextSerial(type: 'transport' | 'package' | 'invoice' | 'receipt'): Promise<string> {
    const current = getLocalData<SerialCounters>('serialCounters', initialSerialCounters);
    const year = new Date().getFullYear();
    const item = current[type] || { year, next: 1 };
    const validItem = item.year === year ? item : { year, next: 1 };
    
    let prefix = 'TR';
    if (type === 'package') prefix = 'PKG';
    else if (type === 'invoice') prefix = 'INV';
    else if (type === 'receipt') prefix = 'REC';

    const serialStr = `${prefix}-${year}-${String(validItem.next).padStart(4, '0')}`;
    current[type] = { year, next: validItem.next + 1 };
    setLocalData('serialCounters', current);
    return serialStr;
  }

  static async seedDatabase(): Promise<{ success: boolean; count: number; message: string }> {
    if (!isFirebaseConfigured() || !db) {
      return { success: false, count: 0, message: 'Firebase is not configured with live credentials.' };
    }
    try {
      let count = 0;
      for (const v of initialVehicles) { await setDoc(doc(db, 'vehicles', v.id), v); count++; }
      for (const d of initialDrivers) { await setDoc(doc(db, 'drivers', d.id), d); count++; }
      for (const c of initialCorporateClients) { await setDoc(doc(db, 'corporate', c.id), c); count++; }
      for (const e of initialEnquiries) { await setDoc(doc(db, 'enquiries', e.id), e); count++; }
      for (const b of initialBookings) { await setDoc(doc(db, 'bookings', b.id), b); count++; }
      for (const q of initialQuotations) { await setDoc(doc(db, 'quotations', q.id), q); count++; }
      for (const r of initialRoutes) { await setDoc(doc(db, 'routes', r.id), r); count++; }
      for (const dest of initialDestinations) { await setDoc(doc(db, 'destinations', dest.id), dest); count++; }
      for (const p of initialPermits) { await setDoc(doc(db, 'permits', p.id), p); count++; }
      for (const s of initialSightseeings) { await setDoc(doc(db, 'sightseeings', s.id), s); count++; }
      for (const inc of initialInclusions) { await setDoc(doc(db, 'inclusions', inc.id), inc); count++; }
      for (const exc of initialExclusions) { await setDoc(doc(db, 'exclusions', exc.id), exc); count++; }
      await setDoc(doc(db, 'settings', 'company'), initialSettings); count++;
      return { success: true, count, message: `Successfully seeded ${count} documents to live Firestore database!` };
    } catch (e: any) {
      console.error('Seeding failed:', e);
      return { success: false, count: 0, message: e.message || 'Error occurred during database seeding.' };
    }
  }
}
