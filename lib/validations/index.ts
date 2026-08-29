import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const vehicleSchema = z.object({
  id: z.string().optional(),
  category: z.enum([
    'WAGNOR',
    'Sedan - Swift Dzire',
    'Innova / Xylo',
    'Innova Crysta',
    '11 Tempo Traveller',
    '12 Seater Tempo Traveller',
    '14 Seater Tempo Traveller',
    '17 Seater Tempo Traveller',
    '22 seater AC PREMIUM BUS',
    '26 SEATER AC PREMIUM BUS',
    '35 SEATER AC PREMIUM BUS',
    '40 SEATER AC PREMIUM BUS',
    'URBANIA - 16 SEATER',
    'AC BOLERO',
    'TATA SUMO',
    'BOLERO',
  ]),
  name: z.string().min(2, 'Vehicle name is required'),
  registration: z.string().min(3, 'Registration number is required'),
  seatingCapacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  driverName: z.string().optional(),
  driverMobile: z.string().optional(),
  fuelType: z.enum(['Diesel', 'Petrol', 'EV', 'Hybrid']),
  status: z.enum(['active', 'maintenance', 'inactive']),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export const driverSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Driver name is required'),
  mobile: z.string().min(10, 'Valid mobile number is required'),
  license: z.string().min(5, 'License number is required'),
  assignedVehicleId: z.string().optional(),
  salary: z.coerce.number().min(0, 'Salary must be non-negative'),
  status: z.enum(['active', 'on-leave', 'inactive']),
});

export type DriverInput = z.infer<typeof driverSchema>;

