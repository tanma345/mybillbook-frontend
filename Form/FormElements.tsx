import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CheckboxFive from '../../components/Checkboxes/CheckboxFive';
import CheckboxFour from '../../components/Checkboxes/CheckboxFour';
import CheckboxOne from '../../components/Checkboxes/CheckboxOne';
import CheckboxThree from '../../components/Checkboxes/CheckboxThree';
import CheckboxTwo from '../../components/Checkboxes/CheckboxTwo';
import SwitcherFour from '../../components/Switchers/SwitcherFour';
import SwitcherOne from '../../components/Switchers/SwitcherOne';
import SwitcherThree from '../../components/Switchers/SwitcherThree';
import SwitcherTwo from '../../components/Switchers/SwitcherTwo';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import DatePickerTwo from '../../components/Forms/DatePicker/DatePickerTwo';
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';
import MultiSelect from '../../components/Forms/MultiSelect';
import Transactiontable from './Transactiontable';
import CreateParty from './CreateParty';
import TotalTransactions from './TotalTransactions';
import { useState } from 'react';

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
        setTransactions={setTransactions}
      />
    </>
  );
};

export default FormElements;
