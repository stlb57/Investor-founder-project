"""
Test authentication with the demo accounts
"""

import requests
import json

# Test credentials
startup_email = "demo@notion.so"
investor_email = "demo@accel.com"
password = "demo123"

print("\n🔐 Testing Authentication...\n")

# Test startup login
print("Testing STARTUP login...")
try:
    response = requests.post(
        "http://localhost:8000/api/auth/login",
        json={"email": startup_email, "password": password},
        timeout=5
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Startup login SUCCESSFUL!")
        print(f"   Token: {data.get('access_token', '')[:50]}...")
        print(f"   Role: {data.get('role')}")
    else:
        print(f"❌ Startup login FAILED: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {e}")

print()

# Test investor login
print("Testing INVESTOR login...")
try:
    response = requests.post(
        "http://localhost:8000/api/auth/login",
        json={"email": investor_email, "password": password},
        timeout=5
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Investor login SUCCESSFUL!")
        print(f"   Token: {data.get('access_token', '')[:50]}...")
        print(f"   Role: {data.get('role')}")
    else:
        print(f"❌ Investor login FAILED: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)
print("If both logins succeeded, try the frontend again!")
print("If failed, there's a password hashing mismatch issue.")
print("="*60 + "\n")
