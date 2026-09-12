import React from 'react';
import { CompanySettings } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface QuotationPdfTemplateProps {
  quotation: any; 
  settings: CompanySettings | null;
}

// Simple Indian numbering system number-to-words converter
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const numStr = num.toString();
  if (numStr.length > 9) return numStr; 

  const n = ('000000000' + numStr).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return numStr;

  let str = '';
  str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[n[1][0] as any] + ' ' + a[n[1][1] as any]) + 'Crore ' : '';
  str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[n[2][0] as any] + ' ' + a[n[2][1] as any]) + 'Lakh ' : '';
  str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[n[3][0] as any] + ' ' + a[n[3][1] as any]) + 'Thousand ' : '';
  str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[n[4][0] as any] + ' ' + a[n[4][1] as any]) + 'Hundred ' : '';
  str += (Number(n[5]) != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0] as any] + ' ' + a[n[5][1] as any]) : '';
  
  return str.trim();
}

export const QuotationPdfTemplate: React.FC<QuotationPdfTemplateProps> = ({ quotation, settings }) => {
  const companyName = settings?.companyName || 'Himalayan Vintage Holidays';
  const rawAddress = settings?.companyAddress || settings?.address || '';
  const companyAddress = rawAddress.includes('bagdogra P.O') 
    ? 'Ashok Nagar, bagdogra,Darjeeling - 734014' 
    : (rawAddress || 'Ashok Nagar, bagdogra,Darjeeling - 734014');
  const companyContact = settings?.phone || settings?.whatsappNumber || '+91 9851544861';
  const companyEmail = settings?.email || settings?.supportEmail || 'query@himalayantaxi.com';

  const cabSummary = quotation.vehicles?.length > 0 
    ? quotation.vehicles.map((v: any) => `${v.vehicle} X ${String(v.qty || 1).padStart(2, '0')}`).join(', ')
    : 'Not Specified';

  return (
    <div 
      className="space-y-4 text-[13px] leading-relaxed text-black break-words" 
      style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-shrink-0">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Company Logo" className="h-20 w-auto object-contain mix-blend-multiply" />
          ) : (
            <div className="h-16 w-32 border-2 border-black flex items-center justify-center font-bold">
              LOGO
            </div>
          )}
        </div>
        
        <div className="text-right">
          <h2 className="text-xl font-bold text-[#0c2f5d] m-0">{companyName}</h2>
          <div className="font-bold text-sm text-[#0c2f5d]">{companyAddress}</div>
          <div className="font-bold text-sm text-[#0c2f5d]">Contact : {companyContact}</div>
          <div className="font-bold text-sm text-[#0c2f5d]">Email: {companyEmail}</div>
        </div>
      </div>

      {/* Intro Text */}
      <div className="text-justify font-bold text-[#7a1818] mb-4">
        Dear {quotation.clientName || quotation.customerName || 'Client'}, with Ref. form telcom / Email / Whats app – We are providing you the cab 
        service for {quotation.packageDuration || 'tour'} (Not on Disposal) – Itinerary & details are given below along 
        with terms & condition.
      </div>

      {/* Date */}
      <div className="mb-4">
        <span className="bg-yellow-300 font-bold px-1">
          Date: {formatDate(quotation.date || quotation.createdAt || new Date().toISOString())} - {quotation.clientPhone || quotation.mobile || 'Contact Not Provided'}
        </span>
      </div>

      {/* Day-Wise Itinerary */}
      {quotation.itinerary && quotation.itinerary.length > 0 && (
        <div className="space-y-4">
          {quotation.itinerary.map((item: any, idx: number) => (
            <div key={idx}>
              <div className="inline-block bg-yellow-300 font-bold mb-1 px-1">
                Day: {idx + 1} {item.heading ? `[${item.heading}]` : ''}
              </div>
              <div className="text-justify text-[#0c2f5d]">
                {item.desc || item.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Summary */}
      <div className="mt-6 mb-4 space-y-1">
        <div>
          <span className="bg-yellow-300 font-bold px-1">
            Pax: {quotation.passengers || '1'} Only (Including Adults / Children / Kids)
          </span>
        </div>
        <div>
          <span className="bg-yellow-300 font-bold px-1">
            Cab: {cabSummary}
          </span>
        </div>
        <div>
          <span className="bg-yellow-300 font-bold px-1">
            Status: Reserved
          </span>
        </div>
        <div>
          <span className="bg-yellow-300 font-bold px-1">
            Costing: Rs.{quotation.grandTotal || 0} ({numberToWords(quotation.grandTotal || 0)})
          </span>
        </div>
      </div>

      {/* Package Includes & Excludes */}
      {(quotation.inclusions?.length > 0 || quotation.exclusions?.length > 0) && (
        <div className="space-y-4 mt-6 text-[#0c2f5d]">
          {quotation.inclusions?.length > 0 && (
            <div>
              <div className="font-bold underline mb-1">Package includes:</div>
              <ul className="list-disc pl-8 space-y-1">
                {quotation.inclusions.map((inc: string, i: number) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
            </div>
          )}
          
          {quotation.exclusions?.length > 0 && (
            <div>
              <div className="font-bold underline mb-1">Package excludes:</div>
              <ul className="list-disc pl-8 space-y-1">
                {quotation.exclusions.map((exc: string, i: number) => (
                  <li key={i}>{exc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Additional Details & Notes */}
      {(quotation.additionalDetails || quotation.additionalNotes || quotation.pickupTiming || quotation.dropTiming || quotation.driverInstructions || quotation.vehicleNotes) && (
        <div className="space-y-4 mt-6 text-[#0c2f5d]">
          {quotation.additionalDetails && (
            <div>
              <div className="font-bold underline mb-1">Additional Details:</div>
              <div className="text-justify">{quotation.additionalDetails}</div>
            </div>
          )}
          
          {(quotation.pickupTiming || quotation.dropTiming || quotation.driverInstructions || quotation.vehicleNotes) && (
            <div>
              <div className="font-bold underline mb-1">Transport Details:</div>
              <ul className="list-disc pl-8 space-y-1">
                {quotation.pickupTiming && <li><strong>Pickup Timing:</strong> {quotation.pickupTiming}</li>}
                {quotation.dropTiming && <li><strong>Drop Timing:</strong> {quotation.dropTiming}</li>}
                {quotation.driverInstructions && <li><strong>Driver Instructions:</strong> {quotation.driverInstructions}</li>}
                {quotation.vehicleNotes && <li><strong>Vehicle Notes:</strong> {quotation.vehicleNotes}</li>}
              </ul>
            </div>
          )}

          {quotation.additionalNotes && (
            <div>
              <div className="font-bold underline mb-1">Additional Notes:</div>
              <div className="text-justify">{quotation.additionalNotes}</div>
            </div>
          )}
        </div>
      )}

      {/* Terms and Conditions / Remarks */}
      {(quotation.terms || quotation.remarks) && (
        <div className="space-y-4 mt-6 text-[#0c2f5d] break-before-auto">
          {quotation.remarks && (
            <div>
              <div className="font-bold underline mb-1">Payment Mode / Remarks:</div>
              <ul className="list-disc pl-8 space-y-1">
                {quotation.remarks.split('\n').filter((t: string) => t.trim() !== '').map((remark: string, idx: number) => (
                  <li key={idx} className="text-justify">{remark.trim().replace(/^[-•]\s*/, '')}</li>
                ))}
              </ul>
            </div>
          )}
          {quotation.terms && (
            <div>
              <div className="font-bold underline mb-1">Terms & Condition:</div>
              <ul className="list-disc pl-8 space-y-1">
                {quotation.terms.split('\n').filter((t: string) => t.trim() !== '').map((term: string, idx: number) => (
                  <li key={idx} className="text-justify">{term.trim().replace(/^[-•]\s*/, '')}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Footer Details */}
      {settings?.footerLogoUrl && (
        <div className="mt-8 flex justify-center">
          <img src={settings.footerLogoUrl} alt="Footer Details" className="h-28 w-auto object-contain max-w-full mix-blend-multiply" />
        </div>
      )}
    </div>
  );
};
