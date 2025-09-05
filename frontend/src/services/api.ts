import { RecurringSlot, WeekSchedule, CreateSlotData, UpdateSlotData, SlotException, CreateExceptionData } from '../types'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000/'

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Recurring Slots
  async getRecurringSlots(): Promise<RecurringSlot[]> {
    return this.request<RecurringSlot[]>('/slots')
  }

  async createRecurringSlot(data: CreateSlotData): Promise<RecurringSlot> {
    return this.request<RecurringSlot>('/slots', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRecurringSlot(id: number, data: UpdateSlotData): Promise<RecurringSlot> {
    return this.request<RecurringSlot>(`/slots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRecurringSlot(id: number): Promise<void> {
    return this.request<void>(`/slots/${id}`, {
      method: 'DELETE',
    })
  }

  // Week Schedule
  async getWeekSchedule(startDate: string): Promise<WeekSchedule> {
    return this.request<WeekSchedule>(`/week?start_date=${startDate}`)
  }

  // Slot Exceptions
  async createException(data: CreateExceptionData): Promise<SlotException> {
    return this.request<SlotException>('/slots/exceptions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getExceptions(): Promise<SlotException[]> {
    return this.request<SlotException[]>('/slots/exceptions')
  }
}

export const api = new ApiService()
