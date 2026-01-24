import pytest
from subdomain_scanner.utils.risk import classify_risk, get_risk_summary


class TestClassifyRisk:
    
    def test_high_risk_admin(self):
        result = classify_risk("admin.example.com", alive=True)
        assert result == "high"
    
    def test_high_risk_dashboard(self):
        result = classify_risk("dashboard.example.com", alive=True)
        assert result == "high"
    
    def test_high_risk_auth(self):
        result = classify_risk("auth.example.com", alive=True)
        assert result == "high"
    
    def test_high_risk_login(self):
        result = classify_risk("login.example.com", alive=True)
        assert result == "high"
    
    def test_high_risk_secure(self):
        result = classify_risk("secure.example.com", alive=True)
        assert result == "high"
    
    def test_medium_risk_dev(self):
        result = classify_risk("dev.example.com", alive=True)
        assert result == "medium"
    
    def test_medium_risk_staging(self):
        result = classify_risk("staging.example.com", alive=True)
        assert result == "medium"
    
    def test_medium_risk_internal(self):
        result = classify_risk("internal.example.com", alive=True)
        assert result == "medium"
    
    def test_medium_risk_test(self):
        result = classify_risk("test.example.com", alive=True)
        assert result == "medium"
    
    def test_medium_risk_beta(self):
        result = classify_risk("beta.example.com", alive=True)
        assert result == "medium"
    
    def test_low_risk_www(self):
        result = classify_risk("www.example.com", alive=True)
        assert result == "low"
    
    def test_low_risk_api(self):
        result = classify_risk("api.example.com", alive=True)
        assert result == "low"
    
    def test_low_risk_cdn(self):
        result = classify_risk("cdn.example.com", alive=True)
        assert result == "low"
    
    def test_low_risk_generic(self):
        result = classify_risk("random.example.com", alive=True)
        assert result == "low"
    
    def test_info_when_not_alive(self):
        result = classify_risk("admin.example.com", alive=False)
        assert result == "info"
    
    def test_info_for_high_risk_not_alive(self):
        result = classify_risk("secure.example.com", alive=False)
        assert result == "info"
    
    def test_case_insensitive(self):
        result = classify_risk("ADMIN.example.com", alive=True)
        assert result == "high"
    
    def test_keyword_in_prefix_only(self):
        result = classify_risk("admin-panel.example.com", alive=True)
        assert result == "high"


class TestGetRiskSummary:
    
    def test_empty_results(self):
        result = get_risk_summary([])
        assert result == {"high": 0, "medium": 0, "low": 0, "info": 0}
    
    def test_single_high_risk(self):
        results = [{"risk_level": "high"}]
        summary = get_risk_summary(results)
        assert summary["high"] == 1
        assert summary["medium"] == 0
    
    def test_mixed_risks(self):
        results = [
            {"risk_level": "high"},
            {"risk_level": "high"},
            {"risk_level": "medium"},
            {"risk_level": "low"},
            {"risk_level": "low"},
            {"risk_level": "low"},
            {"risk_level": "info"}
        ]
        summary = get_risk_summary(results)
        assert summary["high"] == 2
        assert summary["medium"] == 1
        assert summary["low"] == 3
        assert summary["info"] == 1
    
    def test_missing_risk_level(self):
        results = [{"subdomain": "test.example.com"}]
        summary = get_risk_summary(results)
        assert summary["info"] == 1
    
    def test_unknown_risk_level_ignored(self):
        results = [{"risk_level": "unknown"}]
        summary = get_risk_summary(results)
        assert summary == {"high": 0, "medium": 0, "low": 0, "info": 0}
