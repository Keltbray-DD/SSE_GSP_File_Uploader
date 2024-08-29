

function runUpload(){
      // Get the value of the username and password fields
      const DocNumber = document.getElementById('DocNumber').value;
      const input_folder = document.getElementById('input_folder').value;
      const input_title = document.getElementById('input_title').value;
      const input_Description = document.getElementById('input_Description').value;
      const input_RevisionsCode = document.getElementById('input_RevisionsCode').value;
      const input_RevisionDescription = document.getElementById('input_RevisionDescription').value;
      const input_Status = document.getElementById('input_Status').value;
      const input_file_template = document.getElementById('input_file_template').value;
      const input_file_origin = document.getElementById('input_file_origin').value;
      const fileInput = document.getElementById('fileInput');
  
      // Check if the username field is empty
      if (!DocNumber.trim()) {
          // Alert the user if the username field is empty
          alert('Please generate a document number');
          return; // Exit the function
      }
      // Check if the password field is empty
      if (!input_folder.trim()) {
          // Alert the user if the password field is empty
          alert('Please select a target folder');
          return; // Exit the function
      }
      // Check if the username field is empty
      if (!input_title.trim()) {
          // Alert the user if the username field is empty
          alert('Please enter a Title');
          return; // Exit the function
      }
      // Check if the password field is empty
      if (!input_Description.trim()) {
          // Alert the user if the password field is empty
          alert('Please enter a description');
          return; // Exit the function
      }
              // Check if the username field is empty
      if (!input_RevisionsCode.trim()) {
          // Alert the user if the username field is empty
          alert('Please enter a revision code');
          return; // Exit the function
      }
      // Check if the password field is empty
      if (!input_RevisionDescription.trim()) {
          // Alert the user if the password field is empty
          alert('Please enter a revision description');
          return; // Exit the function
      }
      // Check if the username field is empty
      if (!input_Status.trim()) {
          // Alert the user if the username field is empty
          alert('Please select a Status');
          return; // Exit the function
      }
      if (!input_file_origin.trim()) {
          // Alert the user if the username field is empty
          alert('Please select an upload origin');
          return; // Exit the function
      }
    // Check if the password field is empty
    if(originSelectionDropdown.value === "Template Folder" && !input_file_template.trim()){

        alert('Please select a Template');
        return; // Exit the function
    }
    if(originSelectionDropdown.value === "Your computer" ){

        if(droppedfile){
            console.log(droppedfile)
            uploadfile = droppedfile

        }else{
            console.log(fileInput.files[0])
            uploadfile = fileInput.files[0];
        }

        console.log(uploadfile)
        if(uploadfile){
        }else{
            alert('Please upload a file');
            return; // Exit the function
        }
    }

    
    uploadbutton.disabled = true
    const dropdown = document.getElementById('input_folder');
    uploadFolderID = dropdown.value
    if(originSelectionDropdown.value === "Template Folder"){
        templateDropdown = document.getElementById('input_file_template')
        // Get the selected index
        const selectedIndex = templateDropdown.selectedIndex;

        // Get the selected option element
        const selectedOption = templateDropdown.options[selectedIndex];

        // Get the inner text of the selected option
        const selectedOptionText = selectedOption.innerText;
        filename = sessionStorage.getItem('generatedName')+"."+getFileExtension(selectedOptionText)

    }else if(originSelectionDropdown.value === "Your computer"){

        let file
        if(droppedfile){
            file = renameFileDrop(uploadfile)
        }else{
            file = renameFile(uploadfile)
        }
        console.log(file)
        filename = file.name
    }
    console.log(filename)
    uploadFile()


    //}else{
        //alert("Please select a file to upload")
    //}

    }

async function getCustomDetailsData(){
    try{
        AccessToken_DataRead = await getAccessToken("data:read")
    } catch (error) {
        console.error('Error:', error);
    }
    customAttributes = await getItemDetails(AccessToken_DataRead)
    console.log("Custom Attributes:",customAttributes)

    titlelineID = await findObjectByName("Title Line 1",customAttributes)
    revisionCodeID = await findObjectByName("Revision",customAttributes)
    revisionDescID = await findObjectByName("Revision Description",customAttributes)
    statusCodeID = await findObjectByName("Status",customAttributes)
    StatusCodeDescriptionID = await findObjectByName("Status Code Description",customAttributes)
    ClassificationID = await findObjectByName("Classification",customAttributes)
    FileDescriptionID = await findObjectByName("File Description",customAttributes)
    StateID = await findObjectByName("State",customAttributes)

    console.log(titlelineID)
    console.log(revisionCodeID)
    console.log(revisionDescID)
    console.log(statusCodeID)
    console.log(StatusCodeDescriptionID)
    console.log(ClassificationID)
    console.log(FileDescriptionID)
    console.log(StateID)
}

