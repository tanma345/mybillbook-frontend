import React, { useState } from 'react';

const CategoryDropdown = ({ categories, setCategories, selectedCategory, setSelectedCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Handle category selection
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'create') {
      setIsModalOpen(true); // Open popup modal
      setSelectedCategory('');
    } else {
      setSelectedCategory(value);
    }
  };

  // Handle new category creation
  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setSelectedCategory(newCategory.trim());
      setNewCategory('');
      setIsModalOpen(false); // Close modal
    } else {
      alert('Please enter a valid category.');
    }
  };

  return (
    <div>
      {/* Category Dropdown */}
      <div className="mb-4.5">
        <label className="mb-2.5 block text-black dark:text-white">Category</label>
        <select
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
          <option value="create">Create Category</option>
        </select>
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-2 text-black dark:text-white">Create a New Category</h3>
            <form onSubmit={handleCreateCategory} className="flex flex-col space-y-3">
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Enter new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;