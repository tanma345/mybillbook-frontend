import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
}

const TransactionTable = ({ transactions, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] =  useState<Category[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [partyCategory, setPartyCategory] = useState<string | number>('');
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState('');

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.partyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? transaction.category === selectedCategory : true)
    );
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://192.168.1.40:8000/sales/categories/'); // Replace with actual API
      const data: Category[] = await response.json();
      console.log(data);
      if (data && Array.isArray(data.results)) {
        setCategories(data.results); // Update categories with the results array
      } else {
        throw new Error('Invalid data format');
      } // Assuming API returns an array of categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === 'create') {
      setIsCreatingCategory(true);
      setPartyCategory('');
    } else {
      setPartyCategory(Number(value));
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Prevent page refresh immediately
  
    if (!newCategory.trim()) {
      alert('Please enter a valid category.');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.1.40:8000/sales/categories/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
  
      const data = await response.json();
      console.log('Response from API:', data); // Debugging
  
      if (response.ok) {
        setNewCategory('');
        setIsCreatingCategory(false);
        await fetchCategories(); // ✅ Re-fetch categories from API to update dropdown
      } else {
        console.error('Error adding category:', data);
        alert('Error adding category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add category.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Parties Details</h2>
        <div className="relative w-1/3">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by Party Name..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* 📌 Category Dropdown */}
        <div className="relative w-1/3">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={partyCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {Array.isArray(categories) && categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value="create">Create Category</option>
          </select>
        </div>
      </div>

      {/* Popup Modal for Creating Category */}
      {isCreatingCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-2">Create a New Category</h3>
            <form
              onSubmit={handleCreateCategory}
              className="flex flex-col space-y-3"
            >
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-lg w-full"
                placeholder="Enter new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={() => setIsCreatingCategory(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto mb-4">
        {loading ? (
          <p className="text-center text-lg">Loading transactions...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border px-4 py-2">Party Name</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Mobile Number</th>
                <th className="border px-4 py-2">Party Type</th>
                <th className="border px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/*{transactions.map((txn, index) => (
              <tr key={index} className="hover:bg-gray-200 text-left">
                <td className="border px-4 py-2">{txn.partyName}</td>
                <td className="border px-4 py-2">{txn.category}</td>
                <td className="border px-4 py-2">{txn.MobileNumber}</td>
                <td className="border px-4 py-2">{txn.partytype}</td>
                <td
                  className={`border px-4 py-2 ${
                    txn.amount < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  ₹{txn.amount}
                </td>
              </tr>
            ))}*/}
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn, index) => (
                  <tr key={index} className="hover:bg-gray-200 text-left">
                    <td className="border px-4 py-2">{txn.partyName}</td>
                    <td className="border px-4 py-2">{txn.category}</td>
                    <td className="border px-4 py-2">{txn.MobileNumber}</td>
                    <td className="border px-4 py-2">{txn.partytype}</td>
                    <td
                      className={`border px-4 py-2 ${
                        txn.Amount < 0 ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      ₹{txn.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2 text-center" colSpan="5">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Form to Add Transactions */}
    </div>
  );
};

export default TransactionTable;
