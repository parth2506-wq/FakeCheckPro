import json
import re

file_path = 'd:\\FakeCheckPro\\frontend\\src\\i18n.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

en_reasons = '''"decisionReasons": {
            "noEvidence": "No reliable evidence was found to corroborate or contradict the claims.",
            "highMlNoEvidenceFake": "High ML risk was detected, but external evidence is insufficient to independently establish falsity.",
            "mlRiskNoEvidence": "ML model indicates a risk level, but available external evidence is insufficient to independently establish falsity.",
            "weightedCombination": "Final assessment derived from weighted combination of ML and external evidence.",
            "strongEvidenceContradicts": "Strong external evidence directly contradicts the claims, overriding other signals.",
            "strongEvidenceOverridesMl": "Strong external evidence overrides ML classification.",
            "strongEvidenceSupportsDespiteMl": "Strong external evidence supports the central claims despite high ML risk.",
            "strongEvidenceCorroborates": "Strong external evidence corroborates the claims.",
            "highMlWeakEvidence": "ML classification indicates high risk, while available external evidence is weak and insufficient for a definitive contradiction.",
            "weakEvidence": "External evidence is weak and insufficient for a definitive conclusion.",
            "mixedEvidenceHighMl": "External evidence is mixed, but the ML classifier identifies strong linguistic risk.",
            "mixedEvidenceReview": "External evidence contains meaningful support and contradiction. Manual review recommended.",
            "supportEvidenceHighMl": "External evidence provides meaningful support, but the ML classifier identifies strong linguistic risk.",
            "contradictEvidenceLowMl": "External evidence contradicts the claim, but the ML classifier suggests low risk.",
            "signalsAligned": "Signals are aligned and weighted calculation determines the final assessment."
          }'''

hi_reasons = '''"decisionReasons": {
            "noEvidence": "दावों की पुष्टि या खंडन करने के लिए कोई विश्वसनीय साक्ष्य नहीं मिला।",
            "highMlNoEvidenceFake": "उच्च एमएल जोखिम का पता चला था, लेकिन स्वतंत्र रूप से झूठ स्थापित करने के लिए बाहरी साक्ष्य अपर्याप्त है।",
            "mlRiskNoEvidence": "एमएल मॉडल एक जोखिम स्तर को इंगित करता है, लेकिन उपलब्ध बाहरी साक्ष्य स्वतंत्र रूप से झूठ स्थापित करने के लिए अपर्याप्त है।",
            "weightedCombination": "अंतिम मूल्यांकन एमएल और बाहरी साक्ष्य के भारित संयोजन से प्राप्त हुआ।",
            "strongEvidenceContradicts": "मजबूत बाहरी साक्ष्य सीधे दावों का खंडन करते हैं, अन्य संकेतों को खत्म करते हैं।",
            "strongEvidenceOverridesMl": "मजबूत बाहरी साक्ष्य एमएल वर्गीकरण को खत्म करते हैं।",
            "strongEvidenceSupportsDespiteMl": "मजबूत बाहरी साक्ष्य उच्च एमएल जोखिम के बावजूद केंद्रीय दावों का समर्थन करते हैं।",
            "strongEvidenceCorroborates": "मजबूत बाहरी साक्ष्य दावों की पुष्टि करते हैं।",
            "highMlWeakEvidence": "एमएल वर्गीकरण उच्च जोखिम को इंगित करता है, जबकि उपलब्ध बाहरी साक्ष्य कमजोर है और निश्चित खंडन के लिए अपर्याप्त है।",
            "weakEvidence": "बाहरी साक्ष्य कमजोर है और निश्चित निष्कर्ष के लिए अपर्याप्त है।",
            "mixedEvidenceHighMl": "बाहरी साक्ष्य मिश्रित है, लेकिन एमएल क्लासिफायर मजबूत भाषाई जोखिम की पहचान करता है।",
            "mixedEvidenceReview": "बाहरी साक्ष्य में सार्थक समर्थन और खंडन शामिल है। मैन्युअल समीक्षा की सिफारिश की जाती है।",
            "supportEvidenceHighMl": "बाहरी साक्ष्य सार्थक समर्थन प्रदान करता है, लेकिन एमएल क्लासिफायर मजबूत भाषाई जोखिम की पहचान करता है।",
            "contradictEvidenceLowMl": "बाहरी साक्ष्य दावे का खंडन करता है, लेकिन एमएल क्लासिफायर कम जोखिम का सुझाव देता है।",
            "signalsAligned": "संकेत संरेखित हैं और भारित गणना अंतिम मूल्यांकन निर्धारित करती है।"
          }'''

