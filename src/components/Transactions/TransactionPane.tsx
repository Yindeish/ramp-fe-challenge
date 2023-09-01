import { useEffect, useState } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"
export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  onApproveTransaction,
  transactionId
}) => {
  const [approved, setApproved] = useState(transaction.approved)

  useEffect(() => {
    setApproved(transaction.approved)
  }, [transaction.approved])

  return (
    <div className="RampPane" onClick={() => onApproveTransaction(transactionId)}>
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={() => {}}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
