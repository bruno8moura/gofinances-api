// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne({ id });

    if (!transaction) {
      throw new AppError(
        'Is not possible delete the Transaction because it does not exit',
      );
    }

    await transactionsRepository
      .createQueryBuilder()
      .delete()
      .from(Transaction)
      .where('id = :id', { id })
      .execute();
  }
}

export default DeleteTransactionService;
