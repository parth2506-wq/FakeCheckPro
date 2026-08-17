import pytest
from app.services.credibility_decision_engine import CredibilityDecisionEngine

def test_case_1_ml_fake_evidence_strong_contradiction():
    # CASE 1: ML FAKE 95, Evidence CONTRADICTING 92, HIGH, 95
    # Expected: EXTREME_RISK/VERY_HIGH_RISK, CONTRADICTED
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="FAKE",
        ml_confidence=95,
        evidence_score=92,
        evidence_direction="CONTRADICTING",
        evidence_quality="HIGH",
        source_reliability_score=95
    )
    assert result["final_assessment"] == "CONTRADICTED"
    assert result["risk_level"] in ["VERY_HIGH_RISK", "EXTREME_RISK"]
    assert result["signal_relationship"] == "AGREE_FAKE"

def test_case_2_ml_real_evidence_strong_contradiction():
    # CASE 2: ML REAL 99, Evidence CONTRADICTING 92, HIGH, 95
    # Expected: CONTRADICTED
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="REAL",
        ml_confidence=99,
        evidence_score=92,
        evidence_direction="CONTRADICTING",
        evidence_quality="HIGH",
        source_reliability_score=95
    )
    assert result["final_assessment"] == "CONTRADICTED"
    assert result["decision_type"] == "STRONG_EVIDENCE_OVERRIDE"
    assert result["signal_relationship"] == "CONFLICT"

def test_case_3_ml_fake_evidence_strong_support():
    # CASE 3: ML FAKE 96, Evidence SUPPORTING 94, HIGH, 95
    # Expected: LIKELY_CREDIBLE
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="FAKE",
        ml_confidence=96,
        evidence_score=94,
        evidence_direction="SUPPORTING",
        evidence_quality="HIGH",
        source_reliability_score=95
    )
    assert result["final_assessment"] == "LIKELY_CREDIBLE"
    assert result["decision_type"] == "STRONG_EVIDENCE_OVERRIDE"

def test_case_4_ml_fake_evidence_insufficient():
    # CASE 4: ML FAKE 95, Evidence 15, INSUFFICIENT, LOW
    # Expected: Risk 95, Assessment UNVERIFIED, NOT FAKE/CONTRADICTED
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="FAKE",
        ml_confidence=95,
        evidence_score=15,
        evidence_direction="INSUFFICIENT",
        evidence_quality="LOW",
        source_reliability_score=10
    )
    assert result["final_assessment"] == "UNVERIFIED"
    assert result["final_credibility_risk_score"] == 95
    assert result["decision_type"] in ["INSUFFICIENT_EVIDENCE", "INSUFFICIENT_EVIDENCE_RULE", "WEAK_EVIDENCE_RULE"]

def test_case_5_ml_real_evidence_insufficient():
    # CASE 5: ML REAL 95, Evidence 15, INSUFFICIENT, LOW
    # Expected: Risk 5, Assessment UNVERIFIED
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="REAL",
        ml_confidence=95,
        evidence_score=15,
        evidence_direction="INSUFFICIENT",
        evidence_quality="LOW",
        source_reliability_score=10
    )
    assert result["final_assessment"] == "UNVERIFIED"
    assert result["final_credibility_risk_score"] == 5

def test_case_6_weighted_calculation():
    # CASE 6: ML FAKE 70, Evidence CONTRADICTING 40, MEDIUM, 60
    # Expected: Weighted Calculation. No override.
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="FAKE",
        ml_confidence=70,
        evidence_score=40,
        evidence_direction="CONTRADICTING",
        evidence_quality="MEDIUM",
        source_reliability_score=60
    )
    assert result["decision_type"] == "NORMAL_WEIGHTED_COMBINATION"
    # ml_fake_risk = 70. evidence_fake_risk_adjusted = 40 * 0.75 * 0.60 = 18.
    # Weighted base = 0.4 * 70 + 0.6 * 18 = 28 + 10.8 = 38.8.
    assert result["final_credibility_risk_score"] == 38.8

def test_case_7_conflict_signals():
    # CASE 7: ML FAKE 90, Evidence SUPPORTING 70, MEDIUM, 72
    # Expected: CONFLICTING_SIGNALS, LIKELY_MISLEADING or UNVERIFIED
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="FAKE",
        ml_confidence=90,
        evidence_score=70,
        evidence_direction="SUPPORTING",
        evidence_quality="MEDIUM",
        source_reliability_score=72
    )
    assert result["signal_relationship"] == "CONFLICT"
    assert result["decision_type"] == "CONFLICTING_SIGNALS"
    assert result["final_assessment"] in ["LIKELY_MISLEADING", "UNVERIFIED"]

def test_case_8_ml_real_evidence_support():
    # CASE 8: ML REAL 90, Evidence SUPPORTING 90, HIGH, 90
    # Expected: SUPPORTED
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="REAL",
        ml_confidence=90,
        evidence_score=90,
        evidence_direction="SUPPORTING",
        evidence_quality="HIGH",
        source_reliability_score=90
    )
    assert result["final_assessment"] == "SUPPORTED"
    assert result["decision_type"] == "STRONG_EVIDENCE_OVERRIDE"

def test_case_9_both_weak():
    # CASE 9: ML FAKE 55, Evidence INSUFFICIENT 30
    # Expected: UNVERIFIED
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="FAKE",
        ml_confidence=55,
        evidence_score=30,
        evidence_direction="INSUFFICIENT",
        evidence_quality="LOW",
        source_reliability_score=50
    )
    assert result["final_assessment"] == "UNVERIFIED"

def test_case_10_ml_real_low_evidence_contradiction():
    # CASE 10: ML REAL 60, Evidence CONTRADICTING 90, HIGH, 90
    # Expected: CONTRADICTED
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="REAL",
        ml_confidence=60,
        evidence_score=90,
        evidence_direction="CONTRADICTING",
        evidence_quality="HIGH",
        source_reliability_score=90
    )
    assert result["final_assessment"] == "CONTRADICTED"

def test_mixed_evidence():
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="FAKE",
        ml_confidence=90,
        evidence_score=50,
        evidence_direction="MIXED",
        evidence_quality="MEDIUM",
        source_reliability_score=60
    )
    assert result["decision_type"] == "MIXED_EVIDENCE_RULE"
    assert result["final_assessment"] == "LIKELY_MISLEADING"

def test_evidence_failure():
    # When evidence_direction is INSUFFICIENT or missing
    result = CredibilityDecisionEngine.evaluate(
        ml_prediction="FAKE",
        ml_confidence=95,
        evidence_score=None,
        evidence_direction=None,
        evidence_quality=None,
        source_reliability_score=None
    )
    assert result["final_assessment"] == "UNVERIFIED"
    assert result["final_credibility_risk_score"] == 95
