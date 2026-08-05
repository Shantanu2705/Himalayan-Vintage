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
      <div className="flex justify-between items-start border-b-2 border-primary pb-6">
        <div>
          <div className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Company Logo" className="h-20 w-auto max-w-[220px] object-contain mix-blend-multiply" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 shadow-sm text-white font-bold">
                LOGO
              </div>
            )}
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight uppercase text-primary">
                {settings?.companyName || 'Himalayan Vintage Holidays'}
              </h2>
              <p className="text-xs text-slate-600">
                {settings?.address || 'MG Marg, Gangtok, Sikkim — 737101'}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs font-mono space-y-0.5 text-slate-600">
            <div>Phone: {settings?.phone || '+91 98300 12345'}</div>
            <div>Email: {settings?.email || 'booking@himalayan.co'} | GSTIN: {settings?.gstin || '11AAAAA0000A1Z5'}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-extrabold text-primary uppercase">QUOTATION PROPOSAL</div>
          <div className="text-sm font-mono font-bold mt-1">Ref: {quotation.id?.substring(0,8).toUpperCase()}</div>
          <div className="text-xs text-slate-500 mt-0.5">Date: {formatDate(quotation.date || quotation.createdAt || new Date().toISOString())}</div>
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
        </div>
      </div>

      {/* Day-Wise Itinerary */}
      {quotation.itinerary && quotation.itinerary.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-200 pb-1 text-primary">Day-Wise Tour Itinerary</h3>
          <div className="space-y-4 pt-2">
            {quotation.itinerary.map((item: any, idx: number) => (
              <div key={idx} className="border-l-2 border-primary pl-4 py-1 relative">
                <div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-primary" />
                <div className="text-sm font-bold text-slate-900">
                  Day {item.day || idx + 1}: {item.title}
                </div>
                <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{item.desc || item.description}</p>
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

      {/* Commercial Summary Table */}
      <div className="pt-2 break-inside-avoid">
        <div className="flex justify-end">
          <table className="w-[60%] text-xs border border-slate-200">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-2 font-medium text-slate-600">Base Subtotal</td>
                <td className="p-2 text-right font-mono">{formatCurrency(quotation.baseAmount)}</td>
              </tr>
              {quotation.rateCard?.gst > 0 && (
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
                <tr className="bg-slate-50">
                  <td className="p-2 font-medium text-slate-600">Required Advance ({quotation.advancePercent}%)</td>
                  <td className="p-2 text-right font-mono text-emerald-600 font-bold">{formatCurrency((quotation.grandTotal * quotation.advancePercent) / 100)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="grid grid-cols-2 gap-6 pt-6 text-xs text-slate-600 break-inside-avoid">
        <div>
          <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 uppercase tracking-wider text-[11px]">Inclusions</h4>
          <ul className="list-disc pl-4 space-y-1">
            {quotation.inclusions?.map((inc: string, i: number) => (
              <li key={i}>{inc}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 uppercase tracking-wider text-[11px]">Exclusions</h4>
          <ul className="list-disc pl-4 space-y-1">
            {quotation.exclusions?.map((exc: string, i: number) => (
              <li key={i}>{exc}</li>
            ))}
          </ul>
        </div>
      </div>

      {quotation.remarks && (
        <div className="pt-4 break-inside-avoid">
          <div className="bg-slate-50 p-3 text-xs text-slate-700 italic border border-slate-200 rounded">
            <strong>Remarks: </strong> {quotation.remarks}
          </div>
        </div>
      )}

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
