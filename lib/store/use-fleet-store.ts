import { create } from 'zustand';
import {
  Vehicle,
  Driver,
  CorporateClient,
  Enquiry,
  Booking,
  Quotation,
  Invoice,
  Receipt,
  RouteMaster,
  DestinationMaster,
  PermitMaster,
  SightseeingMaster,
  InclusionMaster,
  ExclusionMaster,
  Notification,
  CompanySettings,
} from '@/types';
import { FleetDatabase } from '@/services/db';

interface FleetState {
  vehicles: Vehicle[];
  drivers: Driver[];
  corporateClients: CorporateClient[];
  enquiries: Enquiry[];
  bookings: Booking[];
  quotations: Quotation[];
  invoices: Invoice[];
  receipts: Receipt[];
  routes: RouteMaster[];
  destinations: DestinationMaster[];
  permits: PermitMaster[];
  sightseeings: SightseeingMaster[];
  inclusions: InclusionMaster[];
  exclusions: ExclusionMaster[];
  notifications: Notification[];
  settings: CompanySettings | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  fetchAll: () => Promise<void>;
  
  // Vehicles CRUD
  addVehicle: (v: Vehicle) => Promise<void>;
  updateVehicle: (v: Vehicle) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;

  // Drivers CRUD
  addDriver: (d: Driver) => Promise<void>;
  updateDriver: (d: Driver) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;

  // Corporate Clients CRUD
  addClient: (c: CorporateClient) => Promise<void>;
  updateClient: (c: CorporateClient) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  // Enquiries CRUD
  addEnquiry: (e: Enquiry) => Promise<void>;
  updateEnquiry: (e: Enquiry) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;

  // Bookings CRUD
  addBooking: (b: Booking) => Promise<void>;
  updateBooking: (b: Booking) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;

  // Quotations CRUD
  addQuotation: (q: Quotation) => Promise<void>;
  updateQuotation: (q: Quotation) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;

  // Invoices & Receipts CRUD
  addInvoice: (i: Invoice) => Promise<void>;
  updateInvoice: (i: Invoice) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  addReceipt: (r: Receipt) => Promise<void>;
  updateReceipt: (r: Receipt) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;

  // Routes & Masters CRUD
  addRoute: (r: RouteMaster) => Promise<void>;
  updateRoute: (r: RouteMaster) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
  addDestination: (d: DestinationMaster) => Promise<void>;
  updateDestination: (d: DestinationMaster) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;
  addPermit: (p: PermitMaster) => Promise<void>;
  updatePermit: (p: PermitMaster) => Promise<void>;
  deletePermit: (id: string) => Promise<void>;
  addSightseeing: (s: SightseeingMaster) => Promise<void>;
  updateSightseeing: (s: SightseeingMaster) => Promise<void>;
  deleteSightseeing: (id: string) => Promise<void>;
  addInclusion: (i: InclusionMaster) => Promise<void>;
  updateInclusion: (i: InclusionMaster) => Promise<void>;
  deleteInclusion: (id: string) => Promise<void>;
  addExclusion: (e: ExclusionMaster) => Promise<void>;
  updateExclusion: (e: ExclusionMaster) => Promise<void>;
  deleteExclusion: (id: string) => Promise<void>;

  // Settings
  updateSettings: (s: Partial<CompanySettings>) => Promise<void>;
  markNotificationRead: (id: string) => void;
}

