'use client';
import React, { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import { ItineraryTemplate } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search, Trash2, Edit, MapPin, Plus, FileText } from 'lucide-react';

function TemplatesHubContent() {
  const { itineraryTemplates, addItineraryTemplate, updateItineraryTemplate, deleteItineraryTemplate } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [days, setDays] = useState(1);
  const [itinerary, setItinerary] = useState<any[]>([]);

  const openNewModal = () => {
    setName('');
    setDays(1);
    setItinerary([{ id: `day-${Date.now()}-1`, day: 1, title: 'Day 1', description: '' }]);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: ItineraryTemplate) => {
    setEditingId(t.id);
    setName(t.name);
    setDays(t.days || t.itinerary.length);
    setItinerary(t.itinerary.map(i => ({...i})));
    setIsModalOpen(true);
  };

  const addDay = () => {
    const newDayNum = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      { id: `day-${Date.now()}-${newDayNum}`, day: newDayNum, title: `Day ${newDayNum}`, description: '' }
    ]);
    setDays(newDayNum);
  };

  const removeDay = (index: number) => {
    const newItinerary = [...itinerary];
    newItinerary.splice(index, 1);
    // Re-number
    newItinerary.forEach((item, idx) => {
      item.day = idx + 1;
      item.title = `Day ${idx + 1}`;
    });
    setItinerary(newItinerary);
    setDays(newItinerary.length);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ItineraryTemplate = {
      id: editingId || `tpl-${Date.now()}`,
      name,
      days: itinerary.length,
      itinerary
    };
    if (editingId) {
      await updateItineraryTemplate(payload);
    } else {
      await addItineraryTemplate(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      await deleteItineraryTemplate(id);
    }
  };

  const filtered = itineraryTemplates.filter((t) =>
    (t.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Itinerary Templates</h1>
          <p className="text-sm text-muted-foreground">
            Manage reusable itinerary templates for quick quotation generation.
          </p>
        </div>
        <Button onClick={openNewModal} className="bg-primary text-primary-foreground font-semibold shadow-sm">
          <PlusCircle className="mr-1.5 h-4 w-4" /> Add Template
        </Button>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </Card>

      <Card className="shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                  No itinerary templates found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-bold text-base text-foreground">
                      <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{t.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-semibold text-muted-foreground">
                      {t.days || t.itinerary?.length} Days
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:bg-blue-50 mr-2"
                      onClick={() => openEditModal(t)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Template Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> {editingId ? 'Edit' : 'Add'} Itinerary Template
            </DialogTitle>
            <DialogDescription>
              Create a reusable itinerary template to auto-fill quotations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-6 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Template Name *</Label>
              <Input required placeholder="e.g. 4D/3N - Darjeeling & Kalimpong" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold">Day-wise Details</Label>
                <Button type="button" variant="outline" size="sm" onClick={addDay} className="h-8">
                  <Plus className="h-3 w-3 mr-1" /> Add Day
                </Button>
              </div>
              
              {itinerary.map((day, idx) => (
                <div key={day.id || idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3 relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeDay(idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <div className="grid grid-cols-[80px_1fr] gap-3 items-start">
                    <div className="pt-2">
                      <span className="font-bold text-sm bg-primary/10 text-primary px-2 py-1 rounded">Day {idx + 1}</span>
                    </div>
                    <div className="space-y-3">
                      <Input 
                        placeholder="Day Title (e.g. Arrival & Transfer to Darjeeling)" 
                        value={day.title || ''} 
                        onChange={(e) => {
                          const newI = [...itinerary];
                          newI[idx].title = e.target.value;
                          setItinerary(newI);
                        }} 
                        className="font-medium"
                      />
                      <Textarea 
                        placeholder="Day Description..." 
                        value={day.description || ''} 
                        onChange={(e) => {
                          const newI = [...itinerary];
                          newI[idx].description = e.target.value;
                          setItinerary(newI);
                        }} 
                        className="min-h-[80px] text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="pt-4 sticky bottom-0 bg-white p-2 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold">Save Template</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center font-bold">Loading Templates...</div>}>
        <TemplatesHubContent />
      </Suspense>
    </DashboardLayout>
  );
}
