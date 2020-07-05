import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface ImportedTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionBatchService {
  public async execute(
    importedTransactions: ImportedTransaction[],
    categories: Category[],
  ): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const newTransactions = transactionsRepository.create(
      importedTransactions.map(({ title, value, category, type }) => ({
        title,
        value,
        type,
        category_id: categories.find(
          categoryFilter => categoryFilter.title === category,
        )?.id,
      })),
    );

    const savedTransactions = await transactionsRepository.save(
      newTransactions,
    );

    const transactions: Transaction[] = savedTransactions.map(
      ({ id, type, value, title, category_id, created_at, updated_at }) => ({
        id,
        title,
        type,
        value,
        category_id,
        category: categories.find(
          (categoryFilter: Category) => categoryFilter.id === category_id,
        ),
        created_at,
        updated_at,
      }),
    );

    return Promise.all(transactions);
  }
}

export default CreateTransactionBatchService;
