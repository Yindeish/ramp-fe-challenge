import { useCallback, useEffect, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"
import { Transaction } from "src/utils/types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch();
  const [sortedTransactions, setSortedTransactions] = useState<Partial<Transaction[]>>([]);

  useEffect(() => {
    transactions && setSortedTransactions(transactions);
  }, [transactions])

  
  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  const approveTransaction = (transactionId: number | string): void => {
    let helperArr: Partial<Transaction[]> = sortedTransactions?.map(transaction => {
      if (transaction?.id === transactionId) {
        return {
          ...transaction,
          approved: transaction?.approved ? false : true
        }
       
      }
      else return {
        ...transaction
      }
    }) as Transaction[];

    setSortedTransactions(helperArr);
  }

  return (
    <div data-testid="transaction-container">
      {sortedTransactions?.map((transaction) => (
        <TransactionPane
          key={transaction?.id}
          transactionId={transaction?.id as string}
          transaction={transaction as Transaction}
          loading={loading}
          onApproveTransaction={approveTransaction}
        />
      ))}
    </div>
  )
}
