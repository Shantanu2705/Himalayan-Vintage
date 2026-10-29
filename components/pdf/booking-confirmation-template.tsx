import React from 'react';
import { CompanySettings } from '@/types';

export interface BookingConfirmationData {
  guestName: string;
  businessHouse: string;
  cellNo: string;
  pax: string;
  travellingDates: string;
  packageType: string;
  vehicle: string;
  costing: string;
  includes: string;
  adv: string;
  remarks: string;
  stay: string;
  duties: string[];
  createdBy: string;
  designation: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  companyPhones: string;
}

// Convert numbers to Indian English Words (e.g. 82500 -> "Eighty-Two Thousand Five Hundred")
export function numberToWords(num: number): string {
  if (!num || isNaN(num) || num === 0) return 'Zero';
  num = Math.round(Number(num));

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTens(n: number): string {
    if (n < 20) return a[n];
    const tens = b[Math.floor(n / 10)];
    const ones = a[n % 10];
    return ones ? `${tens}-${ones}` : tens;
  }

  function convertHundreds(n: number): string {
    let str = '';
    if (Math.floor(n / 100) > 0) {
      str += a[Math.floor(n / 100)] + ' Hundred';
      if (n % 100 > 0) str += ' ';
    }
    if (n % 100 > 0) {
      str += convertTens(n % 100);
    }
    return str;
  }

  let result = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = num;

  if (crore > 0) result += convertHundreds(crore) + ' Crore ';
  if (lakh > 0) result += convertHundreds(lakh) + ' Lakh ';
  if (thousand > 0) result += convertHundreds(thousand) + ' Thousand ';
  if (remainder > 0) result += convertHundreds(remainder);

  return result.trim();
}

// Convert '2026-11-18' to '18th November 2026'
export function formatOrdinalDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  const j = day % 10;
  const k = day % 100;
  let suffix = 'th';
  if (j === 1 && k !== 11) suffix = 'st';
  else if (j === 2 && k !== 12) suffix = 'nd';
  else if (j === 3 && k !== 13) suffix = 'rd';
  return `${day}${suffix} ${month} ${year}`;
}

/**
 * Intelligently build Booking Confirmation data from Quotation, Receipts, and Settings
 */
