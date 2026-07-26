'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  Car,
  Users,
  MessageSquareQuote,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  FileText,
  Receipt,
  ArrowUpRight,
  Bus,
  CheckCircle2,
  Clock,
  Navigation,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { vehicles, drivers, enquiries, bookings, invoices, quotations } = useFleetStore();

  const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
  const activeDrivers = drivers.filter((d) => d.status === 'active').length;
  const newEnquiries = enquiries.filter((e) => e.status === 'new' || e.status === 'follow-up').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;

  const totalRevenue = invoices
    .filter((i) => i.status !== 'cancelled')
    .reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const pendingCollections = invoices
    .filter((i) => i.status === 'unpaid' || i.status === 'partially-paid' || i.status === 'overdue')
    .reduce((sum, i) => sum + (i.balanceAmount || 0), 0);

  const recentEnquiries = enquiries.slice(0, 5);
  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Overview</h1>
            <p className="text-sm text-muted-foreground">
              Live operational telemetry, fleet status, and financial metrics for Himalayan Vintage Holidays.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/enquiries">
              <Button size="sm" className="bg-primary text-primary-foreground font-semibold shadow-sm">
                <PlusCircle className="mr-1.5 h-4 w-4" /> New Enquiry
              </Button>
            </Link>
            <Link href="/quotations/new">
              <Button size="sm" variant="outline" className="font-semibold border-primary/20 hover:bg-primary/5">
                <FileText className="mr-1.5 h-4 w-4 text-primary" /> Smart Quote
              </Button>
            </Link>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card className="border-l-4 border-l-blue-600 shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Active Fleet</CardTitle>
              <Car className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">{activeVehicles} / {vehicles.length}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Ready for dispatch</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-600 shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Active Drivers</CardTitle>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">{activeDrivers} / {drivers.length}</div>
              <p className="text-[11px] text-muted-foreground mt-1">On duty personnel</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Open Enquiries</CardTitle>
              <MessageSquareQuote className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">{newEnquiries}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Requiring follow-up</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-600 shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Confirmed Trips</CardTitle>
              <CalendarCheck className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">{confirmedBookings}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Scheduled bookings</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-600 shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Invoiced</CardTitle>
              <TrendingUp className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-extrabold text-foreground truncate">{formatCurrency(totalRevenue)}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Gross billed volume</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Pending Dues</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-extrabold text-red-600 dark:text-red-400 truncate">
                {formatCurrency(pendingCollections)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Unpaid balance</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Module Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/quotations">
            <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer group bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-muted-foreground group-hover:text-primary transition-colors">
                  Quotations Hub
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-lg font-bold mt-1">{quotations.length} Proposals</div>
            </Card>
          </Link>

          <Link href="/billing">
            <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer group bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-muted-foreground group-hover:text-primary transition-colors">
                  Billing & QR Pay
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-lg font-bold mt-1">{invoices.length} Invoices</div>
            </Card>
          </Link>

          <Link href="/vehicles">
            <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer group bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-muted-foreground group-hover:text-primary transition-colors">
                  Vehicles Master
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-lg font-bold mt-1">{vehicles.length} Total Units</div>
            </Card>
          </Link>

          <Link href="/corporate">
            <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer group bg-gradient-to-br from-card to-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-muted-foreground group-hover:text-primary transition-colors">
                  Corporate B2B
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-lg font-bold mt-1">Contract Pricing</div>
            </Card>
          </Link>
        </div>

        {/* Tables Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Enquiries Table */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MessageSquareQuote className="h-4 w-4 text-primary" />
                  Recent Tourist & Corporate Enquiries
                </CardTitle>
                <CardDescription className="text-xs">
                  Latest customer inquiries received across WhatsApp, email, and phone.
                </CardDescription>
              </div>
              <Link href="/enquiries">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary">
                  View All ({enquiries.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Customer</TableHead>
                    <TableHead>Route & Vehicle</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEnquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No enquiries recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentEnquiries.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-semibold text-foreground">
                          <div className="truncate max-w-[130px]">{e.customerName}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{e.mobile}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium truncate max-w-[160px]">
                            {e.pickupLocation} → {e.destination}
                          </div>
                          <div className="text-[10px] text-primary font-semibold">{e.vehicle} ({e.passengers} pax)</div>
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          {formatDate(e.startDate)}
                          <span className="block text-[10px] text-muted-foreground">{e.days} Days trip</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <StatusBadge status={e.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Upcoming Bookings Table */}
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-emerald-600" />
                  Upcoming & Active Dispatches
                </CardTitle>
                <CardDescription className="text-xs">
                  Confirmed bookings currently assigned or scheduled for dispatch.
                </CardDescription>
              </div>
              <Link href="/bookings">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary">
                  View All ({bookings.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client & Vehicle</TableHead>
                    <TableHead>Itinerary</TableHead>
                    <TableHead>Driver Assigned</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No upcoming bookings scheduled.
                      </TableCell>
                    </TableRow>
                  ) : (
                    upcomingBookings.map((b) => {
                      const drv = drivers.find((d) => d.id === b.driverId);
                      return (
                        <TableRow key={b.id}>
                          <TableCell className="font-semibold text-foreground">
                            <div className="truncate max-w-[130px]">{b.clientName}</div>
                            <div className="text-[10px] text-primary font-medium">{b.vehicle}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-medium truncate max-w-[150px]">
                              {b.pickup} → {b.destination}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{formatDate(b.startDate)}</div>
                          </TableCell>
                          <TableCell>
                            {drv ? (
                              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                {drv.name}
                                <span className="block text-[10px] text-muted-foreground font-mono">{drv.mobile}</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-bold text-foreground">
                            {formatCurrency(b.amount)}
                            <div className="mt-0.5">
                              <StatusBadge status={b.status} className="text-[9px] px-1.5 py-0" />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
