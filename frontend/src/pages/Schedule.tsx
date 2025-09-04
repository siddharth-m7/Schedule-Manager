import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useScheduleStore } from '../store/useScheduleStore'
import { getCurrentWeekStart, generateInitialWeekRange, generateMoreWeeks } from '../utils/dateHelpers'
import { useActiveWeek } from '../hooks/useActiveWeek'
import WeekNavigator from '../components/WeekNavigator'
import WeekSection from '../components/WeekSection'
import LoadingSpinner from '../components/LoadingSpinner'
import InfiniteScroll from 'react-infinite-scroll-component'

const Schedule: React.FC = () => {
  // Current week (removed unused variable)
  // Generate weeks starting from current week, with some past weeks and more future weeks
  const [weeks, setWeeks] = useState(() => {
    const currentWeek = getCurrentWeekStart()
    // Generate 5 past weeks + current week + 15 future weeks
    return generateInitialWeekRange(currentWeek, 5).slice(-21) // Take last 21 weeks (5 past + 1 current + 15 future)
  })
  const [hasMore, setHasMore] = useState(true)
  
  const weekRefs = useRef<(HTMLElement | null)[]>([])
  const activeWeek = useActiveWeek(weekRefs.current.map(ref => ({ current: ref })))
  
  const { fetchRecurringSlots } = useScheduleStore()

  // Generate week sections with refs
  const weekSections = useMemo(() => {
    return weeks.map((week, index) => ({
      week,
      index,
      ref: (el: HTMLElement | null) => {
        weekRefs.current[index] = el
      }
    }))
  }, [weeks])

  useEffect(() => {
    fetchRecurringSlots()
  }, [fetchRecurringSlots])

  // Scroll to current week on initial load
  useEffect(() => {
    const currentWeek = getCurrentWeekStart()
    const currentWeekIndex = weeks.findIndex(week => week === currentWeek)
    
    if (currentWeekIndex !== -1) {
      // Small delay to ensure refs are set
      setTimeout(() => {
        scrollToWeek(currentWeekIndex)
      }, 100)
    }
  }, []) // Only run on mount

  const loadMoreWeeks = () => {
    if (weeks.length >= 100) { // Limit to prevent infinite growth
      setHasMore(false)
      return
    }
    
    const lastWeek = weeks[weeks.length - 1]
    const newWeeks = generateMoreWeeks(lastWeek, 10) // Generate more weeks at once
    
    // Additional safety check: filter out any duplicates
    const existingWeekSet = new Set(weeks)
    const uniqueNewWeeks = newWeeks.filter(week => !existingWeekSet.has(week))
    
    if (uniqueNewWeeks.length === 0) {
      setHasMore(false)
      return
    }
    
    setWeeks(prev => [...prev, ...uniqueNewWeeks])
  }

  const scrollToWeek = (index: number) => {
    const weekRef = weekRefs.current[index]
    if (weekRef) {
      weekRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Debug logging to catch duplicates in development
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      const weekSet = new Set(weeks)
      if (weekSet.size !== weeks.length) {
        console.warn('Duplicate weeks detected:', weeks.filter((week, index) => weeks.indexOf(week) !== index))
      }
    }
  }, [weeks])

  return (
    <div className="relative">
      {/* Sticky Week Navigator */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <WeekNavigator
          weeks={weeks}
          activeWeek={activeWeek}
          onWeekClick={scrollToWeek}
        />
      </div>

      {/* Schedule Content */}
      <div className="mt-4">
        <InfiniteScroll
          dataLength={weeks.length}
          next={loadMoreWeeks}
          hasMore={hasMore}
          loader={
            <div className="py-8">
              <LoadingSpinner className="mx-auto" />
            </div>
          }
          endMessage={
            <p className="text-center text-gray-500 py-8">
              No more weeks to load
            </p>
          }
          scrollThreshold={0.7}
        >
          <div className="space-y-8">
            {weekSections.map(({ week, index, ref }) => (
              <WeekSection
                key={week}
                weekStart={week}
                ref={ref}
                isActive={index === activeWeek}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default Schedule
