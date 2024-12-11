'use client'

import React, { useState } from 'react'
import { Calendar } from '../components/Calendar'
import { EventModal } from '../components/EventModal'
import { EventList } from '../components/EventList'
import { EventFilter } from '../components/EventFilter'
import { useCalendar } from '../contexts/CalendarContext'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export default function Home() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isEventListOpen, setIsEventListOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { selectedDate, exportEvents } = useCalendar()

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setIsEventModalOpen(true)
  }

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
    setIsEventListOpen(false)
  }

  return (
    <main className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Dynamic Event Calendar</h1>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleAddEvent}>
          Add Event {selectedDate && `for ${format(selectedDate, 'MMM d, yyyy')}`}
        </Button>
        <Button onClick={() => setIsEventListOpen(true)}>View Events</Button>
        <Button onClick={exportEvents}>Export Events</Button>
      </div>
      <EventFilter />
      <Calendar />
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
      />
      <EventList
        isOpen={isEventListOpen}
        onClose={() => setIsEventListOpen(false)}
        onEditEvent={handleEditEvent}
      />
    </main>
  )
}

