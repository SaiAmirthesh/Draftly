const API_BASE_URL = 'http://localhost:8000/api'

export const emailAPI = {
  // Generate email
  async generateEmail(emailData) {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })
      
      if (!response.ok) {
        throw new Error('API request failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error generating email:', error)
      throw error
    }
  },

  // Improve/regenerate email
  async improveEmail(previousEmail) {
    try {
      const response = await fetch(`${API_BASE_URL}/improve-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ previous_email: previousEmail })
      })
      
      if (!response.ok) {
        throw new Error('API request failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error improving email:', error)
      throw error
    }
  }
}