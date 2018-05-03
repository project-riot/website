(function($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                scrollTop: (target.offset().top - 48)
                }, 1000, "easeInOutExpo");
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
        $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
        target: '#mainNav',
        offset: 54
    });

    // Collapse Navbar
    var navbarCollapse = function() {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);


    // initialize Sliders
    // stackoverflow.com/questions/4753946/html5-slider-with-two-inputs-possible
    var elec_sliderSections = document.getElementsByClassName("elec_range-slider");
    for( var x = 0; x < elec_sliderSections.length; x++ ){
        var sliders = elec_sliderSections[x].getElementsByTagName("input");
        for( var y = 0; y < sliders.length; y++ ){
            if( sliders[y].type ==="range" ){
                sliders[y].oninput = getElectricityVals;
                // Manually trigger event first time to display values
                sliders[y].oninput();
            }
        }
    }
    var band_sliderSections = document.getElementsByClassName("band_range-slider");
    for( var x = 0; x < band_sliderSections.length; x++ ){
        var sliders = band_sliderSections[x].getElementsByTagName("input");
        for( var y = 0; y < sliders.length; y++ ){
            if( sliders[y].type ==="range" ){
                sliders[y].oninput = getBandwidthVals;
                // Manually trigger event first time to display values
                sliders[y].oninput();
            }
        }
    }

    calculateTotalCost();

    $('.dropdown-item').click(function(e){
        $('#attackType').text(this.innerHTML);
        calculateTotalCost();
    });
})(jQuery); // End of use strict


function getElectricityVals(){
    // Get slider values
    var slides = $(".elec_slider-input");
    var slide1 = parseFloat( slides[0].value );
    var slide2 = parseFloat( slides[1].value );
    // Neither slider will clip the other, so make sure we determine which is larger
    if( slide1 > slide2 ){
        var tmp = slide2; slide2 = slide1; slide1 = tmp;
    }

    var lowCostPct = slide1;
    var medCostPct = slide2 - slide1;
    var highCostPct = 100 - slide2;

    $("#elec_lowCostPct").text(lowCostPct);
    $("#elec_medCostPct").text(medCostPct);
    $("#elec_highCostPct").text(highCostPct);

    calculateTotalCost();
}

function getBandwidthVals(){
    // Get slider values
    var slides = $(".band_slider-input");
    var slide1 = parseFloat( slides[0].value );
    var slide2 = parseFloat( slides[1].value );
    var slide3 = parseFloat( slides[2].value );
    var slide4 = parseFloat( slides[3].value );
    var slide5 = parseFloat( slides[4].value );

    // continuously check the ranges of all the sliders, making sure that
    // they don't overlap each other and turn negative
    check1_2();
    check2_3();
    check3_4();
    check4_5();

    var lowCostWifiPct = slide1;
    var lowCostEthPct = slide2 - slide1;
    var medCostWifiPct = slide3 - slide2;
    var medCostEthPct = slide4 - slide3;
    var highCostWifiPct = slide5 - slide4;
    var highCostEthPct = 100 - slide5;

    $("#band_lc-eth").text(lowCostEthPct);
    $("#band_lc-wifi").text(lowCostWifiPct);
    $("#band_mc-eth").text(medCostEthPct);
    $("#band_mc-wifi").text(medCostWifiPct);
    $("#band_hc-eth").text(highCostEthPct);
    $("#band_hc-wifi").text(highCostWifiPct);

    calculateTotalCost();

    // nested functions for checking the slider handle ranges
    function check1_2() {
        if (slide1 > slide2) {
            var tmp = slide2; slide2 = slide1; slide1 = tmp;
        }
    }
    function check2_3() {
        if (slide2 > slide3) {
            var tmp = slide3; slide3 = slide2; slide2 = tmp;
            check1_2();
        }
    }
    function check3_4() {
        if (slide3 > slide4) {
            var tmp = slide4; slide4 = slide3; slide3 = tmp;
            check2_3();
        }
    }
    function check4_5() {
        if (slide4 > slide5) {
            var tmp = slide5; slide5 = slide4; slide4 = tmp;
            check3_4();
        }
    }
}


