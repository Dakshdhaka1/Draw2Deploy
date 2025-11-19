import { apiPost, apiDelete, getApiErrorMessage } from './client'
import type { ApiResponse } from './client'

export type SubmitProjectPayload = {
  projectName: string
  image: File
}

export type Project = {
  id: string
  title?: string
  projectName?: string
  createdAt?: string
  updatedAt?: string
  status?: string
  imageUrl?: string
  [key: string]: unknown
}

// Helper: always fetch token in every protected request
const getToken = () => localStorage.getItem('d2d_token')

// Base API
const API_BASE = 'http://localhost:9000'


// =========================
// SUBMIT PROJECT
// =========================
export const submitProject = async (
  payload: SubmitProjectPayload
): Promise<ApiResponse<Record<string, unknown>>> => {
  const token = getToken()
  if (!token) throw new Error('Please login first.')

  const formData = new FormData()
  formData.append('title', payload.projectName)
  formData.append('image', payload.image)

  try {
    const response = await fetch(`${API_BASE}/api/user/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Required
      },
      body: formData,
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error submitting project.')
    }

    return data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}


// =========================
// GET ALL PROJECTS
// =========================
export const getAllProjects = async (): Promise<Project[]> => {
  const token = getToken()
  if (!token) throw new Error('Please login first.')

  try {
    const response = await fetch(`${API_BASE}/api/user/get-all-projects`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}


// =========================
// DELETE PROJECT
// =========================
export const deleteProject = async (
  projectId: string
): Promise<ApiResponse<Record<string, unknown>>> => {
  const token = getToken()
  if (!token) throw new Error('Please login first.')

  try {
    return await apiDelete(`/api/user/delete-project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}


// =========================
// GENERATE TERRAFORM ZIP
// =========================
export const generateTerraform = async (projectId: string): Promise<void> => {
  const token = getToken()
  if (!token) throw new Error('Please login first.')

  try {
    const response = await fetch(
      `${API_BASE}/api/user/projects/${projectId}/generate-tf`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }
    )

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text)
    }

    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/octet-stream')) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `terraform_project_${projectId}.zip`
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      throw new Error('Unexpected response format')
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}


// =========================
// CHECK AI SERVICE
// =========================
export const checkAiServiceStatus = async () => {
  try {
    await fetch('http://localhost:7000/analyze-url', {
      method: 'OPTIONS',
      headers: { 'Content-Type': 'application/json' },
    })

    return { available: true, message: 'AI service is running' }
  } catch (error) {
    return { available: false, message: 'AI service not available' }
  }
}


// =========================
// DELETE ALL PROJECTS (ADMIN)
// =========================
export const deleteAllProjects = async () => {
  try {
    return await apiDelete('/public/auth/delete-all-projects')
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
