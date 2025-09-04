import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RecurringSlot, WeekSchedule, CreateSlotData, UpdateSlotData, CreateExceptionData } from '../types'
import { api } from '../services/api'
import toast from 'react-hot-toast'

interface ScheduleStore {
  // Recurring Slots
  recurringSlots: RecurringSlot[]
  isLoading: boolean
  
  // Week Schedule
  weekSchedules: Map<string, WeekSchedule>
  loadedWeeks: Set<string>
  
  // Force refresh trigger
  refreshTrigger: number
  
  // Actions
  fetchRecurringSlots: () => Promise<void>
  createSlot: (data: CreateSlotData) => Promise<void>
  updateSlot: (id: number, data: UpdateSlotData) => Promise<void>
  deleteSlot: (id: number) => Promise<void>
  
  // Week schedule actions
  fetchWeekSchedule: (startDate: string, forceRefresh?: boolean) => Promise<WeekSchedule | null>
  getWeekSchedule: (startDate: string) => WeekSchedule | null
  
  // Exception actions
  createException: (data: CreateExceptionData) => Promise<void>
  clearWeekScheduleCache: () => void
  forceRefresh: () => void
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      recurringSlots: [],
      isLoading: false,
      weekSchedules: new Map(),
      loadedWeeks: new Set(),
      refreshTrigger: 0,

      fetchRecurringSlots: async () => {
        try {
          set({ isLoading: true })
          const slots = await api.getRecurringSlots()
          set({ recurringSlots: slots })
        } catch (error) {
          toast.error('Failed to fetch recurring slots')
          console.error('Error fetching recurring slots:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      createSlot: async (data: CreateSlotData) => {
        try {
          set({ isLoading: true })
          
          // Optimistic update
          const tempSlot: RecurringSlot = {
            id: Date.now(),
            ...data
          }
          
          set(state => ({
            recurringSlots: [...state.recurringSlots, tempSlot]
          }))
          
          const newSlot = await api.createRecurringSlot(data)
          
          // Replace temporary slot with real one
          set(state => ({
            recurringSlots: state.recurringSlots.map(slot => 
              slot.id === tempSlot.id ? newSlot : slot
            )
          }))
          
          toast.success('Slot created successfully')
          get().clearWeekScheduleCache()
          get().forceRefresh()
          
        } catch (error: any) {
          // Revert optimistic update
          set(state => ({
            recurringSlots: state.recurringSlots.filter(slot => slot.id !== Date.now())
          }))
          toast.error(error.message || 'Failed to create slot')
        } finally {
          set({ isLoading: false })
        }
      },

      updateSlot: async (id: number, data: UpdateSlotData) => {
        const originalSlots = get().recurringSlots
        try {
          set({ isLoading: true })
          
          // Optimistic update
          set(state => ({
            recurringSlots: state.recurringSlots.map(slot =>
              slot.id === id ? { ...slot, ...data } : slot
            )
          }))
          
          const updatedSlot = await api.updateRecurringSlot(id, data)
          
          set(state => ({
            recurringSlots: state.recurringSlots.map(slot =>
              slot.id === id ? updatedSlot : slot
            )
          }))
          
          toast.success('Slot updated successfully')
          get().clearWeekScheduleCache()
          get().forceRefresh()
          
        } catch (error: any) {
          // Revert optimistic update
          set({ recurringSlots: originalSlots })
          toast.error(error.message || 'Failed to update slot')
        } finally {
          set({ isLoading: false })
        }
      },

      deleteSlot: async (id: number) => {
        const originalSlots = get().recurringSlots
        try {
          set({ isLoading: true })
          
          // Optimistic update
          set(state => ({
            recurringSlots: state.recurringSlots.filter(slot => slot.id !== id)
          }))
          
          await api.deleteRecurringSlot(id)
          toast.success('Slot deleted successfully')
          get().clearWeekScheduleCache()
          get().forceRefresh()
          
        } catch (error: any) {
          // Revert optimistic update
          set({ recurringSlots: originalSlots })
          toast.error(error.message || 'Failed to delete slot')
        } finally {
          set({ isLoading: false })
        }
      },

      fetchWeekSchedule: async (startDate: string, forceRefresh = false) => {
        try {
          const { loadedWeeks, weekSchedules } = get()
          
          if (!forceRefresh && loadedWeeks.has(startDate)) {
            return weekSchedules.get(startDate) || null
          }
          
          const schedule = await api.getWeekSchedule(startDate)
          
          set(state => ({
            weekSchedules: new Map(state.weekSchedules).set(startDate, schedule),
            loadedWeeks: new Set(state.loadedWeeks).add(startDate)
          }))
          
          return schedule
        } catch (error) {
          console.error('Error fetching week schedule:', error)
          return null
        }
      },

      getWeekSchedule: (startDate: string) => {
        return get().weekSchedules.get(startDate) || null
      },

      createException: async (data: CreateExceptionData) => {
        try {
          set({ isLoading: true })
          await api.createException(data)
          
          if (data.is_deleted) {
            toast.success('Slot deleted for this date')
          } else {
            toast.success('Slot exception created successfully')
          }
          
          // Clear cache and force refresh
          get().clearWeekScheduleCache()
          get().forceRefresh()
          
        } catch (error: any) {
          toast.error(error.message || 'Failed to create exception')
        } finally {
          set({ isLoading: false })
        }
      },

      clearWeekScheduleCache: () => {
        set({ 
          weekSchedules: new Map(), 
          loadedWeeks: new Set() 
        })
      },

      forceRefresh: () => {
        set(state => ({ refreshTrigger: state.refreshTrigger + 1 }))
      }
    }),
    {
      name: 'schedule-store',
      partialize: (state) => ({
        recurringSlots: state.recurringSlots,
      })
    }
  )
)
