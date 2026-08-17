import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      sidebar: {
        dashboard: "Dashboard",
        analyze: "Analyze News",
        history: "History",
        howItWorks: "How It Works",
        settings: "Settings",
        logout: "Log Out"
      },
      header: {
        aiVerification: "3 Layer robust Evaluation"
      },
      analyze: {
        title: "Content Verification Engine",
        subtitle: "Upload content or paste text to verify authenticity using our AI models.",
        tabs: {
          text: "Text Input",
          url: "URL",
          image: "Image",
          pdf: "PDF",
          voice: "Voice",
          qr: "QR Code"
        },
        inputs: {
          titleOptional: "Enter News Title (Optional)",
          pasteText: "Paste article text here...",
          verifyBtn: "Verify Content",
          analyzing: "Analyzing...",
          outputLang: "Explanation Language:",
          uploadImage: "Click to upload or drag and drop an image",
          uploadPdf: "Click to upload or drag and drop a PDF",
          enterUrl: "Enter article URL...",
          startRecording: "Start Recording",
          stopRecording: "Stop Recording",
          scanQr: "Scan QR Code",
          headline: "Headline",
          headlinePlaceholder: "Enter the news headline...",
          articleContent: "Article Content",
          articlePlaceholder: "Paste the main article text here...",
          analyzeArticle: "Analyze Article"
        }
      },
      dashboard: {
        title: "Dashboard",
        welcome: "Welcome to FakeCheckPro",
        subtitle: "Evaluate news articles using our machine learning classifier. The system extracts textual features and identifies patterns associated with verified and unverified sources.",
        analyzeBtn: "Analyze an Article",
        mlModel: "ML Model",
        features: "Features",
        upTo: "Up to",
        featuresCount: "features",
        explainability: "Explainability",
        enabled: "Enabled",
        featureContribution: "Feature Contribution Analysis"
      }
    }
  },
  hi: {
    translation: {
      sidebar: {
        dashboard: "डैशबोर्ड",
        analyze: "विश्लेषण",
        history: "इतिहास",
        howItWorks: "यह कैसे काम करता है",
        settings: "सेटिंग्स",
        logout: "लॉग आउट"
      },
      header: {
        aiVerification: "3 स्तरीय मजबूत मूल्यांकन"
      },
      analyze: {
        title: "सामग्री सत्यापन इंजन",
        subtitle: "हमारे एआई मॉडल का उपयोग करके प्रामाणिकता सत्यापित करने के लिए सामग्री अपलोड करें या टेक्स्ट पेस्ट करें।",
        tabs: {
          text: "टेक्स्ट इनपुट",
          url: "यूआरएल",
          image: "छवि",
          pdf: "पीडीएफ",
          voice: "आवाज़",
          qr: "क्यूआर कोड"
        },
        inputs: {
          titleOptional: "समाचार शीर्षक दर्ज करें (वैकल्पिक)",
          pasteText: "लेख का पाठ यहाँ पेस्ट करें...",
          verifyBtn: "सामग्री सत्यापित करें",
          analyzing: "विश्लेषण कर रहा है...",
          outputLang: "व्याख्या की भाषा:",
          uploadImage: "छवि अपलोड करने के लिए क्लिक करें या खींचें",
          uploadPdf: "पीडीएफ अपलोड करने के लिए क्लिक करें या खींचें",
          enterUrl: "लेख का यूआरएल दर्ज करें...",
          startRecording: "रिकॉर्डिंग शुरू करें",
          stopRecording: "रिकॉर्डिंग बंद करें",
          scanQr: "क्यूआर कोड स्कैन करें",
          headline: "शीर्षक",
          headlinePlaceholder: "समाचार शीर्षक दर्ज करें...",
          articleContent: "लेख सामग्री",
          articlePlaceholder: "मुख्य लेख का पाठ यहाँ पेस्ट करें...",
          analyzeArticle: "लेख का विश्लेषण करें"
        }
      },
      dashboard: {
        title: "डैशबोर्ड",
        welcome: "FakeCheckPro में आपका स्वागत है",
        subtitle: "हमारे मशीन लर्निंग क्लासिफायर का उपयोग करके समाचार लेखों का मूल्यांकन करें। यह सिस्टम टेक्स्ट सुविधाओं को निकालता है और सत्यापित और असत्यापित स्रोतों से जुड़े पैटर्न की पहचान करता है।",
        analyzeBtn: "लेख का विश्लेषण करें",
        mlModel: "एमएल मॉडल",
        features: "विशेषताएं",
        upTo: "तक",
        featuresCount: "विशेषताएं",
        explainability: "व्याख्यात्मकता",
        enabled: "सक्रिय",
        featureContribution: "फीचर योगदान विश्लेषण"
      }
    }
  },
  mr: {
    translation: {
      sidebar: {
        dashboard: "डॅशबोर्ड",
        analyze: "विश्लेषण",
        history: "इतिहास",
        howItWorks: "हे कसे कार्य करते",
        settings: "सेटिंग्ज",
        logout: "लॉग आउट"
      },
      header: {
        aiVerification: "3 स्तरीय भक्कम मूल्यमापन"
      },
      analyze: {
        title: "सामग्री पडताळणी इंजिन",
        subtitle: "आमच्या एआय मॉडेल्सचा वापर करून सत्यता पडताळण्यासाठी सामग्री अपलोड करा किंवा मजकूर पेस्ट करा.",
        tabs: {
          text: "मजकूर इनपुट",
          url: "यूआरएल",
          image: "प्रतिमा",
          pdf: "पीडीएफ",
          voice: "आवाज",
          qr: "क्यूआर कोड"
        },
        inputs: {
          titleOptional: "बातम्यांचे शीर्षक प्रविष्ट करा (पर्यायी)",
          pasteText: "लेखाचा मजकूर येथे पेस्ट करा...",
          verifyBtn: "सामग्री पडताळणी करा",
          analyzing: "विश्लेषण करत आहे...",
          outputLang: "स्पष्टीकरणाची भाषा:",
          uploadImage: "प्रतिमा अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग करा",
          uploadPdf: "पीडीएफ अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग करा",
          enterUrl: "लेखाची यूआरएल प्रविष्ट करा...",
          startRecording: "रेकॉर्डिंग सुरू करा",
          stopRecording: "रेकॉर्डिंग थांबवा",
          scanQr: "क्यूआर कोड स्कॅन करा",
          headline: "शीर्षक",
          headlinePlaceholder: "बातम्यांचे शीर्षक प्रविष्ट करा...",
          articleContent: "लेखाचा मजकूर",
          articlePlaceholder: "मुख्य लेखाचा मजकूर येथे पेस्ट करा...",
          analyzeArticle: "लेखाचे विश्लेषण करा"
        }
      },
      dashboard: {
        title: "डॅशबोर्ड",
        welcome: "FakeCheckPro मध्ये आपले स्वागत आहे",
        subtitle: "आमच्या मशीन लर्निंग क्लासिफायरचा वापर करून बातम्यांच्या लेखांचे मूल्यांकन करा. सिस्टम मजकूर वैशिष्ट्ये काढते आणि सत्यापित आणि असत्यापित स्त्रोतांशी संबंधित नमुने ओळखते.",
        analyzeBtn: "लेखाचे विश्लेषण करा",
        mlModel: "एमएल मॉडेल",
        features: "वैशिष्ट्ये",
        upTo: "पर्यंत",
        featuresCount: "वैशिष्ट्ये",
        explainability: "स्पष्टीकरण क्षमता",
        enabled: "सक्रिय",
        featureContribution: "वैशिष्ट्य योगदान विश्लेषण"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
