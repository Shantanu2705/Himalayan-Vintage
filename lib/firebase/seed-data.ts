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
} from '@/types';

const formatDateOffset = (days: number, hours = 9): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
};

export const initialVehicles: Vehicle[] = [
  { id: 'v1', category: 'Sedan', name: 'Dzire 01', registration: 'SK 01 A 1234', seatingCapacity: 4, driverName: 'Pemba Sherpa', driverMobile: '9800011111', fuelType: 'Diesel', status: 'active' },
  { id: 'v2', category: 'Sedan', name: 'Etios 02', registration: 'SK 01 A 1235', seatingCapacity: 4, driverName: 'Karma Bhutia', driverMobile: '9800011112', fuelType: 'Petrol', status: 'active' },
  { id: 'v3', category: 'SUV', name: 'Scorpio N', registration: 'SK 02 B 8891', seatingCapacity: 7, driverName: 'Nima Tamang', driverMobile: '9800011113', fuelType: 'Diesel', status: 'active' },
  { id: 'v4', category: 'SUV', name: 'XUV700', registration: 'SK 02 B 8892', seatingCapacity: 7, driverName: 'Sonam Lepcha', driverMobile: '9800011114', fuelType: 'Diesel', status: 'maintenance' },
  { id: 'v5', category: 'Innova Crysta', name: 'Crysta White', registration: 'WB 74 C 5501', seatingCapacity: 7, driverName: 'Tashi Wangdi', driverMobile: '9800011115', fuelType: 'Diesel', status: 'active' },
  { id: 'v6', category: 'Innova Crysta', name: 'Crysta Silver', registration: 'WB 74 C 5502', seatingCapacity: 7, driverName: 'Dorjee Bhutia', driverMobile: '9800011116', fuelType: 'Diesel', status: 'active' },
  { id: 'v7', category: 'Tempo Traveller', name: 'TT 12-Seater', registration: 'SK 03 D 4401', seatingCapacity: 12, driverName: 'Rinzin Ongmu', driverMobile: '9800011117', fuelType: 'Diesel', status: 'active' },
  { id: 'v8', category: 'Tempo Traveller', name: 'TT 17-Seater', registration: 'SK 03 D 4402', seatingCapacity: 17, driverName: 'Yeshi Dolma', driverMobile: '9800011118', fuelType: 'Diesel', status: 'active' },
  { id: 'v9', category: '22 Seater Bus', name: 'Coach 22 Blue', registration: 'SK 04 E 2201', seatingCapacity: 22, driverName: 'Arjun Rai', driverMobile: '9800011119', fuelType: 'Diesel', status: 'active' },
  { id: 'v10', category: '22 Seater Bus', name: 'Coach 22 White', registration: 'SK 04 E 2202', seatingCapacity: 22, driverName: 'Mingma Gurung', driverMobile: '9800011120', fuelType: 'Diesel', status: 'inactive' },
  { id: 'v11', category: '27 Seater Bus', name: 'Coach 27 Grand', registration: 'SK 05 F 2701', seatingCapacity: 27, driverName: 'Bikash Chettri', driverMobile: '9800011121', fuelType: 'Diesel', status: 'active' },
  { id: 'v12', category: '27 Seater Bus', name: 'Coach 27 Elite', registration: 'SK 05 F 2702', seatingCapacity: 27, driverName: 'Ashok Subba', driverMobile: '9800011122', fuelType: 'Diesel', status: 'active' },
];