async function getAccessToken(scopeInput){

    const bodyData = {
        scope: scopeInput,
        };

    const headers = {
        'Content-Type':'application/json'
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://prod-18.uksouth.logic.azure.com:443/workflows/d8f90f38261044b19829e27d147f0023/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-N-bYaES64moEe0gFiP5J6XGoZBwCVZTmYZmUbdJkPk";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data

        //console.log(JSONdata)

        return JSONdata.access_token
        })
        .catch(error => console.error('Error fetching data:', error));


    return signedURLData
    }

function createStorageLocation(AccessToken){
      const bodyData = {
        "jsonapi": {
          "version": "1.0"
        },
        "data": {
          "type": "objects",
          "attributes": {
            "name": filename
          },
          "relationships": {
            "target": {
              "data": {
                "type": "folders",
                "id": uploadFolderID
              }
            }
          }
        }
      };
        const headers = {
            'Content-Type': 'application/vnd.api+json',
            'Authorization':"Bearer "+AccessToken,
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyData),
        };

        const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+projectID+"/storage";
        //console.log(requestOptions)
        objectKey_local = fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data
                console.log(JSONdata)
            //console.log(JSONdata.data.id)
            return JSONdata.data.id
            })
            .catch(error => console.error('Error fetching data:', error));
        return objectKey_local
    }

async function generateSignedURL(AccessToken,objectKey){

        const headers = {
            'Authorization':"Bearer "+AccessToken,
        };

        const requestOptions = {
            method: 'GET',
            headers: headers,
        };

        const apiUrl = "https://developer.api.autodesk.com/oss/v2/buckets/"+bucketKey+"/objects/"+objectKey+"/signeds3upload";
        //console.log(apiUrl)
        //console.log(requestOptions)
        signedURLData = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data
            //console.log(JSONdata)
            //console.log(JSONdata.uploadKey)
            //console.log(JSONdata.urls)
            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));
        return signedURLData
    }

async function uploadtoSignURL(uploadURL) {
            const headers = {
                //'Authorization': 'Bearer ' + AccessToken,
                "Content-Type": 'application/octet-stream'
            };
            if(originSelectionDropdown.value === "Your computer"){
                file = uploadfile

            }else if(originSelectionDropdown.value === "Template Folder"){
                file = fileTemplate
            }

            const apiUrl = uploadURL;

            const requestOptions = {
                method: 'PUT',
                headers: headers,
                body: file,
            };
            await uploadtoSignURLFetch(apiUrl,requestOptions)

            //.catch((error) => console.error('Error fetching data:', error));
    }

async function completeUpload(AccessToken, objectKey, uploadKey) {
        const bodyData = {
            "uploadKey": uploadKey
        }

        const headers = {
            'Authorization': 'Bearer ' + AccessToken,
            'Content-Type': 'application/json'
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyData),
        };

    const apiUrl = "https://developer.api.autodesk.com/oss/v2/buckets/" + bucketKey + "/objects/" + objectKey + "/signeds3upload";

        console.log("apiURL: ", apiUrl)
        console.log("requestOptions: ", requestOptions)

        await fetch(apiUrl, requestOptions)
        .then(async response => {
            console.log("Response status completeUpload:", response.status);
            console.log("Response headers completeUpload:", response.headers);
            console.log("Response body completeUpload:", await response.text()); // Log the raw body

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }


        })
        //.catch(error => console.error('Error fetching data:', error));

    }

async function createFirstRevision(AccessToken,objectKey){
    const bodyData = {
        "jsonapi": { "version": "1.0" },
        "data": {
         
           "type": "items",
           "attributes": {
             "displayName": filename,
             "extension": {
               "type": "items:autodesk.bim360:File",
               "version": "1.0"
             }
           },
           "relationships": {
             "tip": {
               "data": {
                 "type": "versions", "id": "1"
               }
             },
             "parent": {
               "data": {
                 "type": "folders",
                 "id": uploadFolderID
               }
             }
           }
         },
         "included": [
           {
             "type": "versions",
             "id": "1",
             "attributes": {
               "name": filename,
               "extension": {
                 "type": "versions:autodesk.bim360:File",
                 "version": "1.0"
               }
             },
             "relationships": {
               "storage": {
                 "data": {
                   "type": "objects",
                   "id": objectKeyLong
                 }
               }
             }
           }
         ]
       };
        const headers = {
            'Content-Type': 'application/vnd.api+json',
            'Accept':'application/vnd.api+json',
            'Authorization':"Bearer "+AccessToken,
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyData),
        };

        const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+projectID+"/items";
        console.log("firstRevision RO: ",requestOptions)
        returnData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return returnData
    }

