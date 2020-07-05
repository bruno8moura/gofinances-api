import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload.config';

const transactionsRouter = Router();
const upload = multer(uploadConfig.multerOptions);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.all();
  const balance = await transactionRepository.getBalance();

  return response.status(200).json({ transactions, balance }).end();
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const newTransaction = await new CreateTransactionService().execute({
    title,
    value,
    type,
    categoryTitle: category,
  });

  delete newTransaction.category_id;
  return response.status(201).json(newTransaction).end();
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const service = new DeleteTransactionService();
  await service.execute({ id });

  return response.status(204).json().end();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const {
      file: { path },
    } = request;

    const newTransactions = await new ImportTransactionsService().execute({
      pathToFile: path,
    });

    const toClient = newTransactions?.map(transaction => {
      const {
        id,
        title,
        value,
        created_at,
        updated_at,
        category,
      } = transaction;

      return { id, title, value, created_at, updated_at, category };
    });

    return response.json(toClient).end();
  },
);

export default transactionsRouter;
