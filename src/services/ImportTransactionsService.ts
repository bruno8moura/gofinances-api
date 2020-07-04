import parse from 'csv-parse/lib/sync';
import { promises } from 'fs';
import path from 'path';
import { PrimaryColumn } from 'typeorm';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface ImportedTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(): Promise<Transaction[] | null> {
    const importedTransactions = await promises.readFile(
      path.resolve(__dirname, '..', '..', 'tmp', 'transactions.csv'),
    );

    const input = importedTransactions.toString('UTF-8');
    const records: ImportedTransaction[] = parse(input, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const createTransactionService = new CreateTransactionService();

    const transactions = records.map(async importedTransaction => {
      const { title, type, value, category } = importedTransaction;

      const transaction = await createTransactionService.execute({
        title,
        value,
        type,
        categoryTitle: category,
      });

      return transaction;
    });

    return Promise.all(transactions); // NÃO ESTÁ RETORNANDO O ARRAY COM AS TRANSACTIONS!!!
  }
}

export default ImportTransactionsService;
