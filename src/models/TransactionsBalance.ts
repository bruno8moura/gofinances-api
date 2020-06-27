import Transaction from './Transaction';
import Balance from './Balance';

class TransactionsBalance {
  transactions: Transaction[];

  balance: Balance;

  constructor(transactions: Transaction[], balance: Balance) {
    this.transactions = transactions;
    this.balance = balance;
  }
}

export default TransactionsBalance;
