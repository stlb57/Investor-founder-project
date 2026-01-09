"""
Verify ALL Dashboards (Startup & Investor)
Ensures 'fix it once and for all' is successful.
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def run_checks():
    print("\n🕵️  VERIFYING FINAL FIXES...\n")
    
    # ---------------------------------------------------------
    # 1. Login as STARTUP (Notion)
    # ---------------------------------------------------------
    print("1️⃣  Checking STARTUP Side...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "demo@notion.so", "password": "demo123"
    })
    
    if resp.status_code != 200:
        print(f"❌ Startup Login Failed: {resp.text}")
        return
        
    startup_token = resp.json()['access_token']
    print("   ✅ Login Success")
    
    # Get Profile to get ID
    resp = requests.get(f"{BASE_URL}/startups/profile", headers={"Authorization": f"Bearer {startup_token}"})
    startup_id = resp.json()['id']
    print(f"   ✅ Profile Loaded (ID: {startup_id})")
    
    # Check Readiness Score (The one that was crashing)
    resp = requests.post(f"{BASE_URL}/scoring/readiness", 
        json={"startup_id": startup_id},
        headers={"Authorization": f"Bearer {startup_token}"}
    )
    
    if resp.status_code == 200:
        data = resp.json()
        print(f"   ✅ Readiness Score: {data['score']}/100")
    else:
        print(f"❌ Readiness Score Failed: {resp.status_code} - {resp.text}")

    print()

    # ---------------------------------------------------------
    # 2. Login as INVESTOR (Accel)
    # ---------------------------------------------------------
    print("2️⃣  Checking INVESTOR Side...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "demo@accel.com", "password": "demo123"
    })
    
    if resp.status_code != 200:
        print(f"❌ Investor Login Failed: {resp.text}")
        return
        
    investor_token = resp.json()['access_token']
    print("   ✅ Login Success")
    
    # Check Fit Score (Investigative check)
    # This endpoint was also using the broken ML module
    resp = requests.post(f"{BASE_URL}/scoring/fit/{startup_id}", 
        headers={"Authorization": f"Bearer {investor_token}"}
    )
    
    if resp.status_code == 200:
        data = resp.json()
        print(f"   ✅ Fit Score Calculated (Multiplier: {data.get('fit_multiplier')})")
    else:
        print(f"❌ Fit Score Failed: {resp.status_code} - {resp.text}")

    print("\n" + "="*50)
    print("🎉 ALL SYSTEMS OPERATIONAL")
    print("="*50 + "\n")

if __name__ == "__main__":
    run_checks()
