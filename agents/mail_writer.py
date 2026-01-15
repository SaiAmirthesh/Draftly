# agents/mail_writer.py - Minimal working version
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class MailWriter:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "your_api_key_here":
            raise ValueError("Please set your GOOGLE_API_KEY in the .env file")
        
        genai.configure(api_key=api_key)
        
        # Use the most common working model
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def generate_email(self, user_prompt: str) -> str:
        """Simple email generation"""
        try:
            prompt = f"Write a professional email. Request: {user_prompt}"
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Please check your API key and model. Error: {str(e)}"