export const initialDrivers: Driver[] = [
  { id: 'd1', name: 'Pemba Sherpa', mobile: '9800011111', license: 'SK0120180001', assignedVehicleId: 'v1', salary: 22000, status: 'active' },
  { id: 'd2', name: 'Karma Bhutia', mobile: '9800011112', license: 'SK0120180002', assignedVehicleId: 'v2', salary: 22000, status: 'active' },
  { id: 'd3', name: 'Nima Tamang', mobile: '9800011113', license: 'SK0120180003', assignedVehicleId: 'v3', salary: 25000, status: 'active' },
  { id: 'd4', name: 'Sonam Lepcha', mobile: '9800011114', license: 'SK0120180004', assignedVehicleId: 'v4', salary: 25000, status: 'on-leave' },
  { id: 'd5', name: 'Tashi Wangdi', mobile: '9800011115', license: 'SK0120180005', assignedVehicleId: 'v5', salary: 26000, status: 'active' },
  { id: 'd6', name: 'Dorjee Bhutia', mobile: '9800011116', license: 'SK0120180006', assignedVehicleId: 'v6', salary: 26000, status: 'active' },
  { id: 'd7', name: 'Rinzin Ongmu', mobile: '9800011117', license: 'SK0120180007', assignedVehicleId: 'v7', salary: 28000, status: 'active' },
  { id: 'd8', name: 'Yeshi Dolma', mobile: '9800011118', license: 'SK0120180008', assignedVehicleId: 'v8', salary: 28000, status: 'active' },
  { id: 'd9', name: 'Arjun Rai', mobile: '9800011119', license: 'SK0120180009', assignedVehicleId: 'v9', salary: 32000, status: 'active' },
  { id: 'd10', name: 'Mingma Gurung', mobile: '9800011120', license: 'SK0120180010', salary: 32000, status: 'inactive' },
];

export const initialCorporateClients: CorporateClient[] = [
  { id: 'c1', companyName: 'TCS Kolkata', contactPerson: 'Rohit Sen', mobile: '9830011201', email: 'travel@tcs-kol.example', gst: '19AAACT2727Q1ZW', billingAddress: 'TCS Salt Lake, Kolkata', contractPricing: '₹18/km, Innova Crysta priority' },
  { id: 'c2', companyName: 'Infosys Bhubaneswar', contactPerson: 'Anita Nair', mobile: '9830011202', email: 'admin@infy-bbsr.example', gst: '21AAACI4741L1ZQ', billingAddress: 'Infosys IT SEZ, Bhubaneswar', contractPricing: '₹16/km, SUV fleet' },
  { id: 'c3', companyName: 'ITC Windsor Bengaluru', contactPerson: 'Prakash Iyer', mobile: '9830011203', email: 'concierge@itc.example', gst: '29AAACI1681G1Z8', billingAddress: 'ITC Windsor, Bengaluru', contractPricing: 'Executive sedan ₹22/km' },
  { id: 'c4', companyName: 'Reliance Retail', contactPerson: 'Meera Shah', mobile: '9830011204', email: 'logistics@ril.example', gst: '27AAACR5055K1ZZ', billingAddress: 'RCP, Navi Mumbai', contractPricing: 'Bulk TT contract' },
  { id: 'c5', companyName: 'Wipro NE Ops', contactPerson: 'Sanjay Das', mobile: '9830011205', email: 'ne-ops@wipro.example', gst: '18AAACW0387J1Z8', billingAddress: 'Wipro, Guwahati', contractPricing: '22-seater ₹14/km' },
  { id: 'c6', companyName: 'Taj Guwahati', contactPerson: 'Ritu Kalita', mobile: '9830011206', email: 'guest@taj.example', gst: '18AAACT3957H1ZQ', billingAddress: 'Taj Vivanta, Guwahati', contractPricing: 'Guest transfers Innova' },
  { id: 'c7', companyName: 'MakeMyTrip', contactPerson: 'Vivek Rao', mobile: '9830011207', email: 'b2b@mmt.example', gst: '07AAACM5310P1ZS', billingAddress: 'MMT, Gurugram', contractPricing: 'Volume tourist packages' },
  { id: 'c8', companyName: 'Yatra Corporate', contactPerson: 'Neha Kapoor', mobile: '9830011208', email: 'corp@yatra.example', gst: '07AAACY2670E1ZC', billingAddress: 'Yatra, Gurugram', contractPricing: 'Preferred vendor' },
];

