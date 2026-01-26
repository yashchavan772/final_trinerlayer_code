"""Shannon entropy calculation for false positive reduction."""

import math
from typing import Dict


ENTROPY_THRESHOLDS: Dict[str, float] = {
    'aws_access_key': 3.5,
    'aws_secret_key': 4.5,
    'gcp_api_key': 4.0,
    'azure_key': 4.5,
    'stripe_key': 4.0,
    'jwt_token': 4.0,
    'jwt_secret': 3.5,
    'github_token': 4.0,
    'generic_api_key': 3.5,
    'generic_secret': 3.0,
    'database_url': 2.5,
    'bearer_token': 3.5,
    'session_token': 3.0,
    'oauth_token': 3.5,
    'private_key': 4.0,
    'encryption_key': 4.0,
    'password': 2.5,
    'webhook_secret': 3.0,
    'default': 3.0,
}

MIN_SECRET_LENGTHS: Dict[str, int] = {
    'aws_access_key': 20,
    'aws_secret_key': 40,
    'gcp_api_key': 39,
    'azure_key': 88,
    'stripe_key': 32,
    'jwt_token': 50,
    'jwt_secret': 16,
    'github_token': 40,
    'generic_api_key': 20,
    'generic_secret': 16,
    'bearer_token': 20,
    'session_token': 20,
    'private_key': 100,
    'password': 8,
    'default': 16,
}


def calculate_entropy(data: str) -> float:
    """
    Calculate Shannon entropy of a string.
    Higher entropy suggests more randomness (likely a real secret).
    
    Args:
        data: The string to analyze
        
    Returns:
        Entropy value (0-8 for ASCII, higher = more random)
    """
    if not data:
        return 0.0
    
    entropy = 0.0
    length = len(data)
    char_counts = {}
    
    for char in data:
        char_counts[char] = char_counts.get(char, 0) + 1
    
    for count in char_counts.values():
        probability = count / length
        entropy -= probability * math.log2(probability)
    
    return entropy


def is_high_entropy(value: str, threshold: float = 0.0, secret_type: str = 'default') -> bool:
    """
    Check if a string has high entropy (likely a real secret).
    Uses type-specific thresholds for better accuracy.
    """
    if threshold == 0.0:
        threshold = ENTROPY_THRESHOLDS.get(secret_type, ENTROPY_THRESHOLDS['default'])
    
    return calculate_entropy(value) >= threshold


def entropy_score(value: str) -> float:
    """
    Return a normalized entropy score (0-1).
    Useful for confidence calculations.
    """
    entropy = calculate_entropy(value)
    return min(entropy / 6.0, 1.0)


def get_entropy_threshold(secret_type: str) -> float:
    """Get the recommended entropy threshold for a secret type."""
    return ENTROPY_THRESHOLDS.get(secret_type, ENTROPY_THRESHOLDS['default'])


def get_min_length(secret_type: str) -> int:
    """Get the minimum length for a secret type."""
    return MIN_SECRET_LENGTHS.get(secret_type, MIN_SECRET_LENGTHS['default'])


def is_low_entropy_value(value: str, max_entropy: float = 2.0) -> bool:
    """
    Check if a value has suspiciously low entropy (likely placeholder/mock).
    Useful for filtering out test/example values.
    """
    if not value or len(value) < 4:
        return True
    
    entropy = calculate_entropy(value)
    
    if entropy < max_entropy:
        return True
    
    unique_ratio = len(set(value)) / len(value)
    if unique_ratio < 0.2:
        return True
    
    return False


def calculate_character_class_score(value: str) -> float:
    """
    Calculate a score based on character class diversity.
    Real secrets typically have mixed character classes.
    
    Returns 0-1 where higher = more diverse.
    """
    if not value:
        return 0.0
    
    has_lower = any(c.islower() for c in value)
    has_upper = any(c.isupper() for c in value)
    has_digit = any(c.isdigit() for c in value)
    has_special = any(not c.isalnum() for c in value)
    
    classes = sum([has_lower, has_upper, has_digit, has_special])
    
    return classes / 4.0


def calculate_secret_score(value: str, secret_type: str = 'default') -> float:
    """
    Calculate an overall score for how likely a value is a real secret.
    Combines entropy, length, and character diversity.
    
    Returns 0-1 where higher = more likely real secret.
    """
    if not value:
        return 0.0
    
    entropy = calculate_entropy(value)
    threshold = ENTROPY_THRESHOLDS.get(secret_type, ENTROPY_THRESHOLDS['default'])
    entropy_score_val = min(entropy / threshold, 1.0) if threshold > 0 else 0.5
    
    min_len = MIN_SECRET_LENGTHS.get(secret_type, MIN_SECRET_LENGTHS['default'])
    length_score = min(len(value) / min_len, 1.0) if min_len > 0 else 0.5
    
    diversity_score = calculate_character_class_score(value)
    
    score = (entropy_score_val * 0.5) + (length_score * 0.3) + (diversity_score * 0.2)
    
    return min(max(score, 0.0), 1.0)
