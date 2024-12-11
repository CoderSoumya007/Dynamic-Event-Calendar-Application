'use client'

import React, { useEffect } from 'react'
import { useCalendar } from '../contexts/CalendarContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWeekend } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export const Calendar: React.FC = () => {
  const { currentDate, setCurrentDate, filteredEvents, selectedDate, setSelectedDate, moveEvent } = useCalendar()

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1))

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const sourceDate = result.source.droppableId
    const destinationDate = result.destination.droppableId
    const eventId = result.draggableId

    if (sourceDate !== destinationDate) {
      moveEvent(sourceDate, destinationDate, eventId)
    }
  }

  useEffect(() => {
    setSelectedDate(null)
  }, [currentDate, setSelectedDate])

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
            {days.map(day => (
              <Droppable key={day.toString()} droppableId={format(day, 'yyyy-MM-dd')}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
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
                        {filteredEvents[format(day, 'yyyy-MM-dd')]?.map((event, index) => (
                          <Draggable key={event.id} draggableId={event.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`w-4 h-4 rounded-full mt-1 bg-${event.color}-500`}
                              />
                            )}
                          </Draggable>
                        ))}
                      </div>
                    </Button>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </CardContent>
      </Card>
    </DragDropContext>
  )
}

