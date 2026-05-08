import ollama

def extract_job_deep_info(raw_text):
    try:
        # AI को सख्त निर्देश कि डेटा को इस खास फॉर्मेट में ही दे
        prompt = f"""
        Analyze this government recruitment text and extract details in this EXACT format:
        1. Vacancy Name: (Department name)
        2. Posts: (List of positions/posts)
        3. Nature: (Direct Recruitment / Outsourcing / Deputation / Contract)
        4. Summary: (2-3 lines about what this job is and status)
        5. Deadline: (Last date)

        Text: {raw_text[:2500]}
        """
        
        response = ollama.generate(model='llama3', prompt=prompt)
        return response['response'].strip()
    except Exception as e:
        return "AI Analysis Error: Ensure Ollama Llama3 is running."