///////////////////
// COST CALCULATOR
//////////////////

function calculateTotalCost() {

    var numDevices = Number($("#numDevices").val());
    var duration = Number($("#duration").val());
    var attackType = $('#attackType').text();

    ///////////////////
    // ELECTRICITY
    ///////////////////

    // usage increases per kWh
    const elec_camElectricityIncrease = 0.0001;
    const elec_dvrElectricityIncrease = 0.0001;
    const elec_electricityIncrease = 0.0001;

    // electricity prices
    const elec_lowCostPrice = 0.1;
    const elec_medCostPrice = 0.2;
    const elec_highCostPrice = 0.3;
    $("#elec_lowCostPrice").text(elec_lowCostPrice);
    $("#elec_medCostPrice").text(elec_medCostPrice);
    $("#elec_highCostPrice").text(elec_highCostPrice);

    // GRID: get device composition
    // var elec_pctLowCostCams = Number($("#elec_lc-cams").val());
    // var elec_pctLowCostDvrs = Number($("#elec_lc-dvrs").val());
    // var elec_pctMedCostCams = Number($("#elec_mc-cams").val());
    // var elec_pctMedCostDvrs = Number($("#elec_mc-dvrs").val());
    // var elec_pctHighCostCams = Number($("#elec_hc-cams").val());
    // var elec_pctHighCostDvrs = Number($("#elec_hc-dvrs").val());
    // var elec_pctTotal = elec_pctLowCostCams + elec_pctLowCostDvrs + elec_pctMedCostCams + elec_pctMedCostDvrs + elec_pctHighCostCams + elec_pctHighCostDvrs;
    // $("#elec_percent-total").text(elec_pctTotal);
    // calculate number of devices
    // var elec_numLowCostCams = (elec_pctLowCostCams / 100) * numDevices;
    // var elec_numLowCostDvrs = (elec_pctLowCostDvrs / 100) * numDevices;
    // var elec_numMedCostCams = (elec_pctMedCostCams / 100) * numDevices;
    // var elec_numMedCostDvrs = (elec_pctMedCostDvrs / 100) * numDevices;
    // var elec_numHighCostCams = (elec_pctHighCostCams / 100) * numDevices;
    // var elec_numHighCostDvrs = (elec_pctHighCostDvrs / 100) * numDevices;
    // $("#elec_numLowCostCams").text(Math.round(elec_numLowCostCams));
    // $("#elec_numLowCostDvrs").text(Math.round(elec_numLowCostDvrs));
    // $("#elec_numMedCostCams").text(Math.round(elec_numMedCostCams));
    // $("#elec_numMedCostDvrs").text(Math.round(elec_numMedCostDvrs));
    // $("#elec_numHighCostCams").text(Math.round(elec_numHighCostCams));
    // $("#elec_numHighCostDvrs").text(Math.round(elec_numHighCostDvrs));


    // SLIDER: get device composition
    var elec_lowCostPct = Number($("#elec_lowCostPct").text());
    var elec_medCostPct = Number($("#elec_medCostPct").text());
    var elec_highCostPct = Number($("#elec_highCostPct").text());

    var elec_numLowCost = elec_lowCostPct / 100.0 * numDevices;
    var elec_numMedCost = elec_medCostPct / 100.0 * numDevices;
    var elec_numHighCost = elec_highCostPct / 100.0 * numDevices;

    $("#elec_numLowCost").text(Math.round(elec_numLowCost).toLocaleString());
    $("#elec_numMedCost").text(Math.round(elec_numMedCost).toLocaleString());
    $("#elec_numHighCost").text(Math.round(elec_numHighCost).toLocaleString());

    // GRID: increased usage in kWh
    // var elec_lcCamIncreasedUsage = elec_numLowCostCams * elec_camElectricityIncrease;
    // var elec_lcDvrIncreasedUsage = elec_numLowCostDvrs * elec_dvrElectricityIncrease;
    // var elec_mcCamIncreasedUsage = elec_numMedCostCams * elec_camElectricityIncrease;
    // var elec_mcDvrIncreasedUsage = elec_numMedCostDvrs * elec_dvrElectricityIncrease;
    // var elec_hcCamIncreasedUsage = elec_numHighCostCams * elec_camElectricityIncrease;
    // var elec_hcDvrIncreasedUsage = elec_numHighCostDvrs * elec_dvrElectricityIncrease;

    // SLIDER: increased usage in kWh
    var elec_lcIncreasedUsage = elec_numLowCost * elec_electricityIncrease;
    var elec_mcIncreasedUsage = elec_numMedCost * elec_electricityIncrease;
    var elec_hcIncreasedUsage = elec_numHighCost * elec_electricityIncrease;

    // GRID: increased cost per device and zone
    // var elec_lcCamIncreasedCost = elec_lcCamIncreasedUsage * elec_lowCostPrice;
    // var elec_lcDvrIncreasedCost = elec_lcDvrIncreasedUsage * elec_lowCostPrice;
    // var elec_mcCamIncreasedCost = elec_mcCamIncreasedUsage * elec_medCostPrice;
    // var elec_mcDvrIncreasedCost = elec_mcDvrIncreasedUsage * elec_medCostPrice;
    // var elec_hcCamIncreasedCost = elec_hcCamIncreasedUsage * elec_highCostPrice;
    // var elec_hcDvrIncreasedCost = elec_hcDvrIncreasedUsage * elec_highCostPrice;

    // SLIDER: increased cost per device and zone
    var elec_lcIncreasedCost = elec_lcIncreasedUsage * elec_lowCostPrice;
    var elec_mcIncreasedCost = elec_mcIncreasedUsage * elec_medCostPrice;
    var elec_hcIncreasedCost = elec_hcIncreasedUsage * elec_highCostPrice;

    //  cost per hour across all devices
    // var elec_increasedCostPerHour = elec_lcCamIncreasedCost + elec_lcDvrIncreasedCost + elec_mcCamIncreasedCost + elec_mcDvrIncreasedCost + elec_hcCamIncreasedCost + elec_hcDvrIncreasedCost;
    var elec_increasedCostPerHour = elec_lcIncreasedCost + elec_mcIncreasedCost + elec_hcIncreasedCost;

    var elec_roundedIncreasedCostPerHour = elec_increasedCostPerHour.toFixed(2)
    $("#elec_increasedCostPerHour").text(elec_roundedIncreasedCostPerHour);

    var elec_subtotal = (elec_increasedCostPerHour * duration).toFixed(2);



    ///////////////////
    // BANDWIDTH
    ///////////////////

    // bandwidth costs
    const band_lowCostPrice = .2;
    const band_medCostPrice = .3;
    const band_highCostPrice = .4;
    $("#band_lowCostPrice").text(band_lowCostPrice);
    $("#band_medCostPrice").text(band_medCostPrice);
    $("#band_highCostPrice").text(band_highCostPrice);

    // define usage increases, per hour in GB
    var band_eth_scanIncrease = 0.01953125;
    var band_eth_tcpIncrease = 1.025390625;
    var band_eth_udpIncrease = 6.8;
    var band_wifi_scanIncrease = 0.01953125;
    var band_wifi_tcpIncrease = 0.171875;
    var band_wifi_udpIncrease = 1.3671875;

    // set attack type
    var ethIncrease;
    var wifiIncrease;
    if (attackType == "TCP") {
        ethIncrease = band_eth_tcpIncrease;
        wifiIncrease = band_wifi_tcpIncrease;
    } else if (attackType == "UDP"){
        ethIncrease = band_eth_udpIncrease;
        wifiIncrease = band_wifi_udpIncrease;
    } else {
        ethIncrease = band_eth_scanIncrease;
        wifiIncrease = band_wifi_scanIncrease;
    }

    // get the device composition
    var band_pctLowCostEth = Number($("#band_lc-eth").text());
    var band_pctLowCostWifi = Number($("#band_lc-wifi").text());
    var band_pctMedCostEth = Number($("#band_mc-eth").text());
    var band_pctMedCostWifi = Number($("#band_mc-wifi").text());
    var band_pctHighCostEth = Number($("#band_hc-eth").text());
    var band_pctHighCostWifi = Number($("#band_hc-wifi").text());
    var band_pctTotal = band_pctLowCostEth + band_pctLowCostWifi + band_pctMedCostEth + band_pctMedCostWifi + band_pctHighCostEth + band_pctHighCostWifi;
    // $("#band_percent-total").text(band_pctTotal);

    // calculate number of devices
    var band_numLowCostEth = (band_pctLowCostEth / 100.0) * numDevices;
    var band_numLowCostWifi = (band_pctLowCostWifi / 100.0) * numDevices;
    var band_numMedCostEth = (band_pctMedCostEth / 100.0) * numDevices;
    var band_numMedCostWifi = (band_pctMedCostWifi / 100.0) * numDevices;
    var band_numHighCostEth = (band_pctHighCostEth / 100.0) * numDevices;
    var band_numHighCostWifi = (band_pctHighCostWifi / 100.0) * numDevices;
    $("#band_numLowCostEth").text(Math.round(band_numLowCostEth).toLocaleString());
    $("#band_numLowCostWifi").text(Math.round(band_numLowCostWifi).toLocaleString());
    $("#band_numMedCostEth").text(Math.round(band_numMedCostEth).toLocaleString());
    $("#band_numMedCostWifi").text(Math.round(band_numMedCostWifi).toLocaleString());
    $("#band_numHighCostEth").text(Math.round(band_numHighCostEth).toLocaleString());
    $("#band_numHighCostWifi").text(Math.round(band_numHighCostWifi).toLocaleString());

    // increased usage in GB
    var band_lcEthIncreasedUsage = band_numLowCostEth * ethIncrease;
    var band_lcWifiIncreasedUsage = band_numLowCostWifi * wifiIncrease;
    var band_mcEthIncreasedUsage = band_numMedCostEth * ethIncrease;
    var band_mcWifiIncreasedUsage = band_numMedCostWifi * wifiIncrease;
    var band_hcEthIncreasedUsage = band_numHighCostEth * ethIncrease;
    var band_hcWifiIncreasedUsage = band_numHighCostWifi * wifiIncrease;

    // increased cost per device and zone
    var band_lcEthIncreasedCost = band_lcEthIncreasedUsage * band_lowCostPrice;
    var band_lcWifiIncreasedCost = band_lcWifiIncreasedUsage * band_lowCostPrice;
    var band_mcEthIncreasedCost = band_mcEthIncreasedUsage * band_medCostPrice;
    var band_mcWifiIncreasedCost = band_mcWifiIncreasedUsage * band_medCostPrice;
    var band_hcEthIncreasedCost = band_hcEthIncreasedUsage * band_highCostPrice;
    var band_hcWifiIncreasedCost = band_hcWifiIncreasedUsage * band_highCostPrice;

    //  cost per hour across all devices
    var band_increasedCostPerHour = band_lcEthIncreasedCost + band_lcWifiIncreasedCost + band_mcEthIncreasedCost + band_mcWifiIncreasedCost + band_hcEthIncreasedCost + band_hcWifiIncreasedCost;

    var band_roundedIncreasedCostPerHour = +band_increasedCostPerHour.toFixed(2);
    $("#band_increasedCostPerHour").text(band_roundedIncreasedCostPerHour.toLocaleString());

    var band_subtotal = (band_increasedCostPerHour * duration).toFixed(2);



    // cost totals
    var totalCost = Number(elec_subtotal) + Number(band_subtotal);
    var increasedCostPerDevice = (totalCost / numDevices).toFixed(2);
    $("#increasedCostPerDevice").text(increasedCostPerDevice.toLocaleString());
    $("#totalCost").text(totalCost.toLocaleString());

}


