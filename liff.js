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


function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("app").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}

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
            document.getElementById("app").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
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
    $("#total").html(`Burger ${pesanan.burger}, French Fries ${pesanan.frenchFries}, Iced Tea ${pesanan.icedTea}, Hot Coffee ${pesanan.hotCoffee}`);
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
    $("#total").html(`Burger ${pesanan.burger}, French Fries ${pesanan.frenchFries}, Iced Tea ${pesanan.icedTea}, Hot Coffee ${pesanan.hotCoffee}`);
    $("#totalHarga").html(totalHarga);   
});

$("#order").click(function(){
    if(!totalHarga){
        $("#modalFail").modal();
    }
    else{
        $("#modalSuccess").modal();
    }
})