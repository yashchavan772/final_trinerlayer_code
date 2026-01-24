import pytest
from subdomain_scanner.utils.validator import validate_domain


class TestValidateDomain:
    
    def test_valid_domain(self):
        is_valid, normalized, error = validate_domain("example.com")
        assert is_valid is True
        assert normalized == "example.com"
        assert error == ""
    
    def test_valid_domain_with_subdomain(self):
        is_valid, normalized, error = validate_domain("www.example.com")
        assert is_valid is True
        assert normalized == "www.example.com"
    
    def test_valid_domain_uppercase(self):
        is_valid, normalized, error = validate_domain("EXAMPLE.COM")
        assert is_valid is True
        assert normalized == "example.com"
    
    def test_valid_domain_with_spaces(self):
        is_valid, normalized, error = validate_domain("  example.com  ")
        assert is_valid is True
        assert normalized == "example.com"
    
    def test_empty_domain(self):
        is_valid, normalized, error = validate_domain("")
        assert is_valid is False
        assert "required" in error.lower()
    
    def test_none_domain(self):
        is_valid, normalized, error = validate_domain(None)
        assert is_valid is False
    
    def test_domain_with_protocol_http(self):
        is_valid, normalized, error = validate_domain("http://example.com")
        assert is_valid is False
        assert "protocol" in error.lower()
    
    def test_domain_with_protocol_https(self):
        is_valid, normalized, error = validate_domain("https://example.com")
        assert is_valid is False
        assert "protocol" in error.lower()
    
    def test_domain_with_path(self):
        is_valid, normalized, error = validate_domain("example.com/path")
        assert is_valid is False
        assert "path" in error.lower()
    
    def test_domain_with_query_string(self):
        is_valid, normalized, error = validate_domain("example.com?query=1")
        assert is_valid is False
    
    def test_domain_with_fragment(self):
        is_valid, normalized, error = validate_domain("example.com#section")
        assert is_valid is False
    
    def test_domain_with_port(self):
        is_valid, normalized, error = validate_domain("example.com:8080")
        assert is_valid is False
        assert "port" in error.lower()
    
    def test_domain_with_wildcard(self):
        is_valid, normalized, error = validate_domain("*.example.com")
        assert is_valid is False
        assert "wildcard" in error.lower()
    
    def test_ipv4_address(self):
        is_valid, normalized, error = validate_domain("192.168.1.1")
        assert is_valid is False
        assert "ip" in error.lower()
    
    def test_localhost_blocked(self):
        is_valid, normalized, error = validate_domain("localhost")
        assert is_valid is False
    
    def test_private_ip_10_blocked(self):
        is_valid, normalized, error = validate_domain("10.0.0.1")
        assert is_valid is False
    
    def test_private_ip_172_blocked(self):
        is_valid, normalized, error = validate_domain("172.16.0.1")
        assert is_valid is False
    
    def test_private_ip_192_blocked(self):
        is_valid, normalized, error = validate_domain("192.168.0.1")
        assert is_valid is False
    
    def test_domain_too_long(self):
        long_domain = "a" * 250 + ".com"
        is_valid, normalized, error = validate_domain(long_domain)
        assert is_valid is False
        assert "length" in error.lower()
    
    def test_single_label_domain(self):
        is_valid, normalized, error = validate_domain("localhost")
        assert is_valid is False
    
    def test_valid_tld_variations(self):
        valid_domains = ["example.io", "example.co.uk", "example.org", "test.dev"]
        for domain in valid_domains:
            is_valid, normalized, error = validate_domain(domain)
            assert is_valid is True, f"Expected {domain} to be valid"
    
    def test_hyphenated_domain(self):
        is_valid, normalized, error = validate_domain("my-example-site.com")
        assert is_valid is True
    
    def test_domain_starting_with_hyphen(self):
        is_valid, normalized, error = validate_domain("-example.com")
        assert is_valid is False
    
    def test_domain_ending_with_hyphen(self):
        is_valid, normalized, error = validate_domain("example-.com")
        assert is_valid is False
    
    def test_numeric_subdomain(self):
        is_valid, normalized, error = validate_domain("123.example.com")
        assert is_valid is True
