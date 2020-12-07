window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1655321821-78Dvpqmd";   // change the default LIFF value if you are not using a node server
 
    // DO NOT CHANGE THIS
    let myLiffId = "";
 
    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};
 
/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}
 
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}
 
/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    displayLiffData();
    displayIsInClientInfo();
    registerButtonHandlers();
 
    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {
        document.getElementById('liffLoginButton').disabled = true;        
    } else {
        document.getElementById('liffLogoutButton').disabled = true;
    }
}
 
/**
* Display data generated by invoking LIFF methods
*/
function displayLiffData() {    
    document.getElementById('isInClient').textContent = liff.isInClient();
    document.getElementById('isLoggedIn').textContent = liff.isLoggedIn();
    
    liff.getProfile().then(function(profile) {
        // document.getElementById('userIdProfileField').textContent = profile.userId;
        document.getElementById('customerName').textContent = profile.displayName;

        // const profilePictureDiv = document.getElementById('profilePictureDiv');
        // if (profilePictureDiv.firstElementChild) {
        //     profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
        // }
        // const img = document.createElement('img');
        // img.src = profile.pictureUrl;
        // img.alt = 'Profile Picture';
        // profilePictureDiv.appendChild(img);

        document.getElementById('statusMessageField').textContent = profile.statusMessage;
        toggleProfileData();
    }).catch(function(error) {
        window.alert('Error getting profile: ' + error);
    });
}
 
/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
    if (liff.isInClient()) {
        document.getElementById('liffLoginButton').classList.toggle('hidden');
        document.getElementById('liffLogoutButton').classList.toggle('hidden');
        document.getElementById('isInClientMessage').textContent = 'You are opening the app in the in-app browser of LINE.';
    } else {
        document.getElementById('isInClientMessage').textContent = 'You are opening the app in an external browser.';
    }
}

function registerButtonHandlers() {

    $('#openWindowButton').click(function(){
        console.log("clicked");
        liff.openWindow({
            url: 'https://burgershot.herokuapp.com/',
            external: true
        });        
    });

    $('#closeWindowButton').click(function(){
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.closeWindow();
        }
    });
    
    $('#liffLoginButton').click(function(){
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });

    $('#sendMessageButton').click(function(){
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': "Anda telah menggunakan fitur Send Message!"
            }])
            // .then(function() {
            //     window.alert('Ini adalah pesan dari fitur Send Message');
            // }).catch(function(error) {
            //     window.alert('Error sending message: ' + error);
            // });
        }
    });
}

function sendAlertIfNotInClient() {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
}
 
/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = 'none';
    } else {
        elem.style.display = 'block';
    }
}