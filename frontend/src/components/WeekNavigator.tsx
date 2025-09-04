import React, { useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getWeekNumber } from '../utils/dateHelpers'

interface WeekNavigatorProps {
  weeks: string[]
  activeWeek: number
  onWeekClick: (index: number) => void
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  weeks,
  activeWeek,
  onWeekClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  // Auto-scroll to active week
  useEffect(() => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const button = activeButtonRef.current
      const containerRect = container.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()

      if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
        button.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    }
  }, [activeWeek])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="flex items-center">
      <button
        onClick={() => scroll('left')}
        className="p-2 hover:bg-gray-100 rounded-md"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex space-x-2 px-4 py-3">
          {weeks.map((week, index) => {
            const weekNum = getWeekNumber(week)
            const isActive = index === activeWeek
            
            return (
              <button
                key={week}
                ref={isActive ? activeButtonRef : null}
                onClick={() => onWeekClick(index)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                  ${isActive 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                Week {weekNum}
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={() => scroll('right')}
        className="p-2 hover:bg-gray-100 rounded-md"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  )
}

export default WeekNavigator