export const initialRoutes: RouteMaster[] = [
  { id: 'r1', name: 'NJP → Gangtok', pickup: 'NJP Railway Station', destination: 'Gangtok', km: 125, estHours: 4.5, toll: 200, parking: 100, notes: 'Standard transfer route' },
  { id: 'r2', name: 'Gangtok → Nathula', pickup: 'Gangtok', destination: 'Nathula Pass', km: 56, estHours: 3, toll: 0, parking: 100, notes: 'Permit required' },
  { id: 'r3', name: 'Gangtok → Tsomgo Lake', pickup: 'Gangtok', destination: 'Tsomgo Lake', km: 38, estHours: 2, toll: 0, parking: 100, notes: 'Weather dependent' },
  { id: 'r4', name: 'Bagdogra → Darjeeling', pickup: 'Bagdogra Airport', destination: 'Darjeeling', km: 95, estHours: 3.5, toll: 150, parking: 100, notes: '' },
  { id: 'r5', name: 'Gangtok → Pelling', pickup: 'Gangtok', destination: 'Pelling', km: 130, estHours: 5, toll: 100, parking: 100, notes: 'West Sikkim' },
  { id: 'r6', name: 'NJP → Kalimpong', pickup: 'NJP Railway Station', destination: 'Kalimpong', km: 78, estHours: 3, toll: 100, parking: 100, notes: '' },
];

export const initialDestinations: DestinationMaster[] = [
  'Gangtok', 'Pelling', 'Lachung', 'Darjeeling', 'Kalimpong', 'Namchi', 'Zuluk', 'Ravangla', 'Yumthang Valley', 'Nathula'
].map((name, i) => ({ id: `dest-${i + 1}`, name, state: name === 'Darjeeling' || name === 'Kalimpong' ? 'West Bengal' : 'Sikkim' }));

export const initialPermits: PermitMaster[] = [
  { id: 'pm-1', name: 'Nathula Permit', price: 3500, region: 'East Sikkim' },
  { id: 'pm-2', name: 'North Sikkim Permit', price: 2500, region: 'North Sikkim' },
  { id: 'pm-3', name: 'Bhutan Permit', price: 4500, region: 'Bhutan' },
  { id: 'pm-4', name: 'Sikkim Entry Permit', price: 500, region: 'Sikkim' },
];

export const initialSightseeings: SightseeingMaster[] = [
  { id: 'ss-1', name: 'Changu Lake', price: 1800, destination: 'Gangtok', notes: 'Includes yak ride option' },
  { id: 'ss-2', name: 'Baba Mandir', price: 800, destination: 'Gangtok' },
  { id: 'ss-3', name: 'Yumthang Valley', price: 3500, destination: 'Lachung' },
  { id: 'ss-4', name: 'Zero Point', price: 2500, destination: 'Lachung', notes: 'Snow point, seasonal' },
];

export const initialInclusions: InclusionMaster[] = [
  'Accommodation', 'Breakfast & Dinner', 'Private Vehicle', 'Driver Allowance', 'Toll Tax', 'Parking Charges', 'Fuel Charges', 'Airport / Railway Station Pickup & Drop', 'Sightseeing as per itinerary'
].map((text, i) => ({ id: `inc-${i + 1}`, text }));

export const initialExclusions: ExclusionMaster[] = [
  'Airfare / Train Tickets', 'Personal Expenses', 'Entry Fees', 'Camera Charges', 'Lunch', 'Travel Insurance', 'GST (if applicable)', 'Extra Sightseeing', 'Anything not mentioned in the inclusions'
].map((text, i) => ({ id: `exc-${i + 1}`, text }));

