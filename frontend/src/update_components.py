import re
import os

files_to_update = [
    ("d:\\FakeCheckPro\\frontend\\src\\pages\\FAQ.jsx", "faq"),
    ("d:\\FakeCheckPro\\frontend\\src\\pages\\HowItWorks.jsx", "howItWorks"),
    ("d:\\FakeCheckPro\\frontend\\src\\pages\\History.jsx", "history"),
    ("d:\\FakeCheckPro\\frontend\\src\\pages\\Profile.jsx", "profile"),
    ("d:\\FakeCheckPro\\frontend\\src\\pages\\Dashboard.jsx", "dashboard"),
    ("d:\\FakeCheckPro\\frontend\\src\\pages\\Analyze.jsx", "analyze")
]

for file_path, namespace in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Add import { useTranslation } from 'react-i18next'; if missing
    if "useTranslation" not in content:
        content = re.sub(r'(import React.*?;)', r'\1\nimport { useTranslation } from \'react-i18next\';', content, count=1)
        
    # Insert const { t } = useTranslation();
    # Find functional component definition
    component_name = os.path.basename(file_path).split('.')[0]
    func_pattern = re.compile(rf'const {component_name} = (\([^)]*\)) => {{\n')
    if "const { t } = useTranslation();" not in content and "const { t, i18n } = useTranslation();" not in content:
        content = func_pattern.sub(rf'const {component_name} = \g<1> => {{\n  const {{ t }} = useTranslation();\n', content)

    # Manual replacements per file
    if namespace == "faq":
        content = content.replace('title="FAQ"', 'title={t("faq.title")}')
        content = content.replace('>Got Questions?<', '>{t("faq.gotQuestions")}<')
        content = content.replace('Everything you need to know about FakeCheckPro, how it analyzes information, and how to get the most out of the platform.', '{t("faq.desc")}')

        content = content.replace('"What is FakeCheckPro?"', 't("faq.q1")')
        content = content.replace('"FakeCheckPro is an advanced, AI-driven platform designed to detect fake news, verify claims, and assess the credibility of information across multiple formats. It leverages both Machine Learning classification and a deep Evidence Intelligence Engine to give you comprehensive insights."', 't("faq.a1")')

        content = content.replace('"How does the AI Analysis Pipeline work?"', 't("faq.q2")')
        content = content.replace('"The pipeline consists of three main layers: Layer 1 uses a Machine Learning model (like Logistic Regression with TF-IDF) for initial classification. Layer 2, the Evidence Intelligence Engine, extracts claims, searches for evidence from trusted sources, and semantically matches them. Finally, Layer 3 (Decision Engine) normalizes the scores and resolves conflicts to provide a final credibility assessment."', 't("faq.a2")')

        content = content.replace('"What types of media can I analyze?"', 't("faq.q3")')
        content = content.replace('"You can analyze direct text input, full website URLs, text extracted from images (OCR), PDF documents, transcribed voice notes, and even QR codes that link to articles or text."', 't("faq.a3")')

        content = content.replace('"Are multiple languages supported?"', 't("faq.q4")')
        content = content.replace('"Yes! FakeCheckPro features multilingual analysis capabilities. It can automatically detect the input language (such as Hindi or Marathi), translate it to English for robust model processing, and then provide the output report back in your preferred language."', 't("faq.a4")')

        content = content.replace('"Is the Evidence Intelligence Engine accurate?"', 't("faq.q5")')
        content = content.replace('"The Evidence Intelligence Engine significantly boosts accuracy by cross-referencing extracted claims against live, trusted sources. However, it serves as an AI-assisted indicator of credibility risk rather than an absolute statistical truth. We recommend using it alongside your own critical judgment."', 't("faq.a5")')

        content = content.replace('"How is my analysis data handled?"', 't("faq.q6")')
        content = content.replace('"Your privacy is important. Analysis results are stored in your personal History dashboard so you can review them later. You have full control over this data and can delete previous scans at any time from the History page."', 't("faq.a6")')

        content = content.replace('"What is the difference between ML Classification and Evidence Intelligence?"', 't("faq.q7")')
        content = content.replace('"ML Classification looks at the linguistic patterns and vocabulary in the text itself to determine if it \'sounds\' like typical fake news. Evidence Intelligence, on the other hand, actively searches the internet to verify the factual claims made in the text against reliable external sources."', 't("faq.a7")')

        content = content.replace('"Can I export or share the analysis report?"', 't("faq.q8")')
        content = content.replace('"Yes. Once an analysis is complete, you can click the \'Download PDF Report\' button at the top of the results to generate a formatted PDF containing the credibility score, important phrases, and evidence verification details."', 't("faq.a8")')

        content = content.replace('"What does the Credibility Risk Score mean?"', 't("faq.q9")')
        content = content.replace('"The Credibility Risk Score is a composite metric ranging from 0 to 100. A low score indicates high credibility (safe), while a high score indicates a significant risk of misinformation. It is calculated by blending the ML model\'s confidence with the quality and direction of the external evidence found."', 't("faq.a9")')

        content = content.replace('"How does the Chatbot Assistant help me?"', 't("faq.q10")')
        content = content.replace('"The Chatbot Assistant is a context-aware AI that appears after you run an analysis. It reads the full report and the evidence gathered. You can ask it specific questions about the article, request summaries, or ask it to explain why certain claims were flagged as misleading."', 't("faq.a10")')

    if namespace == "howItWorks":
        content = content.replace('title="How It Works"', 'title={t("howItWorks.title")}')
        content = content.replace('>The Analysis Pipeline<', '>{t("howItWorks.pipeline")}<')
        content = content.replace('FakeCheckPro utilizes a sophisticated 3-layer architecture, combining traditional Machine Learning with advanced Evidence Intelligence to deliver unparalleled accuracy.', '{t("howItWorks.desc")}')
        
        content = content.replace("'Multimodal Input'", "t('howItWorks.step1Title')")
        content = content.replace("'Submit news via direct text, a URL, uploading an image (OCR), parsing a PDF document, transcribing a voice note, or scanning a QR code.'", "t('howItWorks.step1Desc')")
        
        content = content.replace("'Layer 1: ML Classification'", "t('howItWorks.step2Title')")
        content = content.replace("'The text is cleaned, translated (if not in English), and vectorized using TF-IDF. A robust Logistic Regression model instantly flags the linguistic risk of the text being fake.'", "t('howItWorks.step2Desc')")
        
        content = content.replace("'Layer 2: Evidence Intelligence'", "t('howItWorks.step3Title')")
        content = content.replace("'The system extracts factual claims from the article and searches live, trusted internet sources. It semantically matches found evidence against the original claims to determine validity.'", "t('howItWorks.step3Desc')")
        
        content = content.replace("'Layer 3: Decision Engine'", "t('howItWorks.step4Title')")
        content = content.replace("'The raw ML risk and external evidence scores converge. Conflicts are resolved, overrides are applied, and a final, normalized Credibility Risk Score is generated.'", "t('howItWorks.step4Desc')")
        
        content = content.replace("'Output & Explainability'", "t('howItWorks.step5Title')")
        content = content.replace("'You receive a highly detailed breakdown, including the phrases that most influenced the ML model and a downloadable PDF report of the full investigation.'", "t('howItWorks.step5Desc')")
        
        content = content.replace("'Context-Aware Chatbot'", "t('howItWorks.step6Title')")
        content = content.replace("'Still have questions? Chat directly with an AI assistant that has read the article, the evidence gathered, and the final report to get deeper insights on demand.'", "t('howItWorks.step6Desc')")
        
        content = content.replace("'Layer 1'", "t('howItWorks.layer1')")
        content = content.replace("'Layer 2'", "t('howItWorks.layer2')")
        content = content.replace("'Layer 3'", "t('howItWorks.layer3')")

    if namespace == "history":
        content = content.replace('title="Analysis History"', 'title={t("history.title")}')
        content = content.replace('>Your Analyses<', '>{t("history.analyses")}<')
        content = content.replace('A record of past articles, URLs, and images you\'ve analyzed.', '{t("history.analysesDesc")}')
        content = content.replace("['All Analysis', 'Credible', 'Unverified', 'Misleading', 'Saved']", "[t('history.filters.all'), t('history.filters.credible'), t('history.filters.unverified'), t('history.filters.misleading'), t('history.filters.saved')]")
        content = content.replace(">Loading history...<", ">{t('history.loading')}<")
        content = content.replace(">No analyses yet<", ">{t('history.noAnalyses')}<")
        content = content.replace("Your analyzed articles will appear here once you start using the Analyze News tool.", "{t('history.noAnalysesDesc')}")
        content = content.replace("No items found for filter: ", "{t('history.noItemsFilter')} ")
        content = content.replace('"Untitled Analysis"', 't("history.untitled")')
        content = content.replace("'Fake News'", "t('history.fakeNews')")
        content = content.replace("'Real News'", "t('history.realNews')")
        content = content.replace("% Confidence", "% {t('history.confidence')}")
        content = content.replace("Risk Score", "{t('history.riskScore')}")
        content = content.replace('"Unsave Record"', 't("history.unsave")')
        content = content.replace('"Save Record"', 't("history.save")')
        content = content.replace('"Delete Record"', 't("history.delete")')
        content = content.replace('"Are you sure you want to delete this record?"', 't("history.deleteConfirm")')

    if namespace == "profile":
        content = content.replace('title="Profile"', 'title={t("profile.title")}')
        content = content.replace('>Cancel<', '>{t("profile.cancel")}<')
        content = content.replace('>Save<', '>{t("profile.save")}<')
        content = content.replace('>Email<', '>{t("profile.email")}<')
        content = content.replace('>Phone<', '>{t("profile.phone")}<')
        content = content.replace('placeholder="Enter your phone"', 'placeholder={t("profile.enterPhone")}')
        content = content.replace('>Language<', '>{t("profile.language")}<')
        content = content.replace('>Member Since<', '>{t("profile.memberSince")}<')
        content = content.replace('>Notifications<', '>{t("profile.notifications")}<')
        content = content.replace('>On<', '>{t("profile.on")}<')
        content = content.replace('>Privacy<', '>{t("profile.privacy")}<')
        content = content.replace('>Private<', '>{t("profile.private")}<')

    if namespace == "dashboard":
        content = content.replace("t('dashboard.title', 'Dashboard')", "t('dashboard.title')")
        content = content.replace('>Welcome<', '>{t("dashboard.welcome")}<')
        content = content.replace('>to<', '>{t("dashboard.to")}<')
        content = content.replace('Here\'s a snapshot of your verification activity.', '{t("dashboard.snapshot")}')
        content = content.replace('>Download PDF<', '>{t("dashboard.downloadPdf")}<')
        content = content.replace('>Total Checks<', '>{t("dashboard.totalChecks")}<')
        content = content.replace('>Real<', '>{t("dashboard.real")}<')
        content = content.replace('>Partially True<', '>{t("dashboard.partiallyTrue")}<')
        content = content.replace('>Fake<', '>{t("dashboard.fake")}<')
        content = content.replace('>Saved Reports<', '>{t("dashboard.savedReports")}<')
        content = content.replace('>Activity (14D)<', '>{t("dashboard.activity")}<')
        content = content.replace('>Real vs Partial vs Fake<', '>{t("dashboard.realVsFake")}<')
        content = content.replace('Avg. credibility:', '{t("dashboard.avgCredibility")}')
        content = content.replace('>Credibility Distribution<', '>{t("dashboard.distribution")}<')
        content = content.replace('>Languages<', '>{t("dashboard.languages")}<')
        content = content.replace('>No data available<', '>{t("dashboard.noData")}<')
        content = content.replace('GLOBAL TRENDING <span className="text-[#ef4444]">FAKE TOPICS</span>', '{t("dashboard.globalTrending")}')
        content = content.replace('LAST 30D', '{t("dashboard.last30d")}')
        content = content.replace('6 FLAGGED', '{t("dashboard.flagged")}')
        content = content.replace('TRENDING KEYWORDS', '{t("dashboard.trendingKeywords")}')

    if namespace == "analyze":
        content = content.replace('Probable Source:', '{t("analyze.report.probableSource")}')
        content = content.replace('Analyze Another Article', '{t("analyze.report.analyzeAnother")}')
        content = content.replace('Download PDF Report', '{t("analyze.report.downloadPdf")}')
        content = content.replace('Analyzing Credibility', '{t("analyze.report.analyzingCredibility")}')
        content = content.replace('Running ML Classification & Evidence Intelligence Engine...', '{t("analyze.report.runningMl")}')
        content = content.replace('This may take 10-20 seconds', '{t("analyze.report.mayTakeTime")}')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
