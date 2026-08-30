export type Role = 'admin' | 'manager' | 'operator' | string;
export type UserRole = Role;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  status?: string;
  createdAt?: string;
}

export type VehicleCategory = 
  | 'WAGNOR'
  | 'Sedan - Swift Dzire'
  | 'Innova / Xylo'
  | 'Innova Crysta'
  | '11 Tempo Traveller'
  | '12 Seater Tempo Traveller'
  | '14 Seater Tempo Traveller'
  | '17 Seater Tempo Traveller'
  | '22 seater AC PREMIUM BUS'
  | '26 SEATER AC PREMIUM BUS'
  | '35 SEATER AC PREMIUM BUS'
  | '40 SEATER AC PREMIUM BUS'
  | 'URBANIA - 16 SEATER'
  | 'AC BOLERO'
  | 'TATA SUMO'
  | 'BOLERO'
  | 'Coaster bus'
  | 'Hiace bus'
  | 'High Roof Coaster'
  | 'SUV'
  | 'CRETA'
  | 'BYD'
  | string;

export type VehicleType = VehicleCategory;
export type VehicleStatus = 'active' | 'maintenance' | 'inactive' | string;

export interface Vehicle {
  id: string;
  category?: VehicleCategory;
  type?: VehicleCategory;
  name: string;
  registration?: string;
  regNo?: string;
  seatingCapacity: number;
  driverName?: string;
  driverMobile?: string;
  fuelType?: 'Diesel' | 'Petrol' | 'EV' | 'Hybrid' | 'diesel' | 'petrol' | 'ev' | string;
  status?: VehicleStatus;
  imageUrl?: string;
  permitExpiry?: string;
  insuranceExpiry?: string;
  createdAt?: string;
}

export type DriverStatus = 'active' | 'on-leave' | 'inactive' | string;

export interface Driver {
  id: string;
  name: string;
  mobile: string;
  license?: string;
  licenseNo?: string;
  badgeNo?: string;
  licenseExpiry?: string;
  assignedVehicleId?: string;
  salary?: number;
  status?: DriverStatus;
  avatarUrl?: string;
  licenseUrl?: string;
  createdAt?: string;
}

export interface CorporateClient {
  id: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email?: string;
  gst?: string;
  gstin?: string;
  billingAddress?: string;
  contractPricing?: string;
  contractRate?: number;
  discountPercent?: number;
  billingCycle?: string;
  status?: string;
  logoUrl?: string;
  createdAt?: string;
}

export type ClientType = 'tourist' | 'corporate' | 'b2b' | string;
export type EnquiryType = ClientType;
export type QuotationType = ClientType;
export type EnquiryStatus = 'new' | 'follow-up' | 'quotation-sent' | 'confirmed' | 'cancelled' | string;