export function getBookingConfirmationData(
  quotation: any,
  totalReceived?: number,
  receipts?: any[],
  settings?: CompanySettings | null
): BookingConfirmationData {
  const qReceipt = receipts && receipts.length > 0 ? receipts[receipts.length - 1] : null;

  // 1. Guest name
  let rawName = quotation?.clientName || quotation?.customerName || qReceipt?.clientName || 'Girish Patel';
  if (!/^(Mr|Mrs|Ms|Dr|Prof)\.?\s+/i.test(rawName.trim())) {
    rawName = `Mr. ${rawName.trim()}`;
  }

  // 2. Business House / Agency
  const businessHouse = quotation?.companyName || qReceipt?.businessHouse || 'Travel Amore';

  // 3. Cell No
  const cellNo = quotation?.clientPhone || quotation?.mobile || qReceipt?.clientMobile || '8436378176';

  // 4. PAX
  let pax = qReceipt?.pax;
  if (!pax) {
    const pCount = quotation?.passengers || quotation?.persons || 7;
    pax = `${String(pCount).padStart(2, '0')} Only (Including Adults, Kids and Children)`;
  }

  // 5. Travelling Dates
  let travellingDates = '';
  if (quotation?.startDate) {
    const sStr = formatOrdinalDate(quotation.startDate);
    const eStr = quotation.endDate ? formatOrdinalDate(quotation.endDate) : sStr;
    travellingDates = `${sStr} – ${eStr}`;
  } else if (qReceipt?.travelStart) {
    const sStr = formatOrdinalDate(qReceipt.travelStart);
    const eStr = qReceipt.travelEnd ? formatOrdinalDate(qReceipt.travelEnd) : sStr;
    travellingDates = `${sStr} – ${eStr}`;
  } else {
    travellingDates = '18th November 2026 – 25th November 2026';
  }

  // 6. Package
  const packageType = qReceipt?.packageType || 'Transportation Only';

  // 7. Vehicle
  let vehicle = qReceipt?.vehicleDetails;
  if (!vehicle) {
    if (quotation?.vehicles && quotation.vehicles.length > 0) {
      vehicle = quotation.vehicles
        .map((v: any) => `${v.vehicle || v.vehicleName || 'Vehicle'} x ${String(v.qty || v.quantity || 1).padStart(2, '0')}`)
        .join(' and ');
    } else if (quotation?.vehicle) {
      vehicle = `${quotation.vehicle} x 01`;
    } else {
      vehicle = 'Innova Crysta x 01 and Wagnor x 01';
    }
  }

  // 8. Costing
  let costing = qReceipt?.costingOverride;
  if (!costing) {
    const total = Number(quotation?.totalAmount || quotation?.baseAmount || qReceipt?.grandTotal || 82500);
    const words = numberToWords(total);
    const passIncluded = (quotation?.notes || quotation?.remarks || '').toLowerCase().includes('pass') ||
      (quotation?.destination || '').toLowerCase().includes('gangtok') ||
      (quotation?.destination || '').toLowerCase().includes('tsomgo');
    costing = `Rs.${total} (${words})${passIncluded ? ' – Nathula Pass Included' : ''}`;
  }

  // 9. Includes
  let includes = qReceipt?.includes;
  if (!includes) {
    if (quotation?.inclusions && quotation.inclusions.length > 0) {
      includes = quotation.inclusions.join(' / ');
    } else {
      includes = 'Toll / Tax / Permits / Fuel / Vehicle / Driver Allowance';
    }
  }

  // 10. Adv
  let adv = qReceipt?.advanceLineOverride;
  if (!adv) {
    const advanceAmount = totalReceived !== undefined
      ? totalReceived
      : (Number(qReceipt?.receivedAmount) || Number(qReceipt?.amount) || 10000);
    const advWords = numberToWords(advanceAmount);
    adv = `Rs. ${advanceAmount} (${advWords} Only)`;
  }

  // 11. Remarks
  const remarks = qReceipt?.remarks ||
    quotation?.notes ||
    quotation?.remarks ||
    'For Tsomgo Lake, baba Mandir and Nathula Pass only One Innova Crysta Will be Provided';

  // 12. Stay
  const stay = qReceipt?.stayDetails || quotation?.destination || 'Gangtok, Pelling and Darjeeling';

  // 13. Duties
  let duties: string[] = [];
  if (quotation?.itinerary && quotation.itinerary.length > 0) {
    duties = quotation.itinerary.map((item: any, idx: number) => {
      const heading = (item.heading || item.title || '').trim();
      const desc = (item.desc || item.description || '').trim();
      if (heading && desc) {
        return `${heading} – ${desc}`;
      }
      return desc || heading || 'Sightseeing and transfer as per schedule';
    });
  } else if (qReceipt?.duty && qReceipt.duty !== 'As per given itinerary') {
    duties = qReceipt.duty.split('\n').filter(Boolean);
  } else {
    duties = [
      'Reach NJP Rly / IXB Bagdogra to transfer Gangtok – Overnight stay at Gangtok',
      'Tsomgo Lake Baba Mandir Nathula Pass – Overnight stay at Gangtok',
      'Gangtok Local Sightseeing – Overnight stay at Gangtok',
      'Pelling Transfer via Namchi – Overnight stay at Pelling',
      'Pelling Sightseeing – Overnight stay at Pelling',
      'Transfer Darjeeling – Overnight stay at Darjeeling',
      'Darjeeling Local Sightseeing – Overnight stay at Darjeeling',
      'NJP Rly Station / IXB Bagdogra Airport Transfer – Tour End'
    ];
  }

  // 14. Signoff
  const createdBy = qReceipt?.checkedByName || 'Rohit Purbey';
  const designation = qReceipt?.designation || 'Sales Head';
  const companyName = settings?.companyName || 'Himalayan Vintage Holidays';
  const companyAddress = settings?.companyAddress || 'Bagdogra, West Bengal, India';
  const companyContact = `Contact: ${settings?.phone || '+91 98515 44861'}, ${settings?.email || 'query@himalayantaxi.com'}`;
  const companyPhones = '(+91) 9749367718 | (+91) 9851544861';

  return {
    guestName: rawName,
    businessHouse,
    cellNo,
    pax,
    travellingDates,
    packageType,
    vehicle,
    costing,
    includes,
    adv,
    remarks,
    stay,
    duties,
    createdBy,
    designation,
    companyName,
    companyAddress,
    companyContact,
    companyPhones,
  };
}

