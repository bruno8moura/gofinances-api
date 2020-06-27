import Balance from '../models/Balance';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class TransactionsBalanceService {
  private repository: TransactionsRepository;

  constructor(repository: TransactionsRepository) {
    this.repository = repository;
  }

  public execute(): Balance {
    const transactions = this.repository.all();

    const balance = transactions.reduce(
      (accumulator: Balance, currentValue: Transaction) => {
        if (currentValue.type === 'income')
          accumulator.income += currentValue.value;

        if (currentValue.type === 'outcome')
          accumulator.outcome += currentValue.value;

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsBalanceService;
