import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    balance.total = balance.income - balance.outcome;

    return balance;
  }

  // public getBalance(): Balance {
  //   let income = 0;
  //   let outcome = 0;
  //   let total = 0;

  //   if (!this.transactions || this.transactions.length === 0) {
  //     return { income, outcome, total };
  //   }

  //   income = this.transactions
  //     .map(transaction => {
  //       if (transaction.type === 'income') {
  //         return transaction.value;
  //       }
  //       return 0;
  //     })
  //     .reduce((v1, v2) => {
  //       return v1 + v2;
  //     });

  //   outcome = this.transactions
  //     .map(transaction => {
  //       if (transaction.type === 'outcome') {
  //         return transaction.value;
  //       }
  //       return 0;
  //     })
  //     .reduce((v1, v2) => {
  //       return v1 + v2;
  //     });

  //   total = income - outcome;

  //   const balance = { income, outcome, total };

  //   return balance;
  // }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (type === 'outcome') {
      const balance = this.getBalance();

      if (value > balance.total) {
        throw new Error('There is not enough balance for this transaction.');
      }
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
