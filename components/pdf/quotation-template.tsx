import React from 'react';
import { CompanySettings } from '@/types';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';

interface QuotationPdfTemplateProps {
  quotation: any; // Using any for the smart quotation schema since it varies
  settings: CompanySettings | null;
}

export const QuotationPdfTemplate: React.FC<QuotationPdfTemplateProps> = ({ quotation, settings }) => {
  return (
    <div className="space-y-6 text-sm font-sans text-black">

      {/* Header */}
      <div className="grid grid-cols-3 items-start border-b-2 border-primary pb-6 gap-4">
        {/* Left: Logo */}
        <div className="flex justify-start">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Company Logo" className="h-28 w-auto max-w-[240px] object-contain mix-blend-multiply" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-900 shadow-sm text-white font-bold text-xl">
              LOGO
            </div>
          )}
        </div>

        {/* Middle: Document Title */}
        <div className="flex flex-col items-center justify-center text-center mt-2">
          <div className="text-xl font-extrabold text-primary uppercase tracking-wider">QUOTATION PROPOSAL</div>
          <div className="text-sm font-mono font-bold mt-2">Quotation No: {quotation.quotationNo || quotation.id?.substring(0,8).toUpperCase()}</div>
          <div className="text-xs text-slate-500 mt-0.5">Date: {formatDate(quotation.date || quotation.createdAt || new Date().toISOString())}</div>
        </div>

        {/* Right: Company Details */}
        <div className="flex flex-col items-end text-right">
          <h2 className="text-lg font-extrabold tracking-tight uppercase text-primary">
            {settings?.companyName || 'Himalayan Vintage Holidays'}
          </h2>
          <p className="text-[11px] text-slate-600 mt-1 max-w-[200px] leading-snug">
            {settings?.address || 'MG Marg, Gangtok, Sikkim — 737101'}
          </p>
          <div className="mt-2 text-[10px] font-mono space-y-0.5 text-slate-500">
            <div>Phone: {settings?.phone || '+91 98300 12345'}</div>
            <div>Email: {settings?.email || 'booking@himalayan.co'}</div>
            {settings?.gstin && <div>GSTIN: {settings?.gstin}</div>}
          </div>
        </div>
      </div>

      {/* Client & Trip Info Box */}
      <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 border-b border-slate-200 pb-1">Prepared For:</div>
          <div className="font-bold text-base text-slate-900">{quotation.clientName || quotation.customerName}</div>
          {quotation.clientPhone && <div className="text-xs font-mono mt-0.5">Mobile: {formatPhoneNumber(quotation.clientPhone)}</div>}
          {quotation.clientType && <div className="text-xs mt-0.5">Client Type: <span className="font-semibold uppercase">{quotation.clientType}</span></div>}
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 border-b border-slate-200 pb-1">Trip Summary:</div>
          <div className="text-xs font-semibold mt-1">Route: {quotation.pickupLocation} → {quotation.destination || quotation.drop}</div>
          <div className="text-xs mt-0.5">Duration: <strong>{quotation.packageDuration || '1 Day'}</strong></div>
          <div className="text-xs mt-0.5">Pax: <strong>{quotation.passengers || 2}</strong></div>
          <div className="text-xs mt-0.5">Start Date: {formatDate(quotation.startDate || new Date().toISOString())}</div>
          {quotation.qType && <div className="text-xs mt-0.5">Type: <strong>{quotation.qType}</strong></div>}
        </div>
      </div>

      {/* Day-Wise Itinerary */}
      {quotation.itinerary && quotation.itinerary.length > 0 && (
        <div className="space-y-3 pt-4 break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary/20 pb-1.5 text-primary">Day-Wise Tour Itinerary</h3>
          <div className="space-y-5 pt-2">
            {quotation.itinerary.map((item: any, idx: number) => (
              <div key={idx} className="border-l-[3px] border-primary/60 pl-5 py-1 relative">
                <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-white" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-extrabold text-primary uppercase">DAY {item.day || idx + 1}:</span>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{item.desc || item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Break-up */}
      {quotation.vehicles && quotation.vehicles.length > 0 && (
        <div className="space-y-3 pt-4 break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-200 pb-1 text-primary">Transport & Pricing Details</h3>
          <table className="w-full text-xs border border-slate-200">
            <thead className="bg-slate-100 font-bold text-left">
              <tr>
                <th className="p-2 border-r border-slate-200">Vehicle Type</th>
                <th className="p-2 border-r border-slate-200 text-center">Qty</th>
                <th className="p-2 border-r border-slate-200 text-center">Days</th>
                <th className="p-2 border-r border-slate-200 text-right">Base Rate</th>
                <th className="p-2 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quotation.vehicles.map((v: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2 border-r border-slate-200 font-medium">
                    {v.vehicle}
                    <div className="text-[10px] text-slate-500 font-normal">{v.packagePrice}</div>
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center">{v.qty}</td>
                  <td className="p-2 border-r border-slate-200 text-center">{v.days}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-mono">{formatCurrency(v.rate)}</td>
                  <td className="p-2 text-right font-mono font-semibold">{formatCurrency(v.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Rate Card & Extra Services */}
      {(quotation.rateCard?.perKm > 0 || quotation.rateCard?.extraKm > 0 || quotation.rateCard?.extraHour > 0 || quotation.rateCard?.driverAllowance > 0 || quotation.permits?.length > 0 || quotation.extraSightseeing?.length > 0) && (
        <div className="space-y-3 pt-4 break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-200 pb-1 text-primary">Rate Card & Extra Services</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">Additional Rates</h4>
              <ul className="space-y-1 text-slate-600">
                {quotation.rateCard?.perKm > 0 && <li><span className="font-medium">Per Km:</span> {formatCurrency(quotation.rateCard.perKm)}</li>}
                {quotation.rateCard?.extraKm > 0 && <li><span className="font-medium">Extra Km:</span> {formatCurrency(quotation.rateCard.extraKm)}</li>}
                {quotation.rateCard?.extraHour > 0 && <li><span className="font-medium">Extra Hour:</span> {formatCurrency(quotation.rateCard.extraHour)}</li>}
                {quotation.rateCard?.driverAllowance > 0 && <li><span className="font-medium">Driver Allowance:</span> {formatCurrency(quotation.rateCard.driverAllowance)}</li>}
                {quotation.rateCard?.nightCharge > 0 && <li><span className="font-medium">Night Charge:</span> {formatCurrency(quotation.rateCard.nightCharge)}</li>}
              </ul>
            </div>
            
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">Permits & Sightseeing (Included in Total)</h4>
              <ul className="space-y-1 text-slate-600">
                {quotation.permits?.map((p: string, idx: number) => (
                  <li key={`p-${idx}`}>{p}</li>
                ))}
                {quotation.extraSightseeing?.map((s: string, idx: number) => (
                  <li key={`s-${idx}`}>{s}</li>
                ))}
                {(!quotation.permits?.length && !quotation.extraSightseeing?.length) && <li>No additional permits or sightseeing selected.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Transport & Additional Details */}
      {(quotation.pickupTiming || quotation.dropTiming || quotation.driverInstructions || quotation.vehicleNotes || quotation.additionalDetails || quotation.additionalNotes) && (
        <div className="space-y-3 pt-4 break-inside-avoid">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b-2 border-primary/20 pb-1.5 text-primary">Transport & Additional Details</h3>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="space-y-3">
              {quotation.pickupTiming && <div><span className="font-bold text-slate-900 block mb-0.5">Pickup Time:</span> {quotation.pickupTiming}</div>}
              {quotation.dropTiming && <div><span className="font-bold text-slate-900 block mb-0.5">Drop Time:</span> {quotation.dropTiming}</div>}
              {quotation.driverInstructions && <div><span className="font-bold text-slate-900 block mb-0.5">Driver Instructions:</span> <span className="whitespace-pre-wrap">{quotation.driverInstructions}</span></div>}
              {quotation.vehicleNotes && <div><span className="font-bold text-slate-900 block mb-0.5">Vehicle Notes:</span> <span className="whitespace-pre-wrap">{quotation.vehicleNotes}</span></div>}
            </div>
            <div className="space-y-3">
              {quotation.additionalDetails && <div><span className="font-bold text-slate-900 block mb-0.5">Additional Details:</span> <span className="whitespace-pre-wrap">{quotation.additionalDetails}</span></div>}
              {quotation.additionalNotes && <div><span className="font-bold text-slate-900 block mb-0.5">Additional Notes:</span> <span className="whitespace-pre-wrap">{quotation.additionalNotes}</span></div>}
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      {(quotation.inclusions?.length > 0 || quotation.exclusions?.length > 0) && (
        <div className="grid grid-cols-2 gap-6 pt-6 text-xs text-slate-600 break-inside-avoid">
          {quotation.inclusions?.length > 0 && (
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100/50">
              <h4 className="font-bold text-emerald-900 border-b border-emerald-200/50 pb-2 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" /> Package Inclusions
              </h4>
              <ul className="space-y-2">
                {quotation.inclusions.map((inc: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span className="leading-snug">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {quotation.exclusions?.length > 0 && (
            <div className="bg-red-50/50 p-4 rounded-lg border border-red-100/50">
              <h4 className="font-bold text-red-900 border-b border-red-200/50 pb-2 mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500" /> Package Exclusions
              </h4>
              <ul className="space-y-2">
                {quotation.exclusions.map((exc: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span className="leading-snug">{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Terms and Conditions */}
      {quotation.terms && (
        <div className="pt-4 break-inside-avoid">
          <h4 className="font-bold text-slate-900 border-b-2 border-primary/20 pb-1.5 mb-2 uppercase tracking-wider text-[11px] text-primary">Terms & Conditions</h4>
          <div className="bg-slate-50 p-4 text-xs text-slate-700 border border-slate-200 rounded-lg whitespace-pre-wrap leading-relaxed">
            {quotation.terms}
          </div>
        </div>
      )}

      {/* Remarks */}
      {quotation.remarks && (
        <div className="pt-4 break-inside-avoid">
          <div className="bg-amber-50/50 p-4 text-xs text-amber-900 italic border border-amber-200/60 rounded-lg whitespace-pre-wrap flex items-start gap-2">
            <div className="font-bold uppercase tracking-wider text-[10px] mt-0.5 shrink-0 text-amber-700">Remarks:</div>
            <div>{quotation.remarks}</div>
          </div>
        </div>
      )}

      {/* Commercial Summary Table (Moved to bottom) */}
      <div className="pt-8 break-inside-avoid">
        <div className="flex justify-end">
          <table className="w-[70%] text-xs border border-slate-200">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-2 font-medium text-slate-600">Base Fare</td>
                <td className="p-2 text-right font-mono">
                  {formatCurrency((Number(quotation.rateCard?.packagePrice) || 0) || (quotation.vehicles?.reduce((acc: number, v: any) => acc + (Number(v.total) || 0), 0) || 0))}
                </td>
              </tr>
              {Number(quotation.rateCard?.driverAllowance) > 0 && (
                <tr>
                  <td className="p-2 font-medium text-slate-600">Driver Allowance</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(quotation.rateCard.driverAllowance)}</td>
                </tr>
              )}
              {quotation.extraSightseeing?.length > 0 && (
                <tr>
                  <td className="p-2 font-medium text-slate-600">
                    <div>Extra Sightseeing</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug font-normal">
                      {quotation.extraSightseeing.map((s: string) => s.split('—')[0].trim()).join(', ')}
                    </div>
                  </td>
                  <td className="p-2 text-right font-mono align-top">
                    {formatCurrency(quotation.extraSightseeing.reduce((acc: number, item: string) => {
                      const match = item.match(/₹([\d,]+)/);
                      return match ? acc + Number(match[1].replace(/,/g, '')) : acc;
                    }, 0))}
                  </td>
                </tr>
              )}
              {(quotation.permits?.length > 0 || Number(quotation.rateCard?.permits) > 0) && (
                <tr>
                  <td className="p-2 font-medium text-slate-600">
                    <div>Permits</div>
                    {quotation.permits?.length > 0 && (
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-snug font-normal">
                        {quotation.permits.map((s: string) => s.split('—')[0].trim()).join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="p-2 text-right font-mono align-top">
                    {formatCurrency(
                      (Number(quotation.rateCard?.permits) || 0) + 
                      (quotation.permits?.reduce((acc: number, item: string) => {
                        const match = item.match(/₹([\d,]+)/);
                        return match ? acc + Number(match[1].replace(/,/g, '')) : acc;
                      }, 0) || 0)
                    )}
                  </td>
                </tr>
              )}
              {Number(quotation.rateCard?.toll) > 0 && (
                <tr>
                  <td className="p-2 font-medium text-slate-600">Toll</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(quotation.rateCard.toll)}</td>
                </tr>
              )}
              {Number(quotation.rateCard?.parking) > 0 && (
                <tr>
                  <td className="p-2 font-medium text-slate-600">Parking</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(quotation.rateCard.parking)}</td>
                </tr>
              )}
              {Number(quotation.rateCard?.additional) > 0 && (
                <tr>
                  <td className="p-2 font-medium text-slate-600">Additional Charges</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(quotation.rateCard.additional)}</td>
                </tr>
              )}
              
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td className="p-2 font-bold text-slate-800">Subtotal</td>
                <td className="p-2 text-right font-mono font-bold text-slate-800">{formatCurrency(quotation.baseAmount)}</td>
              </tr>
              {quotation.hasGst !== false && quotation.rateCard?.gst > 0 && (
                <tr>
                  <td className="p-2 font-medium text-slate-600">GST ({quotation.rateCard.gst}%)</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(quotation.gstAmount)}</td>
                </tr>
              )}
              <tr className="bg-slate-100">
                <td className="p-2 font-bold text-primary uppercase">Grand Total</td>
                <td className="p-2 text-right font-mono font-bold text-primary">{formatCurrency(quotation.grandTotal)}</td>
              </tr>
              {quotation.advancePercent > 0 && (
                <>
                  <tr className="bg-emerald-50/50 border-t border-slate-200">
                    <td className="p-2.5 font-medium text-slate-600">Required Advance ({quotation.advancePercent}%)</td>
                    <td className="p-2.5 text-right font-mono text-emerald-700 font-bold">{formatCurrency((quotation.grandTotal * quotation.advancePercent) / 100)}</td>
                  </tr>
                  <tr className="bg-orange-50/50 border-t border-slate-200">
                    <td className="p-2.5 font-medium text-slate-600">Balance Amount</td>
                    <td className="p-2.5 text-right font-mono text-orange-700 font-bold">{formatCurrency(quotation.grandTotal - (quotation.grandTotal * quotation.advancePercent) / 100)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Details */}
      <div className="pt-24 flex justify-between items-end border-t-2 border-slate-100 mt-8 break-inside-avoid">
        <div className="text-[10px] text-slate-500 w-1/2 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
          <strong className="text-slate-800 uppercase tracking-wider text-[11px] mb-1 block">Validity & Acceptance:</strong>
          This quotation is valid for 7 days. Acceptance of this quotation confirms agreement to our standard terms of service and commercial policies.
        </div>
        <div className="text-center w-64">
          <div className="border-b-2 border-dashed border-slate-400 pb-12 mb-2 font-bold text-slate-800 uppercase text-[11px] flex flex-col justify-end min-h-[80px]">
            {/* Stamp/Signature Space */}
            <span className="text-[10px] text-slate-400 opacity-50 block mt-4 font-normal lowercase italic">(signature & stamp)</span>
          </div>
          <div className="font-extrabold text-slate-800 uppercase text-[11px]">
            For {settings?.companyName || 'Himalayan Vintage Holidays'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Authorized Signatory
          </div>
        </div>
      </div>

      {settings?.footerLogoUrl && (
        <div className="mt-8 flex justify-center break-inside-avoid">
          <img src={settings.footerLogoUrl} alt="Footer Details" className="h-28 w-auto object-contain max-w-full mix-blend-multiply" />
        </div>
      )}
    </div>
  );
};
