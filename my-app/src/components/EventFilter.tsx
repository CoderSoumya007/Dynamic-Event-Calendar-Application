'use client'

import React, { useState } from 'react'
import { useCalendar } from '../contexts/CalendarContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const EventFilter: React.FC = () => {
  const [keyword, setKeyword] = useState('')
  const { filterEvents } = useCalendar()

  const handleFilter = () => {
    filterEvents(keyword)
  }

  return (
    <div className="flex gap-2 mb-4">
      <Input
        type="text"
        placeholder="Filter events..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button onClick={handleFilter}>Filter</Button>
    </div>
  )
}

