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
  ItineraryTemplate,
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

export const initialItineraryTemplates: ItineraryTemplate[] = [
  {
    id: "tpl-1",
    name: "2N | 3D - Darjeeling and kalimpong",
    days: 3,
    itinerary: [
      { id: "1-1", title: "Day 01: Reach IXB Bagdogra Airport Transfer Darjeeling via Mirik Sightseeing", description: "Reach NJP Railway Station / IXB Airport, meet & greet by our office executive and transfer to Darjeeling in an executive vehicle – On this beautiful journey we will visit Simana (India Nepal Border), Gopal Dhara Tea estate, Samdhenu lake & Pashupati Fatak. Upon arrival complete check-in formalities at your pre-booked hotel and spend rest of the day at leisure – Overnight stay at Darjeeling." },
      { id: "1-2", title: "Day 02: Darjeeling Local Sightseeing Proceed to Kalimpong", description: "Early morning at around 4:00 a.m. drive to Tiger Hill, – Back to hotel within 8.00 a.m. – After breakfast complete the formalities of check out from the pre-booked hotel we will proceed to kalimpong via city tour includes Batasia Loop & Ghoom Monastery Padmaja Naidu Zoological Park, Himalayan Mountaineering Institute (Closed on Thursday), Ropeway, and- after completion of sightseeing we will proceed for kalimpong – enroute we will witness we will visit Lamahatta Ecco Park, Gumbhadhara View Point & Triveni View Point – upon arrival complete the formalities of check in at your pre-booked hotel – Overnight stay at Kalimpong" },
      { id: "1-3", title: "Day 03: Kalimpong Sightseeing and Transfer NJP Rly Station / IXB airport", description: "Morning 9:30 a.m. after breakfast Check-out from hotel we will proceed for Kalimpong local Sightseeing. The place we will visit are - Delo is a park with a Tourist Guest House inside of it. In sunny morning you can easily see the Snowcapped mountains & Teesta River as well. The nearby area to visit are Delo / Hanuman Top / Science City / Paragliding (On Cost) & Durpin Dara Monestary – after completion of sightseeing we will proceed to NJP Railway station / IXB Airport drop you for your onward journey." }
    ]
  },
  {
    id: "tpl-2",
    name: "4D - Darjeeling",
    days: 4,
    itinerary: [
      { id: "2-1", title: "Day 01: NJP Railway Station / IXB Airport to Darjeeling transfer via Kurseong Sightseeing", description: "Reach NJP Railway Station / IXB Airport, meet & greet by our office executive and transfer to Darjeeling in an executive vehicle via Kurseong Sightseeing – the places we will visit are - Eagle's Crag (EC), Dow Hill & Pine Forest, Netaji Subhas Chandra Bose Museum, Giddapahar view point, hanuman Tok, Chimney view point, Bagora Pine Forest – Upon arrival complete check-in formalities at your pre-booked hotel and spend rest of the day at leisure – Overnight stay at Darjeeling." },
      { id: "2-2", title: "Day 02: Darjeeling Local Sightseeing", description: "Early morning at around 3:45 a.m. drive to Tiger Hill, Batasia loop & Ghoom Monastery – Back to hotel within 8.00 a.m. – After breakfast Half Day city tour includes Padmaja Naidu Zoological Park, Himalayan Mountaineering Institute (Closed on Thursday), Ropeway, Tensing Rock, Tea Estate Visit, Natural History Museum (Sunday Closed), Peace Pagoda - Back to hotel – Overnight stay at Darjeeling." },
      { id: "2-3", title: "Day 03: Mirik Excursion", description: "Morning after breakfast we will proceed to Mirik. On this beautiful day the places we will visit are – Lepcha Jagat Pine Forest View Point, Simana View Point, Pashupati fatak, Ino- Nepal Border, Gopaldhara Tea estate View Point, Samendu Lake, Tingling view Point – after completion of sightseeing return back to hotel – Overnight stay at Darjeeling" },
      { id: "2-4", title: "Day 04: Transfer NJP Rly / IXB Airport", description: "Morning 7:30 a.m. after breakfast check-out from hotel on time & transfer to NJP Railway station / IXB Airport for your onward journey – Tour end." }
    ]
  },
  {
    id: "tpl-3",
    name: "4D Gangtok Sightseeing",
    days: 4,
    itinerary: [
      { id: "3-1", title: "Day 01: NJP Railway Station / IXB Airport to Gangtok transfer", description: "Reach NJP Railway Station / IXB Airport, meet & greet by our office executive and transfer to Darjeeling in an executive vehicle – Upon arrival complete check-in formalities at your pre-booked hotel and spend rest of the day at leisure – Overnight stay at Gangtok." },
      { id: "3-2", title: "Day 02: Tsomgo Lake, Baba Mandir Visit, Nathula Pass (Optional Visit)", description: "Morning 7:30 a.m. to 8:00 a.m. after breakfast proceed for Tsomgo Lake (height 12310 ft. & depth 50 ft.) & Baba Mandir visit – This is nearly 48 km drive and takes nearly 2.5 hours – Tsomgo Lake is one of the holy lake of the region – A temple of Lord Shiva is built on the lakeside – Primula flowers and other alpine plantation provide an immaculate beauty to this place – Till April it is full of snow and lay frozen – Nathula Pass (Optional) visit has to be arranged on one day before – Nathula Pass (India China Border 14200 ft.) once booked the amount is not refunded even if the trip get cancelled – There after back to hotel for lunch or lunch on the way – The rest of the day is free and evening one is free to stroll around M. G. Marg or the Local Market – Overnight stay at Gangtok." },
      { id: "3-3", title: "Day 03: Gangtok Local Sightseeing", description: "Morning 9:00 a.m. after breakfast proceed for Gangtok local sightseeing – Banjahakri Waterfalls, Tashi View Point, Ganesh Tok, Echay Monastery, Flower Show, Do Drul - Chorten Stupa, Institute of Tibetology – The visit to all these places are done with leisure and we advise our guest to follow – Evening one is free to stroll around – Overnight Stay at Gangtok" },
      { id: "3-4", title: "Day 04: Gangtok to NJP Rly Station / IXB airport transfer", description: "Morning 7:30 a.m. after breakfast check-out from hotel on time & transfer to NJP Railway station / IXB Airport for your onward journey – Tour end." }
    ]
  },
  {
    id: "tpl-4",
    name: "6D Gangtok & Darjeeling",
    days: 6,
    itinerary: [
      { id: "4-1", title: "Day 01: NJP Railway Station / IXB Airport to Gangtok transfer", description: "Reach NJP Railway Station / IXB Airport, meet & greet by our office executive and transfer to Darjeeling in an executive vehicle – Upon arrival complete check-in formalities at your pre-booked hotel and spend rest of the day at leisure – Overnight stay at Gangtok." },
      { id: "4-2", title: "Day 02: Tsomgo Lake, Baba Mandir Visit, Nathula Pass (Optional Visit)", description: "Morning 7:30 a.m. to 8:00 a.m. after breakfast proceed for Tsomgo Lake (height 12310 ft. & depth 50 ft.) & Baba Mandir visit – This is nearly 48 km drive and takes nearly 2.5 hours – Tsomgo Lake is one of the holy lake of the region – A temple of Lord Shiva is built on the lakeside – Primula flowers and other alpine plantation provide an immaculate beauty to this place – Till April it is full of snow and lay frozen – Nathula Pass (Optional) visit has to be arranged on one day before – Nathula Pass (India China Border 14200 ft.) once booked the amount is not refunded even if the trip get cancelled – There after back to hotel for lunch or lunch on the way – The rest of the day is free and evening one is free to stroll around M. G. Marg or the Local Market – Overnight stay at Gangtok." },
      { id: "4-3", title: "Day 03: Gangtok Local Sightseeing", description: "Morning 9:00 a.m. after breakfast proceed for Gangtok local sightseeing - Institute of Tibetology (Timing: 09.00 hrs to 13.00 hrs) - Ganesh Tok - Hanuman Tok – Institute of Tibetology – Do Dural Chorten - Flower Show - Tashi View Point – Banjhakri Waterfall– The visit to all these places is done with leisure and we advise our guest to follow - Evening one is free to stroll around - Overnight stay at Gangtok" },
      { id: "4-4", title: "Day 04: Darjeeling Transfer", description: "Morning 7:30 a.m. to 8:00 a.m. after breakfast complete the formalities of check out from the pre-booked hotel will proceed to Darjeeling and upon arrival complete the formalities of check-in at your pre-booked hotel and evening is free to explore the local market and spend your leisure time at hotel – Overnight stay at Darjeeling" },
      { id: "4-5", title: "Day 05: Darjeeling Local Sightseeing", description: "Early morning at around 3:45 a.m. drive to Tiger Hill, Batasia loop & Ghoom Monastery – Back to hotel within 8.00 a.m. – After breakfast Half Day city tour includes Padmaja Naidu Zoological Park, Himalayan Mountaineering Institute (Closed on Thursday), Ropeway, Tensing Rock, Tea Estate Visit, Natural History Museum (Sunday Closed), Peace Pagoda - Back to hotel – Overnight stay at Darjeeling." },
      { id: "4-6", title: "Day 06: Transfer NJP Railway station / IXB Airport", description: "Morning 7:30 a.m. after breakfast check-out from hotel on time & transfer to NJP Railway station / IXB Airport for your onward journey – Tour end." }
    ]
  },
  {
    id: "tpl-5",
    name: "4D - Pelling Sightseeing",
    days: 4,
    itinerary: [
      { id: "5-1", title: "Day 01: NJP Railway Station / IXB Airport to Pelling transfer", description: "Reach NJP Railway Station / IXB Airport, meet & greet by our office executive and transfer to Pelling in an executive vehicle – Upon arrival complete check-in formalities at your pre-booked hotel and spend rest of the day at leisure – Overnight stay at Pelling." },
      { id: "5-2", title: "Day 02: Pelling Sightseeing", description: "Morning 8:30 a.m. after breakfast drive for Pelling Sightseeing - Places of visit are – Kanchenjunga waterfalls, Rimbi waterfalls & Khecheopalri Lake – Pemayangtse Monastery, Rabdantse Palace Ruins, The Chenrezig statue and Skywalk – Back to Hotel and free evening – Overnight stay at Pelling" },
      { id: "5-3", title: "Day 03: Ravangla and Namchi Excursion", description: "Morning after breakfast we will proceeds for Ravangla and Namchi Chardham sightseeing – Ralong Monastery, Rayong View Point, Buddha Park, Carpet Centre and Namchi Chardham – Chardham is a famous tourist attraction in Sikkim – It’s a replica of all the 12 Jyotirlingas and Chardhams in India – You’ll find here a 33 m massive Shiva statue raised on the Solophok hilltop – It’s a huge pilgrimage complex with Hindu temples all around – Overall it's a nice place that gives you positive vibes – Back to hotel – Overnight stay at Pelling" },
      { id: "5-4", title: "Day 04: Pelling to NJP Railway Station / IXB Airport", description: "Morning 7:30 a.m. after breakfast, we shall check-out of the hotel and transfer NJP Railway Station / IXB Airport - Return Home with Happy memories and regret as you have to leave from these places!" }
    ]
  },
  {
    id: "tpl-6",
    name: "10D Bhutan",
    days: 10,
    itinerary: [
      { id: "6-1", title: "Day 1: Bagdogra / NJP → Phuentsholing", description: "Pickup from Bagdogra Airport / NJP Railway Station. Drive to Phuentsholing. Complete Bhutan entry formalities. Check-in at hotel. Overnight: Phuentsholing" },
      { id: "6-2", title: "Day 2: Phuentsholing → Thimphu", description: "After breakfast, complete immigration formalities. Drive to Thimphu via : Melirepa Temple,Gedu Town and Water fall. Scenic drive through the mountains. Check-in at hotel. Evening free to explore Thimphu town. Overnight: Thimphu" },
      { id: "6-3", title: "Day 3: Thimphu Sightseeing", description: "After breakfast, proceed for local sightseeing. Buddha Dordenma Statue, Memorial Chorten, Motithang Takin Preserve, Tashichho Dzong. Explore Thimphu town/local market. Overnight: Thimphu" },
      { id: "6-4", title: "Day 4: Thimphu → Punakha via Dochula", description: "After breakfast, check out. Drive to Punakha via Dochula Pass. Visit 108 Druk Wangyal Chortens. Continue towards Punakha. Visit Punakha Dzong. Visit Punakha Suspension Bridge. Check-in at hotel. Overnight: Punakha" },
      { id: "6-5", title: "Day 5: Punakha Sightseeing", description: "After breakfast, proceed for sightseeing. Visit Chimi Lhakhang. Explore Punakha Valley. Visit Khamsum Yulley Namgyal Chorten, subject to time/weather. Leisure evening at Punakha. Overnight: Punakha" },
      { id: "6-6", title: "Day 6: Punakha → Paro", description: "After breakfast, check out. Drive towards Paro. En route, enjoy scenic Himalayan views. On arrival, check-in at hotel. Visit Rinpung Dzong. Visit Paro town/local market. Overnight: Paro" },
      { id: "6-7", title: "Day 7: Paro – Tiger’s Nest", description: "Early breakfast. Proceed for the famous Tiger’s Nest (Taktsang Monastery) hike. Return to Paro after sightseeing. Evening free for leisure. Overnight: Paro" },
      { id: "6-8", title: "Day 8: Paro Sightseeing", description: "After breakfast, proceed for Paro sightseeing. Kyichu Lhakhang, National Museum, Drukgyel Dzong. Explore Paro town. Overnight: Paro" },
      { id: "6-9", title: "Day 9: Paro → Phuentsholing", description: "After breakfast, check out. Drive back to Phuentsholing. En route, enjoy the scenic journey. Check-in at hotel. Evening free for shopping/local market. Overnight: Phuentsholing" },
      { id: "6-10", title: "Day 10: Phuentsholing → Bagdogra / NJP", description: "After breakfast, check out. Drive to Bagdogra Airport / NJP Railway Station. Drop-off as per departure schedule. Tour concludes with wonderful memories of Bhutan" }
    ]
  },
  {
    id: "tpl-7",
    name: "Day - 7D - Zuluk - Gangtok - Lachen - Lachung - Gangtok",
    days: 7,
    itinerary: [
      { id: "7-1", title: "Day 01: Pick From Ixb Bagdogra / NJP rly Station and Transfer Zuluk", description: "Reached NJP Rly station / IXb Bagdogra airport our office executive meet and greet you and transfer you in an executive van to Zuluk – Upon arrival complete the formalities of check in at you pre-booked hotel – evening is free to explore the local market – Overnight stay at Zuluk" },
      { id: "7-2", title: "Day 02: Zuluk Sightseeing and Transfer Gangtok", description: "Morning after breakfast complete the formalities of check out from the pre-booked hotel we will proceed for Gangtok via Local Sightseeing - On this day the places we will visit are Thambhi View Point, Lungthung, Gnathang Valley – Silk Route, Kupu Lake, , Old Harbajan baba Mandir, Nathula Pass (optional visit) Nathula Pass (Optional) visit has to be arranged on one day before – Nathula Pass (India China Border 14200 ft.) once booked the amount is not refunded even if the trip get cancelled - New Harbajan baba Mandir, Tsomgo lake Transfer Gangtok – Overnight stay at Gangtok" },
      { id: "7-3", title: "Day 03: Gangtok to Lachen transfer", description: "Morning 8:30 a.m. after breakfast drive for Lachen - Chungthang is nearly 96 k.m. from Gangtok - On the way stop at Chungthang or Miyang Chu for Lunch - Next drive for 29 kilometres from Chungthang to Lachen - Reach Lachen late afternoon - Check into a hotel - Evening free to stroll or visit the Lachen Monastery and visit the Lepcha Village – Overnight stay at Lachen." },
      { id: "7-4", title: "Day 04: Lachen to Lachung transfer via Gurudongmar visit", description: "Morning after breakfast drive for Gurudongmar lake - A valley at an altitude of nearly 15800 feet – This is a holy Lake and is one of the most sacred place of worship for the Buddhist – The Lake gets frozen during winter barring a stretch which remains as water even at -20⁰ C – The region is generally covered with snow from December to April - This is a stretch of cold desert till Tibet / China - After Lunch drive to Lachung – Overnight stay at Lachung." },
      { id: "7-5", title: "Day 05: Lachung to Gangtok transfer via Yumthang Valley visit", description: "Morning after breakfast drive for 24 km (altitude 11800 ft) to Yumthang-valley - known as Valley of Flowers, Yumthang is the summer grazing ground of the Yaks & winter playgrounds of Yetis – after that we will proceed for Zero point – which is optional visit- for that permit is needed for that you can directly communicate with the driver – and after completion of sightseeing return back to hotel – Overnight stay at Lachung" },
      { id: "7-6", title: "Day 06: Transfer Gangtok", description: "After breakfast we will drive for Gangtok - route witness the Beautification of the wonderful Bheema & Twin Falls - On arrival at check-in to your Gangtok hotel – Overnight stay at Gangtok." },
      { id: "7-7", title: "Day 07: Gangtok Local Sightseeing", description: "Morning 9:00 a.m. after breakfast proceed for Gangtok local sightseeing (Half day)– Banjahakri Waterfalls, Tashi View Point, Ganesh Tok, Hanuman Tok, Enchay Monastery,mige towards the airport" }
    ]
  }
];

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
  companyAddress: 'Ashok Nagar, bagdogra P.O - bagdogra, Dist. - Darjeeling - 734014',
  phone: '+91 9851544861',
  companyPan: '',
  cancellationPolicy: ``
};

export const initialSerialCounters: SerialCounters = {
  transport: { year: new Date().getFullYear(), next: 1 },
  package: { year: new Date().getFullYear(), next: 1 },
  invoice: { year: new Date().getFullYear(), next: 1 },
  receipt: { year: new Date().getFullYear(), next: 1 },
};
