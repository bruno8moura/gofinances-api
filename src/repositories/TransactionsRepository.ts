import { EntityRepository, Repository, createQueryBuilder } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const balance = allTransactions.reduce(
      (accumulator: Balance, currentValue: Transaction) => {
        if (currentValue.type === 'income') {
          accumulator.income += currentValue.value;
          return accumulator;
        }

        if (currentValue.type === 'outcome') {
          accumulator.outcome += currentValue.value;
          return accumulator;
        }
        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    const { income, outcome } = balance;
    balance.total = income - outcome;

    return Promise.resolve(balance);
  }

  public async all(): Promise<Transaction[]> {
    const allTransactions = await createQueryBuilder(Transaction)
      .select([
        'Transaction.id',
        'Transaction.title',
        'Transaction.value',
        'Category.id',
        'Category.title',
        'Category.created_at',
        'Category.updated_at',
        'Transaction.created_at',
        'Transaction.updated_at',
      ])
      .innerJoinAndSelect('Transaction.category', 'category')
      .getMany();
    console.log(allTransactions);

    return Promise.resolve(allTransactions);
  }
}

export default TransactionsRepository;
