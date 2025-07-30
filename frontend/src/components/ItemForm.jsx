import React, { useState, useEffect } from 'react';
import { InventoryAPI } from '../lib/axios';

export default function ItemForm({ mode, initialData, onSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState('');

  // when editing, seed the form
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setName(initialData.name);
      setSku(initialData.sku);
      setQuantity(initialData.quantity);
    }
  }, [mode, initialData]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let res;
      if (mode === 'add') {
        res = await InventoryAPI.post('/items', { name, sku, quantity });
      } else {
        res = await InventoryAPI.put(`/items/${initialData.id}`, { name, sku, quantity });
      }
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to save item. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {mode === 'add' ? 'Add New Item' : 'Edit Item'}
      </h3>
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">SKU</label>
        <input
          type="text"
          value={sku}
          onChange={e => setSku(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {mode === 'add' ? 'Create' : 'Update'}
        </button>
      </div>
    </form>
  );
}
