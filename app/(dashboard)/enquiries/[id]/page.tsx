'use client';
import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, Sparkles, Phone, Mail } from 'lucide-react';

export default function EnquiryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { enquiries, isInitialized } = useFleetStore();
  
  if (!isInitialized) return null;
  
  const enquiry = enquiries.find(e => e.id === id);
  if (!enquiry) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-gray-500">Enquiry not found</div>
      </DashboardLayout>
    );
  }

  const start = enquiry.startDate ? new Date(enquiry.startDate) : null;
  const end = start ? new Date(start.getTime() + ((enquiry.days || 1) - 1) * 24 * 60 * 60 * 1000) : null;
  const datesStr = start && end 
    ? `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} \u2013 ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` 
    : '\u2014';

  const formatStatus = (status: string) => {
    return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#effdf5] p-6 lg:p-8 pt-[32px]">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/enquiries')}
              className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Enquiries
            </button>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => router.push(`/enquiries?edit=${enquiry.id}`)}
                variant="outline" 
                className="h-9 px-5 rounded-full font-bold text-gray-600 border-gray-200/80 hover:bg-white shadow-sm bg-white/50"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button 
                onClick={() => router.push(`/quotations/new?enquiryId=${enquiry.id}`)}
                className="h-9 px-5 rounded-full font-bold bg-[#fbbf24] hover:bg-[#f59e0b] text-[#422006] shadow-sm"
              >
                <Sparkles className="h-4 w-4 mr-1.5" /> Generate quotation
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            
            {/* Main Info Card */}
            <Card className="border-0 shadow-sm rounded-[24px]">
              <CardContent className="p-8 space-y-8">
                
                {/* Header Info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-[#1e293b]">{enquiry.customerName}</h1>
                    {enquiry.clientType && (
                      <span className="px-3 py-1 rounded-full border border-gray-200 text-[11px] font-bold text-gray-500 bg-gray-50/50">
                        {enquiry.clientType}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full border border-gray-200 text-[11px] font-bold text-gray-400 bg-gray-100/50">
                      {formatStatus(enquiry.status || '')}
                    </span>
                  </div>
                  <div className="text-[14px] font-medium text-[#64748b]">
                    {enquiry.pickupLocation} \u2192 {enquiry.destination} &middot; {enquiry.passengers} passengers &middot; {enquiry.days} days
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Vehicle</div>
                    <div className="text-[15px] font-medium text-gray-800">{enquiry.vehicle || '\u2014'}</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Travel Dates</div>
                    <div className="text-[15px] font-medium text-gray-800">{datesStr}</div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ticket Confirmed</div>
                    <div className="text-[15px] font-medium text-gray-800">{enquiry.ticketRequired ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hotel Confirmed</div>
                    <div className="text-[15px] font-medium text-gray-800">{enquiry.hotelRequired ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Places of Interest</div>
                  <div className="text-[15px] font-medium text-gray-800">{enquiry.places || '\u2014'}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Special Requirements</div>
                  <div className="text-[15px] font-medium text-gray-800">{enquiry.specialRequirements || '\u2014'}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer Remarks</div>
                  <div className="text-[15px] font-medium text-gray-800">{enquiry.customerRemarks || '\u2014'}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Internal Notes</div>
                  <div className="text-[15px] font-medium text-gray-800">{enquiry.internalNotes || '\u2014'}</div>
                </div>

              </CardContent>
            </Card>

            {/* Contact Card */}
            <div className="space-y-4">
              <Card className="border-0 shadow-sm rounded-[24px]">
                <CardContent className="p-6">
                  <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">Contact</h3>
                  
                  <div className="space-y-3">
                    {enquiry.mobile ? (
                      <a href={`tel:${enquiry.mobile.replace(/\\D/g, '')}`} className="flex items-center gap-3 p-3.5 rounded-[16px] border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:bg-orange-50/50 transition-colors cursor-pointer group">
                        <Phone className="h-4 w-4 text-orange-400 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-[14px] font-medium text-gray-800 group-hover:text-orange-600 transition-colors">{enquiry.mobile}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 p-3.5 rounded-[16px] border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] opacity-50">
                        <Phone className="h-4 w-4 text-orange-400 shrink-0" />
                        <span className="text-[14px] font-medium text-gray-800">\u2014</span>
                      </div>
                    )}
                    
                    {(enquiry.whatsapp || enquiry.mobile) ? (
                      <a href={`https://wa.me/${(enquiry.whatsapp || enquiry.mobile).replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 rounded-[16px] border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:bg-green-50/50 transition-colors cursor-pointer group">
                        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-green-500 shrink-0 group-hover:scale-110 transition-transform" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        <span className="text-[14px] font-medium text-gray-800 group-hover:text-green-700 transition-colors">{enquiry.whatsapp || enquiry.mobile}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 p-3.5 rounded-[16px] border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] opacity-50">
                        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-green-500 shrink-0" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        <span className="text-[14px] font-medium text-gray-800">\u2014</span>
                      </div>
                    )}

                    {enquiry.email ? (
                      <a href={`mailto:${enquiry.email}`} className="flex items-center gap-3 p-3.5 rounded-[16px] border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:bg-gray-50 transition-colors cursor-pointer group">
                        <Mail className="h-4 w-4 text-gray-400 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-[14px] font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{enquiry.email}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 p-3.5 rounded-[16px] border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] opacity-50">
                        <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="text-[14px] font-medium text-gray-800">\u2014</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 text-[11px] font-medium text-gray-400">
                    Created {new Date(enquiry.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
