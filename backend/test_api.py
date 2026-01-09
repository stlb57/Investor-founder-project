"""
Test the scoring API endpoint
"""

import requests
import json

# Login first to get token
login_response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"email": "demo@notion.so", "password": "demo123"}
)

if login_response.status_code == 200:
    token = login_response.json()['access_token']
    print(f"✅ Logged in, token: {token[:50]}...")
    
    # Get profile
    profile_response = requests.get(
        "http://localhost:8000/api/startups/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if profile_response.status_code == 200:
        profile = profile_response.json()
        print(f"✅ Profile retrieved: {profile['name']}")
        print(f"   Startup ID: {profile['id']}")
        
        # Try to get readiness score
        print("\n📊 Testing readiness score endpoint...")
        score_response = requests.post(
            "http://localhost:8000/api/scoring/readiness",
            json={"startup_id": profile['id']},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        print(f"Status: {score_response.status_code}")
        if score_response.status_code == 200:
            print("✅ SUCCESS!")
            print(json.dumps(score_response.json(), indent=2))
        else:
            print(f"❌ FAILED: {score_response.text}")
    else:
        print(f"❌ Profile failed: {profile_response.text}")
else:
    print(f"❌ Login failed: {login_response.text}")
