try:
    import requests
except ImportError:
    import pip
    pip.main(['install', 'requests'])
    import requests

try:
    import urllib3
except ImportError:
    import pip
    pip.main(['install', 'urllib3'])
    import urllib3

import os

import json

configFileOpen = open('./configPlaywright.json')
configFile = json.load(configFileOpen)

projectKeyFromConfig = configFile['projectKey']

env_var = os.environ.get("environ_var")

if(env_var=="refs/heads/dev"):
    name = configFile['planName_dev']
elif(env_var=="refs/heads/prod"):
    name = configFile['planName_prod']
elif(env_var=="refs/heads/stage"):
    name = configFile['planName_stage']
else:
    name = configFile['planName_master']

prjName = projectKeyFromConfig

base_url = os.environ.get("base_url")

planIdRequestUrl = f"{base_url}/plans/{prjName}"

planIdRequestResponce = requests.get(planIdRequestUrl,verify=False)

getResponseForAllPlans = json.loads(planIdRequestResponce.text)

planId = 0

for i in range(0,len(getResponseForAllPlans)):
    if(getResponseForAllPlans[i]['name']==name):
        planId = getResponseForAllPlans[i]['id']

planTestCasesRequestUrl = f"{base_url}/tree/plan/{str(planId)}/{prjName}"

planTestCasesResponce = requests.get(planTestCasesRequestUrl,verify=False)

getPlanTestCases = json.loads(planTestCasesResponce.text)

keys = []

for i in getPlanTestCases:
    if(i=="issues"):
        for j in getPlanTestCases[i]:
            key = j["key"]
            keys.append(key)

# Open the file in write mode
file = open("e2e/python/sample.txt", "w")

# Write to the file
for i in keys:
    file.write(i+"\n")

# Close the file to make sure everything is saved
file.close()