mr_reasons = '''"decisionReasons": {
            "noEvidence": "दाव्यांची पुष्टी किंवा खंडन करण्यासाठी कोणताही विश्वसनीय पुरावा आढळला नाही.",
            "highMlNoEvidenceFake": "उच्च एमएल धोका आढळला, परंतु स्वतंत्रपणे खोटेपणा स्थापित करण्यासाठी बाह्य पुरावा अपुरा आहे.",
            "mlRiskNoEvidence": "एमएल मॉडेल धोका पातळी दर्शवते, परंतु उपलब्ध बाह्य पुरावा स्वतंत्रपणे खोटेपणा स्थापित करण्यासाठी अपुरा आहे.",
            "weightedCombination": "एमएल आणि बाह्य पुराव्याच्या भारित संयोजनातून अंतिम मूल्यांकन प्राप्त झाले.",
            "strongEvidenceContradicts": "मजबूत बाह्य पुरावा थेट दाव्यांचे खंडन करतो, इतर संकेतांना ओव्हरराइड करतो.",
            "strongEvidenceOverridesMl": "मजबूत बाह्य पुरावा एमएल वर्गीकरणाला ओव्हरराइड करतो.",
            "strongEvidenceSupportsDespiteMl": "मजबूत बाह्य पुरावा उच्च एमएल धोका असूनही केंद्रीय दाव्यांना समर्थन देतो.",
            "strongEvidenceCorroborates": "मजबूत बाह्य पुरावा दाव्यांची पुष्टी करतो.",
            "highMlWeakEvidence": "एमएल वर्गीकरण उच्च धोका दर्शवते, तर उपलब्ध बाह्य पुरावा कमकुवत आहे आणि निश्चित खंडनासाठी अपुरा आहे.",
            "weakEvidence": "बाह्य पुरावा कमकुवत आहे आणि निश्चित निष्कर्षासाठी अपुरा आहे.",
            "mixedEvidenceHighMl": "बाह्य पुरावा संमिश्र आहे, परंतु एमएल क्लासिफायर मजबूत भाषिक धोका ओळखतो.",
            "mixedEvidenceReview": "बाह्य पुराव्यामध्ये अर्थपूर्ण समर्थन आणि खंडन आहे. मॅन्युअल पुनरावलोकनाची शिफारस केली जाते.",
            "supportEvidenceHighMl": "बाह्य पुरावा अर्थपूर्ण समर्थन देतो, परंतु एमएल क्लासिफायर मजबूत भाषिक धोका ओळखतो.",
            "contradictEvidenceLowMl": "बाह्य पुरावा दाव्याचे खंडन करतो, परंतु एमएल क्लासिफायर कमी धोका दर्शवतो.",
            "signalsAligned": "संकेत संरेखित आहेत आणि भारित गणना अंतिम मूल्यांकन निर्धारित करते."
          }'''

content = content.replace('"confidenceDesc": "Confidence reflects the model\'s learned classification patterns and is not proof of factual truth."\n        }', '"confidenceDesc": "Confidence reflects the model\'s learned classification patterns and is not proof of factual truth.",\n          ' + en_reasons + '\n        }')
content = content.replace('"confidenceDesc": "कॉन्फिडेंस मॉडल के सीखे गए वर्गीकरण पैटर्न को दर्शाता है और यह तथ्यात्मक सत्य का प्रमाण नहीं है।"\n        }', '"confidenceDesc": "कॉन्फिडेंस मॉडल के सीखे गए वर्गीकरण पैटर्न को दर्शाता है और यह तथ्यात्मक सत्य का प्रमाण नहीं है।",\n          ' + hi_reasons + '\n        }')
content = content.replace('"confidenceDesc": "कॉन्फिडन्स मॉडेलच्या शिकलेल्या वर्गीकरण नमुन्यांना प्रतिबिंबित करतो आणि तो तथ्यात्मक सत्याचा पुरावा नाही."\n        }', '"confidenceDesc": "कॉन्फिडन्स मॉडेलच्या शिकलेल्या वर्गीकरण नमुन्यांना प्रतिबिंबित करतो आणि तो तथ्यात्मक सत्याचा पुरावा नाही.",\n          ' + mr_reasons + '\n        }')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
