const projectID = "2e6449f9-ce25-4a9c-8835-444cb5ea03bf";
const hubID= "b.24d2d632-e01b-4ca0-b988-385be827cb04"
const bucketKey = "wip.dm.emea.2"
const toolURL ="https://keltbray-dd.github.io/SSE_GSP_File_Uploader/"

let ProjectFiles = []
let projectFolders
let deliverableFolders =[]

const StatesList = [
    //{ code: 'A4', description: 'Accepted Design',folder:"PUBLISHED" },
    //{ code: 'A5', description: 'Accepted For Construction',folder:"PUBLISHED" },
    //{ code: 'A6', description: 'Accepted Handover',folder:"PUBLISHED" },
    //{ code: 'A7', description: 'Accepted Operation and Maintain',folder:"PUBLISHED" },
    { code: 'S0', description: 'Work In Progress',folder:"WIP" },
    //{ code: 'S1', description: 'Suitable For Co-Ordination',folder:"SHARED" },
    //{ code: 'S2', description: 'Suitable For Information',folder:"SHARED" },
    //{ code: 'S3', description: 'Suitable Review & Comment',folder:"SHARED" },
    //{ code: 'S4', description: 'Suitable LeadAppointedPartyApproval',folder:"CLIENT_SHARED" },
    //{ code: 'S6', description: 'Suitable PIM Authorisation',folder:"NA" },
    //{ code: 'S7', description: 'Suitable AIM Authorisation',folder:"NA" }
];

const tooltips = [
    { value: "Project Pin", tooltip: "The ‘project pin’ identifier code indicates that a document is related to a specific project to control its placement and management within the project folder structure where more than one project identification number may be in use" },
    { value: "Originator", tooltip: "The ‘originator’ (company) identifier code serves to identify which company has created a document. They are ultimately accountable for the document and liable for its content through the lifecycle of the project" },
    { value: "Function", tooltip: "The ‘function’ (volume) identifier code clearly defines the required profession to allow the user to better understand the documents relevance without having to open it" },
    { value: "Spatial", tooltip: "The ‘spatial’ (location) identifier code provides the user with a clear location the document content relates to. This code can be used to understand for instance if the document relates to a site compound, battery island or junction" },
    { value: "Form", tooltip: "The ‘form’ (type) identifier code indicates to the user the type of document it is, for example a report (RP), a drawing (DR) or 2D Model (M2)" },
    { value: "Discipline", tooltip: "The ‘discipline’ (Task Team) identifier code gives a user information on who the responsible team/discipline is, who have generated the document’ content and are accountable for it" }
];

var AccessToken_DataCreate
var AccessToken_DataRead
var AccessToken_BucketCreate

let filelist =[];
let arrayprojectPin=[];
let arrayOriginator=[];
let arrayfunction=[];
let arraySpatial=[];
let arrayForm=[];
let arrayDiscipline=[];
let customAttributes =[]
let templatesList =[];

let objectKeyShort
let objectKeyLong
let fileData
let filename
let droppedfile
let uploadfile

let titlelineID
let revisionCodeID
let revisionDescID
let statusCodeID
let ClassificationID
let StatusCodeDescriptionID
let FileDescriptionID
let StateID
let namingstandardID

let namingstandard;
let fileURN
let fileExtension
let progressCount = 0
let uploadbutton
let originSelectionDropdown
let templateDropdwon
let copyURN
let copyURN_Raw
let uploadFolderID
let fileTemplate
let reloadButton
let loadingScreen

document.addEventListener('DOMContentLoaded', function() {
    uploadbutton = document.getElementById('viewfile_btn');
    originSelectionDropdown = document.getElementById('input_file_origin');
    droparea = document.getElementById('drop-area')
    templateDropdwon = document.getElementById('templatesDropdown');
    reloadButton = document.getElementById('reloadButton');
    tooltip = document.getElementById('tooltip')
    tooltipQuestion = document.querySelectorAll('.fa-circle-question')

    // Add a click event listener to the button
    reloadButton.addEventListener('click', function() {
        // Reload the page
        location.reload();
        // Scroll to the top of the page
        window.scrollTo(0, 0);
    });

    originSelectionDropdown.addEventListener('change', function() {
        // This function will be called whenever the dropdown value changes
        templateDropdwon.style.display = 'none'
        droparea.style.display = 'none'
        //console.log('Selected option:', originSelectionDropdown.value);
        // You can perform any actions you need here
        if(originSelectionDropdown.value === "Template Folder"){
            templateDropdwon.style.display = 'block'
        }else if(originSelectionDropdown.value === "Your computer"){
            droparea.style.display = 'block'
        }
      });
    // Add event listener to each help icon
    tooltipQuestion.forEach(function(icon) {
        icon.addEventListener('click', function() {
        var index = this.getAttribute("value");
        displayMessage = lookupTooltip(index, tooltips)
        alert(displayMessage);
        });
    });

    function lookupTooltip(valueToFind, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].value === valueToFind) {
                return array[i].tooltip;
            }
        }
        return "Tooltip not found"; // Return a default message if the value is not found
    }

});
function signin(){
    window.open("https://developer.api.autodesk.com/authentication/v2/authorize?response_type=code&client_id=UMPIoFc8iQoJ2eKS6GsJbCGSmMb4s1PY&redirect_uri="+toolURL+"&scope=data:read&prompt=login&state=12321321&code_challenge=fePr9SDGJIToHximLHTRokkzkfzZksznrDIx9bexsto&code_challenge_method=S256","_self")
}

window.onload = function() {
    // Function to parse URL parameters
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Check if 'code' parameter exists in the URL
    var codeParam = getParameterByName('code');
    if (codeParam !== null) {
        // Run your function here, for example:
        console.log("Code parameter found: " + codeParam);
        // Call your function here
        // yourFunctionName(codeParam);
    }else{
        signin()
    }
}





