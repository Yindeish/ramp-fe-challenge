import { FunctionComponent } from "react"
import { Transaction } from "../../utils/types"

export type SetTransactionApprovalFunction = (params: {
  transactionId: string
  newValue: boolean
}) => Promise<void>

type TransactionsProps = { transactions: Transaction[] | null }

type TransactionPaneProps = {
  transaction: Transaction
  loading: boolean
  approved?: boolean
  onApproveTransaction: (id: number | string) => void,
  transactionId: number | string
}

export type TransactionsComponent = FunctionComponent<TransactionsProps>
export type TransactionPaneComponent = FunctionComponent<TransactionPaneProps>
