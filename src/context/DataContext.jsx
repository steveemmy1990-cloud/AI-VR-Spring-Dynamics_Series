import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { eventToRow, ROW_COLUMNS } from '../utils/eventSchema'
import { getSupabase, isSupabaseConfigured } from '../utils/supabaseClient'
import { useLevel } from './LevelContext'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const { level } = useLevel()
  const [fileType, setFileType] = useState('csv')
  const [isDataCollectionActive, setIsDataCollectionActive] = useState(false)
  const [eventLog, setEventLog] = useState([])
  const [userId, setUserId] = useState('')
  const logRef = useRef([])
  const userIdRef = useRef('')

  const updateUserId = useCallback((newUserId) => {
    setUserId(newUserId)
    userIdRef.current = newUserId
  }, [])

  const logEvent = useCallback((eventType, details = {}) => {
    if (!isDataCollectionActive) return

    const row = eventToRow(userIdRef.current, eventType, details)
    row.level = level
    logRef.current.push(row)
    setEventLog(prev => [...prev, row])
    console.log(`Data Logged: ${eventType}`, details)
  }, [isDataCollectionActive, level])

  const getRows = useCallback(() => {
    return [...logRef.current]
  }, [])

  const getRowsByLevel = useCallback((levelNum) => {
    return logRef.current.filter(row => row.level === levelNum)
  }, [])

  const clearEventsForLevel = useCallback((levelNum) => {
    logRef.current = logRef.current.filter(row => row.level !== levelNum)
    setEventLog(prev => prev.filter(row => row.level !== levelNum))
  }, [])

  const downloadData = useCallback((forLevel = null) => {
    const data = forLevel != null ? getRowsByLevel(forLevel) : getRows()
    const safeUserId = (userIdRef.current || 'unknown').replace(/[^a-zA-Z0-9]/g, '_')
    const filename = `experiment_data_${safeUserId}_${Date.now()}`

    if (fileType === 'json') {
      const exportData = {
        userId: userIdRef.current,
        exportedAt: new Date().toISOString(),
        totalEvents: data.length,
        events: data
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      triggerDownload(blob, filename + '.json')
      return
    }

    if (data.length === 0) return
    const header = ROW_COLUMNS.join(',')
    const csvRows = [header]
    data.forEach(row => {
      const values = ROW_COLUMNS.map(col => {
        const v = row[col]
        if (v === null || v === undefined) return ''
        const s = String(v)
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
      })
      csvRows.push(values.join(','))
    })
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    triggerDownload(blob, filename + '.csv')
  }, [fileType, getRows, getRowsByLevel])

  const uploadToSupabaseByLevel = useCallback(async (levelNum) => {
    const supabase = getSupabase()
    if (!supabase) {
      return { ok: false, error: 'Supabase not configured' }
    }
    const rows = getRowsByLevel(levelNum)
    if (rows.length === 0) {
      return { ok: true, data: [] }
    }
    const sessionId = crypto.randomUUID()
    rows.forEach(r => { r.session_id = sessionId })
    const { data: insertData, error } = await supabase
      .from('experiment_events')
      .insert(rows)
    if (error) {
      console.error('Supabase upload error:', error)
      return { ok: false, error: error.message }
    }
    clearEventsForLevel(levelNum)
    return { ok: true, data: insertData }
  }, [getRowsByLevel, clearEventsForLevel])

  const uploadToSupabase = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) {
      return { ok: false, error: 'Supabase not configured' }
    }
    const rows = getRows()
    if (rows.length === 0) {
      return { ok: false, error: 'No data to upload' }
    }
    const { data: insertData, error } = await supabase
      .from('experiment_events')
      .insert(rows)
    if (error) {
      console.error('Supabase upload error:', error)
      return { ok: false, error: error.message }
    }
    return { ok: true, data: insertData }
  }, [getRows])

  return (
    <DataContext.Provider value={{
      fileType,
      setFileType,
      isDataCollectionActive,
      setIsDataCollectionActive,
      eventLog,
      logEvent,
      downloadData,
      uploadToSupabase,
      uploadToSupabaseByLevel,
      getRowsByLevel,
      clearEventsForLevel,
      isSupabaseConfigured: isSupabaseConfigured(),
      getRows,
      userId,
      setUserId: updateUserId
    }}>
      {children}
    </DataContext.Provider>
  )
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
