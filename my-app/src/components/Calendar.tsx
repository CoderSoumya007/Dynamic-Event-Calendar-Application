'use client'

import React, { useState } from 'react'
import { useCalendar } from '../contexts/CalendarContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWeekend } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

type Event = {
  id: string
  name: string
  startTime: string
  endTime: string
  description?: string
  color: string
}

export const Calendar: React.FC = () => {
  const { currentDate, setCurrentDate, filteredEvents, selectedDate, setSelectedDate, moveEvent } = useCalendar()
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1))

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    const sourceDate = source.droppableId
    const destinationDate = destination.droppableId

    if (sourceDate !== destinationDate) {
      moveEvent(sourceDate, destinationDate, draggableId)
    }

    // Close the popover after dragging
    setOpenPopoverId(null)
  }

  const renderEventList = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd')
    const events = filteredEvents[dateString] || []

    return (
      <Droppable droppableId={dateString}>
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {events.map((event: Event, index: number) => (
              <Draggable key={event.id} draggableId={event.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-2 rounded text-sm bg-${event.color}-500 text-white`}
                  >
                    {event.name}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={handlePrevMonth}><ChevronLeft /></Button>
            <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
            <Button onClick={handleNextMonth}><ChevronRight /></Button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-bold">{day}</div>
            ))}
            {days.map(day => {
              const dateString = format(day, 'yyyy-MM-dd')
              const events = filteredEvents[dateString] || []
              return (
                <Popover key={day.toString()} open={openPopoverId === dateString} onOpenChange={(open) => {
                  if (open) {
                    setOpenPopoverId(dateString)
                  } else {
                    setOpenPopoverId(null)
                  }
                }}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-20 w-full ${
                        !isSameMonth(day, currentDate) ? 'opacity-50' : ''
                      } ${
                        isSameDay(day, new Date()) ? 'border-primary' : ''
                      } ${
                        isWeekend(day) ? 'bg-muted' : ''
                      } ${
                        selectedDate && isSameDay(day, selectedDate) ? 'bg-accent border-primary' : ''
                      }`}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className="flex flex-col items-center">
                        <span>{format(day, 'd')}</span>
                        {events.length > 0 && (
                          <div className="flex mt-1 space-x-1">
                            {events.slice(0, 3).map((event: Event) => (
                              <div
                                key={event.id}
                                className={`w-2 h-2 rounded-full bg-${event.color}-500`}
                              />
                            ))}
                            {events.length > 3 && (
                              <div className="w-2 h-2 rounded-full bg-gray-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{format(day, 'MMMM d, yyyy')}</h3>
                      {renderEventList(day)}
                    </div>
                  </PopoverContent>
                </Popover>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </DragDropContext>
  )
}

