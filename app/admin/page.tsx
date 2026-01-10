import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="space-y-6">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/categories">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>View and manage menu categories</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Organize your dishes into categories</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/dishes">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Dishes</CardTitle>
              <CardDescription>Manage your menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Add, edit, and remove dishes</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}