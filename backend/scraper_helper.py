import requests
import pdfplumber
import io

def get_text_from_pdf(pdf_url):
    try:
        response = requests.get(pdf_url, verify=False, timeout=10)
        with pdfplumber.open(io.BytesIO(response.content)) as pdf:
            text = ""
            for page in pdf.pages[:3]: # पहले 3 पेज काफी हैं
                text += page.extract_text()
            return text
    except:
        return ""