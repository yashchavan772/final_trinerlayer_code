"""JavaScript preprocessing - beautification, de-minification."""

import asyncio
import logging
import re
import aiohttp
from typing import Dict, Any, Optional
from dataclasses import dataclass

from ..utils.async_helpers import run_with_timeout, gather_with_concurrency

logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 5 * 1024 * 1024
PROCESSING_TIMEOUT = 10
FETCH_TIMEOUT = 15


@dataclass
class ProcessedJS:
    """Processed JavaScript file data."""
    url: str
    content: str
    original_size: int
    processed: bool
    error: Optional[str] = None


def beautify_js(code: str) -> str:
    """
    Simple JS beautification without external dependencies.
    Adds newlines and indentation for readability.
    """
    if not code:
        return code
    
    result = []
    indent_level = 0
    in_string = False
    string_char = None
    i = 0
    
    code = re.sub(r'([{}\[\];,])', r' \1 ', code)
    code = re.sub(r'\s+', ' ', code)
    
    tokens = code.split()
    
    for token in tokens:
        if token == '{':
            result.append('{\n')
            indent_level += 1
            result.append('  ' * indent_level)
        elif token == '}':
            indent_level = max(0, indent_level - 1)
            result.append('\n')
            result.append('  ' * indent_level)
            result.append('}\n')
            result.append('  ' * indent_level)
        elif token == ';':
            result.append(';\n')
            result.append('  ' * indent_level)
        elif token == ',':
            result.append(', ')
        else:
            result.append(token + ' ')
    
    return ''.join(result)


def calculate_code_entropy(code: str) -> float:
    """Calculate entropy to detect obfuscation."""
    if not code:
        return 0.0
    
    import math
    char_counts = {}
    for char in code:
        char_counts[char] = char_counts.get(char, 0) + 1
    
    entropy = 0.0
    length = len(code)
    for count in char_counts.values():
        probability = count / length
        entropy -= probability * math.log2(probability)
    
    return entropy


def is_heavily_obfuscated(code: str) -> bool:
    """Detect if code is heavily obfuscated."""
    if not code:
        return False
    
    entropy = calculate_code_entropy(code)
    
    hex_ratio = len(re.findall(r'\\x[0-9a-fA-F]{2}', code)) / max(len(code), 1)
    unicode_ratio = len(re.findall(r'\\u[0-9a-fA-F]{4}', code)) / max(len(code), 1)
    
    avg_line_len = len(code) / max(code.count('\n') + 1, 1)
    
    if entropy > 5.5 or hex_ratio > 0.1 or unicode_ratio > 0.1 or avg_line_len > 1000:
        return True
    
    return False


def simple_deobfuscate(code: str) -> str:
    """Simple deobfuscation - decode hex/unicode escapes."""
    if not code:
        return code
    
    def decode_hex(match):
        try:
            return chr(int(match.group(1), 16))
        except ValueError:
            return match.group(0)
    
    def decode_unicode(match):
        try:
            return chr(int(match.group(1), 16))
        except ValueError:
            return match.group(0)
    
    code = re.sub(r'\\x([0-9a-fA-F]{2})', decode_hex, code)
    code = re.sub(r'\\u([0-9a-fA-F]{4})', decode_unicode, code)
    
    return code


class JSPreprocessor:
    """JavaScript file preprocessor."""
    
    def __init__(
        self,
        max_file_size: int = MAX_FILE_SIZE,
        timeout: float = PROCESSING_TIMEOUT,
        beautify: bool = True,
        deobfuscate: bool = True
    ):
        self.max_file_size = max_file_size
        self.timeout = timeout
        self.beautify = beautify
        self.deobfuscate = deobfuscate
    
    async def fetch_js(self, url: str) -> Optional[str]:
        """Fetch JavaScript content from URL."""
        try:
            timeout = aiohttp.ClientTimeout(total=FETCH_TIMEOUT)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        return None
                    
                    content_length = response.headers.get('content-length')
                    if content_length and int(content_length) > self.max_file_size:
                        logger.warning(f"JS file too large: {url}")
                        return None
                    
                    content = await response.text()
                    
                    if len(content) > self.max_file_size:
                        logger.warning(f"JS content exceeds size limit: {url}")
                        return None
                    
                    return content
        except Exception as e:
            logger.debug(f"Failed to fetch JS: {url} - {e}")
            return None
    
    def process_content(self, content: str) -> str:
        """Process JS content - beautify and optionally deobfuscate."""
        if not content:
            return content
        
        processed = content
        
        if self.deobfuscate and is_heavily_obfuscated(content):
            processed = simple_deobfuscate(processed)
        
        if self.beautify and len(processed) < 500000:
            processed = beautify_js(processed)
        
        return processed
    
    async def process_url(self, url: str) -> ProcessedJS:
        """Fetch and process a JavaScript file."""
        content = await run_with_timeout(
            self.fetch_js(url),
            timeout=FETCH_TIMEOUT,
            default=None
        )
        
        if content is None:
            return ProcessedJS(
                url=url,
                content="",
                original_size=0,
                processed=False,
                error="Failed to fetch"
            )
        
        original_size = len(content)
        
        try:
            processed_content = self.process_content(content)
            return ProcessedJS(
                url=url,
                content=processed_content,
                original_size=original_size,
                processed=True
            )
        except Exception as e:
            return ProcessedJS(
                url=url,
                content=content,
                original_size=original_size,
                processed=False,
                error=str(e)
            )
    
    async def process_urls(self, urls: list) -> list:
        """Process multiple JS URLs concurrently."""
        tasks = [self.process_url(url) for url in urls]
        results = await gather_with_concurrency(tasks, max_concurrent=5)
        return [r for r in results if isinstance(r, ProcessedJS)]


async def preprocess_js(urls: list, **kwargs) -> list:
    """Convenience function to preprocess JS files."""
    processor = JSPreprocessor(**kwargs)
    return await processor.process_urls(urls)
