import { useState, useEffect, useCallback } from 'react'

export const useActiveWeek = (weekRefs: React.RefObject<HTMLElement>[], scrollContainer?: Element | Window) => {
  const [activeWeek, setActiveWeek] = useState(0)

  const updateActiveWeek = useCallback(() => {
    const container = scrollContainer || window
    const scrollTop = container instanceof Window 
      ? container.scrollY 
      : container.scrollTop
    
    const containerHeight = container instanceof Window 
      ? container.innerHeight 
      : container.clientHeight

    const threshold = containerHeight * 0.3

    for (let i = weekRefs.length - 1; i >= 0; i--) {
      const ref = weekRefs[i]
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const elementTop = container instanceof Window 
          ? rect.top + scrollTop 
          : rect.top + scrollTop

        if (elementTop <= scrollTop + threshold) {
          setActiveWeek(i)
          break
        }
      }
    }
  }, [weekRefs, scrollContainer])

  useEffect(() => {
    const container = scrollContainer || window
    container.addEventListener('scroll', updateActiveWeek)
    updateActiveWeek() // Initial check

    return () => container.removeEventListener('scroll', updateActiveWeek)
  }, [updateActiveWeek, scrollContainer])

  return activeWeek
}
