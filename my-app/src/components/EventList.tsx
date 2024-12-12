'use client'

import React from 'react'
import { useCalendar,Event } from '../contexts/CalendarContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

type EventListProps = {
  isOpen: boolean
  onClose: () => void
  onEditEvent: (event: Event) => void
}

export const EventList: React.FC<EventListProps> = ({ isOpen, onClose, onEditEvent }) => {
  const { selectedDate, events } = useCalendar()

  if (!selectedDate) return null

  const dateString = format(selectedDate, 'yyyy-MM-dd')
  const dayEvents = events[dateString] || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Events for {format(selectedDate, 'MMMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {dayEvents.length === 0 ? (
            <p>No events for this day.</p>
          ) : (
            <ul className="space-y-2">
              {dayEvents.map((event) => (
                <li key={event.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-500">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                  <Button onClick={() => onEditEvent(event)}>Edit</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

