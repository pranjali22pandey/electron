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

###################### Taking values from config file #####################
configFileOpen = open('./configPlaywright.json')
configFile = json.load(configFileOpen)

projectKeyFromConfig = configFile['projectKey']

VideosConfig = configFile['Videos']

ScreenShotConfig = configFile['Screenshots']

base_url = os.environ.get("base_url")
###################################### Deciding plan name based on branch ##################

env_var = os.environ.get("environ_var")

if(env_var=="refs/heads/dev"):
    name = configFile['planName_dev']
elif(env_var=="refs/heads/prod"):
    name = configFile['planName_prod']
elif(env_var=="refs/heads/stage"):
    name = configFile['planName_stage']
else:
    name = configFile['planName_master']
###################### Screenshots and report attachment #############################
urllib3.disable_warnings()

headers = {
    "Accept": "application/json",
    "X-Atlassian-Token": "no-check",
}

if(ScreenShotConfig == "yes"):
    for filename in os.listdir('screenshots'):
        f = os.path.join('./screenshots/'+filename)
        k = os.path.join("./cucumber_report.html")
        filenameSplit = filename.split(" ")
        JiraIssueAttachementurl=f"{base_url}/{filenameSplit[0]}/attachments"
        response = requests.request(
                "POST",
                JiraIssueAttachementurl,
                headers = headers,
                verify =False,
                files = {
                    "file": (f, open(f,"rb"), "image/png")
                }
            )
        print(json.dumps(json.loads(response.text), sort_keys=True, indent=4, separators=(",", ": ")))
################# Videos attachment #######################################
if(VideosConfig == "yes"):
    for filename in os.listdir('videos'):
        f = os.path.join('./videos/'+filename)
        filenameSplit = filename.split(" ")
        for i in os.listdir(f):
            k = os.path.join('./videos/'+filename+'/'+i)
            JiraIssueAttachementurl=f"{base_url}/{filenameSplit[0]}/attachments"
            response = requests.request(
                        "POST",
                        JiraIssueAttachementurl,
                        headers = headers,
                        verify =False,
                        files = {
                            "file": (k, open(k,"rb"), "video/webm")
                        }
                    )
            print(json.dumps(json.loads(response.text), sort_keys=True, indent=4, separators=(",", ": ")))
############################################################################################################
prjName = projectKeyFromConfig

############# Parsing the json file #########################
f = open('./cucumber_report.json')
cucumber = json.load(f)

# Array for all the test case keys.
finalsplit = []

# Dictionary for storing the test case and the status.
executionDict = {}

errorMessageArr = []

for i in range(0,len(cucumber)):   # Running through all feature files
    for j in range(0,len(cucumber[i]['elements'])): #Seeing how many test cases are there in each feature file
        id = cucumber[i]['elements'][j]['id']       # Getting the id of each test case
        split1 = id.split(';')                      # splitting it 
        split2 = split1[1].split("-")               # Splitting it once again
        testId = (split2[0]+"-"+split2[1]).upper()  # concatenating the required result
        finalsplit.append((split2[0]+"-"+split2[1]).upper())  # append in final array
        for k in range(0,len(cucumber[i]['elements'][j]['steps'])):  # Run another loop for each test case steps
            result = cucumber[i]['elements'][j]['steps'][k]['result']['status'] # See each step's status
            if(result=='failed'):                       # Check if any one is failed copy that into dict and break
                    executionDict[testId] = "failed"
                    errorMessageArr.append(cucumber[i]['elements'][j]['steps'][k]['name'])
                    break
        if(result=="passed"):
            errorMessageArr.append("passed")
        executionDict[testId] = result                  # Else make the status of that test case as true.
#################### Plan Id ####################################

planId = 0
projectKey = 0

# get request for planId and project key

planIdRequestUrl = f"{base_url}/plans/{prjName}"

planIdRequestResponce = requests.get(planIdRequestUrl,verify=False)

getResponseForAllPlans = json.loads(planIdRequestResponce.text)

for i in range(0,len(getResponseForAllPlans)):
    if(getResponseForAllPlans[i]['name']==name):
        planId = getResponseForAllPlans[i]['id']
        projectKey = getResponseForAllPlans[i]['project']

###################### Execution creation ############################

executionCreationUrl = f"{base_url}/execution/{prjName}/{str(planId)}"

executionCreationResponce = requests.post(executionCreationUrl,verify=False)

####################### Execution Id #####################################

getExecutionIdUrl = f"{base_url}/execution/{prjName}/{str(planId)}"

getExecutionIdResponce = requests.get(getExecutionIdUrl,verify=False)
ExecutionIdRes = json.loads(getExecutionIdResponce.text)

ExecutionId  = ExecutionIdRes[0]['id']

############################# Test Id ##################################
testId = []

getExecutionIdUrl = f"{base_url}/test/{projectKey}/{planId}/{ExecutionId}"

getExecutionIdResponce = requests.get(getExecutionIdUrl,verify=False)
r = json.loads(getExecutionIdResponce.text)

for i in range(len(r['testList'])):
    testId.append(r['testList'][i]['id'])
###################### Executing test cases in the execution ###############
finalArray = []
for i in executionDict:
    finalArray.append(executionDict[i])

for i in range(0,len(testId)):
    doExecutionUrl = f"{base_url}/executed/{prjName}/{str(planId)}/{str(ExecutionId)}/test/{str(testId[i])}"
    if(finalArray[i]=="passed"):
                doExecutionPayload = {
                    "prjKey":prjName,
                    "resultId":ExecutionId,
                    "planId":planId,
                    "testId":testId[i],
                    "passed":True
                }
    else:
            doExecutionPayload = {
                    "prjKey":prjName,
                    "resultId":ExecutionId,
                    "planId":planId,
                    "testId":testId[i],
                    "failedContinue":True,
                    "message":errorMessageArr[i]
                }
    response = requests.post(
        doExecutionUrl,
        json=doExecutionPayload,
        headers=headers,
        verify=False
    )
