import { axiosInstance } from './axiosInstance'

export const filesApi = {
  upload: async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('fileUpload', file)
    const { data } = await axiosInstance.post('/files/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data.fileName as string
  },
}
