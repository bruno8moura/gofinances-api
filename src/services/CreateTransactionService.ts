import { uuid } from 'uuidv4';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}
class CreateTransactionService {
  categoryRepository = getRepository(Category);

  transactionRepository = getRepository(Transaction);

  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const typesSupported = ['income', 'outcome'];
    if (!typesSupported.includes(type)) {
      throw new AppError(
        `The type '${type}' is not supported. The types allowed are ${typesSupported.join(
          ', ',
        )}.`,
      );
    }

    const category = await this.categoryRepository.findOne({
      where: { title: categoryTitle },
    });

    if (!category) {
      const newCategory = this.categoryRepository.create({
        id: uuid(),
        title: categoryTitle,
      });
      await this.categoryRepository.save(newCategory);
      return this.createTransaction(title, value, type, newCategory);
    }

    return this.createTransaction(title, value, type, category);
  }

  private async createTransaction(
    title: string,
    value: number,
    type: 'income' | 'outcome',
    category: Category,
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create({
      id: uuid(),
      title,
      value,
      type,
      category_id: category.id,
    });

    await this.transactionRepository.save(newTransaction);
    newTransaction.category = category;
    console.log(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
