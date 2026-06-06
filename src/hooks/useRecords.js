import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export function useRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'records'), orderBy('date', 'desc'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q,
      snapshot => {
        setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        setLoading(false)
      },
      error => {
        console.error('Firestore error:', error.message)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  async function addRecord(record) {
    await addDoc(collection(db, 'records'), { ...record, createdAt: serverTimestamp() })
  }

  async function updateRecord(id, record) {
    await updateDoc(doc(db, 'records', id), record)
  }

  async function deleteRecord(id) {
    await deleteDoc(doc(db, 'records', id))
  }

  return { records, loading, addRecord, updateRecord, deleteRecord }
}
