import React, { useState, useEffect } from 'react';
import { InventoryAPI } from '../lib/axios';
import Modal from '../components/Modal';
import ItemForm from '../components/ItemForm';

const InventoryList = () => {
  // data + UI state
  const [items, setItems]         = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  // modal/form state
  const [showForm, setShowForm]   = useState(false);
  const [formMode, setFormMode]   = useState('add');          // 'add' or 'edit'
  const [currentItem, setCurrentItem] = useState(null);

  // initial fetch
  useEffect(() => {
    (async () => {
      try {
        const res = await InventoryAPI.get('/items');
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load inventory.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // filtered view
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const onAdd = () => {
    setFormMode('add');
    setCurrentItem(null);
    setShowForm(true);
  };
  const onEdit = item => {
    setFormMode('edit');
    setCurrentItem(item);
    setShowForm(true);
  };
  const onDelete = async id => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await InventoryAPI.delete(`/items/${id}`);
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete item.');
    }
  };

  // after create/update success
  const handleSuccess = savedItem => {
    if (formMode === 'add') {
      setItems([savedItem, ...items]);
    } else {
      setItems(items.map(i => (i.id === savedItem.id ? savedItem : i)));
    }
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 dark:bg-gray-900 p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            📦 Inventory Items
          </h2>
          <button
            onClick={onAdd}
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            + New Item
          </button>
        </div>

        {/* Search + States */}
        <div className="p-6">
          <input
            type="text"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {loading && <p className="text-center">Loading inventory…</p>}
          {!loading && error && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-gray-500">No items found.</p>
          )}

          {/* Table for desktop */}
          {!loading && !error && filtered.length > 0 && (
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold border">ID</th>
                    <th className="px-6 py-3 text-left font-semibold border">Name</th>
                    <th className="px-6 py-3 text-left font-semibold border">SKU</th>
                    <th className="px-6 py-3 text-left font-semibold border">Qty</th>
                    <th className="px-6 py-3 text-right font-semibold border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 border">{item.id}</td>
                      <td className="px-6 py-4 border">{item.name}</td>
                      <td className="px-6 py-4 border">{item.sku}</td>
                      <td className="px-6 py-4 border">{item.quantity}</td>
                      <td className="px-6 py-4 border text-right space-x-2">
                        <button onClick={() => onEdit(item)}>✏️</button>
                        <button onClick={() => onDelete(item.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Cards for mobile */}
          {!loading && !error && filtered.length > 0 && (
            <div className="sm:hidden space-y-4">
              {filtered.map(item => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {item.name}
                    </h3>
                    <div className="space-x-2">
                      <button onClick={() => onEdit(item)}>✏️</button>
                      <button onClick={() => onDelete(item.id)}>🗑️</button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    SKU: {item.sku}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Quantity: {item.quantity}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal + Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <ItemForm
          mode={formMode}
          initialData={currentItem}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};

export default InventoryList;
