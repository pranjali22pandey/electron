import time
import requests
from requests.auth import HTTPBasicAuth
import base64
import json
from datetime import datetime, timedelta
import warnings

# Suppress specific warnings
warnings.filterwarnings("ignore", message="urllib3.*")
warnings.filterwarnings("ignore", message="chardet.*")
warnings.filterwarnings("ignore", message="charset_normalizer.*")

# Base64 encoded credentials (replace this with your actual encoded credentials)
encoded_credentials = "cGFuZGV5cHJhbmphOkJhbmdJbmZpQDIwMDM="

# Decode the credentials
credentials = base64.b64decode(encoded_credentials).decode()
username, password = credentials.split(':')

# Create HTTPBasicAuth object with the credentials
auth = HTTPBasicAuth(username, password)

# Calculate the date five weeks ago
five_weeks_ago = (datetime.now() - timedelta(weeks=25)).strftime('%Y-%m-%dT%H:%M:%S')
print(f"Querying for artifacts created after: {five_weeks_ago}")

# AQL query to find .exe files created within the last five weeks in the specified path
aql_query = f"""
items.find({{
  "repo": "gen-des-tcpsw-local",
  "path": {{"$match": "windows-executable"}},
  "name": {{"$match": "*.exe"}},
  "created": {{"$gt": "{five_weeks_ago}"}}
}})
"""
print(f"AQL Query: {aql_query}")

# URL for the AQL search
api_url = "https://artifactory.intra.infineon.com/artifactory/api/search/aql"

# Initialize the previous artifacts set
notified_artifacts = set()

def send_message(message):
    print(f"JSON_MESSAGE: {json.dumps({'message': message})}")

try:
    # Poll the Artifactory repository once for testing
    response = requests.post(api_url, auth=auth, data=aql_query, headers={"Content-Type": "text/plain"})
    if response.status_code == 200:
        artifacts = response.json().get('results', [])
        print(f"Artifacts found: {artifacts}")

        new_artifacts = [artifact for artifact in artifacts if artifact['name'] not in notified_artifacts]

        if new_artifacts:
            for artifact in new_artifacts:
                notified_artifacts.add(artifact['name'])
                print(f"New artifact found: {artifact}")

                # Format the created date to 'DD-MM-YYYY'
                created_date = datetime.fromisoformat(artifact['created'].replace('Z', '+00:00')).strftime('%d-%m-%Y')
                
                send_message(f"New artifact: {artifact['name']} created on {created_date}")
        else:
            print("No new artifacts found.")
    else:
        print(f"Failed to fetch the artifacts: {response.status_code}")
    
    # Exit after one iteration for testing
    print("Polling script completed one iteration and will exit.")
    exit(0)

except KeyboardInterrupt:
    print("Polling script interrupted by user. Exiting...")

finally:
    print("Polling script has exited.")

