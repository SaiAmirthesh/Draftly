import streamlit as st
from agents.mail_writer import MailWriter
from utils.helpers import initialize_session_state

def main():
    st.set_page_config(
        page_title="Draftly",
        layout="wide"
    )
    
    initialize_session_state()
    
    st.title("Draftly")
    st.markdown("Generate professional emails instantly")
    
    # Initialize agent once
    if "mail_writer" not in st.session_state:
        st.session_state.mail_writer = MailWriter()
    
    # Sidebar for email type selection
    with st.sidebar:
        st.header("Email Types")
        
        email_type = st.selectbox(
            "Select email type:",
            ["Cold Email", "Cover Letter", "Follow-up", "Thank You", "Business Proposal", "Custom"]
        )
        
        st.header("Tone")
        tone = st.select_slider(
            "Select tone:",
            options=["Casual", "Professional", "Formal", "Friendly", "Persuasive"]
        )
        
        if st.button("Clear All", use_container_width=True):
            st.session_state.generated_email = ""
            st.session_state.chat_history = []
            st.rerun()
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.header("Input")
        
        recipient = st.text_input("Recipient Name/Role:", placeholder="e.g., Hiring Manager, Client Name")
        purpose = st.text_area("Purpose/Key Points:", 
                             placeholder="What do you want to achieve with this email?\n\nExample:\n- Introducing my services\n- Following up on our meeting\n- Applying for a position", 
                             height=160)
        
        col1a, col1b = st.columns(2)
        with col1a:
            your_name = st.text_input("Your Name:", placeholder="Your name")
        with col1b:
            company = st.text_input("Your Company/Role:", placeholder="Company name or your role")
        
        if st.button("Generate Email", type="primary", use_container_width=True):
            if purpose:
                prompt = f"""
                Write a {tone.lower()} {email_type.lower()}.
                
                Recipient: {recipient}
                Purpose: {purpose}
                Your Name: {your_name}
                Your Company/Role: {company}
                
                Make it professional and ready to send.
                """
                
                with st.spinner("Crafting your perfect email..."):
                    email_content = st.session_state.mail_writer.generate_email(prompt)
                    st.session_state.generated_email = email_content
                    st.rerun()
            else:
                st.warning("Please enter at least the purpose/key points!")
    
    with col2:
        st.header("Generated Email")
        
        if "generated_email" in st.session_state and st.session_state.generated_email:
            email_display = st.text_area(
                "Your email is ready! Copy it below:",
                value=st.session_state.generated_email,
                height=400,
                key="email_output"
            )
            
            col2a, col2b= st.columns(2)
            with col2a:
                if st.button("Copy", use_container_width=True):
                    st.write("Copied to clipboard!")
            with col2b:
                if st.button("Edit", use_container_width=True):
                    st.write("Edit directly in the textbox above!")
        else:
            st.info("Enter details on the left and click 'Generate Email'")

if __name__ == "__main__":
    main()

