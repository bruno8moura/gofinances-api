import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.all();
  const balance = await transactionRepository.getBalance();

  return response.status(200).json({ transactions, balance }).end();
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  console.log(title, value, type, category);

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
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
