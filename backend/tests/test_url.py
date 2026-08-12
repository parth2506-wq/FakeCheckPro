from app.utils.url_validator import is_safe_url

def test_url_validator_safe():
    assert is_safe_url("https://www.google.com") == True
    
def test_url_validator_unsafe_localhost():
    assert is_safe_url("http://127.0.0.1") == False
    assert is_safe_url("http://localhost") == False

def test_url_validator_unsafe_private():
    assert is_safe_url("http://192.168.1.100") == False
    assert is_safe_url("http://10.0.0.1") == False

def test_url_validator_invalid_scheme():
    assert is_safe_url("ftp://example.com") == False
    assert is_safe_url("file:///etc/passwd") == False
    assert is_safe_url("javascript:alert(1)") == False
