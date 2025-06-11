
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ProductDialog from './ProductDialog';
import { useProducts } from '@/hooks/useProducts';

const ProductMaster = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Master</h1>
          <p className="text-gray-600">Manage robot products and specifications</p>
        </div>
        <Button onClick={() => { setSelectedProduct(null); setShowDialog(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Robot</th>
                  <th className="text-left p-3">Controller</th>
                  <th className="text-left p-3">Reach</th>
                  <th className="text-left p-3">Payload</th>
                  <th className="text-left p-3">Brand</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{product.robot}</td>
                    <td className="p-3">{product.controller}</td>
                    <td className="p-3">{product.reach}mm</td>
                    <td className="p-3">{product.payload}kg</td>
                    <td className="p-3">{product.brand}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => { setSelectedProduct(product); setShowDialog(true); }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ProductDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        product={selectedProduct}
        onSave={(productData) => {
          if (selectedProduct) {
            updateProduct(selectedProduct.id, productData);
          } else {
            addProduct(productData);
          }
          setShowDialog(false);
        }}
      />
    </div>
  );
};

export default ProductMaster;
