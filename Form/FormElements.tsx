//import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
//import CheckboxFive from '../../components/Checkboxes/CheckboxFive';
//import CheckboxFour from '../../components/Checkboxes/CheckboxFour';
//import CheckboxOne from '../../components/Checkboxes/CheckboxOne';
//import CheckboxThree from '../../components/Checkboxes/CheckboxThree';
//import CheckboxTwo from '../../components/Checkboxes/CheckboxTwo';
//import SwitcherFour from '../../components/Switchers/SwitcherFour';
//import SwitcherOne from '../../components/Switchers/SwitcherOne';
//import SwitcherThree from '../../components/Switchers/SwitcherThree';
//import SwitcherTwo from '../../components/Switchers/SwitcherTwo';
//import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
//import DatePickerTwo from '../../components/Forms/DatePicker/DatePickerTwo';
//import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';
//import MultiSelect from '../../components/Forms/MultiSelect';
import Transactiontable from './Transactiontable';
import CreateParty from './CreateParty';
import TotalTransactions from './TotalTransactions';
import { useState, useEffect } from 'react';
import axios from 'axios';

const FormElements = () => {
  const [transactions, setTransactions] = useState([
    {
      partyName: 'John Doe',
      category: 'service',
      MobileNumber: '7985191516',
      partytype: 'customer',
      amount: 5000,
    },
    {
      partyName: 'Jane Smith',
      category: 'product',
      MobileNumber: '7985191517',
      partytype: 'supplier',
      amount: 3000,
    },
    {
      partyName: 'Emily Johnson',
      category: 'service',
      MobileNumber: '7985191518',
      partytype: 'customer',
      amount: 7000,
    },
    {
      partyName: 'Emily Johnson',
      category: 'service',
      MobileNumber: '7985191518',
      partytype: 'customer',
      amount: 6000,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch transactions from API on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          'http://192.168.1.40:8000/sales/parties/'
        );
  
        console.log('Full API Response:', response); // Debugging
        console.log('Response Data:', response.data); // Debugging
  
        let transactionsArray = [];
  
        // Check if response.data is an object with a `results` array
        if (Array.isArray(response.data.results)) {
          transactionsArray = response.data.results;
        } 
        // If response.data is directly an array
        else if (Array.isArray(response.data)) {
          transactionsArray = response.data;
        } 
        else {
          setError('Unexpected response format');
          setLoading(false);
          return;
        }
  
        const formattedData = transactionsArray.map(async (txn) => {
          // If txn.category is just an id, you can fetch category details here
          let categoryName = 'N/A';
          if (txn.category) {
            // Fetch the category name (you may need to adjust the API path)
            try {
              const categoryResponse = await axios.get(
                `http://192.168.1.40:8000/sales/categories/${txn.category}/`
              );
              categoryName = categoryResponse.data.name || 'N/A';
            } catch (err) {
              console.error('Error fetching category name:', err);
              categoryName = 'Error fetching category';
            }
          }
  
          return {
            partyName: txn.party_name || 'N/A',
            category: categoryName, // Ensure category is the name
            MobileNumber: txn.mobile_number || 'N/A',
            partytype: txn.party_type || 'N/A',
            amount: txn.opening_balance || 0, // Fix incorrect key Amount
          };
        });
  
        // Wait for all async category fetches to finish
        const resolvedData = await Promise.all(formattedData);
        setTransactions(resolvedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch transactions. Please try again.');
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, []);

  const allParties = transactions.length;
  const totalToCollect = transactions
    .filter((txn) => txn.amount > 0)
    .reduce((sum, txn) => sum + txn.amount, 0);
  const totalToPay = transactions
    .filter((txn) => txn.amount < 0)
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

  return (
    <>
      <h4 className="text-2xl font-bold mb-4">Parties</h4>
      <TotalTransactions
        totalParties={allParties}
        totalToCollect={totalToCollect}
        totalToPay={totalToPay}
      />
      <CreateParty />
      <Transactiontable
        transactions={transactions}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default FormElements;
