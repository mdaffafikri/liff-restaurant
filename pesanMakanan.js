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
    registerButtonHandlers();
    displayIsInClientInfo();
 
    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {
        $("#login").addClass('hidden');   
        $("#greeting").addClass('hidden');
    }
    else {
        $("#logout").addClass('hidden');   
        $("#app").addClass('hidden');
    }
}
 
/**
* Display data generated by invoking LIFF methods
*/
function displayLiffData() {    
    if(liff.isLoggedIn()){
        liff.getProfile().then(function(profile) {        
            document.getElementById('customerName').textContent = profile.displayName;
    
            $("#profilePicture").attr("src", profile.pictureUrl);
            $("#profilePicture").attr("alt", 'Profile Picture');
            
        }).catch(function(error) {
            window.alert('Error getting profile: ' + error);
        })
    }
}
 
/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
    if (liff.isInClient()) {
        $("#login").addClass('hidden'); 
        $("#logout").addClass('hidden');   
    } 
}

function registerButtonHandlers() {

    $('#externalBrowser').click(function(){
        liff.openWindow({
            url: 'https://burgershot.herokuapp.com/',
            external: true
        });
        // console.log("clicked");        
    });
    
    $('#login').click(function(){
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });

    $('#logout').click(function(){
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
          }
    });

    $('#pesan').click(function(){
        if (!liff.isInClient()) {
            $("#modalNotInClient").modal();
        } 
        else {
            if(!totalHarga){
                $("#modalFail").modal();
            }
            else{
                liff.sendMessages([{
                    'type': 'text',
                    'text': `Hai ${document.getElementById('customerName').textContent}!\n\nTerima kasih telah memesan makanan di Burger Shot! Berikut ini adalah rincian pesanan anda:\n\n${(pesanan.burger > 0) ? "-Burger : "+pesanan.burger+"\n" : ""}${(pesanan.frenchFries > 0) ? "-French Fries : "+pesanan.frenchFries+"\n" : ""}${(pesanan.icedTea > 0) ? "-Iced Tea : "+pesanan.icedTea+"\n" : ""}${(pesanan.hotCoffee > 0) ? "-Hot Coffee : "+pesanan.hotCoffee+"\n" : ""}\nTotal : Rp.${totalHarga}`
                }])
                .then(function() {
                    $("#modalSuccess").modal();
                }).catch(function(error) {
                    window.alert('Error sending message: ' + error);
                });
            }
        }
    });
}

// batas kode liff

var pesanan = {
    burger: 0,
    frenchFries: 0,
    icedTea: 0,
    hotCoffee: 0
}
var totalHarga = 0;

$(document).on('click', '.tambah', function (event) {
    if ($(this).data("pilihan") === 'burger') {
        pesanan.burger++
        totalHarga += 10000
        $("#jumlahBurger").html(pesanan.burger)
    }

    if ($(this).data("pilihan") === 'frenchFries') {
        pesanan.frenchFries++
        totalHarga += 7000
        $("#jumlahFrenchFries").html(pesanan.frenchFries)
    }

    if ($(this).data("pilihan") === 'icedTea') {
        pesanan.icedTea++
        totalHarga += 3000
        $("#jumlahIcedTea").html(pesanan.icedTea)
    }

    if ($(this).data("pilihan") === 'hotCoffee') {
        pesanan.hotCoffee++
        totalHarga += 5000
        $("#jumlahHotCoffee").html(pesanan.hotCoffee)
    }
    $("#total").html(`
        ${(pesanan.burger > 0) ? "Burger "+pesanan.burger : ""} 
        ${(pesanan.frenchFries > 0) ? "French Fries "+pesanan.frenchFries : ""} 
        ${(pesanan.icedTea > 0) ? "Iced Tea "+pesanan.icedTea : ""} 
        ${(pesanan.hotCoffee > 0) ? "Hot Coffee "+pesanan.hotCoffee : ""} 
        `);
    $("#totalHarga").html(totalHarga);
});

$(document).on("click", '.kurang', function (event) {
    if ($(this).data("pilihan") === 'burger') {
        if (pesanan.burger < 1) {
            pesanan.burger = 0
        }
        else {
            totalHarga -= 10000
            pesanan.burger--
            $("#jumlahBurger").html(pesanan.burger)
        }
    }

    if ($(this).data("pilihan") === 'frenchFries') {
        if (pesanan.frenchFries < 1) {
            pesanan.frenchFries = 0
        }
        else {
            totalHarga -= 7000
            pesanan.frenchFries--
            $("#jumlahFrenchFries").html(pesanan.frenchFries)
        }
    }

    if ($(this).data("pilihan") === 'icedTea') {
        if (pesanan.icedTea < 1) {
            pesanan.icedTea = 0
        }
        else {
            totalHarga -= 3000
            pesanan.icedTea--
            $("#jumlahIcedTea").html(pesanan.icedTea)
        }
    }

    if ($(this).data("pilihan") === 'hotCoffee') {
        if (pesanan.hotCoffee < 1) {
            pesanan.hotCoffee = 0
        }
        else {
            totalHarga -= 5000
            pesanan.hotCoffee--
            $("#jumlahHotCoffee").html(pesanan.hotCoffee)
        }
    }
    $("#total").html(`
        ${(pesanan.burger > 0) ? "Burger "+pesanan.burger : ""} 
        ${(pesanan.frenchFries > 0) ? "French Fries "+pesanan.frenchFries : ""} 
        ${(pesanan.icedTea > 0) ? "Iced Tea "+pesanan.icedTea : ""} 
        ${(pesanan.hotCoffee > 0) ? "Hot Coffee "+pesanan.hotCoffee : ""} 
        `);
    $("#totalHarga").html(totalHarga);   
});