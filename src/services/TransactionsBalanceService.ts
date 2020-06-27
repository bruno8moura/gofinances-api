import Balance from '../models/Balance';
import TransactionsRepository from '../repositories/TransactionsRepository';

class TransactionsBalanceService {
  private repository: TransactionsRepository;

  constructor(repository: TransactionsRepository) {
    this.repository = repository;
  }

  public execute(): Balance {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const transactions = this.repository.all();

    balance.income = transactions
      .filter(transaction => transaction.type === 'income')
      .map(transaction => transaction.value)
      .reduce((sum, currentValue) => sum + currentValue, 0);

    balance.outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(transaction => transaction.value)
      .reduce((sum, currentValue) => sum + currentValue, 0);

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsBalanceService;
