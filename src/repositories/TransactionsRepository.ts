import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionData {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    // TODO
  }

  public getBalance(): Balance {
    // TODO
  }

  public create(data: TransactionData): Transaction {
    const newTransaction = new Transaction({ ...data });
    this.transactions.push(newTransaction);
    return newTransaction;
  }
}

export default TransactionsRepository;
