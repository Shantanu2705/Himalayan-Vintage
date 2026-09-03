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

export const initialVehicles: Vehicle[] = [];
export const initialDrivers: Driver[] = [];
export const initialCorporateClients: CorporateClient[] = [];
export const initialRoutes: RouteMaster[] = [];
export const initialDestinations: DestinationMaster[] = [];
export const initialPermits: PermitMaster[] = [];
export const initialSightseeings: SightseeingMaster[] = [];
export const initialInclusions: InclusionMaster[] = [];
export const initialExclusions: ExclusionMaster[] = [];
export const initialNotifications: Notification[] = [];
export const initialEnquiries: Enquiry[] = [];
export const initialBookings: Booking[] = [];
export const initialQuotations: Quotation[] = [];

export const initialSettings: CompanySettings = {
  companyName: 'Himalayan Vintage Holidays',
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
  supportEmail: 'query@himalayantaxi.com',
  whatsappNumber: '919851544861',
  bankName: '',
  accountName: '',
  accountNumber: '',
  ifsc: '',
  branch: '',
  upiId: '',
  qrCodeUrl: '',
  companyGstin: '19AQWPB8639C2ZE',
  companyState: 'West Bengal',
  companyAddress: 'Ashok Nagar, bagdogra  P.O - bagdogra, Dist. - Darjeeling - 734014',
  phone: '9851544861',
  companyPan: '',
  cancellationPolicy: ``
};

export const initialSerialCounters: SerialCounters = {
  transport: { year: new Date().getFullYear(), next: 1 },
  package: { year: new Date().getFullYear(), next: 1 },
  invoice: { year: new Date().getFullYear(), next: 1 },
  receipt: { year: new Date().getFullYear(), next: 1 },
};