export const initialNotifications: Notification[] = [
  { id: 'n1', title: 'New booking confirmed', message: 'Ananya Roy • Innova Crysta • Gangtok', type: 'booking', read: false, createdAt: formatDateOffset(0, 10) },
  { id: 'n2', title: 'Driver assigned', message: 'Tashi Wangdi assigned to Booking #B-042', type: 'driver', read: false, createdAt: formatDateOffset(0, 9) },
  { id: 'n3', title: 'Payment reminder', message: '₹22,500 pending from Vikram Sharma', type: 'payment', read: false, createdAt: formatDateOffset(-1, 14) },
  { id: 'n4', title: 'Upcoming trip', message: 'Trip to Pelling starts tomorrow • 22 Seater Bus', type: 'trip', read: true, createdAt: formatDateOffset(-1, 8) },
  { id: 'n5', title: 'New enquiry', message: 'Meera Shah requested Tempo Traveller for 5 days', type: 'info', read: true, createdAt: formatDateOffset(-2, 11) },
];

export const initialSettings: CompanySettings = {
  companyName: 'Himalayan Vintage Holidays & Himalayan Buses',
  logoUrl: '',
  gstPercent: 5,
  invoicePrefix: 'HVH',
  terms: [
    '1. For late Arrival / Unscheduled extensions please must be reported in advance for necessary arrangement and action.',
    '2. If by Strikes, Political Closures, War, Civil Disturbance, Natural calamity, Landslide, Non-permit, Flight / Train Cancellations, Accident, Breakdown, Weather, Sickness or any other unforeseen calamities car will go by different route, guest will be bare extra money for long route.',
    '3. If Management/Agency/Authority/we are unable to provide the taxi service for any Strikes, Political Closures, War, Civil Disturbance, Natural calamity or any unforeseen calamities, that time we will refund only after deducting the expenditure of the travels.',
    '4. In case of breakdown, we will be arranging swayable vehicle.',
    '5. The Himalayan Taxi reserves the right to forfeit the package amount, in case of any cancellations from client side during the tour.',
    '6. In case the client requiring any changes in the pre-booked service, such changes would be considered as new service. The cost for the new service is payable separately and adjustment with the cost of original service is not admissible.',
    '7. Service is subject to both Himalayan Taxi and the guests agreeing on the same. In case of any disagreement Himalayan Taxi commitment is limited to the service already booked.',
    '8. The Management/Agency/Authority/we will not undertake liability towards any damage or loss of life or any property of the tourist due to an accident, theft, robbery, any illegal or immoral activity, any penalty by caused of activities against civic rule, natural calamities during the tour.',
    '9. Vehicle for transfers & sightseeing. Vehicle will be available to guest as per itinerary only (Point to Point basis).',
    '10. Our vehicle doesn\'t go to bed and narrow road. Driver decision should be final.',
    '11. Guests are requested to carry original copy of any Photo ID proof (Except Pan Card) i.e. Passport / Driving License / Voter ID / along with 4 copy passport size photographs.',
    '12. Children (above 5 years) / Students are requested to carry original copy of school / College Photo Identity card / Aadhar card along with 4 copy passport size photographs.',
    '13. For Infants (below 5 years) carry 4 copy passport size photographs. Also carry the original birth certificate / Aadhar card.',
    '14. Additional sightseeing or extra usage of vehicle, other than mentioned in the itinerary, will need extra cost and directly payable on the spot.',
    '15. The guest should always keep cool with the drivers as they are not tourism educated and come from different remote villages.',
    '16. As there is shortage of space for car parking in the entire Sikkim & Darjeeling region — guest will have to wait at the Lobby in time for the vehicle to start their sightseeing / transfers.',
    '17. In Sikkim & Darjeeling region the same vehicles will not be providing for the entire tour, it will be changed sector-wise.',
    '18. If any tourist spot does not complete which falls on closing day & if they want to do the same on next day then they have to pay the extra cost for the vehicle.',
    '19. If guests want any changes in their sightseeing schedule they should be informed to our executive previous day before 16:00 hrs, after that no changes are allowed.',
    '20. The guests are request to travel with minimum baggage (one baggage per person). In case of excess baggage, the guest will have to opt for an extra vehicle for carrying the excess baggage.',
    '21. Vehicle subject to availability and should be providing category wise availability not model wise.',
    '22. All vehicle rates are subject to change for the increasing of fuel cost.',
    '23. Rates are valid for Indian nationals only.',
    '24. All dispute will subject to Siliguri jurisdiction only.'
  ].join('\n'),
  supportEmail: 'bookings@himalayantaxi.com',
  whatsappNumber: '919800011111',
  bankName: 'HDFC Bank',
  accountName: 'Himalayan Vintage Holidays',
  accountNumber: '50200012345678',
  ifsc: 'HDFC0001234',
  branch: 'Siliguri Main',
  upiId: 'himalayantaxi@hdfc',
  qrCodeUrl: '',
  companyGstin: '19AAACT2727Q1ZW',
  companyState: 'West Bengal',
  companyAddress: 'Siliguri, West Bengal',
  companyPan: 'AAACT2727Q',
  cancellationPolicy: `Before 30 Days: Voucher valid 6 months OR Refund after 20% cancellation charge.\n30 to 15 Days: Voucher (after 20% deduction) valid 6 months OR Refund after 50% cancellation charge.\nLess than 15 Days: 50% of fees as a voucher valid upto 6 months.\nLess than 72 Hrs / No show: 100% retention — no refund.`
};

