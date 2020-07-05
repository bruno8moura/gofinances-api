import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}
class CreateTransactionService {
  categoryRepository = getRepository(Category);

  transactionsRepository = getCustomRepository(TransactionsRepository);

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

    const balance = await this.transactionsRepository.getBalance();
    if (type === 'outcome' && balance.total - value <= 0) {
      throw new AppError(
        `It not possible to create an outcome transaction with an invalid balance. ${type}-${value}`,
      );
    }

    const category = await this.categoryRepository.findOne({
      where: { title: categoryTitle.trim() },
    });

    if (!category) {
      const newCategory = await this.categoryRepository.save(
        this.categoryRepository.create({
          title: categoryTitle,
        }),
      );

      const transactionCreated = await this.createTransaction(
        title,
        value,
        type,
        newCategory,
      );

      return transactionCreated;
    }

    const transctionCreated = await this.createTransaction(
      title,
      value,
      type,
      category,
    );
    return transctionCreated;
  }

  private async createTransaction(
    title: string,
    value: number,
    type: 'income' | 'outcome',
    category: Category,
  ): Promise<Transaction> {
    const newTransaction = await this.transactionsRepository.save(
      this.transactionsRepository.create({
        title,
        value,
        type,
        category_id: category.id,
        category,
      }),
    );

    return newTransaction;
  }
}

export default CreateTransactionService;
