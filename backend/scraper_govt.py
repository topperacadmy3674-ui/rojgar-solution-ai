import requests
from bs4 import BeautifulSoup

def scrape_upsc():
    try:
        res = requests.get("https://www.upsc.gov.in/whats-new", timeout=10, verify=False)
        soup = BeautifulSoup(res.text, 'html.parser')
        return [{"title": i.text.strip(), "link": "https://upsc.gov.in", "src": "UPSC"} for i in soup.select('li.leaf')[:8]]
    except: return []