export const initialSerialCounters: SerialCounters = {
  transport: { year: new Date().getFullYear(), next: 1 },
  package: { year: new Date().getFullYear(), next: 1 },
  invoice: { year: new Date().getFullYear(), next: 1 },
  receipt: { year: new Date().getFullYear(), next: 1 },
};

// Generate 15 sample enquiries and 20 bookings for dashboard richness
const firstNames = ['Aarav', 'Isha', 'Rohan', 'Priya', 'Vikram', 'Kavya', 'Aditya', 'Meera', 'Rahul', 'Ananya', 'Suresh', 'Divya'];
const lastNames = ['Sharma', 'Verma', 'Patel', 'Gupta', 'Reddy', 'Iyer', 'Nair', 'Rao', 'Menon', 'Bose', 'Das', 'Roy'];
const pickupPoints = ['NJP Station', 'Bagdogra Airport', 'Siliguri', 'Gangtok', 'Kolkata'];
const destPoints = ['Gangtok', 'Pelling', 'Lachung', 'Darjeeling', 'Kalimpong', 'Namchi', 'Zuluk'];
const categories = ['Sedan', 'SUV', 'Innova Crysta', 'Tempo Traveller', '22 Seater Bus', '27 Seater Bus'] as const;

export const initialEnquiries: Enquiry[] = Array.from({ length: 15 }, (_, i) => {
  const isCorp = i % 3 === 0;
  const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
  const days = (i % 6) + 3;
  return {
    id: `e${i + 1}`,
    customerName: isCorp ? `${name} (Corp)` : name,
    mobile: `98000${10000 + i}`,
    whatsapp: `98000${10000 + i}`,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    clientType: isCorp ? 'corporate' : 'tourist',
    pickupLocation: pickupPoints[i % pickupPoints.length],
    destination: destPoints[i % destPoints.length],
    startDate: formatDateOffset((i % 15) - 3),
    endDate: formatDateOffset((i % 15) - 3 + days),
    days,
    passengers: (i % 12) + 2,
    ticketRequired: i % 2 === 0,
    hotelRequired: i % 3 !== 0,
    hotelType: i % 2 === 0 ? 'with-hotel' : 'without-hotel',
    vehicle: categories[i % categories.length],
    places: 'Tsomgo Lake, Baba Mandir, MG Marg, Rumtek Monastery',
    specialRequirements: i % 4 === 0 ? 'Vegetarian meals required, early morning start' : '',
    internalNotes: 'VIP guest referral from Kolkata office',
    customerRemarks: '',
    status: ['new', 'follow-up', 'quotation-sent', 'confirmed', 'cancelled'][i % 5] as any,
    createdAt: formatDateOffset(-((i % 10) + 1)),
  };
});

