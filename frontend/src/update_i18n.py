import json
import re

en = {
    "sidebar": {
        "dashboard": "Dashboard",
        "analyze": "Analyze News",
        "history": "History",
        "liveNews": "Live News",
        "howItWorks": "How It Works",
        "faq": "FAQ",
        "profile": "Profile",
        "settings": "Settings",
        "logout": "Log Out"
    },
    "liveNews": {
        "title": "Live News",
        "subtitle": "Explore current news across major categories.",
        "loading": "Loading Live News...",
        "loadingDesc": "Fetching the latest updates across the globe.",
        "noNews": "No news available in this category.",
        "noDescription": "No description available.",
        "readArticle": "Read Full Story",
        "articlesCount": "Articles",
        "retry": "Retry",
        "categories": {
            "politics": "Politics",
            "business": "Business & Finance",
            "technology": "Technology",
            "sports": "Sports",
            "health": "Health",
            "world": "World"
        }
    },
    "header": {
        "aiVerification": "3 Layer robust Evaluation"
    },
    "analyze": {
        "title": "Content Verification Engine",
        "subtitle": "Upload content or paste text to verify authenticity using our AI models.",
        "tabs": {
            "text": "Text Input",
            "url": "URL",
            "image": "Image",
            "pdf": "PDF",
            "voice": "Voice",
            "qr": "QR Code"
        },
        "inputs": {
            "titleOptional": "Enter News Title (Optional)",
            "pasteText": "Paste article text here...",
            "verifyBtn": "Verify Content",
            "analyzing": "Analyzing...",
            "outputLang": "Explanation Language:",
            "uploadImage": "Click to upload or drag and drop an image",
            "uploadPdf": "Click to upload or drag and drop a PDF",
            "enterUrl": "Enter article URL...",
            "startRecording": "Start Recording",
            "stopRecording": "Stop Recording",
            "scanQr": "Scan QR Code",
            "headline": "Headline",
            "headlinePlaceholder": "Enter the news headline...",
            "articleContent": "Article Content",
            "articlePlaceholder": "Paste the main article text here...",
            "analyzeArticle": "Analyze Article"
        },
        "report": {
            "probableSource": "Probable Source:",
            "analyzeAnother": "Analyze Another Article",
            "downloadPdf": "Download PDF Report",
            "analyzingCredibility": "Analyzing Credibility",
            "runningMl": "Running ML Classification & Evidence Intelligence Engine...",
            "mayTakeTime": "This may take 10-20 seconds"
        }
    },
    "dashboard": {
        "title": "Dashboard",
        "welcome": "Welcome",
        "to": "to",
        "snapshot": "Here's a snapshot of your verification activity.",
        "downloadPdf": "Download PDF",
        "totalChecks": "Total Checks",
        "real": "Real",
        "partiallyTrue": "Partially True",
        "fake": "Fake",
        "savedReports": "Saved Reports",
        "activity": "Activity (14D)",
        "distribution": "Credibility Distribution",
        "languages": "Languages",
        "avgCredibility": "Avg. credibility:",
        "realVsFake": "Real vs Partial vs Fake",
        "noData": "No data available",
        "globalTrending": "GLOBAL TRENDING FAKE TOPICS",
        "last30d": "LAST 30D",
        "flagged": "FLAGGED",
        "trendingKeywords": "TRENDING KEYWORDS",
        "analyzeBtn": "Analyze an Article",
        "mlModel": "ML Model",
        "features": "Features",
        "upTo": "Up to",
        "featuresCount": "features",
        "explainability": "Explainability",
        "enabled": "Enabled",
        "featureContribution": "Feature Contribution Analysis"
    },
    "profile": {
        "title": "Profile",
        "cancel": "Cancel",
        "save": "Save",
        "email": "Email",
        "phone": "Phone",
        "language": "Language",
        "memberSince": "Member Since",
        "notifications": "Notifications",
        "privacy": "Privacy",
        "enterPhone": "Enter your phone",
        "on": "On",
        "private": "Private"
    },
    "history": {
        "title": "Analysis History",
        "analyses": "Your Analyses",
        "analysesDesc": "A record of past articles, URLs, and images you've analyzed.",
        "filters": {
            "all": "All Analysis",
            "credible": "Credible",
            "unverified": "Unverified",
            "misleading": "Misleading",
            "saved": "Saved"
        },
        "loading": "Loading history...",
        "noAnalyses": "No analyses yet",
        "noAnalysesDesc": "Your analyzed articles will appear here once you start using the Analyze News tool.",
        "noItemsFilter": "No items found for filter:",
        "untitled": "Untitled Analysis",
        "fakeNews": "Fake News",
        "realNews": "Real News",
        "confidence": "Confidence",
        "riskScore": "Risk Score",
        "unsave": "Unsave Record",
        "save": "Save Record",
        "delete": "Delete Record",
        "deleteConfirm": "Are you sure you want to delete this record?"
    },
    "faq": {
        "title": "FAQ",
        "gotQuestions": "Got Questions?",
        "desc": "Everything you need to know about FakeCheckPro, how it analyzes information, and how to get the most out of the platform.",
        "q1": "What is FakeCheckPro?",
        "a1": "FakeCheckPro is an advanced, AI-driven platform designed to detect fake news, verify claims, and assess the credibility of information across multiple formats. It leverages both Machine Learning classification and a deep Evidence Intelligence Engine to give you comprehensive insights.",
        "q2": "How does the AI Analysis Pipeline work?",
        "a2": "The pipeline consists of three main layers: Layer 1 uses a Machine Learning model (like Logistic Regression with TF-IDF) for initial classification. Layer 2, the Evidence Intelligence Engine, extracts claims, searches for evidence from trusted sources, and semantically matches them. Finally, Layer 3 (Decision Engine) normalizes the scores and resolves conflicts to provide a final credibility assessment.",
        "q3": "What types of media can I analyze?",
        "a3": "You can analyze direct text input, full website URLs, text extracted from images (OCR), PDF documents, transcribed voice notes, and even QR codes that link to articles or text.",
        "q4": "Are multiple languages supported?",
        "a4": "Yes! FakeCheckPro features multilingual analysis capabilities. It can automatically detect the input language (such as Hindi or Marathi), translate it to English for robust model processing, and then provide the output report back in your preferred language.",
        "q5": "Is the Evidence Intelligence Engine accurate?",
        "a5": "The Evidence Intelligence Engine significantly boosts accuracy by cross-referencing extracted claims against live, trusted sources. However, it serves as an AI-assisted indicator of credibility risk rather than an absolute statistical truth. We recommend using it alongside your own critical judgment.",
        "q6": "How is my analysis data handled?",
        "a6": "Your privacy is important. Analysis results are stored in your personal History dashboard so you can review them later. You have full control over this data and can delete previous scans at any time from the History page.",
        "q7": "What is the difference between ML Classification and Evidence Intelligence?",
        "a7": "ML Classification looks at the linguistic patterns and vocabulary in the text itself to determine if it 'sounds' like typical fake news. Evidence Intelligence, on the other hand, actively searches the internet to verify the factual claims made in the text against reliable external sources.",
        "q8": "Can I export or share the analysis report?",
        "a8": "Yes. Once an analysis is complete, you can click the 'Download PDF Report' button at the top of the results to generate a formatted PDF containing the credibility score, important phrases, and evidence verification details.",
        "q9": "What does the Credibility Risk Score mean?",
        "a9": "The Credibility Risk Score is a composite metric ranging from 0 to 100. A low score indicates high credibility (safe), while a high score indicates a significant risk of misinformation. It is calculated by blending the ML model's confidence with the quality and direction of the external evidence found.",
        "q10": "How does the Chatbot Assistant help me?",
        "a10": "The Chatbot Assistant is a context-aware AI that appears after you run an analysis. It reads the full report and the evidence gathered. You can ask it specific questions about the article, request summaries, or ask it to explain why certain claims were flagged as misleading."
    },
    "howItWorks": {
        "title": "How It Works",
        "pipeline": "The Analysis Pipeline",
        "desc": "FakeCheckPro utilizes a sophisticated 3-layer architecture, combining traditional Machine Learning with advanced Evidence Intelligence to deliver unparalleled accuracy.",
        "step1Title": "Multimodal Input",
        "step1Desc": "Submit news via direct text, a URL, uploading an image (OCR), parsing a PDF document, transcribing a voice note, or scanning a QR code.",
        "step2Title": "Layer 1: ML Classification",
        "step2Desc": "The text is cleaned, translated (if not in English), and vectorized using TF-IDF. A robust Logistic Regression model instantly flags the linguistic risk of the text being fake.",
        "step3Title": "Layer 2: Evidence Intelligence",
        "step3Desc": "The system extracts factual claims from the article and searches live, trusted internet sources. It semantically matches found evidence against the original claims to determine validity.",
        "step4Title": "Layer 3: Decision Engine",
        "step4Desc": "The raw ML risk and external evidence scores converge. Conflicts are resolved, overrides are applied, and a final, normalized Credibility Risk Score is generated.",
        "step5Title": "Output & Explainability",
        "step5Desc": "You receive a highly detailed breakdown, including the phrases that most influenced the ML model and a downloadable PDF report of the full investigation.",
        "step6Title": "Context-Aware Chatbot",
        "step6Desc": "Still have questions? Chat directly with an AI assistant that has read the article, the evidence gathered, and the final report to get deeper insights on demand.",
        "layer1": "Layer 1",
        "layer2": "Layer 2",
        "layer3": "Layer 3"
    }
}

