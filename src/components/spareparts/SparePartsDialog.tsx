
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { SparePart } from '@/hooks/useSpareParts';

interface SparePartsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sparePart?: SparePart | null;
  onSave: (sparePartData: Omit<SparePart, 'id' | 'created_at' | 'updated_at'>) => void;
}

const SparePartsDialog = ({ open, onOpenChange, sparePart, onSave }: SparePartsDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    description: '',
    brand: '',
    price: 0,
    stock: 0,
    category: '',
  });

  const [image, setImage] = useState<File[]>([]);

  useEffect(() => {
    if (sparePart) {
      setFormData({
        name: sparePart.name,
        partNumber: sparePart.partNumber,
        description: sparePart.description,
        brand: sparePart.brand,
        price: sparePart.price,
        stock: sparePart.stock,
        category: sparePart.category,
      });
      setImage(sparePart.image ? [sparePart.image as File] : []);
    } else {
      setFormData({
        name: '',
        partNumber: '',
        description: '',
        brand: '',
        price: 0,
        stock: 0,
        category: '',
      });
      setImage([]);
    }
  }, [sparePart, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, image: image[0] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{sparePart ? 'Edit Spare Part' : 'Add New Spare Part'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="partNumber">Part Number</Label>
              <Input
                id="partNumber"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <FileUpload
            files={image}
            onFilesChange={setImage}
            label="Spare Part Image"
            maxFiles={1}
            acceptedTypes=".jpg,.jpeg,.png,.gif"
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {sparePart ? 'Update Spare Part' : 'Add Spare Part'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SparePartsDialog;