export const initialBookings: Booking[] = Array.from({ length: 20 }, (_, i) => {
  const isCorp = i % 4 === 0;
  const name = `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 2) % lastNames.length]}`;
  const days = (i % 5) + 2;
  return {
    id: `b${i + 1}`,
    bookingNo: `HVH-B-${1001 + i}`,
    clientName: isCorp ? `${name} (Corp)` : name,
    clientType: isCorp ? 'corporate' : 'tourist',
    vehicle: categories[i % categories.length],
    pickup: pickupPoints[i % pickupPoints.length],
    destination: destPoints[i % destPoints.length],
    startDate: formatDateOffset((i % 20) - 5, 8),
    endDate: formatDateOffset((i % 20) - 5 + days, 20),
    status: (i % 7 === 0 ? 'cancelled' : i % 3 === 0 ? 'pending' : 'confirmed') as any,
    amount: ((i % 8) + 3) * 8500,
    advance: Math.round(((i % 8) + 3) * 8500 * 0.5),
    driverId: initialDrivers[i % initialDrivers.length].id,
    vehicleId: initialVehicles[i % initialVehicles.length].id,
    mobile: `98000${10000 + i}`,
  };
});

export const initialQuotations: Quotation[] = Array.from({ length: 10 }, (_, i) => {
  const enq = initialEnquiries[i];
  const amt = enq.days * 4500;
  return {
    id: `q${i + 1}`,
    quotationNo: `HVH/${new Date().getFullYear()}/${1001 + i}`,
    enquiryId: enq.id,
    customerName: enq.customerName,
    clientName: enq.customerName,
    mobile: enq.mobile,
    startDate: enq.startDate,
    travelDate: enq.startDate,
    pickupLocation: enq.pickupLocation,
    destination: enq.destination,
    vehicle: enq.vehicle,
    persons: enq.passengers,
    passengers: enq.passengers,
    days: enq.days,
    clientType: enq.clientType,
    itinerary: Array.from({ length: enq.days }, (_, dayIdx) => ({
      id: `it-${i}-${dayIdx}`,
      title: dayIdx === 0 ? `Arrival at ${enq.pickupLocation}` : dayIdx === enq.days - 1 ? `Departure from ${enq.destination}` : `Sightseeing Day ${dayIdx + 1}`,
      description: dayIdx === 0 ? `Pickup from ${enq.pickupLocation}, transfer to ${enq.destination}, hotel check-in and evening rest.` : `Full-day sightseeing covering prominent attractions and scenic view points. Overnight stay at hotel.`,
    })),
    vehicles: [{
      id: `qv-${i}`,
      category: enq.vehicle,
      quantity: 1,
      vehicleName: `${enq.vehicle} Fleet`,
    }],
    routes: [{
      id: `qr-${i}`,
      pickup: enq.pickupLocation,
      destination: enq.destination,
      description: 'Round trip transfer & local sightseeing',
      km: 350,
      toll: 500,
      parking: 200,
    }],
    corporate: { perKm: 18, perHour: 250, extraKm: 20, extraHour: 300, driverAllowance: 500, nightCharge: 400, toll: 500, parking: 200 },
    tourist: { perDay: 4500, packagePrice: amt, extraSightseeing: 1500, permits: 800, toll: 400, parking: 200, extraVehicle: 0 },
    baseAmount: amt,
    subtotal: amt,
    gstPercent: 5,
    gstAmount: Math.round(amt * 0.05),
    additionalCharges: 0,
    totalAmount: Math.round(amt * 1.05),
    createdAt: enq.createdAt,
    status: (i % 4 === 0 ? 'confirmed' : i % 2 === 0 ? 'sent' : 'draft') as any,
  };
});
