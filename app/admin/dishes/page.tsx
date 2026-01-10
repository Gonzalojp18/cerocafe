'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';

interface Dish {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  orden: number;
  inventario?: number;
  stockMinimo?: number;
}

interface Category {
  _id: string;
  nombre: string;
}

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    disponible: true,
    orden: 0,
    inventario: 0,
    stockMinimo: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [dishesRes, categoriesRes] = await Promise.all([
        fetch('/api/dishes'),
        fetch('/api/categories'),
      ]);
      const dishesData = await dishesRes.json();
      const categoriesData = await categoriesRes.json();
      setDishes(dishesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDish ? `/api/dishes/${editingDish._id}` : '/api/dishes';
      const method = editingDish ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({
          title: 'Success',
          description: `Dish ${editingDish ? 'updated' : 'created'} successfully`,
        });
        setDialogOpen(false);
        setEditingDish(null);
        setFormData({ nombre: '', descripcion: '', precio: 0, categoria: '', disponible: true, orden: 0, inventario: 0, stockMinimo: 10 });
        fetchData();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingDish ? 'update' : 'create'} dish`,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      nombre: dish.nombre,
      descripcion: dish.descripcion || '',
      precio: dish.precio,
      categoria: dish.categoria,
      disponible: dish.disponible,
      orden: dish.orden,
      inventario: dish.inventario || 0,
      stockMinimo: dish.stockMinimo || 10,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
      const res = await fetch(`/api/dishes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Dish deleted successfully',
        });
        fetchData();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete dish',
        variant: 'destructive',
      });
    }
  };

  const openAddDialog = () => {
    setEditingDish(null);
    setFormData({ nombre: '', descripcion: '', precio: 0, categoria: '', disponible: true, orden: 0, inventario: 0, stockMinimo: 10 });
    setDialogOpen(true);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dishes</h2>
        <Button onClick={openAddDialog} className="w-full sm:w-auto">Add Dish</Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search dishes by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dishes.filter(dish =>
            dish.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (dish.descripcion && dish.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
          ).map(dish => (
            <TableRow key={dish._id}>
              <TableCell className="font-medium">{dish.nombre}</TableCell>
              <TableCell>{dish.descripcion || '-'}</TableCell>
              <TableCell>${dish.precio}</TableCell>
              <TableCell>{dish.categoria}</TableCell>
              <TableCell>{dish.disponible ? 'Yes' : 'No'}</TableCell>
              <TableCell>{dish.orden}</TableCell>
              <TableCell className={dish.inventario && dish.stockMinimo && dish.inventario <= dish.stockMinimo ? 'text-red-600 font-bold' : ''}>
                {dish.inventario || 0}
              </TableCell>
              <TableCell>{dish.stockMinimo || 10}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(dish)} className="mr-2">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(dish._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDish ? 'Edit Dish' : 'Add Dish'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Name</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Description</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="precio">Price</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="categoria">Category</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category._id} value={category.nombre}>
                      {category.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="disponible"
                checked={formData.disponible}
                onCheckedChange={(checked) => setFormData({ ...formData, disponible: !!checked })}
              />
              <Label htmlFor="disponible">Available</Label>
            </div>
            <div>
              <Label htmlFor="orden">Order</Label>
              <Input
                id="orden"
                type="number"
                value={formData.orden}
                onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="inventario">Stock</Label>
              <Input
                id="inventario"
                type="number"
                value={formData.inventario}
                onChange={(e) => setFormData({ ...formData, inventario: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="stockMinimo">Stock Mínimo</Label>
              <Input
                id="stockMinimo"
                type="number"
                value={formData.stockMinimo}
                onChange={(e) => setFormData({ ...formData, stockMinimo: parseInt(e.target.value) })}
              />
            </div>
            <Button type="submit">{editingDish ? 'Update' : 'Create'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}