// PRESET ATTACK PROFILES

function krebsAttack() {
    $("#numDevices").val("24000");
    $("#duration").val("77");
    $("#attackType").text("TCP");

    // GRID
    // $("#elec_lc-cams").val(30);
    // $("#elec_lc-dvrs").val(20);
    // $("#elec_mc-cams").val(10);
    // $("#elec_mc-dvrs").val(15);
    // $("#elec_hc-cams").val(15);
    // $("#elec_hc-dvrs").val(10);

    // SLIDER
    // elec
    $("#elec_lowCostPct").text(50);
    $("#elec_medCostPct").text(25);
    $("#elec_highCostPct").text(25);

    $("#slider-left").val(50);
    $("#slider-right").val(75);

    // band
    $("#band_lc-wifi").text(20);
    $("#band_lc-eth").text(30);
    $("#band_mc-wifi").text(15);
    $("#band_mc-eth").text(10);
    $("#band_hc-wifi").text(10);
    $("#band_hc-eth").text(15);

    $("#slider-1").val(20);
    $("#slider-2").val(50);
    $("#slider-3").val(65);
    $("#slider-4").val(75);
    $("#slider-5").val(85);

    calculateTotalCost();
}

function dynAttack() {
    $("#numDevices").val("107000");
    $("#duration").val("6");
    $("#attackType").text("TCP");

    // GRID
    // $("#elec_lc-cams").val(30);
    // $("#elec_lc-dvrs").val(20);
    // $("#elec_mc-cams").val(10);
    // $("#elec_mc-dvrs").val(15);
    // $("#elec_hc-cams").val(15);
    // $("#elec_hc-dvrs").val(10);

    // SLIDER
    // elec
    $("#elec_lowCostPct").text(50);
    $("#elec_medCostPct").text(25);
    $("#elec_highCostPct").text(25);

    $("#slider-left").val(50);
    $("#slider-right").val(75);

    // band
    $("#band_lc-wifi").text(15);
    $("#band_lc-eth").text(15);
    $("#band_mc-wifi").text(20);
    $("#band_mc-eth").text(20);
    $("#band_hc-wifi").text(15);
    $("#band_hc-eth").text(15);

    $("#slider-1").val(15);
    $("#slider-2").val(30);
    $("#slider-3").val(50);
    $("#slider-4").val(70);
    $("#slider-5").val(85);

    calculateTotalCost();
}


function worstCaseAttack() {
    $("#numDevices").val("600000");
    $("#duration").val("50");
    $("#attackType").text("UDP");

    // GRID
    // $("#elec_lc-cams").val(1);
    // $("#elec_lc-dvrs").val(4);
    // $("#elec_mc-cams").val(3);
    // $("#elec_mc-dvrs").val(2);
    // $("#elec_hc-cams").val(55);
    // $("#elec_hc-dvrs").val(35);

    // SLIDER
    // elec
    $("#elec_lowCostPct").text(5);
    $("#elec_medCostPct").text(5);
    $("#elec_highCostPct").text(90);

    $("#slider-left").val(5);
    $("#slider-right").val(10);

    // band
    $("#band_lc-wifi").text(5);
    $("#band_lc-eth").text(5);
    $("#band_mc-wifi").text(5);
    $("#band_mc-eth").text(5);
    $("#band_hc-wifi").text(5);
    $("#band_hc-eth").text(75);

    $("#slider-1").val(5);
    $("#slider-2").val(10);
    $("#slider-3").val(15);
    $("#slider-4").val(20);
    $("#slider-5").val(25);

    calculateTotalCost();
}
