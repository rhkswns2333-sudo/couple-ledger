import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getMonthKey } from '../utils/formatters'

export function useBudgets(monthKey = getMonthKey()) {
  const [budgets, setBudgets] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'budgets', monthKey), snap => {
      setBudgets(snap.exists() ? snap.data() : {})
      setLoading(false)
    })
    return unsub
  }, [monthKey])

  async function saveBudget(category, amount) {
    await setDoc(doc(db, 'budgets', monthKey), { [category]: amount }, { merge: true })
  }

  return { budgets, loading, saveBudget }
}
