
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { Product } from '@/hooks/useProducts';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave: (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
}

const ProductDialog = ({ open, onOpenChange, product, onSave }: ProductDialogProps) => {
  const [formData, setFormData] = useState({
    robot: '',
    controller: '',
    reach: 0,
    payload: 0,
    brand: '',
  });

  const [image, setImage] = useState<File[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        robot: product.robot,
        controller: product.controller,
        reach: product.reach,
        payload: product.payload,
        brand: product.brand,
      });
      setImage(product.image ? [product.image as File] : []);
    } else {
      setFormData({
        robot: '',
        controller: '',
        reach: 0,
        payload: 0,
        brand: '',
      });
      setImage([]);
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, image: image[0] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="robot">Robot</Label>
              <Input
                id="robot"
                value={formData.robot}
                onChange={(e) => setFormData({ ...formData, robot: e.target.value })}
                placeholder="R-2000iA/100P"
                required
              />
            </div>
            <div>
              <Label htmlFor="controller">Controller</Label>
              <Input
                id="controller"
                value={formData.controller}
                onChange={(e) => setFormData({ ...formData, controller: e.target.value })}
                placeholder="RJ3iB"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reach">Reach (mm)</Label>
              <Input
                id="reach"
                type="number"
                value={formData.reach}
                onChange={(e) => setFormData({ ...formData, reach: Number(e.target.value) })}
                placeholder="3500"
                required
              />
            </div>
            <div>
              <Label htmlFor="payload">Payload (kg)</Label>
              <Input
                id="payload"
                type="number"
                value={formData.payload}
                onChange={(e) => setFormData({ ...formData, payload: Number(e.target.value) })}
                placeholder="100"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="Fanuc"
              required
            />
          </div>

          <FileUpload
            files={image}
            onFilesChange={setImage}
            label="Product Image"
            maxFiles={1}
            acceptedTypes=".jpg,.jpeg,.png,.gif"
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
