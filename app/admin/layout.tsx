import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Menu
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="flex flex-wrap justify-center sm:justify-end space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">Dashboard</Link>
              <Link href="/caja" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">Club</Link>
              <Link href="/admin/categories" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">Categories</Link>
              <Link href="/admin/dishes" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">Dishes</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}