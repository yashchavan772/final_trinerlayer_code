"""Shannon entropy calculation for false positive reduction."""

import math
from typing import Optional


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


def is_high_entropy(value: str, threshold: float = 4.0) -> bool:
    """Check if a string has high entropy (likely a secret)."""
    return calculate_entropy(value) >= threshold


def entropy_score(value: str) -> float:
    """
    Return a normalized entropy score (0-1).
    Useful for confidence calculations.
    """
    entropy = calculate_entropy(value)
    return min(entropy / 6.0, 1.0)