interface BookingConfirmationPdfTemplateProps {
  data: BookingConfirmationData;
}

export const BookingConfirmationPdfTemplate: React.FC<BookingConfirmationPdfTemplateProps> = ({ data }) => {
  return (
    <div
      className="w-full max-w-[210mm] mx-auto bg-white text-black text-[13px] leading-relaxed select-text"
      style={{
        fontFamily: '"Comic Sans MS", "Comic Sans", cursive, sans-serif',
        minHeight: '297mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start pt-2 pb-4">
        {/* Left: Dual Logos */}
        <div className="flex flex-col items-start gap-2">
          {/* Main Himalayan Vintage Holidays logo */}
          <img
            src="/himalayan-vintage-logo.jpg"
            alt="Himalayan Vintage Holidays"
            className="h-10 sm:h-11 w-auto object-contain"
          />
          {/* Himalayan Taxi Badge Logo */}
          <img
            src="/himalayan-taxi-logo.png"
            alt="Himalayan Taxi"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </div>

        {/* Right: Company contact info */}
        <div className="text-right space-y-0.5">
          <h1 className="text-base sm:text-[17px] font-bold text-slate-900 leading-tight">
            {data.companyName}
          </h1>
          <p className="text-xs text-slate-800 font-medium">
            {data.companyAddress}
          </p>
          <p className="text-xs text-slate-800 font-medium">
            {data.companyContact}
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center my-6">
        <h2 className="text-base sm:text-[17px] font-bold uppercase tracking-wider underline text-slate-900 inline-block">
          BOOKING CONFIRMATION
        </h2>
      </div>

      {/* Key-Value Details */}
      <div className="space-y-3 sm:space-y-3.5 text-xs sm:text-[13px] text-slate-900 my-4">
        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">Guest name</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.guestName}</span>
        </div>

        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">Business House</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.businessHouse}</span>
        </div>

        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">Cell No</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.cellNo}</span>
        </div>

        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">PAX</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.pax}</span>
        </div>

        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">Travelling Dates</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.travellingDates}</span>
        </div>

        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">Package</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.packageType}</span>
        </div>

        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">Vehicle</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.vehicle}</span>
        </div>

        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">Costing</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.costing}</span>
        </div>

        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">Includes</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.includes}</span>
        </div>

        <div className="flex items-start">
          <span className="w-36 sm:w-44 shrink-0 font-normal">Adv</span>
          <span className="w-4 shrink-0">:</span>
          <span className="flex-1 font-normal">{data.adv}</span>
        </div>

        {data.remarks && (
          <div className="flex items-start">
            <span className="w-36 sm:w-44 shrink-0 font-normal">Remarks</span>
            <span className="w-4 shrink-0">:</span>
            <span className="flex-1 font-normal">{data.remarks}</span>
          </div>
        )}
      </div>

      {/* Stay Section with horizontal divider borders */}
      <div className="my-5 border-y-2 border-slate-900 py-2.5">
        <p className="text-xs sm:text-[13px] text-slate-900 font-normal">
          <span className="font-normal">Stay: </span>
          <span>{data.stay}</span>
        </p>
      </div>

      {/* Duty / Itinerary Section */}
      <div className="my-5 space-y-2">
        <div className="text-xs sm:text-[13px] font-normal text-slate-900">
          Duty –
        </div>
        <div className="space-y-1.5 text-xs sm:text-[13px] text-slate-900 leading-relaxed font-normal">
          {data.duties.map((duty, idx) => (
            <div key={idx}>
              Day {String(idx + 1).padStart(2, '0')} – {duty}
            </div>
          ))}
        </div>
      </div>

      {/* Signoff / Footer */}
      <div className="mt-12 pt-4 text-xs sm:text-[13px] text-slate-900 space-y-1 font-normal break-inside-avoid">
        <div>Create By –</div>
        <div className="font-semibold text-slate-900">{data.createdBy}</div>
        <div>{data.designation}</div>
        <div>{data.companyName}</div>
        <div>{data.companyPhones}</div>
      </div>
    </div>
  );
};