hi = {
    "sidebar": {
        "dashboard": "डैशबोर्ड",
        "analyze": "विश्लेषण",
        "history": "इतिहास",
        "liveNews": "लाइव न्यूज़",
        "howItWorks": "यह कैसे काम करता है",
        "faq": "FAQ",
        "profile": "प्रोफ़ाइल",
        "settings": "सेटिंग्स",
        "logout": "लॉग आउट"
    },
    "liveNews": {
        "title": "लाइव न्यूज़",
        "subtitle": "प्रमुख श्रेणियों में वर्तमान समाचार देखें।",
        "loading": "लाइव न्यूज़ लोड हो रहा है...",
        "loadingDesc": "दुनिया भर से नवीनतम अपडेट प्राप्त कर रहे हैं।",
        "noNews": "इस श्रेणी में कोई समाचार उपलब्ध नहीं है।",
        "noDescription": "कोई विवरण उपलब्ध नहीं है।",
        "readArticle": "पूरी कहानी पढ़ें",
        "articlesCount": "लेख",
        "retry": "पुनः प्रयास करें",
        "categories": {
            "politics": "राजनीति",
            "business": "व्यापार और वित्त",
            "technology": "प्रौद्योगिकी",
            "sports": "खेल",
            "health": "स्वास्थ्य",
            "world": "विश्व"
        }
    },
    "header": {
        "aiVerification": "3 स्तरीय मजबूत मूल्यांकन"
    },
    "analyze": {
        "title": "सामग्री सत्यापन इंजन",
        "subtitle": "हमारे एआई मॉडल का उपयोग करके प्रामाणिकता सत्यापित करने के लिए सामग्री अपलोड करें या टेक्स्ट पेस्ट करें।",
        "tabs": {
            "text": "टेक्स्ट इनपुट",
            "url": "यूआरएल",
            "image": "छवि",
            "pdf": "पीडीएफ",
            "voice": "आवाज़",
            "qr": "क्यूआर कोड"
        },
        "inputs": {
            "titleOptional": "समाचार शीर्षक दर्ज करें (वैकल्पिक)",
            "pasteText": "लेख का पाठ यहाँ पेस्ट करें...",
            "verifyBtn": "सामग्री सत्यापित करें",
            "analyzing": "विश्लेषण कर रहा है...",
            "outputLang": "व्याख्या की भाषा:",
            "uploadImage": "छवि अपलोड करने के लिए क्लिक करें या खींचें",
            "uploadPdf": "पीडीएफ अपलोड करने के लिए क्लिक करें या खींचें",
            "enterUrl": "लेख का यूआरएल दर्ज करें...",
            "startRecording": "रिकॉर्डिंग शुरू करें",
            "stopRecording": "रिकॉर्डिंग बंद करें",
            "scanQr": "क्यूआर कोड स्कैन करें",
            "headline": "शीर्षक",
            "headlinePlaceholder": "समाचार शीर्षक दर्ज करें...",
            "articleContent": "लेख सामग्री",
            "articlePlaceholder": "मुख्य लेख का पाठ यहाँ पेस्ट करें...",
            "analyzeArticle": "लेख का विश्लेषण करें"
        },
        "report": {
            "probableSource": "संभावित स्रोत:",
            "analyzeAnother": "एक और लेख का विश्लेषण करें",
            "downloadPdf": "पीडीएफ रिपोर्ट डाउनलोड करें",
            "analyzingCredibility": "विश्वसनीयता का विश्लेषण कर रहा है",
            "runningMl": "एमएल वर्गीकरण और साक्ष्य खुफिया इंजन चला रहा है...",
            "mayTakeTime": "इसमें 10-20 सेकंड लग सकते हैं"
        }
    },
    "dashboard": {
        "title": "डैशबोर्ड",
        "welcome": "स्वागत है",
        "to": "FakeCheckPro में",
        "snapshot": "यहाँ आपकी सत्यापन गतिविधि का एक स्नैपशॉट है।",
        "downloadPdf": "पीडीएफ डाउनलोड करें",
        "totalChecks": "कुल जांच",
        "real": "असली",
        "partiallyTrue": "आंशिक रूप से सच",
        "fake": "फर्जी",
        "savedReports": "सहेजी गई रिपोर्टें",
        "activity": "गतिविधि (14 दिन)",
        "distribution": "विश्वसनीयता वितरण",
        "languages": "भाषाएं",
        "avgCredibility": "औसत विश्वसनीयता:",
        "realVsFake": "असली बनाम आंशिक बनाम फर्जी",
        "noData": "कोई डेटा उपलब्ध नहीं है",
        "globalTrending": "वैश्विक ट्रेंडिंग फर्जी विषय",
        "last30d": "पिछले 30 दिन",
        "flagged": "चिह्नित",
        "trendingKeywords": "ट्रेंडिंग कीवर्ड",
        "analyzeBtn": "लेख का विश्लेषण करें",
        "mlModel": "एमएल मॉडल",
        "features": "विशेषताएं",
        "upTo": "तक",
        "featuresCount": "विशेषताएं",
        "explainability": "व्याख्यात्मकता",
        "enabled": "सक्रिय",
        "featureContribution": "फीचर योगदान विश्लेषण"
    },
    "profile": {
        "title": "प्रोफ़ाइल",
        "cancel": "रद्द करें",
        "save": "सहेजें",
        "email": "ईमेल",
        "phone": "फ़ोन",
        "language": "भाषा",
        "memberSince": "सदस्यता तिथि",
        "notifications": "सूचनाएं",
        "privacy": "गोपनीयता",
        "enterPhone": "अपना फोन दर्ज करें",
        "on": "चालू",
        "private": "निजी"
    },
    "history": {
        "title": "विश्लेषण इतिहास",
        "analyses": "आपके विश्लेषण",
        "analysesDesc": "आपके द्वारा विश्लेषण किए गए पिछले लेखों, यूआरएल और छवियों का रिकॉर्ड।",
        "filters": {
            "all": "सभी विश्लेषण",
            "credible": "विश्वसनीय",
            "unverified": "असत्यापित",
            "misleading": "भ्रामक",
            "saved": "सहेजे गए"
        },
        "loading": "इतिहास लोड हो रहा है...",
        "noAnalyses": "अभी तक कोई विश्लेषण नहीं",
        "noAnalysesDesc": "आपके द्वारा विश्लेषण किए गए लेख यहां दिखाई देंगे।",
        "noItemsFilter": "फ़िल्टर के लिए कोई आइटम नहीं मिला:",
        "untitled": "अनाम विश्लेषण",
        "fakeNews": "फर्जी खबर",
        "realNews": "असली खबर",
        "confidence": "विश्वास",
        "riskScore": "जोखिम स्कोर",
        "unsave": "रिकॉर्ड सहेजना हटाएं",
        "save": "रिकॉर्ड सहेजें",
        "delete": "रिकॉर्ड हटाएं",
        "deleteConfirm": "क्या आप वाकई इस रिकॉर्ड को हटाना चाहते हैं?"
    },
    "faq": {
        "title": "अक्सर पूछे जाने वाले प्रश्न",
        "gotQuestions": "कोई सवाल?",
        "desc": "FakeCheckPro के बारे में सब कुछ, यह जानकारी का विश्लेषण कैसे करता है, और प्लेटफ़ॉर्म का अधिकतम लाभ कैसे उठाएं।",
        "q1": "FakeCheckPro क्या है?",
        "a1": "FakeCheckPro एक उन्नत, एआई-संचालित प्लेटफ़ॉर्म है जिसे नकली समाचारों का पता लगाने, दावों को सत्यापित करने और कई प्रारूपों में जानकारी की विश्वसनीयता का आकलन करने के लिए डिज़ाइन किया गया है।",
        "q2": "एआई विश्लेषण पाइपलाइन कैसे काम करती है?",
        "a2": "पाइपलाइन में तीन मुख्य परतें हैं: परत 1 प्रारंभिक वर्गीकरण के लिए एक मशीन लर्निंग मॉडल का उपयोग करती है। परत 2 दावों को निकालती है, विश्वसनीय स्रोतों से साक्ष्य खोजती है और उनका अर्थपूर्ण मिलान करती है। अंत में, परत 3 अंतिम विश्वसनीयता मूल्यांकन प्रदान करने के लिए स्कोरों को सामान्य करती है।",
        "q3": "मैं किस प्रकार के मीडिया का विश्लेषण कर सकता हूँ?",
        "a3": "आप सीधे टेक्स्ट इनपुट, पूर्ण वेबसाइट यूआरएल, छवियों (OCR) से निकाले गए टेक्स्ट, पीडीएफ दस्तावेजों, वॉयस नोट्स और यहां तक ​​कि क्यूआर कोड का भी विश्लेषण कर सकते हैं।",
        "q4": "क्या कई भाषाओं का समर्थन किया जाता है?",
        "a4": "हां! FakeCheckPro में बहुभाषी विश्लेषण क्षमताएं हैं। यह स्वचालित रूप से इनपुट भाषा का पता लगा सकता है और इसे मजबूत मॉडल प्रसंस्करण के लिए अंग्रेजी में अनुवाद कर सकता है।",
        "q5": "क्या साक्ष्य इंटेलिजेंस इंजन सटीक है?",
        "a5": "साक्ष्य इंटेलिजेंस इंजन लाइव, विश्वसनीय स्रोतों के खिलाफ निकाले गए दावों को क्रॉस-रेफरेंस करके सटीकता को महत्वपूर्ण रूप से बढ़ाता है।",
        "q6": "मेरे विश्लेषण डेटा को कैसे संभाला जाता है?",
        "a6": "आपकी गोपनीयता महत्वपूर्ण है। विश्लेषण के परिणाम आपके व्यक्तिगत इतिहास डैशबोर्ड में संग्रहीत किए जाते हैं ताकि आप बाद में उनकी समीक्षा कर सकें।",
        "q7": "एमएल वर्गीकरण और साक्ष्य इंटेलिजेंस के बीच क्या अंतर है?",
        "a7": "एमएल वर्गीकरण यह निर्धारित करने के लिए पाठ में भाषाई पैटर्न को देखता है कि क्या यह सामान्य नकली समाचार की तरह 'लगता' है। साक्ष्य इंटेलिजेंस इंटरनेट पर खोज करता है।",
        "q8": "क्या मैं विश्लेषण रिपोर्ट निर्यात या साझा कर सकता हूँ?",
        "a8": "हां। विश्लेषण पूरा होने के बाद, आप पीडीएफ रिपोर्ट डाउनलोड करें बटन पर क्लिक कर सकते हैं।",
        "q9": "विश्वसनीयता जोखिम स्कोर का क्या अर्थ है?",
        "a9": "विश्वसनीयता जोखिम स्कोर 0 से 100 तक एक मीट्रिक है। कम स्कोर का अर्थ है उच्च विश्वसनीयता।",
        "q10": "चैटबॉट सहायक मेरी कैसे मदद करता है?",
        "a10": "चैटबॉट सहायक एक एआई है जो विश्लेषण चलाने के बाद दिखाई देता है। यह पूरी रिपोर्ट और एकत्रित साक्ष्य पढ़ता है। आप इससे लेख के बारे में विशिष्ट प्रश्न पूछ सकते हैं।"
    },
    "howItWorks": {
        "title": "यह कैसे काम करता है",
        "pipeline": "विश्लेषण पाइपलाइन",
        "desc": "FakeCheckPro एक परिष्कृत 3-स्तरीय वास्तुकला का उपयोग करता है, जो अद्वितीय सटीकता प्रदान करने के लिए उन्नत साक्ष्य इंटेलिजेंस के साथ पारंपरिक मशीन लर्निंग का संयोजन करता है।",
        "step1Title": "मल्टीमॉडल इनपुट",
        "step1Desc": "सीधे टेक्स्ट, एक यूआरएल, एक छवि अपलोड करने, एक पीडीएफ दस्तावेज़ पार्स करने, एक वॉयस नोट के माध्यम से समाचार सबमिट करें।",
        "step2Title": "परत 1: एमएल वर्गीकरण",
        "step2Desc": "टेक्स्ट को साफ किया जाता है, अनुवाद किया जाता है, और TF-IDF का उपयोग करके वेक्टराइज किया जाता है। एक मजबूत लॉजिस्टिक रिग्रेशन मॉडल तुरंत टेक्स्ट के फर्जी होने के भाषाई जोखिम को चिह्नित करता है।",
        "step3Title": "परत 2: साक्ष्य इंटेलिजेंस",
        "step3Desc": "सिस्टम लेख से तथ्यात्मक दावों को निकालता है और लाइव, विश्वसनीय इंटरनेट स्रोतों की खोज करता है। यह वैधता निर्धारित करने के लिए मूल दावों के खिलाफ पाए गए साक्ष्यों का मिलान करता है।",
        "step4Title": "परत 3: निर्णय इंजन",
        "step4Desc": "कच्चे एमएल जोखिम और बाहरी साक्ष्य स्कोर परिवर्तित होते हैं। संघर्षों को हल किया जाता है और एक अंतिम, सामान्यीकृत विश्वसनीयता जोखिम स्कोर उत्पन्न किया जाता है।",
        "step5Title": "आउटपुट और व्याख्यात्मकता",
        "step5Desc": "आपको एक अत्यधिक विस्तृत ब्रेकडाउन प्राप्त होता है, जिसमें वे वाक्यांश शामिल हैं जिन्होंने एमएल मॉडल को सबसे अधिक प्रभावित किया।",
        "step6Title": "संदर्भ-जागरूक चैटबॉट",
        "step6Desc": "अभी भी प्रश्न हैं? सीधे एक एआई सहायक के साथ चैट करें जिसने लेख, एकत्रित साक्ष्य और अंतिम रिपोर्ट पढ़ी है।",
        "layer1": "परत 1",
        "layer2": "परत 2",
        "layer3": "परत 3"
    }
}