export const useFleetStore = create<FleetState>((set, get) => ({
  vehicles: [],
  drivers: [],
  corporateClients: [],
  enquiries: [],
  bookings: [],
  quotations: [],
  invoices: [],
  receipts: [],
  routes: [],
  destinations: [],
  permits: [],
  sightseeings: [],
  inclusions: [],
  exclusions: [],
  notifications: [],
  settings: null,
  isLoading: true,
  isInitialized: false,

  fetchAll: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      const [
        vehicles,
        drivers,
        corporateClients,
        enquiries,
        bookings,
        quotations,
        invoices,
        receipts,
        routes,
        destinations,
        permits,
        sightseeings,
        inclusions,
        exclusions,
        notifications,
        settings,
      ] = await Promise.all([
        FleetDatabase.getVehicles(),
        FleetDatabase.getDrivers(),
        FleetDatabase.getCorporateClients(),
        FleetDatabase.getEnquiries(),
        FleetDatabase.getBookings(),
        FleetDatabase.getQuotations(),
        FleetDatabase.getInvoices(),
        FleetDatabase.getReceipts(),
        FleetDatabase.getRoutes(),
        FleetDatabase.getDestinations(),
        FleetDatabase.getPermits(),
        FleetDatabase.getSightseeings(),
        FleetDatabase.getInclusions(),
        FleetDatabase.getExclusions(),
        FleetDatabase.getNotifications(),
        FleetDatabase.getSettings(),
      ]);

      set({
        vehicles,
        drivers,
        corporateClients,
        enquiries,
        bookings,
        quotations,
        invoices,
        receipts,
        routes,
        destinations,
        permits,
        sightseeings,
        inclusions,
        exclusions,
        notifications,
        settings,
        isLoading: false,
        isInitialized: true,
      });
    } catch (e) {
      console.error('Failed to load fleet data:', e);
      set({ isLoading: false, isInitialized: true });
    }
  },

  addVehicle: async (v) => {
    const saved = await FleetDatabase.upsertVehicle(v);
    set((s) => ({ vehicles: [saved, ...s.vehicles] }));
  },
  updateVehicle: async (v) => {
    const saved = await FleetDatabase.upsertVehicle(v);
    set((s) => ({ vehicles: s.vehicles.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteVehicle: async (id) => {
    await FleetDatabase.deleteVehicle(id);
    set((s) => ({ vehicles: s.vehicles.filter((item) => item.id !== id) }));
  },

  addDriver: async (d) => {
    const saved = await FleetDatabase.upsertDriver(d);
    set((s) => ({ drivers: [saved, ...s.drivers] }));
  },
  updateDriver: async (d) => {
    const saved = await FleetDatabase.upsertDriver(d);
    set((s) => ({ drivers: s.drivers.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteDriver: async (id) => {
    await FleetDatabase.deleteDriver(id);
    set((s) => ({ drivers: s.drivers.filter((item) => item.id !== id) }));
  },

  addClient: async (c) => {
    const saved = await FleetDatabase.upsertCorporateClient(c);
    set((s) => ({ corporateClients: [saved, ...s.corporateClients] }));
  },
  updateClient: async (c) => {
    const saved = await FleetDatabase.upsertCorporateClient(c);
    set((s) => ({ corporateClients: s.corporateClients.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteClient: async (id) => {
    await FleetDatabase.deleteCorporateClient(id);
    set((s) => ({ corporateClients: s.corporateClients.filter((item) => item.id !== id) }));
  },

  addEnquiry: async (e) => {
    const saved = await FleetDatabase.upsertEnquiry(e);
    set((s) => ({ enquiries: [saved, ...s.enquiries] }));
  },
  updateEnquiry: async (e) => {
    const saved = await FleetDatabase.upsertEnquiry(e);
    set((s) => ({ enquiries: s.enquiries.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteEnquiry: async (id) => {
    await FleetDatabase.deleteEnquiry(id);
    set((s) => ({ enquiries: s.enquiries.filter((item) => item.id !== id) }));
  },

  addBooking: async (b) => {
    const saved = await FleetDatabase.upsertBooking(b);
    set((s) => ({ bookings: [saved, ...s.bookings] }));
  },
  updateBooking: async (b) => {
    const saved = await FleetDatabase.upsertBooking(b);
    set((s) => ({ bookings: s.bookings.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteBooking: async (id) => {
    await FleetDatabase.deleteBooking(id);
    set((s) => ({ bookings: s.bookings.filter((item) => item.id !== id) }));
  },

  addQuotation: async (q) => {
    const saved = await FleetDatabase.upsertQuotation(q);
    set((s) => ({ quotations: [saved, ...s.quotations] }));
  },
  updateQuotation: async (q) => {
    const saved = await FleetDatabase.upsertQuotation(q);
    set((s) => ({ quotations: s.quotations.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteQuotation: async (id) => {
    await FleetDatabase.deleteQuotation(id);
    set((s) => ({ quotations: s.quotations.filter((item) => item.id !== id) }));
  },

  addInvoice: async (i) => {
    const saved = await FleetDatabase.upsertInvoice(i);
    set((s) => ({ invoices: [saved, ...s.invoices] }));
  },
  updateInvoice: async (i) => {
    const saved = await FleetDatabase.upsertInvoice(i);
    set((s) => ({ invoices: s.invoices.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteInvoice: async (id) => {
    await FleetDatabase.deleteInvoice(id);
    set((s) => ({ invoices: s.invoices.filter((item) => item.id !== id) }));
  },

  addReceipt: async (r) => {
    const saved = await FleetDatabase.upsertReceipt(r);
    set((s) => ({ receipts: [saved, ...s.receipts] }));
  },
  updateReceipt: async (r) => {
    const saved = await FleetDatabase.upsertReceipt(r);
    set((s) => ({ receipts: s.receipts.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteReceipt: async (id) => {
    await FleetDatabase.deleteReceipt(id);
    set((s) => ({ receipts: s.receipts.filter((item) => item.id !== id) }));
  },

  updateSettings: async (s) => {
    const updated = await FleetDatabase.updateSettings(s);
    set({ settings: updated });
  },

  addRoute: async (r) => {
    const saved = await FleetDatabase.upsertRoute(r);
    set((s) => ({ routes: [saved, ...s.routes] }));
  },
  updateRoute: async (r) => {
    const saved = await FleetDatabase.upsertRoute(r);
    set((s) => ({ routes: s.routes.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteRoute: async (id) => {
    await FleetDatabase.deleteRoute(id);
    set((s) => ({ routes: s.routes.filter((item) => item.id !== id) }));
  },

  addDestination: async (d) => {
    const saved = await FleetDatabase.upsertDestination(d);
    set((s) => ({ destinations: [saved, ...s.destinations] }));
  },
  updateDestination: async (d) => {
    const saved = await FleetDatabase.upsertDestination(d);
    set((s) => ({ destinations: s.destinations.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteDestination: async (id) => {
    await FleetDatabase.deleteDestination(id);
    set((s) => ({ destinations: s.destinations.filter((item) => item.id !== id) }));
  },

  addPermit: async (p) => {
    const saved = await FleetDatabase.upsertPermit(p);
    set((s) => ({ permits: [saved, ...s.permits] }));
  },
  updatePermit: async (p) => {
    const saved = await FleetDatabase.upsertPermit(p);
    set((s) => ({ permits: s.permits.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deletePermit: async (id) => {
    await FleetDatabase.deletePermit(id);
    set((s) => ({ permits: s.permits.filter((item) => item.id !== id) }));
  },

  addSightseeing: async (st) => {
    const saved = await FleetDatabase.upsertSightseeing(st);
    set((s) => ({ sightseeings: [saved, ...s.sightseeings] }));
  },
  updateSightseeing: async (st) => {
    const saved = await FleetDatabase.upsertSightseeing(st);
    set((s) => ({ sightseeings: s.sightseeings.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteSightseeing: async (id) => {
    await FleetDatabase.deleteSightseeing(id);
    set((s) => ({ sightseeings: s.sightseeings.filter((item) => item.id !== id) }));
  },

  addInclusion: async (i) => {
    const saved = await FleetDatabase.upsertInclusion(i);
    set((s) => ({ inclusions: [saved, ...s.inclusions] }));
  },
  updateInclusion: async (i) => {
    const saved = await FleetDatabase.upsertInclusion(i);
    set((s) => ({ inclusions: s.inclusions.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteInclusion: async (id) => {
    await FleetDatabase.deleteInclusion(id);
    set((s) => ({ inclusions: s.inclusions.filter((item) => item.id !== id) }));
  },

  addExclusion: async (ex) => {
    const saved = await FleetDatabase.upsertExclusion(ex);
    set((s) => ({ exclusions: [saved, ...s.exclusions] }));
  },
  updateExclusion: async (ex) => {
    const saved = await FleetDatabase.upsertExclusion(ex);
    set((s) => ({ exclusions: s.exclusions.map((item) => (item.id === saved.id ? saved : item)) }));
  },
  deleteExclusion: async (id) => {
    await FleetDatabase.deleteExclusion(id);
    set((s) => ({ exclusions: s.exclusions.filter((item) => item.id !== id) }));
  },

  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },
}));
