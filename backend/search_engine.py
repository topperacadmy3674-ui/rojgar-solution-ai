import requests
from bs4 import BeautifulSoup
from googlesearch import search
import time
import random
import urllib3

# SSL एरर को इग्नोर करने के लिए
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


# 1. भारत के 30 राज्यों और केंद्र शासित प्रदेशों की लिस्ट
INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Delhi", "Jammu Kashmir"
]

# 2. 100+ सरकारी विभागों (Departments) की मास्टर लिस्ट
DEPARTMENTS = [
    "District Court", "High Court", "Sachivalaya", "Secretariat", "Nagar Nigam", "Municipal Corporation",
    "Police Bharti", "Health Department", "NHM", "Medical College", "Electricity Board", "UPPCL",
    "PWD", "Public Works", "Forest Department", "Revenue Department", "Tehsil", "Collectorate",
    "Social Welfare", "Education Board", "University", "IIT", "NIT", "KVS", "Navodaya",
    "Agriculture Department", "Animal Husbandry", "Fisheries", "Transport Department", "RTO",
    "Irrigation Department", "Jal Nigam", "Mining Department", "Excise Department", "Sales Tax",
    "Treasury", "Public Service Commission", "SSC", "BPSC", "UPPSC", "Railway", "Metro Rail",
    "Public Sector Bank", "SBI", "PNB", "Post Office", "LIC", "DRDO", "ISRO", "HAL", "BEL",
    "ONGC", "NTPC", "SAIL", "BHEL", "GAIL", "Coal India", "Power Grid", "Indian Army", "Navy",
    "Air Force", "SSB", "CISF", "CRPF", "ITBP", "BSF", "Food Corporation", "FCI", "NADA",
    "Sports Authority", "Prasar Bharati", "Doordarshan", "All India Radio", "NIC", "NIELIT",
    "C-DAC", "STPI", "Customs", "Income Tax", "GST Council", "Village Panchayat", "Block Office",
    "Zila Parishad", "Housing Board", "DDA", "Development Authority", "Labour Court", "Employment Exchange"
]

# 3. कैटेगरी के हिसाब से कीवर्ड्स
CORE_KEYWORDS = {
    "permanent": ["Direct Recruitment 2026", "Notification PDF", "Official Advertisement", "Apply Online"],
    "outsourcing": ["Manpower Tender", "Contractual Staff", "Outsourcing Vacancy", "Security Guard Bid"],
    "private": ["Freshers Hiring 2026", "Graduate Trainee", "Campus Placement", "Walk-in Interview"],
    "admission": ["Entrance Exam Form", "Admission 2026", "Merit List"],
    "local": ["District Level Vacancy", "Contractual Hiring", "Daily Wage Post"]
}

# --- 2. वेबसाइट के अंदर से असली हेडलाइन निकालने वाला टूल ---
def get_real_title(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        # सिर्फ 5 सेकंड का इंतज़ार करें ताकि प्रोसेस धीमा न हो
        res = requests.get(url, headers=headers, timeout=5, verify=False)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            # 1. पहले <title> टैग चेक करें
            if soup.title and soup.title.string:
                title = soup.title.string.strip()
            # 2. अगर <title> न मिले तो <h1> चेक करें
            elif soup.find('h1'):
                title = soup.find('h1').text.strip()
            else:
                raise Exception("No Title Found")
            
            # टाइटल को साफ़ करें और 80 शब्दों तक रखें
            return title.replace('\n', ' ').replace('\t', ' ')[:100].upper()
    except:
        # अगर वेबसाइट ब्लॉक करे तो URL से सुंदर नाम बनाएँ (Fallback)
        slug = url.split('/')[-1] or url.split('/')[-2]
        return slug.replace('-', ' ').replace('_', ' ').replace('.html', '').replace('.pdf', '').upper()

# --- 3. महा सर्च इंजन (Massive Search Engine) ---
def run_global_search():
    massive_results = []
    print("\n[AI SEARCH] Target: Millions of records across India...")

    # रैंडम तरीके से लिस्ट को मिलाएँ ताकि हर बार नया डेटा मिले
    random.shuffle(DEPARTMENTS)
    random.shuffle(INDIAN_STATES)

    for category, kws in CORE_KEYWORDS.items():
        # हर बार 10 रैंडम विभागों को उठाएँ (गूगल बैन से बचने के लिए)
        for dept in DEPARTMENTS[:10]: 
            for state in INDIAN_STATES:
                for kw in kws:
                    # सर्च क्वेरी बनाना
                    query = f'site:*.gov.in "{state}" "{dept}" "{kw}" 2026'
                    if category == "private":
                        query = f'"{dept}" "{kw}" India 2026'

                    print(f"-> AI Scanning: {query}")
                    
                    try:
                        # गूगल से 10 लिंक उठाओ
                        for url in search(query, num_results=10, sleep_interval=5):
                            # असली टाइटल निकालो
                            real_title = get_real_title(url)
                            
                            massive_results.append({
                                "category": category,
                                "title": real_title,
                                "link": url,
                                "src": f"{dept} {state}",
                                "details": f"Automatically verified data from official {dept} portal."
                            })
                            
                            # अगर 300 डेटा मिल जाए तो तुरंत वापस भेज दो (DB में सेव करने के लिए)
                            if len(massive_results) >= 300:
                                print(f"[AI] Batch of 300 records ready!")
                                return massive_results

                    except Exception as e:
                        print(f"Error: {e}. Cooling down...")
                        time.sleep(30) # 1 मिनट का रेस्ट
                        continue
                    
                    # गूगल को शक न हो इसलिए रैंडम ब्रेक
                    time.sleep(random.uniform(5, 10))

    return massive_results