async function uploadFile(uploadFolderID,filename,projectID){
    //importData();
    try{
        AccessToken_DataCreate = await getAccessToken("data:create")
    } catch (error) {
        console.error('Error:', error);
    }
    try{
        AccessToken_DataRead = await getAccessToken("data:read")
    } catch (error) {
        console.error('Error:', error);
    }
    try{
        objectKeyLong = await createStorageLocation(AccessToken_DataCreate,uploadFolderID,filename,projectID);
    } catch (error) {
        console.error('Error:', error);
    }
    updateProgressBar()
    objectKeyShort = objectKeyLong.replace("urn:adsk.objects:os.object:wip.dm.emea.2/","")
    console.log("objectKey: ",objectKeyShort)
    try{
        signedURLData = await generateSignedURL(AccessToken_DataCreate,objectKeyShort)
    } catch (error) {
        console.error('Error:', error);
    }
    updateProgressBar()
    uploadKey = signedURLData.uploadKey
    uploadURL = signedURLData.urls[0]

    console.log("uploadKey: ",uploadKey)
    console.log("uploadURL: ",uploadURL)

    //console.log("Access Token: ",AccessToken_DataCreate)

    if(originSelectionDropdown.value === "Template Folder"){
        returndata = await getItemsStorage(AccessToken_DataRead)
        console.log("Storgate returndata",returndata)
        stroageID = returndata.included[0].relationships.storage.meta.link.href
        await getItemStorageS3URL(AccessToken_DataRead,stroageID)
        //console.log("Storgate downloadURL",downloadURL)
        //await downloadItem(downloadURL)

        //templateDropdown = document.getElementById('input_file_template')
        //console.log("copyURN Raw",templateDropdown.value)
        //copyURN_Raw = templateDropdown.value
        //copyURN = encodeURIComponent(copyURN_Raw)
        //console.log("copyURN",copyURN)
        //fileData = await postCopyofItem(AccessToken_DataCreate,copyURN,objectKeyLong)

    }
    try{
        await uploadtoSignURL(uploadURL);
        delay(500)
        updateProgressBar()
        await completeUpload(AccessToken_DataCreate,objectKeyShort,uploadKey);
        delay(100)
        updateProgressBar()
        fileData = await createFirstRevision(AccessToken_DataCreate,objectKeyLong);
        delay(100)
        updateProgressBar()
    } catch (error) {
        console.error('Error:', error);
    }
    console.log(fileData)
    fileURN = fileData.included[0].id
    fileURN = encodeURIComponent(fileURN)
    console.log(fileURN)
    fileItemID = fileData.data.id
    console.log(fileItemID)
    fileLink = fileData.data.links.webView.href
    console.log(fileLink)

    delay(100)
    try{
        AccessToken_DataCreate = await getAccessToken("data:write")
    } catch (error) {
        console.error('Error:', error);
    }
    //await patchItemDetails(AccessToken_DataCreate)
    //updateProgressBar()
    await postCustomItemDetails(AccessToken_DataCreate)
    updateProgressBar()

    uploadbutton.innerText = "View file on ACC"
    uploadbutton.onclick = viewFile

    const progressBarContainer = document.querySelector('.progress-bar__container');
    const progressBar = document.querySelector('.progress-bar-Main');
    const progressBarText = document.querySelector('.progress-bar-Main__text');
    progress = 100
    uploadbutton.disabled = false
    reloadButton.style.display = 'block';
    if(progress == 100){
        gsap.to(progressBar, {
          x: `${progress}%`,
          duration: 0.5,
          backgroundColor: '#4895ef',
          onComplete: () => {
            progressBarText.style.display = "initial";
            progressBarContainer.style.boxShadow = '0 0 5px #4895ef';
          }
        })};
    }