mr = {
    "sidebar": {
        "dashboard": "डॅशबोर्ड",
        "analyze": "विश्लेषण",
        "history": "इतिहास",
        "liveNews": "थेट बातम्या",
        "howItWorks": "हे कसे कार्य करते",
        "faq": "FAQ",
        "profile": "प्रोफाइल",
        "settings": "सेटिंग्ज",
        "logout": "बाहेर पडा"
    },
    "liveNews": {
        "title": "थेट बातम्या",
        "subtitle": "प्रमुख श्रेणींमध्ये वर्तमान बातम्या एक्सप्लोर करा.",
        "loading": "थेट बातम्या लोड होत आहेत...",
        "loadingDesc": "जगभरातील नवीनतम अद्यतने आणत आहे.",
        "noNews": "या श्रेणीमध्ये कोणत्याही बातम्या उपलब्ध नाहीत.",
        "noDescription": "कोणतेही वर्णन उपलब्ध नाही.",
        "readArticle": "संपूर्ण बातमी वाचा",
        "articlesCount": "लेख",
        "retry": "पुन्हा प्रयत्न करा",
        "categories": {
            "politics": "राजकारण",
            "business": "व्यापार आणि वित्त",
            "technology": "तंत्रज्ञान",
            "sports": "खेळ",
            "health": "आरोग्य",
            "world": "जग"
        }
    },
    "header": {
        "aiVerification": "3 स्तरीय भक्कम मूल्यमापन"
    },
    "analyze": {
        "title": "सामग्री पडताळणी इंजिन",
        "subtitle": "आमच्या एआय मॉडेल्सचा वापर करून सत्यता पडताळण्यासाठी सामग्री अपलोड करा किंवा मजकूर पेस्ट करा.",
        "tabs": {
            "text": "मजकूर इनपुट",
            "url": "यूआरएल",
            "image": "प्रतिमा",
            "pdf": "पीडीएफ",
            "voice": "आवाज",
            "qr": "क्यूआर कोड"
        },
        "inputs": {
            "titleOptional": "बातम्यांचे शीर्षक प्रविष्ट करा (पर्यायी)",
            "pasteText": "लेखाचा मजकूर येथे पेस्ट करा...",
            "verifyBtn": "सामग्री पडताळणी करा",
            "analyzing": "विश्लेषण करत आहे...",
            "outputLang": "स्पष्टीकरणाची भाषा:",
            "uploadImage": "प्रतिमा अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग करा",
            "uploadPdf": "पीडीएफ अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग करा",
            "enterUrl": "लेखाची यूआरएल प्रविष्ट करा...",
            "startRecording": "रेकॉर्डिंग सुरू करा",
            "stopRecording": "रेकॉर्डिंग थांबवा",
            "scanQr": "क्यूआर कोड स्कॅन करा",
            "headline": "शीर्षक",
            "headlinePlaceholder": "बातम्यांचे शीर्षक प्रविष्ट करा...",
            "articleContent": "लेखाचा मजकूर",
            "articlePlaceholder": "मुख्य लेखाचा मजकूर येथे पेस्ट करा...",
            "analyzeArticle": "लेखाचे विश्लेषण करा"
        },
        "report": {
            "probableSource": "संभावित स्त्रोत:",
            "analyzeAnother": "आणखी एका लेखाचे विश्लेषण करा",
            "downloadPdf": "पीडीएफ रिपोर्ट डाउनलोड करा",
            "analyzingCredibility": "विश्वसनीयतेचे विश्लेषण करत आहे",
            "runningMl": "एमएल वर्गीकरण आणि पुरावे इंटेलिजेंस इंजिन चालवत आहे...",
            "mayTakeTime": "याला 10-20 सेकंद लागू शकतात"
        }
    },
    "dashboard": {
        "title": "डॅशबोर्ड",
        "welcome": "स्वागत आहे",
        "to": "FakeCheckPro मध्ये",
        "snapshot": "येथे आपल्या पडताळणी क्रियाकलापाचा स्नॅपशॉट आहे.",
        "downloadPdf": "पीडीएफ डाउनलोड करा",
        "totalChecks": "एकूण तपासणी",
        "real": "खरे",
        "partiallyTrue": "अंशतः खरे",
        "fake": "बनावट",
        "savedReports": "जतन केलेले अहवाल",
        "activity": "क्रियाकलाप (14 दिवस)",
        "distribution": "विश्वसनीयता वितरण",
        "languages": "भाषा",
        "avgCredibility": "सरासरी विश्वसनीयता:",
        "realVsFake": "खरे विरुद्ध अंशतः विरुद्ध बनावट",
        "noData": "कोणताही डेटा उपलब्ध नाही",
        "globalTrending": "जागतिक ट्रेंडिंग बनावट विषय",
        "last30d": "गेले 30 दिवस",
        "flagged": "चिन्हांकित",
        "trendingKeywords": "ट्रेंडिंग कीवर्ड",
        "analyzeBtn": "लेखाचे विश्लेषण करा",
        "mlModel": "एमएल मॉडेल",
        "features": "वैशिष्ट्ये",
        "upTo": "पर्यंत",
        "featuresCount": "वैशिष्ट्ये",
        "explainability": "स्पष्टीकरण क्षमता",
        "enabled": "सक्रिय",
        "featureContribution": "वैशिष्ट्य योगदान विश्लेषण"
    },
    "profile": {
        "title": "प्रोफाइल",
        "cancel": "रद्द करा",
        "save": "जतन करा",
        "email": "ईमेल",
        "phone": "फोन",
        "language": "भाषा",
        "memberSince": "सदस्यता तारीख",
        "notifications": "सूचना",
        "privacy": "गोपनीयता",
        "enterPhone": "तुमचा फोन एंटर करा",
        "on": "चालू",
        "private": "खासगी"
    },
    "history": {
        "title": "विश्लेषण इतिहास",
        "analyses": "आपले विश्लेषण",
        "analysesDesc": "आपण विश्लेषण केलेल्या मागील लेखांची आणि URL ची नोंद.",
        "filters": {
            "all": "सर्व विश्लेषण",
            "credible": "विश्वसनीय",
            "unverified": "अत्यापित",
            "misleading": "दिशाभूल करणारे",
            "saved": "जतन केलेले"
        },
        "loading": "इतिहास लोड होत आहे...",
        "noAnalyses": "अद्याप कोणतेही विश्लेषण नाही",
        "noAnalysesDesc": "आपण विश्लेषण केलेले लेख येथे दिसतील.",
        "noItemsFilter": "फिल्टरसाठी कोणतेही आयटम आढळले नाहीत:",
        "untitled": "निनावी विश्लेषण",
        "fakeNews": "बनावट बातमी",
        "realNews": "खरी बातमी",
        "confidence": "विश्वास",
        "riskScore": "धोका स्कोअर",
        "unsave": "रेकॉर्ड जतन करणे काढा",
        "save": "रेकॉर्ड जतन करा",
        "delete": "रेकॉर्ड हटवा",
        "deleteConfirm": "तुम्हाला नक्की हा रेकॉर्ड हटवायचा आहे का?"
    },
    "faq": {
        "title": "सतत विचारले जाणारे प्रश्न",
        "gotQuestions": "प्रश्न आहेत?",
        "desc": "FakeCheckPro बद्दल सर्व काही, हे माहितीचे विश्लेषण कसे करते आणि प्लॅटफॉर्मचा जास्तीत जास्त फायदा कसा मिळवायचा.",
        "q1": "FakeCheckPro काय आहे?",
        "a1": "FakeCheckPro हे एक प्रगत, AI-चालित प्लॅटफॉर्म आहे जे बनावट बातम्या शोधण्यासाठी, दाव्यांची पडताळणी करण्यासाठी आणि माहितीची विश्वासार्हता तपासण्यासाठी डिझाइन केले आहे.",
        "q2": "AI विश्लेषण पाइपलाइन कशी काम करते?",
        "a2": "पाइपलाइनमध्ये तीन मुख्य स्तर असतात: स्तर 1 प्रारंभिक वर्गीकरणासाठी मशीन लर्निंग मॉडेल वापरतो. स्तर 2 दावे काढतो, विश्वसनीय स्त्रोतांकडून पुरावे शोधतो. आणि स्तर 3 अंतिम विश्वसनीयता मूल्यांकन प्रदान करण्यासाठी स्कोअर सामान्य करतो.",
        "q3": "मी कोणत्या प्रकारच्या मीडियाचे विश्लेषण करू शकतो?",
        "a3": "आपण थेट मजकूर, वेबसाइट URL, प्रतिमा (OCR), PDF दस्तऐवज, व्हॉइस नोट्स आणि QR कोडचे विश्लेषण करू शकता.",
        "q4": "एकाधिक भाषांना समर्थन आहे का?",
        "a4": "होय! FakeCheckPro मध्ये बहुभाषिक विश्लेषण क्षमता आहेत. ते स्वयंचलितपणे इनपुट भाषा शोधू शकते आणि इंग्रजीमध्ये भाषांतरित करू शकते.",
        "q5": "पुरावा इंटेलिजेंस इंजिन अचूक आहे का?",
        "a5": "पुरावा इंटेलिजेंस इंजिन लाइव्ह, विश्वसनीय स्त्रोतांच्या विरूद्ध काढलेल्या दाव्यांचा क्रॉस-रेफरन्स करून अचूकता लक्षणीयरीत्या वाढवते.",
        "q6": "माझा विश्लेषण डेटा कसा हाताळला जातो?",
        "a6": "आपली गोपनीयता महत्त्वाची आहे. विश्लेषणाचे परिणाम आपल्या वैयक्तिक इतिहास डॅशबोर्डमध्ये जतन केले जातात जेणेकरून आपण नंतर त्यांचे पुनरावलोकन करू शकाल.",
        "q7": "एमएल वर्गीकरण आणि पुरावा इंटेलिजेंसमध्ये काय फरक आहे?",
        "a7": "एमएल वर्गीकरण मजकुरातील भाषिक नमुने पाहते. पुरावा इंटेलिजेंस इंटरनेटवर शोध घेते.",
        "q8": "मी विश्लेषण अहवाल निर्यात किंवा शेअर करू शकतो का?",
        "a8": "होय. विश्लेषण पूर्ण झाल्यावर, आपण 'पीडीएफ अहवाल डाउनलोड करा' बटणावर क्लिक करू शकता.",
        "q9": "क्रेडिबिलिटी रिस्क स्कोअरचा अर्थ काय?",
        "a9": "क्रेडिबिलिटी रिस्क स्कोअर हे 0 ते 100 पर्यंतचे मेट्रिक आहे. कमी स्कोअरचा अर्थ उच्च विश्वासार्हता असा होतो.",
        "q10": "चॅटबॉट सहाय्यक मला कशी मदत करतो?",
        "a10": "चॅटबॉट सहाय्यक हा एक AI आहे जो विश्लेषण चालवल्यानंतर दिसतो. तो संपूर्ण अहवाल आणि गोळा केलेले पुरावे वाचतो. आपण त्याला लेखाबद्दल विशिष्ट प्रश्न विचारू शकता."
    },
    "howItWorks": {
        "title": "हे कसे कार्य करते",
        "pipeline": "विश्लेषण पाइपलाइन",
        "desc": "FakeCheckPro एक अत्याधुनिक 3-स्तरीय आर्किटेक्चर वापरते, अद्वितीय अचूकता देण्यासाठी प्रगत पुरावा इंटेलिजेंससह पारंपारिक मशीन लर्निंग एकत्र करते.",
        "step1Title": "मल्टीमोडल इनपुट",
        "step1Desc": "थेट मजकूर, एक URL, एक प्रतिमा अपलोड करून, PDF दस्तऐवज पार्स करून बातम्या सबमिट करा.",
        "step2Title": "स्तर 1: एमएल वर्गीकरण",
        "step2Desc": "मजकूर स्वच्छ केला जातो, अनुवादित केला जातो आणि TF-IDF वापरून वेक्टराइज केला जातो. एक मजबूत लॉजिस्टिक रिग्रेशन मॉडेल मजकूर बनावट असण्याचा भाषिक धोका त्वरित चिन्हांकित करते.",
        "step3Title": "स्तर 2: पुरावा इंटेलिजेंस",
        "step3Desc": "सिस्टीम लेखामधून तथ्यात्मक दावे काढते आणि थेट, विश्वसनीय इंटरनेट स्त्रोत शोधते. वैधता निर्धारित करण्यासाठी मूळ दाव्यांविरुद्ध सापडलेल्या पुराव्यांची जुळवाजुळव करते.",
        "step4Title": "स्तर 3: निर्णय इंजिन",
        "step4Desc": "कच्चा एमएल धोका आणि बाह्य पुरावे स्कोअर एकत्र येतात. आणि अंतिम, सामान्यीकृत क्रेडिबिलिटी रिस्क स्कोअर व्युत्पन्न केला जातो.",
        "step5Title": "आउटपुट आणि स्पष्टीकरण क्षमता",
        "step5Desc": "आपल्याला एक अत्यंत तपशीलवार ब्रेकडाउन प्राप्त होतो, ज्यामध्ये एमएल मॉडेलवर सर्वाधिक प्रभाव टाकणारे वाक्य समाविष्ट आहेत.",
        "step6Title": "संदर्भ-जागरूक चॅटबॉट",
        "step6Desc": "अजूनही प्रश्न आहेत? थेट AI सहाय्यकाशी चॅट करा ज्याने लेख, गोळा केलेले पुरावे आणि अंतिम अहवाल वाचला आहे.",
        "layer1": "स्तर 1",
        "layer2": "स्तर 2",
        "layer3": "स्तर 3"
    }
}

resources = {
    "en": {"translation": en},
    "hi": {"translation": hi},
    "mr": {"translation": mr}
}

js_content = f"""import i18n from 'i18next';
import {{ initReactI18next }} from 'react-i18next';

const resources = {json.dumps(resources, indent=2, ensure_ascii=False)};

i18n
  .use(initReactI18next)
  .init({{
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {{
      escapeValue: false 
    }}
  }});

export default i18n;
"""

with open("d:\\FakeCheckPro\\frontend\\src\\i18n.js", "w", encoding="utf-8") as f:
    f.write(js_content)
print("Updated i18n.js")