export const corporateClientSchema = z.object({
  id: z.string().optional(),
  companyName: z.string().min(2, 'Company name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  mobile: z.string().min(10, 'Valid mobile number is required'),
  email: z.string().email('Valid email is required'),
  gst: z.string().min(15, 'Valid 15-digit GSTIN is required'),
  billingAddress: z.string().min(5, 'Billing address is required'),
  contractPricing: z.string().optional().default(''),
});

export type CorporateClientInput = z.infer<typeof corporateClientSchema>;

export const enquirySchema = z.object({
  id: z.string().optional(),
  customerName: z.string().min(2, 'Customer name is required'),
  mobile: z.string().min(10, 'Valid mobile number is required'),
  whatsapp: z.string().min(10, 'Valid WhatsApp number is required'),
  email: z.string().email('Valid email is required'),
  clientType: z.enum(['tourist', 'corporate']),
  pickupLocation: z.string().min(2, 'Pickup location is required'),
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  days: z.coerce.number().min(1, 'Days must be at least 1'),
  passengers: z.coerce.number().min(1, 'Passengers must be at least 1'),
  ticketRequired: z.boolean().default(false),
  hotelRequired: z.boolean().default(false),
  hotelType: z.enum(['with-hotel', 'without-hotel']).default('without-hotel'),
  vehicle: z.enum([
    'WAGNOR',
    'Sedan - Swift Dzire',
    'Innova / Xylo',
    'Innova Crysta',
    '11 Tempo Traveller',
    '12 Seater Tempo Traveller',
    '14 Seater Tempo Traveller',
    '17 Seater Tempo Traveller',
    '22 seater AC PREMIUM BUS',
    '26 SEATER AC PREMIUM BUS',
    '35 SEATER AC PREMIUM BUS',
    '40 SEATER AC PREMIUM BUS',
    'URBANIA - 16 SEATER',
    'AC BOLERO',
    'TATA SUMO',
    'BOLERO',
  ]),
  places: z.string().min(2, 'Sightseeing places required'),
  specialRequirements: z.string().optional().default(''),
  internalNotes: z.string().optional().default(''),
  customerRemarks: z.string().optional().default(''),
  status: z.enum(['new', 'follow-up', 'quotation-sent', 'confirmed', 'cancelled']).default('new'),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const bookingSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(2, 'Client name is required'),
  clientType: z.enum(['tourist', 'corporate']),
  vehicle: z.enum([
    'WAGNOR',
    'Sedan - Swift Dzire',
    'Innova / Xylo',
    'Innova Crysta',
    '11 Tempo Traveller',
    '12 Seater Tempo Traveller',
    '14 Seater Tempo Traveller',
    '17 Seater Tempo Traveller',
    '22 seater AC PREMIUM BUS',
    '26 SEATER AC PREMIUM BUS',
    '35 SEATER AC PREMIUM BUS',
    '40 SEATER AC PREMIUM BUS',
    'URBANIA - 16 SEATER',
    'AC BOLERO',
    'TATA SUMO',
    'BOLERO',
  ]),
  pickup: z.string().min(2, 'Pickup location is required'),
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('confirmed'),
  amount: z.coerce.number().min(0, 'Amount must be non-negative'),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  sacCode: z.string().optional(),
  quantity: z.coerce.number().min(1),
  rate: z.coerce.number().min(0),
  amount: z.coerce.number().min(0),
});

export const invoiceSchema = z.object({
  id: z.string().optional(),
  invoiceNo: z.string().min(1, 'Invoice number required'),
  bookingId: z.string().optional(),
  quotationId: z.string().optional(),
  clientName: z.string().min(2, 'Client name is required'),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientMobile: z.string().optional().default(''),
  clientAddress: z.string().optional().default(''),
  clientGst: z.string().optional().default(''),
  date: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  subtotal: z.coerce.number().min(0),
  gstPercent: z.coerce.number().min(0).max(100),
  gstAmount: z.coerce.number().min(0),
  totalAmount: z.coerce.number().min(0),
  paidAmount: z.coerce.number().min(0).default(0),
  balanceAmount: z.coerce.number().min(0),
  status: z.enum(['unpaid', 'partially-paid', 'paid', 'overdue', 'cancelled']).default('unpaid'),
  notes: z.string().optional().default(''),
  terms: z.string().optional().default(''),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

export const receiptSchema = z.object({
  id: z.string().optional(),
  receiptNo: z.string().min(1, 'Receipt number required'),
  invoiceId: z.string().optional(),
  bookingId: z.string().optional(),
  clientName: z.string().min(2, 'Client name is required'),
  clientMobile: z.string().optional().default(''),
  date: z.string().min(1, 'Date is required'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['Cash', 'UPI', 'Bank Transfer', 'Credit Card', 'Debit Card', 'Cheque']),
  referenceNo: z.string().optional().default(''),
  receiptType: z.enum([
    'Confirmation cum Advance Receipt',
    'Advance Receipt',
    'Full Payment Receipt',
    'Booking Confirmation',
  ]),
  notes: z.string().optional().default(''),
});

export type ReceiptInput = z.infer<typeof receiptSchema>;

export const routeMasterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Route name is required'),
  pickup: z.string().min(2, 'Pickup location required'),
  destination: z.string().min(2, 'Destination required'),
  km: z.coerce.number().min(1, 'Distance in km required'),
  estHours: z.coerce.number().min(0.5, 'Estimated hours required'),
  toll: z.coerce.number().min(0).default(0),
  parking: z.coerce.number().min(0).default(0),
  notes: z.string().optional().default(''),
});

export type RouteMasterInput = z.infer<typeof routeMasterSchema>;

export const companySettingsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  logoUrl: z.string().optional().default(''),
  gstPercent: z.coerce.number().min(0).max(100),
  invoicePrefix: z.string().min(1, 'Prefix required'),
  terms: z.string().min(10, 'Terms required'),
  supportEmail: z.string().email('Valid email required'),
  whatsappNumber: z.string().min(10, 'Valid WhatsApp number required'),
  bankName: z.string().min(2, 'Bank name required'),
  accountName: z.string().min(2, 'Account name required'),
  accountNumber: z.string().min(5, 'Account number required'),
  ifsc: z.string().min(5, 'IFSC code required'),
  branch: z.string().min(2, 'Branch required'),
  upiId: z.string().min(3, 'UPI ID required'),
  qrCodeUrl: z.string().optional().default(''),
  companyGstin: z.string().optional().default(''),
  companyState: z.string().min(2, 'State required'),
  companyAddress: z.string().min(5, 'Address required'),
  companyPan: z.string().optional().default(''),
  cancellationPolicy: z.string().min(10, 'Cancellation policy required'),
});

export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;
