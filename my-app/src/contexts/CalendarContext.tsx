'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns'

type EventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple'

type Event = {
  id: string
  name: string
  startTime: string
  endTime: string
  description?: string
  color: EventColor
}

type CalendarContextType = {
  currentDate: Date
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
  events: Record<string, Event[]>
  addEvent: (date: string, event: Event) => void
  updateEvent: (date: string, event: Event) => void
  deleteEvent: (date: string, eventId: string) => void
  selectedDate: Date | null
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>
  filterEvents: (keyword: string) => void
  filteredEvents: Record<string, Event[]>
  moveEvent: (fromDate: string, toDate: string, eventId: string) => void
  exportEvents: () => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export const useCalendar = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Record<string, Event[]>>({})
  const [filteredEvents, setFilteredEvents] = useState<Record<string, Event[]>>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
      setFilteredEvents(JSON.parse(storedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events))
  }, [events])

  const addEvent = (date: string, event: Event) => {
    setEvents(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), event]
    }))
    setFilteredEvents(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), event]
    }))
  }

  const updateEvent = (date: string, updatedEvent: Event) => {
    setEvents(prev => ({
      ...prev,
      [date]: prev[date].map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    }))
    setFilteredEvents(prev => ({
      ...prev,
      [date]: prev[date].map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    }))
  }

  const deleteEvent = (date: string, eventId: string) => {
    setEvents(prev => ({
      ...prev,
      [date]: prev[date].filter(event => event.id !== eventId)
    }))
    setFilteredEvents(prev => ({
      ...prev,
      [date]: prev[date].filter(event => event.id !== eventId)
    }))
  }

  const filterEvents = (keyword: string) => {
    if (!keyword) {
      setFilteredEvents(events)
    } else {
      const filtered: Record<string, Event[]> = {}
      Object.entries(events).forEach(([date, dateEvents]) => {
        const filteredDateEvents = dateEvents.filter(event => 
          event.name.toLowerCase().includes(keyword.toLowerCase()) ||
          event.description?.toLowerCase().includes(keyword.toLowerCase())
        )
        if (filteredDateEvents.length > 0) {
          filtered[date] = filteredDateEvents
        }
      })
      setFilteredEvents(filtered)
    }
  }

  const moveEvent = (fromDate: string, toDate: string, eventId: string) => {
    setEvents(prev => {
      const eventToMove = prev[fromDate].find(event => event.id === eventId)
      if (!eventToMove) return prev

      const newEvents = { ...prev }
      newEvents[fromDate] = newEvents[fromDate].filter(event => event.id !== eventId)
      newEvents[toDate] = [...(newEvents[toDate] || []), eventToMove]

      return newEvents
    })
    setFilteredEvents(prev => {
      const eventToMove = prev[fromDate]?.find(event => event.id === eventId)
      if (!eventToMove) return prev

      const newEvents = { ...prev }
      if (newEvents[fromDate]) {
        newEvents[fromDate] = newEvents[fromDate].filter(event => event.id !== eventId)
      }
      newEvents[toDate] = [...(newEvents[toDate] || []), eventToMove]

      return newEvents
    })
  }

  const exportEvents = () => {
    const eventsArray = Object.entries(events).flatMap(([date, dateEvents]) => 
      dateEvents.map(event => ({ ...event, date }))
    )
    const jsonString = JSON.stringify(eventsArray, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'calendar_events.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <CalendarContext.Provider 
      value={{ 
        currentDate, 
        setCurrentDate, 
        events, 
        addEvent, 
        updateEvent, 
        deleteEvent,
        selectedDate,
        setSelectedDate,
        filterEvents,
        filteredEvents,
        moveEvent,
        exportEvents
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

