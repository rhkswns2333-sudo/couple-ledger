import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export function useRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'records'), orderBy('date', 'desc'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snapshot => {
      setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  async function addRecord(record) {
    await addDoc(collection(db, 'records'), {
      ...record,
      createdAt: serverTimestamp(),
    })
  }

  return { records, loading, addRecord }
}
