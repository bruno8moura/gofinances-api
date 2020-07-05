import parse from 'csv-parse/lib/sync';
import { promises } from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import CreateCategoryBatchService from './CreateCategoryBatchService';
import CreateTransactionBatchService from './CreateTransactionBatchService';

interface ImportedTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface Request {
  pathToFile: string;
}

class ImportTransactionsService {
  async execute({ pathToFile }: Request): Promise<Transaction[] | null> {
    const importedTransactionsBuffer = await promises.readFile(
      path.resolve(pathToFile),
    );

    const importedTransactions: ImportedTransaction[] = parse(
      importedTransactionsBuffer,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      },
    );

    const importedCategories = importedTransactions.map(row => ({
      title: row.category,
    }));

    const finalCategories = await new CreateCategoryBatchService().execute(
      importedCategories,
    );

    const toClient = await new CreateTransactionBatchService().execute(
      importedTransactions.map(({ title, type, value, category }) => ({
        title,
        type,
        value,
        category,
      })),
      finalCategories,
    );

    promises.unlink(pathToFile);
    return Promise.resolve(toClient);
  }
}

export default ImportTransactionsService;
