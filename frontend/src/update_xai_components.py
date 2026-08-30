import os
import re

components_dir = 'd:\\FakeCheckPro\\frontend\\src\\components\\analyzer'

# Add import if missing
def add_import(content, component_name):
    if 'useTranslation' not in content:
        content = re.sub(r'(import React.*?;)', r"\1\nimport { useTranslation } from 'react-i18next';", content, count=1)
    
    # Add const { t } = useTranslation();
    # Find the const ComponentName = ...
    func_pattern = re.compile(rf'const {component_name} = (\([^)]*\)) => {{\n')
    if 'useTranslation();' not in content:
        content = func_pattern.sub(rf'const {component_name} = \g<1> => {{\n  const {{ t }} = useTranslation();\n', content)
    
    return content

# 1. CredibilityAssessmentCard.jsx
file_path = os.path.join(components_dir, 'CredibilityAssessmentCard.jsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = add_import(content, 'CredibilityAssessmentCard')
content = content.replace("'Supported / Credible'", "t('analyze.report.xai.supported')")
content = content.replace("'Likely Credible'", "t('analyze.report.xai.likelyCredible')")
content = content.replace("'Contradicted / High Risk'", "t('analyze.report.xai.contradicted')")
content = content.replace("'Likely Misleading'", "t('analyze.report.xai.likelyMisleading')")
content = content.replace("'Unverified / Inconclusive'", "t('analyze.report.xai.unverified')")

content = content.replace("'Signals Align (High Risk)'", "t('analyze.report.xai.signalsAlignHigh')")
content = content.replace("'Signals Align (Low Risk)'", "t('analyze.report.xai.signalsAlignLow')")
content = content.replace("'Conflicting Signals Detected'", "t('analyze.report.xai.conflictingSignals')")
content = content.replace("'Insufficient External Evidence'", "t('analyze.report.xai.insufficientEvidence')")

content = content.replace("Final Credibility Assessment", "{t('analyze.report.xai.finalAssessment')}")
content = content.replace("Credibility Risk Score", "{t('analyze.report.xai.credibilityRiskScore')}")
content = content.replace(">Decision Reasoning<", ">{t('analyze.report.xai.decisionReasoning')}<")
content = content.replace(">Signal Relationship<", ">{t('analyze.report.xai.signalRelationship')}<")
content = content.replace(">Calculation Base<", ">{t('analyze.report.xai.calculationBase')}<")
content = content.replace("40% ML + 60% Evidence", "{t('analyze.report.xai.baseSplit')}")
content = content.replace(">Credibility Risk Score &bull;", ">{t('analyze.report.xai.credibilityRiskScore')} &bull;")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. PredictionCard.jsx
file_path = os.path.join(components_dir, 'PredictionCard.jsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = add_import(content, 'PredictionCard')
content = content.replace(">Prediction Result<", ">{t('analyze.report.xai.predictionResult')}<")
content = content.replace("The trained ML model indicates a higher likelihood of the '", "{t('analyze.report.xai.predictionDesc1')}'")
content = content.replace("' label, based on analysis across 60,000 vectorized features.", "'{t('analyze.report.xai.predictionDesc2')}")
content = content.replace("<strong>Disclaimer:</strong>", "<strong>{t('analyze.report.xai.disclaimer')}</strong>")
content = content.replace("This application is an academic research project. The result above is purely a machine learning prediction based on statistical patterns learned from the WELFake dataset. It does <strong>not</strong> indicate factual truth or falsehood and should not be used as a definitive fact-checking source.", "{t('analyze.report.xai.disclaimerText')}")
content = content.replace("'{isFake ? 'Fake' : 'Real'}'", "'{isFake ? t('analyze.report.xai.fake') : t('analyze.report.xai.real')}'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 3. ExplanationCard.jsx
file_path = os.path.join(components_dir, 'ExplanationCard.jsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = add_import(content, 'ExplanationCard')
content = content.replace("Why this prediction?", "{t('analyze.report.xai.whyPrediction')}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 4. ImportantPhrases.jsx
file_path = os.path.join(components_dir, 'ImportantPhrases.jsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = add_import(content, 'ImportantPhrases')
content = content.replace("Important Phrases", "{t('analyze.report.xai.importantPhrases')}")
content = content.replace("Influence:", "{t('analyze.report.xai.influence')}:")
content = content.replace("Direction:", "{t('analyze.report.xai.direction')}:")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 5. FeatureInfluence.jsx
file_path = os.path.join(components_dir, 'FeatureInfluence.jsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = add_import(content, 'FeatureInfluence')
content = content.replace("Feature Influence", "{t('analyze.report.xai.featureInfluence')}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 6. ModelInfoCard.jsx
file_path = os.path.join(components_dir, 'ModelInfoCard.jsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = add_import(content, 'ModelInfoCard')
# We need to replace all texts:
content = content.replace(">Layer 1<", ">{t('analyze.report.xai.layer1')}<")
content = content.replace(">Layer 2<", ">{t('analyze.report.xai.layer2')}<")
content = content.replace(">Layer 3<", ">{t('analyze.report.xai.layer3')}<")
content = content.replace("AI Analysis Pipeline", "{t('howItWorks.pipeline')}")
content = content.replace(">ML Classification<", ">{t('analyze.report.xai.mlClassification')}<")
content = content.replace(">Current Model<", ">{t('analyze.report.xai.currentModel')}<")
content = content.replace(">Logistic Regression<", ">{t('analyze.report.xai.logisticRegression')}<")
content = content.replace(">Feature Extraction<", ">{t('analyze.report.xai.featureExtraction')}<")
content = content.replace("Vocabulary: up to 60,000", "{t('analyze.report.xai.vocabulary')}")
content = content.replace(">Explainability<", ">{t('analyze.report.xai.explainability')}<")
content = content.replace(">Enabled<", ">{t('analyze.report.xai.enabled')}<")
content = content.replace("Feature Contribution Analysis", "{t('analyze.report.xai.featureContribution')}")
content = content.replace(">Evidence Intelligence Engine<", ">{t('analyze.report.xai.evidenceEngine')}<")
content = content.replace(">Claim Extraction<", ">{t('analyze.report.xai.claimExtraction')}<")
content = content.replace(">Evidence Search<", ">{t('analyze.report.xai.evidenceSearch')}<")
content = content.replace(">Trusted Source<", ">{t('analyze.report.xai.trustedSource')}<")
content = content.replace(">Article Extraction<", ">{t('analyze.report.xai.articleExtraction')}<")
content = content.replace(">Semantic Matching<", ">{t('analyze.report.xai.semanticMatching')}<")
content = content.replace(">Evidence Classification<", ">{t('analyze.report.xai.evidenceClassification')}<")
content = content.replace(">Source Reliability<", ">{t('analyze.report.xai.sourceReliability')}<")
content = content.replace(">Evidence Aggregation<", ">{t('analyze.report.xai.evidenceAggregation')}<")
content = content.replace(">Final Decision Engine<", ">{t('analyze.report.xai.finalDecisionEngine')}<")
content = content.replace("DECISION ENGINE", "{t('analyze.report.xai.decisionEngine')}")
content = content.replace("Normalize<br/>Scores", "{t('analyze.report.xai.normalizeScores')}")
content = content.replace("Conflict<br/>Detection", "{t('analyze.report.xai.conflictDetection')}")
content = content.replace("Overrides<br/>Rules", "{t('analyze.report.xai.overridesRules')}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
