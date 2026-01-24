import pytest
from subdomain_scanner.utils.deduplicator import deduplicate_results, merge_alive_results


class TestDeduplicateResults:
    
    def test_empty_inputs(self):
        result = deduplicate_results({}, {}, {})
        assert result == {}
    
    def test_passive_only(self):
        passive = {
            "subdomains": {
                "api.example.com": {"sources": ["crt.sh"]},
                "www.example.com": {"sources": ["crt.sh"]}
            }
        }
        result = deduplicate_results(passive, {}, {})
        assert "api.example.com" in result
        assert "www.example.com" in result
        assert "crt.sh" in result["api.example.com"]["sources"]
    
    def test_active_only(self):
        active = {
            "api.example.com": {"sources": ["bruteforce"], "dns_record_type": "A"}
        }
        result = deduplicate_results({}, active, {})
        assert "api.example.com" in result
        assert "bruteforce" in result["api.example.com"]["sources"]
        assert result["api.example.com"]["dns_record_type"] == "A"
    
    def test_merge_passive_and_active(self):
        passive = {
            "subdomains": {
                "api.example.com": {"sources": ["crt.sh"]}
            }
        }
        active = {
            "api.example.com": {"sources": ["bruteforce"], "dns_record_type": "A"}
        }
        result = deduplicate_results(passive, active, {})
        assert "api.example.com" in result
        assert "crt.sh" in result["api.example.com"]["sources"]
        assert "bruteforce" in result["api.example.com"]["sources"]
    
    def test_advanced_wayback(self):
        advanced = {"wayback": {"api.example.com", "old.example.com"}}
        result = deduplicate_results({}, {}, advanced)
        assert "api.example.com" in result
        assert "old.example.com" in result
        assert "wayback" in result["api.example.com"]["sources"]
    
    def test_advanced_commoncrawl(self):
        advanced = {"commoncrawl": {"archive.example.com"}}
        result = deduplicate_results({}, {}, advanced)
        assert "archive.example.com" in result
        assert "commoncrawl" in result["archive.example.com"]["sources"]
    
    def test_advanced_public_js(self):
        advanced = {"public_js": {"js.example.com"}}
        result = deduplicate_results({}, {}, advanced)
        assert "js.example.com" in result
        assert "jsparse" in result["js.example.com"]["sources"]
    
    def test_sources_converted_to_list(self):
        passive = {"subdomains": {"api.example.com": {"sources": ["crt.sh"]}}}
        result = deduplicate_results(passive, {}, {})
        assert isinstance(result["api.example.com"]["sources"], list)
    
    def test_full_merge(self):
        passive = {"subdomains": {"api.example.com": {"sources": ["crt.sh"]}}}
        active = {"api.example.com": {"sources": ["bruteforce"]}}
        advanced = {"wayback": {"api.example.com"}, "commoncrawl": {"cdn.example.com"}}
        
        result = deduplicate_results(passive, active, advanced)
        
        assert len(result) == 2
        assert "api.example.com" in result
        assert "cdn.example.com" in result
        assert len(result["api.example.com"]["sources"]) >= 2


class TestMergeAliveResults:
    
    def test_empty_inputs(self):
        result = merge_alive_results({}, {}, {})
        assert result == []
    
    def test_basic_merge(self):
        subdomains = {"api.example.com": {"sources": ["crt.sh"]}}
        dns_results = {"api.example.com": True}
        alive_results = {"api.example.com": {"alive": True, "http_status": 200}}
        
        result = merge_alive_results(subdomains, dns_results, alive_results)
        
        assert len(result) == 1
        assert result[0]["subdomain"] == "api.example.com"
        assert result[0]["dns_valid"] is True
        assert result[0]["alive"] is True
        assert result[0]["http_status"] == 200
    
    def test_not_alive(self):
        subdomains = {"api.example.com": {"sources": ["crt.sh"]}}
        dns_results = {"api.example.com": True}
        alive_results = {}
        
        result = merge_alive_results(subdomains, dns_results, alive_results)
        
        assert result[0]["alive"] is False
        assert result[0]["http_status"] is None
    
    def test_dns_not_valid(self):
        subdomains = {"api.example.com": {"sources": ["crt.sh"]}}
        dns_results = {"api.example.com": False}
        alive_results = {}
        
        result = merge_alive_results(subdomains, dns_results, alive_results)
        
        assert result[0]["dns_valid"] is False
    
    def test_missing_dns_defaults_false(self):
        subdomains = {"api.example.com": {"sources": ["crt.sh"]}}
        dns_results = {}
        alive_results = {}
        
        result = merge_alive_results(subdomains, dns_results, alive_results)
        
        assert result[0]["dns_valid"] is False
    
    def test_sources_preserved(self):
        subdomains = {"api.example.com": {"sources": ["crt.sh", "bruteforce"]}}
        result = merge_alive_results(subdomains, {}, {})
        
        assert result[0]["sources"] == ["crt.sh", "bruteforce"]
    
    def test_multiple_subdomains(self):
        subdomains = {
            "api.example.com": {"sources": ["crt.sh"]},
            "www.example.com": {"sources": ["bruteforce"]}
        }
        dns_results = {"api.example.com": True, "www.example.com": False}
        alive_results = {"api.example.com": {"alive": True, "http_status": 200}}
        
        result = merge_alive_results(subdomains, dns_results, alive_results)
        
        assert len(result) == 2
