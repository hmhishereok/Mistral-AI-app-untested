#!/usr/bin/env python3
"""
Test script to verify AWS EC2 server connection
"""

import requests
import json
import sys
from datetime import datetime

def test_aws_connection():
    """Test connection to AWS EC2 server"""
    
    # AWS server URL
    base_url = "http://3.25.119.39:8000"
    
    print("🔍 Testing AWS EC2 server connection...")
    print(f"📍 Server URL: {base_url}")
    print(f"⏰ Test time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    # Test 1: Health check
    print("1️⃣ Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            print("✅ Health check passed!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
    
    print()
    
    # Test 2: API documentation
    print("2️⃣ Testing API documentation...")
    try:
        response = requests.get(f"{base_url}/docs", timeout=10)
        if response.status_code == 200:
            print("✅ API documentation accessible!")
        else:
            print(f"❌ API documentation failed with status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ API documentation failed: {e}")
    
    print()
    
    # Test 3: CORS headers
    print("3️⃣ Testing CORS headers...")
    try:
        response = requests.options(f"{base_url}/api/v1/receipt/upload-receipt/", timeout=10)
        cors_headers = response.headers.get('Access-Control-Allow-Origin', 'Not set')
        print(f"✅ CORS headers: {cors_headers}")
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test failed: {e}")
    
    print()
    
    # Test 4: Server response time
    print("4️⃣ Testing response time...")
    try:
        start_time = datetime.now()
        response = requests.get(f"{base_url}/health", timeout=10)
        end_time = datetime.now()
        response_time = (end_time - start_time).total_seconds() * 1000
        print(f"✅ Response time: {response_time:.2f}ms")
    except requests.exceptions.RequestException as e:
        print(f"❌ Response time test failed: {e}")
    
    print("-" * 50)
    print("🎯 Connection test completed!")

def test_receipt_upload():
    """Test receipt upload functionality (mock)"""
    
    print("\n🧪 Testing receipt upload endpoint...")
    base_url = "http://3.25.119.39:8000"
    
    # Create a mock image file for testing
    import io
    mock_image = io.BytesIO(b"fake_image_data")
    
    try:
        files = {'file': ('test_receipt.jpg', mock_image, 'image/jpeg')}
        response = requests.post(
            f"{base_url}/api/v1/receipt/upload-receipt/",
            files=files,
            timeout=30
        )
        
        if response.status_code == 422:  # Validation error expected for fake image
            print("✅ Upload endpoint is working (validation working correctly)")
        elif response.status_code == 200:
            print("✅ Upload endpoint working!")
            print(f"   Response: {response.json()}")
        else:
            print(f"⚠️  Upload endpoint returned status {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Upload test failed: {e}")

if __name__ == "__main__":
    print("🚀 ReceiptScanner Pro - AWS Connection Test")
    print("=" * 50)
    
    try:
        test_aws_connection()
        test_receipt_upload()
        
        print("\n📊 Summary:")
        print("✅ If all tests passed, your AWS server is ready!")
        print("🌐 Your application should be accessible at:")
        print("   - API: http://3.25.119.39:8000")
        print("   - Docs: http://3.25.119.39:8000/docs")
        print("   - Health: http://3.25.119.39:8000/health")
        
    except KeyboardInterrupt:
        print("\n⏹️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        sys.exit(1) 