// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
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
    const category = await this.categoryRepository.findOne({
      where: { title: categoryTitle },
    });
    console.log(category);

    if (!category) {
      const newCategory = this.categoryRepository.create({
        title: categoryTitle,
      });
      console.log(category, newCategory);
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
      title,
      value,
      type,
      category_id: category.id,
    });

    await this.transactionRepository.save(newTransaction);
    newTransaction.category = category;
    return newTransaction;
  }
}

export default CreateTransactionService;