export interface Enquiry {
  id: string;
  enquiryNo?: string;
  customerName: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  clientType?: ClientType;
  type?: ClientType;
  pickupLocation: string;
  destination: string;
  startDate: string;
  endDate?: string;
  days: number;
  passengers: number;
  ticketRequired?: boolean;
  hotelRequired?: boolean;
  hotelType?: 'with-hotel' | 'without-hotel' | string;
  vehicle: VehicleCategory | string;
  places?: string;
  specialRequirements?: string;
  internalNotes?: string;
  customerRemarks?: string;
  notes?: string;
  status?: EnquiryStatus;
  createdAt?: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'confirmed' | 'cancelled' | string;

export interface ItineraryItem {
  id?: string;
  day?: number;
  title: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface QuotationVehicle {
  id: string;
  category?: VehicleCategory;
  quantity?: number;
  vehicleName?: string;
  registration?: string;
  driverName?: string;
}

export interface QuotationRoute {
  id: string;
  pickup?: string;
  destination?: string;
  description?: string;
  km?: number;
  toll?: number;
  parking?: number;
}

export interface QuotationCorporatePricing {
  perKm?: number;
  perHour?: number;
  extraKm?: number;
  extraHour?: number;
  driverAllowance?: number;
  nightCharge?: number;
  toll?: number;
  parking?: number;
}

export interface QuotationTouristPricing {
  perDay?: number;
  packagePrice?: number;
  extraSightseeing?: number;
  permits?: number;
  toll?: number;
  parking?: number;
  extraVehicle?: number;
}

export interface Quotation {
  id: string;
  quotationNo?: string;
  enquiryId?: string;
  customerName?: string;
  clientName: string;
  mobile?: string;
  clientPhone?: string;
  clientEmail?: string;
  companyName?: string;
  gstin?: string;
  pickupLocation: string;
  vehicle: string;
  startDate: string;
  endDate?: string;
  travelDate?: string;
  date?: string;
  destination: string;
  persons?: number;
  passengers: number;
  days: number;
  clientType?: ClientType;
  type?: ClientType;
  itinerary?: ItineraryItem[] | any[];
  vehicles?: QuotationVehicle[] | any[];
  routes?: QuotationRoute[] | any[];
  corporate?: QuotationCorporatePricing | any;
  corporatePricing?: any;
  tourist?: QuotationTouristPricing | any;
  touristPricing?: any;
  baseAmount: number;
  subtotal: number;
  gstPercent?: number;
  gstAmount: number;
  additionalCharges?: number;
  totalAmount: number;
  hasGst?: boolean;
  createdAt?: string;
  status: QuotationStatus;
  inclusions?: string[];
  exclusions?: string[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | string;

export interface Booking {
  id: string;
  bookingNo?: string;
  quotationId?: string;
  enquiryId?: string;
  clientName: string;
  clientType?: ClientType;
  vehicle?: VehicleCategory | string;
  pickup?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  status: BookingStatus;
  amount: number;
  advance: number;
  driverId?: string;
  vehicleId?: string;
  mobile?: string;
  createdAt?: string;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Credit Card' | 'Debit Card' | 'Cheque' | 'cash' | 'upi' | 'bank-transfer' | 'credit-card' | 'debit-card' | 'cheque' | string;
export type PaymentStatus = 'unpaid' | 'partially-paid' | 'paid' | 'overdue' | 'cancelled' | string;
export type ReceiptType = 'Confirmation cum Advance Receipt' | 'Advance Receipt' | 'Full Payment Receipt' | 'Booking Confirmation' | string;

export interface InvoiceItem {
  id?: string;
  description?: string;
  serviceDetails?: string;
  dateFrom?: string;
  dateTo?: string;
  vehicles?: string;
  sacCode?: string;
  hsnSac?: string;
  quantity: number;
  rate: number;
  discountPercent?: number;
  gstPercent?: number;
  taxableAmount?: number;
  amount?: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  bookingId?: string;
  quotationId?: string;
  clientName: string;
  clientEmail?: string;
  clientMobile?: string;
  clientPhone?: string;
  clientAddress?: string;
  billingAddress?: string;
  clientState?: string;
  supplyType?: string;
  clientGst?: string;
  clientGstin?: string;
  paymentTerms?: string;
  travellers?: string;
  date?: string;
  issueDate?: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  gstPercent?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  gstAmount: number;
  roundOff?: number;
  totalAmount: number;
  hasGst?: boolean;
  paidAmount: number;
  advanceReceived?: number;
  balanceAmount: number;
  status: PaymentStatus;
  notes?: string;
  terms?: string;
  disclaimerNote?: string;
  placeOfIssue?: string;
  signatoryName?: string;
  extraNote?: string;
}

export interface Receipt {
  id: string;
  receiptNo: string;
  invoiceId?: string;
  bookingId?: string;
  clientName: string;
  clientMobile?: string;
  date?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  method?: PaymentMethod;
  referenceNo?: string;
  receiptType?: ReceiptType;
  notes?: string;

  // Extended Fields for Full-Page Builder
  quotationNo?: string;
  bookingReference?: string;
  destination?: string;
  travelStart?: string;
  travelEnd?: string;
  
  grandTotal?: number;
  advancePercent?: number;
  advanceAmount?: number;
  receivedAmount?: number;
  paymentDate?: string;
  receivedBy?: string;
  remarks?: string;

  receiptHeading?: string;
  businessHouse?: string;
  pax?: string;
  packageType?: string;
  vehicleDetails?: string;
  duty?: string;
  includes?: string;
  costingOverride?: string;
  advanceLineOverride?: string;
  stayDetails?: string;
  checkedByName?: string;
  designation?: string;
}

export interface RouteMaster {
  id: string;
  name?: string;
  pickup: string;
  destination: string;
  km?: number;
  distanceKm?: number;
  estHours?: number;
  durationHours?: number;
  toll?: number;
  parking?: number;
  notes?: string;
  baseRates?: { [key: string]: number };
}

export interface DestinationMaster {
  id: string;
  name: string;
  state?: string;
  description?: string;
}

export interface PermitMaster {
  id: string;
  name: string;
  price: number;
  region: string;
}

export interface SightseeingMaster {
  id: string;
  name: string;
  price: number;
  destination: string;
  notes?: string;
}

export interface InclusionMaster {
  id: string;
  text?: string;
  title?: string;
}

export interface ExclusionMaster {
  id: string;
  text?: string;
  title?: string;
}

export interface CorporatePricing {
  id: string;
  clientId: string;
  companyName: string;
  vehicleCategory: VehicleCategory;
  perKmRate: number;
  perDayRate: number;
  driverAllowance: number;
  nightHaltCharge: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'driver' | 'payment' | 'trip' | 'info' | string;
  read: boolean;
  createdAt: string;
}

export interface SerialCounterItem {
  year: number;
  next: number;
}

export interface SerialCounters {
  transport: SerialCounterItem;
  package: SerialCounterItem;
  invoice: SerialCounterItem;
  receipt: SerialCounterItem;
}

export interface CompanySettings {
  companyName?: string;
  logoUrl?: string;
  gstPercent?: number;
  invoicePrefix?: string;
  terms?: string;
  termsAndConditions?: string;
  supportEmail?: string;
  email?: string;
  whatsappNumber?: string;
  phone?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifsc?: string;
  branch?: string;
  upiId?: string;
  qrCodeUrl?: string;
  companyGstin?: string;
  gstin?: string;
  companyState?: string;
  companyAddress?: string;
  address?: string;
  website?: string;
  companyPan?: string;
  cancellationPolicy?: string;
  signatureUrl?: string;
  headerLogoUrl?: string;
  footerLogoUrl?: string;
  adminFullName?: string;
  adminEmail?: string;
}
