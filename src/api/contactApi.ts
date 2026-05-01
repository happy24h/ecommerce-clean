import { axiosInstance } from './axiosInstance'
import { WEBSITE_ID } from '@/constants'

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  message: string
  websiteId: string
}

export interface ContactResponse {
  _id: string
  name: string
  email: string
  phone?: string
  message: string
  websiteId: string
  status: 'NEW' | 'READ' | 'REPLIED'
  createdAt: string
}

export const contactApi = {
  sendContact: async (payload: Omit<ContactPayload, 'websiteId'>): Promise<ContactResponse> => {
    const { data } = await axiosInstance.post('/contacts', {
      ...payload,
      websiteId: WEBSITE_ID,
    })
    return data.data
  },
}
