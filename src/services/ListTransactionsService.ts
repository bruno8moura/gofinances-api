import TransactionsRepository from '../repositories/TransactionsRepository';
import TransactionsBalance from '../models/TransactionsBalance';
import TransactionsBalanceService from './TransactionsBalanceService';

class ListTransactionsService {
  private repository: TransactionsRepository;

  constructor(repository: TransactionsRepository) {
    this.repository = repository;
  }

  public execute(): TransactionsBalance {
    const transactions = this.repository.all();
    const balance = new TransactionsBalanceService(this.repository).execute();

    return {
      transactions,
      balance,
    };
  }
}

export default ListTransactionsService;
