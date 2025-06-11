
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import SparePartsDialog from './SparePartsDialog';
import { useSpareParts } from '@/hooks/useSpareParts';

const SparePartsMaster = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSparePart, setSelectedSparePart] = useState(null);
  const { spareParts, addSparePart, updateSparePart, deleteSparePart } = useSpareParts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spare Parts Master</h1>
          <p className="text-gray-600">Manage spare parts and inventory</p>
        </div>
        <Button onClick={() => { setSelectedSparePart(null); setShowDialog(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Spare Part
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spare Parts ({spareParts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Part Number</th>
                  <th className="text-left p-3">Brand</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {spareParts.map((sparePart) => (
                  <tr key={sparePart.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{sparePart.name}</td>
                    <td className="p-3">{sparePart.partNumber}</td>
                    <td className="p-3">{sparePart.brand}</td>
                    <td className="p-3">{sparePart.category}</td>
                    <td className="p-3">${sparePart.price}</td>
                    <td className="p-3">{sparePart.stock}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => { setSelectedSparePart(sparePart); setShowDialog(true); }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteSparePart(sparePart.id)}
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

      <SparePartsDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        sparePart={selectedSparePart}
        onSave={(sparePartData) => {
          if (selectedSparePart) {
            updateSparePart(selectedSparePart.id, sparePartData);
          } else {
            addSparePart(sparePartData);
          }
          setShowDialog(false);
        }}
      />
    </div>
  );
};

export default SparePartsMaster;
