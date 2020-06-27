import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import ListTransactionsService from '../services/ListTransactionsService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const listTransactionsService = new ListTransactionsService(
      transactionsRepository,
    );
    return response.status(200).json(listTransactionsService.execute()).end();
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    console.log(request.body);
    const { title, value, type } = request.body;

    const createTransactionService = new CreateTransactionService(
      transactionsRepository,
    );
    const newTransaction = createTransactionService.execute({
      title,
      value,
      type,
    });

    return response.status(201).json(newTransaction).end();
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
