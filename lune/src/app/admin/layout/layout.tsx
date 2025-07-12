// app/admin/layout.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <ThemeProvider attribute="class">
          {/* اینجا Toaster را قرار دهید */}
          <Toaster position="top-right" richColors closeButton />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