async function getItemDetails(AccessToken){

    const headers = {
        'Authorization':"Bearer "+AccessToken,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/bim360/docs/v1/projects/"+projectID+"/folders/"+defaultFolder+"/custom-attribute-definitions";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata.results
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function postCustomItemDetails(AccessToken){
    if($("#input_Classification").val()===""){
        classValue = ""
    }else{
        classValue = $("#input_Classification").val()
    }
    //console.log("SD",$("#input_StatusDesc").val())
    const bodyData = [
        {
            // Title Line 1
          "id": titlelineID.id,
          "value": $("#input_title").val()
        },
        {
            // Revision Code
          "id": revisionCodeID.id,
          "value": $("#input_RevisionsCode").val()
        },
        {
            // Revision Description
          "id": revisionDescID.id,
          "value": $("#input_RevisionDescription").val()
        },
        {
            // Status Code
          "id": statusCodeID.id,
          "value": $("#input_Status").val()
        },
        {
             // Status Description
          "id": ClassificationID.id,
          "value": classValue
        },
        {
             // Status Description
          "id": FileDescriptionID.id,
          "value": $("#input_Description").val()
        }
      ];

    const headers = {
        'Authorization':"Bearer "+AccessToken,
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Headers': 'Content-Type',
        //'x-user-id': "116300ed-53f9-48ad-a525-ae928297620e"
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://developer.api.autodesk.com/bim360/docs/v1/projects/"+projectID+"/versions/"+fileURN+"/custom-attributes:batch-update";
    console.log(apiUrl)
    console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function postCopyofItem(AccessToken,copyURN,objectKeyLong){
    const bodyData = {
        "jsonapi": { "version": "1.0" },
        "data": {

           "type": "items",
           "attributes": {
             "displayName": filename,
             "extension": {
               "type": "items:autodesk.bim360:File",
               "version": "1.0"
             }
           },
           "relationships": {
             "tip": {
               "data": {
                 "type": "versions",
                 "id": "1"
               }
             },
             "parent": {
               "data": {
                 "type": "objects",
                 "id": uploadFolderID
               }
             }
           }
         },
         "included": [
           {
             "type": "versions",
             "id": "1",
             "attributes": {
               "name": filename,
               "extension": {
                 "type": "versions:autodesk.bim360:File",
                 "version": "1.0"
               }
             },
             "relationships": {
               "storage": {
                 "data": {
                   "type": "objects",
                   "id": objectKeyLong
                 }
               }
             }
           }
         ]
       };
        const headers = {
            'Content-Type': 'application/vnd.api+json',
            'Accept':'application/vnd.api+json',
            'Authorization':"Bearer "+AccessToken,
            //'x-user-id':'116300ed-53f9-48ad-a525-ae928297620e'
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyData),
        };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+projectID+"/items?copyFrom="+copyURN;
    console.log(apiUrl)
    console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function patchItemDetails(AccessToken){
    const newFileName = $("#DocNumber").val()+"."+fileExtension
    const bodyData = [{
        "jsonapi": {
          "version": 1.0
        },
        "data": {
          "type": "items",
          "id": fileItemID,
          "attributes": {
            "displayName": newFileName
          }
        }
      }];

    convertedBody = JSON.stringify(bodyData)
    const headers = {
        'Authorization':"Bearer "+AccessToken,
        'Content-Type': 'application/vnd.api+json'
    };
    console.log(convertedBody)

    const requestOptions = {
        method: 'PATCH',
        headers: headers,
        body: convertedBody
    };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+projectID+"/items/"+fileItemID;
    console.log(apiUrl)
    console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

// Function to find object by name
async function findObjectByName(name,data) {
    let output
    output = await data.find(obj => obj.name === name);
    //console.log(output)
    if(output && output.arrayValues && output.length === 0){

    }else{
        return output
    }

    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function viewFile(){
        // Use window.open to open a new tab
        window.open(fileLink, '_blank');
    }

function updateProgressBar(){
    const progressTotal = 7
    const progressBarMain = document.querySelector('.progress-bar-Main');
    progressCount++;
    progress = (progressCount / progressTotal) * 100;
    console.log(progress)
    gsap.to(progressBarMain, {
        x: `${progress}%`,
        duration: 0.5,
      });
}

function renameFile(input) {
    if (input.files && input.files.length > 0) {
        var file = input.files[0];
        var newName = $("#DocNumber").val()+"."+fileExtension; // New filename
        var newFile = new File([file], newName, { type: file.type });
        console.log(newFile)
        // Replace the original file with the renamed file in the file input
        //input.files[0] = newFile;
        return newFile
    }
}

function renameFileDrop(input) {

        var file = input.file;
        var newName = $("#DocNumber").val()+"."+fileExtension; // New filename
        var newFile = new File([file], newName);

        // Replace the original file with the renamed file in the file input
        //input.files = newFile;
        console.log(newFile)
        return newFile
    
}

function getFileExtension(filename) {
    return filename.match(/\.(.+)$/)[1];
}

async function uploadtoSignURLFetch(apiUrl, requestOptions){
    await fetch(apiUrl, requestOptions)  // Note the use of fetch.default
    .then(async (response) => {
        console.log("Response status uploadtoSignURL:", response.status);
        console.log("Response headers uploadtoSignURL:", response.headers);
        console.log("Response body uploadtoSignURL:", await response.text());

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

    })
}