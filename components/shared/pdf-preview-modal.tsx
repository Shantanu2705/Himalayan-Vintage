'use client';
import React from 'react';
import { createPortal } from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Share2, Download } from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentNo?: string;
  children: React.ReactNode;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  documentNo,
  children,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col p-0 overflow-hidden no-print">
          <div className="flex items-center justify-between border-b bg-muted/40 px-6 py-4">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <span>{title}</span>
                {documentNo && <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{documentNo}</span>}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Formatted for standard A4 printing and PDF export
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1.5 font-semibold">
                <Printer className="h-4 w-4" />
                Print / Save PDF
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-slate-100 dark:bg-slate-900 flex justify-center">
            <div className="w-full max-w-[210mm] min-h-[297mm] bg-white text-black p-8 shadow-xl rounded sm:p-12">
              {children}
            </div>
          </div>

          <DialogFooter className="border-t bg-muted/40 px-6 py-3 sm:justify-end">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button variant="default" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {mounted && isOpen && typeof document !== 'undefined' && createPortal(
        <div id="global-print-area" className="hidden print:block print:w-full print:bg-white print:text-black print:absolute print:left-0 print:top-0 print:m-0 print:p-0 print:overflow-visible print:z-[99999]">
          {children}
        </div>,
        document.body
      )}
    </>
  );
};
