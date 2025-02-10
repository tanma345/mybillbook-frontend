import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
{
  /*import SelectGroupOne from '../../components/Forms/SelectGroup/SelectGroupOne';*/
}

const FormLayout = () => {
  const [partyType, setPartyType] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState('');
  const [partyCategory, setPartyCategory] = useState('');
  const [categories, setCategories] = useState(['Retail', 'Wholesale']);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [partyName, setPartyName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [balanceType, setBalanceType] = useState('to-collect'); // Default selection
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiFetched, setApiFetched] = useState(false);

  // Handle category selection
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'create') {
      setIsCreatingCategory(true); // Show popup
      setPartyCategory('');
    } else {
      setPartyCategory(value);
    }
  };

  // Handle creating a new category
  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setPartyCategory(newCategory.trim());
      setNewCategory('');
      setIsCreatingCategory(false);
    } else {
      alert('Please enter a valid category.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!partyType) {
      setShowError('Party Type is required');
      return;
    }
    setError('');
    // Proceed with form submission
  };

  const handleSameAsBilling = () => {
    setSameAsBilling(!sameAsBilling);
    if (!sameAsBilling) {
      setShippingAddress(billingAddress);
    } else {
      setShippingAddress('');
    }
  };
     
  useEffect(() => {
    if (gstin.length === 15 && /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstin)) {
      fetchGSTDetails();
    } else {
      setPartyName("");
      setBillingAddress("");
      setShippingAddress("");
      setError("");
    }
  }, [gstin]);

  const fetchGSTDetails = async () => {
    if (!gstin) {
      alert("Please enter a valid GSTIN number.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log(`Requesting GST details for GSTIN: ${gstin}`);
      const response = await axios.get(
        `http://192.168.1.40:8000/fetch-gst/${gstin}/`,
      ); // Replace with your actual API

      if (response.data) {
        const { name, billing_address, shipping_address } = response.data;

        setPartyName(name || '');
        setBillingAddress(billing_address || '');
        setShippingAddress(sameAsBilling ? billing_address : shipping_address);
        setApiFetched(true);
      } else {
        setError('No details found for this GSTIN.');
      }
    } catch (err) {
      console.error('Error fetching GST details:', err);
      setError('Failed to fetch GST details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Create Party" />

      <div className="w-full flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              General Details
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Party name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    disabled={apiFetched}
                    required
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    pattern="[6-9]{1}[0-9]{9}"
                    title="Please enter a valid 10-digit mobile number starting with 6-9"
                    required
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Opening Balance
                </label>
                <div className="flex gap-2">
                  {/* Opening Balance Input */}
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-8 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Dropdown for "To Collect / To Pay" */}
                  <select
                    className="w-1/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={balanceType}
                    onChange={(e) => setBalanceType(e.target.value)}
                  >
                    <option value="to-collect">To Collect</option>
                    <option value="to-pay">To Pay</option>
                  </select>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  GSTIN <span className="text-meta-1">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter GSTIN"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={fetchGSTDetails}
                    disabled={loading}
                  >
                    {loading ? 'Fetching...' : 'Check Details'}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  PAN Number
                </label>
                <input
                  type="text"
                  placeholder="Enter PAN Number"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Party Type <span className="text-meta-1">*</span>
                </label>
                <select
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={partyType}
                  onChange={(e) => setPartyType(e.target.value)}
                  required
                >
                  <option value="">Select Party Type</option>
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                </select>
                {showError && (
                  <p className="text-red-500 text-sm mt-1">{showError}</p>
                )}
              </div>

              {/* Party Category */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Party Category
                </label>
                <select
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={partyCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="create">Create Category</option>
                </select>
              </div>

              {/* Popup Modal for Creating Category */}
              {isCreatingCategory && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-xl font-bold mb-2">
                      Create a New Category
                    </h3>
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

              {/* New Section Heading */}
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark mb-6 mt-6">
                <h3 className="font-medium text-black dark:text-white">
                  Additional Information
                </h3>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {/* Billing Address */}
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Billing Address
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter Billing Address"
                    value={billingAddress}
                    onChange={(e) => {
                      setBillingAddress(e.target.value);
                      if (sameAsBilling) {
                        setShippingAddress(e.target.value);
                      }
                    }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>

                {/* Shipping Address */}
                <div className="w-full xl:w-1/2">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-black dark:text-white">
                      Shipping Address
                    </label>
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={handleSameAsBilling}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-black dark:text-white">
                      Same as Billing Address
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter Shipping Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    disabled={sameAsBilling}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>

              <div className="border-b border-stroke py-0.5 px-6.5 dark:border-strokedark mb-6"></div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Credit Period (in days)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Credit Period"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Credit Limit
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-8 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/*<SelectGroupOne />*/}

              {/*<div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Type your message"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>*/}

              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormLayout;
