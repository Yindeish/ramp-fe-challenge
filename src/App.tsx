import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee, Transaction } from "./utils/types"

export function App() {
  const { data: employees, emp, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, transacts, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  const [sortedItems, setSortedItems] = useState<Partial<Transaction[]>>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'individual'>('all');
  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);
  const [selectedItems] = useState<Partial<Transaction[]>>([]);
  const { data: allEmployees, fetchById } = useTransactionsByEmployee();

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    // transactionsByEmployeeUtils.invalidateData()

    await employeeUtils.fetchAll()
    
    await paginatedTransactionsUtils.fetchAll()

    setIsLoading(false)
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }

  }, [employeeUtils.loading, employees, loadAllTransactions])

  const fetchAllEmployees = async () => {
    await loadAllTransactions()
  }

  useEffect(() => {
    setSortedItems(transactions as Transaction[]);
  }, [transactions, sortedItems])

  const toggleMenu = () => {
    const visibility = !menuIsVisible;
    setMenuIsVisible(visibility);
  }

  const selectAllItems = () => {
    setFilterStatus("all");
    setSortedItems(transactions as Transaction[])
  }

  const selectItem = (itemId: string) => {
    setFilterStatus('individual');
    sortedItems?.map(item => {
      if (item?.id == itemId) {
        selectedItems.push(item);
        sortedItems.filter(item => item?.id !== itemId);
      }
    })
    setSortedItems(selectedItems);
  }

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <div>
          <div style={{ margin: '1em 0px', cursor: 'pointer' }} onClick={() => toggleMenu()}>Filter By Employee</div>
          
          {
            menuIsVisible && (<>
            <div style={{ width: 'fi-content', height: 'fit-content', margin: 'auto', display: 'flex', gap: '1em' }}>

            <div onClick={() => selectAllItems()} style={{ width: 'fit-content', height: 'fit-content', display: 'inline-block', padding: '0.5em', backgroundColor: filterStatus == 'all' ? 'grey' : 'lightgrey', color: 'white', borderRadius: '1em', cursor: 'pointer' }}>All Employees</div>
            
            </div>
            
            <div style={{ margin: '1em 0px', width: '30em', height: '15vh', backgroundColor: 'white', border: '1px solid black', display: 'flex', flexDirection: 'column', gap: '0.3em', overflowY: 'scroll', padding: '0.3em'}}>
              {sortedItems?.map(item => (
                <div key={item?.id} style={{ cursor: 'pointer', background: 'lightgrey' }} onClick={() => selectItem(item?.id as string)}>{item?.employee.firstName} { item?.employee.lastName }</div>
              ))}
            </div>
            </>)
          }
        </div>

        <div className="RampBreak--l" />

        <div className="RampGrid">
          {filterStatus == 'all' && <Transactions transactions={sortedItems as Transaction[]} />}
          {/* Render based on items in the dropdown */}
          { filterStatus == 'individual' && <Transactions transactions={selectedItems as Transaction[]} />}

          {transactions !== null && (
            <button
              className="RampButton"
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                // await loadAllTransactions()
                fetchAllEmployees();
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
