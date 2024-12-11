'use client'

import React, { useState, useEffect } from 'react'
import { useCalendar } from '../contexts/CalendarContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'

type EventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple'

type Event = {
  id: string
  name: string
  startTime: string
  endTime: string
  description?: string
  color: EventColor
}

type EventModalProps = {
  isOpen: boolean
  onClose: () => void
  event?: Event
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { selectedDate, addEvent, updateEvent, deleteEvent } = useCalendar()
  const [eventData, setEventData] = useState<Event>({
    id: '',
    name: '',
    startTime: '',
    endTime: '',
    description: '',
    color: 'blue'
  })

  useEffect(() => {
    if (event) {
      setEventData(event)
    } else {
      setEventData({
        id: '',
        name: '',
        startTime: '',
        endTime: '',
        description: '',
        color: 'blue'
      })
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd')
      if (event) {
        updateEvent(dateString, eventData)
      } else {
        addEvent(dateString, { ...eventData, id: Date.now().toString() })
      }
      onClose()
    }
  }

  const handleDelete = () => {
    if (selectedDate && event) {
      const dateString = format(selectedDate, 'yyyy-MM-dd')
      deleteEvent(dateString, event.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Event name"
              value={eventData.name}
              onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
              required
            />
            <Input
              type="time"
              value={eventData.startTime}
              onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
              required
            />
            <Input
              type="time"
              value={eventData.endTime}
              onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
              required
            />
            <Textarea
              placeholder="Description (optional)"
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            />
            <Select
              value={eventData.color}
              onValueChange={(value: EventColor) => setEventData({ ...eventData, color: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            {event && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button type="submit">{event ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

