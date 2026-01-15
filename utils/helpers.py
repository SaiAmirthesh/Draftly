import streamlit as st

def initialize_session_state():
    """Initialize session state variables"""
    if "generated_email" not in st.session_state:
        st.session_state.generated_email = ""
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []