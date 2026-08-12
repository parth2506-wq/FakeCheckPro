import socket
import ipaddress
from urllib.parse import urlparse
import dns.resolver

def is_safe_url(url: str) -> bool:
    """
    Validates that a URL is safe to fetch (prevents SSRF).
    Checks:
    - Scheme is http or https
    - Hostname resolves to a public IP address (not private, loopback, multicast)
    """
    try:
        parsed_url = urlparse(url)
        
        # 1. Check scheme
        if parsed_url.scheme not in ['http', 'https']:
            return False
            
        hostname = parsed_url.hostname
        if not hostname:
            return False

        # 2. Resolve IP
        try:
            answers = dns.resolver.resolve(hostname, 'A')
            ip_str = answers[0].to_text()
        except Exception:
            # Fallback to socket if dns.resolver fails or for localhost cases
            ip_str = socket.gethostbyname(hostname)

        # 3. Check IP ranges
        ip = ipaddress.ip_address(ip_str)
        if ip.is_private or ip.is_loopback or ip.is_multicast or ip.is_link_local or ip.is_reserved:
            return False
            
        # Optional: Explicitly block cloud metadata IP
        if str(ip) == "169.254.169.254":
            return False

        return True
    except Exception:
        return False
