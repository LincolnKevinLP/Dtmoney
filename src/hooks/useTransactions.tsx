import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { api } from '../services/api';

interface Transaction {
    id: number,
    title: string,
    amount: number,
    type: string,
    category: string,
    createdAt: string
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}
// 3 maneiras de selecinar as variaveis do input 

//interface TransactionInput{
//    title: string,
//    amount: number,
//    type: string,
//    category: string
//}

//type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>;

interface TransactionsProviderProps {
    children: ReactNode;
}

const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
    );

export function TransactionsProvider({children} : TransactionsProviderProps){
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get('transactions') // pegar informaçoes do banco de dados
        .then(response =>setTransactions(response.data.transactions))
    }, []);

     async function createTransaction(transactionInput: TransactionInput){
      
       const response =  await api.post('/transactions', { // post é mandar as informçaoes para o banco de dados
           ...transactionInput,
           createdAt: new Date(),
       })
       const { transaction } = response.data;

       setTransactions([ // aqui está setando os valores
           ...transactions, // aqui está pegando todos os modelos da interface Transaction
           transaction // adiciona todas as informaçoes do TransactionInput + a data
       ]);
    }

   return (
       <TransactionsContext.Provider value={{transactions, createTransaction}}>
           {children}
       </TransactionsContext.Provider>
   );
}

export function useTransactions(){
    const context = useContext(TransactionsContext);

    return context
    
}