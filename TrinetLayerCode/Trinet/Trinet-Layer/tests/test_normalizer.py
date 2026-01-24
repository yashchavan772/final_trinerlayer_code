import pytest
from subdomain_scanner.utils.normalizer import (
    normalize_subdomains,
    normalize_single,
    is_valid_format
)


class TestNormalizeSingle:
    
    def test_basic_normalization(self):
        result = normalize_single("api.example.com", "example.com")
        assert result == "api.example.com"
    
    def test_uppercase_to_lowercase(self):
        result = normalize_single("API.EXAMPLE.COM", "example.com")
        assert result == "api.example.com"
    
    def test_wildcard_removal(self):
        result = normalize_single("*.example.com", "example.com")
        assert result == "example.com"
    
    def test_wildcard_prefix_removal(self):
        result = normalize_single("*.api.example.com", "example.com")
        assert result == "api.example.com"
    
    def test_port_removal(self):
        result = normalize_single("api.example.com:443", "example.com")
        assert result == "api.example.com"
    
    def test_trailing_dots_removal(self):
        result = normalize_single("api.example.com.", "example.com")
        assert result == "api.example.com"
    
    def test_leading_dots_removal(self):
        result = normalize_single(".api.example.com", "example.com")
        assert result == "api.example.com"
    
    def test_empty_string(self):
        result = normalize_single("", "example.com")
        assert result == ""
    
    def test_whitespace_only(self):
        result = normalize_single("   ", "example.com")
        assert result == ""
    
    def test_wrong_domain_suffix(self):
        result = normalize_single("api.other.com", "example.com")
        assert result == ""
    
    def test_exact_domain_match(self):
        result = normalize_single("example.com", "example.com")
        assert result == "example.com"
    
    def test_subdomain_with_spaces(self):
        result = normalize_single("  api.example.com  ", "example.com")
        assert result == "api.example.com"
    
    def test_multiple_wildcards(self):
        result = normalize_single("*.*.example.com", "example.com")
        assert result == "example.com"


class TestNormalizeSubdomains:
    
    def test_normalize_set(self):
        subdomains = {"API.Example.COM", "www.example.com", "*.test.example.com"}
        result = normalize_subdomains(subdomains, "example.com")
        assert "api.example.com" in result
        assert "www.example.com" in result
        assert "test.example.com" in result
    
    def test_empty_set(self):
        result = normalize_subdomains(set(), "example.com")
        assert result == set()
    
    def test_filters_invalid(self):
        subdomains = {"valid.example.com", "invalid.other.com", ""}
        result = normalize_subdomains(subdomains, "example.com")
        assert "valid.example.com" in result
        assert "invalid.other.com" not in result
        assert len(result) == 1
    
    def test_deduplication(self):
        subdomains = {"api.example.com", "API.EXAMPLE.COM", "Api.Example.Com"}
        result = normalize_subdomains(subdomains, "example.com")
        assert len(result) == 1
        assert "api.example.com" in result


class TestIsValidFormat:
    
    def test_valid_hostname(self):
        assert is_valid_format("api.example.com") is True
    
    def test_valid_short_hostname(self):
        assert is_valid_format("a.co") is True
    
    def test_empty_string(self):
        assert is_valid_format("") is False
    
    def test_too_long(self):
        long_hostname = "a" * 254
        assert is_valid_format(long_hostname) is False
    
    def test_contains_wildcard(self):
        assert is_valid_format("*.example.com") is False
    
    def test_contains_space(self):
        assert is_valid_format("api example.com") is False
    
    def test_double_dots(self):
        assert is_valid_format("api..example.com") is False
    
    def test_starts_with_hyphen(self):
        assert is_valid_format("-api.example.com") is False
    
    def test_ends_with_hyphen(self):
        assert is_valid_format("api.example.com-") is False
    
    def test_label_starts_with_hyphen(self):
        assert is_valid_format("api.-example.com") is False
    
    def test_label_ends_with_hyphen(self):
        assert is_valid_format("api-.example.com") is False
    
    def test_label_too_long(self):
        long_label = "a" * 64 + ".com"
        assert is_valid_format(long_label) is False
    
    def test_invalid_characters(self):
        assert is_valid_format("api_test.example.com") is False
        assert is_valid_format("api@example.com") is False
        assert is_valid_format("api!example.com") is False
    
    def test_numeric_labels(self):
        assert is_valid_format("123.example.com") is True
    
    def test_hyphen_in_middle(self):
        assert is_valid_format("my-api.example.com") is True
