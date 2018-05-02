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
    // https://stackoverflow.com/questions/4753946/html5-slider-with-two-inputs-possible
    var sliderSections = document.getElementsByClassName("range-slider");
    for( var x = 0; x < sliderSections.length; x++ ){
        var sliders = sliderSections[x].getElementsByTagName("input");
        for( var y = 0; y < sliders.length; y++ ){
            if( sliders[y].type ==="range" ){
                sliders[y].oninput = getVals;
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


function getVals(){
    // Get slider values
    var parent = this.parentNode;
    var slides = $(".slider-input");
    var slide1 = parseFloat( slides[0].value );
    var slide2 = parseFloat( slides[1].value );
    // Neither slider will clip the other, so make sure we determine which is larger
    if( slide1 > slide2 ){
        var tmp = slide2; slide2 = slide1; slide1 = tmp;
    }

    var displayElement = parent.getElementsByClassName("rangeValues")[0];
    var lowCostPct = slide1;
    var medCostPct = slide2 - slide1;
    var highCostPct = 100 - slide2;
    displayElement.innerHTML = lowCostPct + "% low cost <br>" + medCostPct + "% med cost <br>" + highCostPct + "% high cost";
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

    // electricity prices
    const elec_lowCostPrice = 0.1;
    const elec_medCostPrice = 0.2;
    const elec_highCostPrice = 0.3;
    $("#elec_lowCostPrice").text(elec_lowCostPrice);
    $("#elec_medCostPrice").text(elec_medCostPrice);
    $("#elec_highCostPrice").text(elec_highCostPrice);

    // get the device composition
    var elec_pctLowCostCams = Number($("#elec_lc-cams").val());
    var elec_pctLowCostDvrs = Number($("#elec_lc-dvrs").val());
    var elec_pctMedCostCams = Number($("#elec_mc-cams").val());
    var elec_pctMedCostDvrs = Number($("#elec_mc-dvrs").val());
    var elec_pctHighCostCams = Number($("#elec_hc-cams").val());
    var elec_pctHighCostDvrs = Number($("#elec_hc-dvrs").val());
    var elec_pctTotal = elec_pctLowCostCams + elec_pctLowCostDvrs + elec_pctMedCostCams + elec_pctMedCostDvrs + elec_pctHighCostCams + elec_pctHighCostDvrs;
    $("#elec_percent-total").text(elec_pctTotal);

    // calculate number of devices
    var elec_numLowCostCams = (elec_pctLowCostCams / 100) * numDevices;
    var elec_numLowCostDvrs = (elec_pctLowCostDvrs / 100) * numDevices;
    var elec_numMedCostCams = (elec_pctMedCostCams / 100) * numDevices;
    var elec_numMedCostDvrs = (elec_pctMedCostDvrs / 100) * numDevices;
    var elec_numHighCostCams = (elec_pctHighCostCams / 100) * numDevices;
    var elec_numHighCostDvrs = (elec_pctHighCostDvrs / 100) * numDevices;
    $("#elec_numLowCostCams").text(Math.round(elec_numLowCostCams));
    $("#elec_numLowCostDvrs").text(Math.round(elec_numLowCostDvrs));
    $("#elec_numMedCostCams").text(Math.round(elec_numMedCostCams));
    $("#elec_numMedCostDvrs").text(Math.round(elec_numMedCostDvrs));
    $("#elec_numHighCostCams").text(Math.round(elec_numHighCostCams));
    $("#elec_numHighCostDvrs").text(Math.round(elec_numHighCostDvrs));

    // increased usage in kWh
    var elec_lcCamIncreasedUsage = elec_numLowCostCams * elec_camElectricityIncrease;
    var elec_lcDvrIncreasedUsage = elec_numLowCostDvrs * elec_dvrElectricityIncrease;
    var elec_mcCamIncreasedUsage = elec_numMedCostCams * elec_camElectricityIncrease;
    var elec_mcDvrIncreasedUsage = elec_numMedCostDvrs * elec_dvrElectricityIncrease;
    var elec_hcCamIncreasedUsage = elec_numHighCostCams * elec_camElectricityIncrease;
    var elec_hcDvrIncreasedUsage = elec_numHighCostDvrs * elec_dvrElectricityIncrease;

    // increased cost per device and zone
    var elec_lcCamIncreasedCost = elec_lcCamIncreasedUsage * elec_lowCostPrice;
    var elec_lcDvrIncreasedCost = elec_lcDvrIncreasedUsage * elec_lowCostPrice;
    var elec_mcCamIncreasedCost = elec_mcCamIncreasedUsage * elec_medCostPrice;
    var elec_mcDvrIncreasedCost = elec_mcDvrIncreasedUsage * elec_medCostPrice;
    var elec_hcCamIncreasedCost = elec_hcCamIncreasedUsage * elec_highCostPrice;
    var elec_hcDvrIncreasedCost = elec_hcDvrIncreasedUsage * elec_highCostPrice;

    //  cost per hour across all devices
    var elec_increasedCostPerHour = elec_lcCamIncreasedCost + elec_lcDvrIncreasedCost + elec_mcCamIncreasedCost + elec_mcDvrIncreasedCost + elec_hcCamIncreasedCost + elec_hcDvrIncreasedCost;
    var elec_roundedIncreasedCostPerHour = elec_increasedCostPerHour.toFixed(2)
    $("#elec_increasedCostPerHour").text(elec_roundedIncreasedCostPerHour);

    var elec_subtotal = (elec_increasedCostPerHour * duration).toFixed(2);



    ///////////////////
    // BANDWIDTH
    ///////////////////

    // bandwidth costs
    const band_lowCostPrice = 2;
    const band_medCostPrice = 3;
    const band_highCostPrice = 4;
    $("#band_lowCostPrice").text(band_lowCostPrice);
    $("#band_medCostPrice").text(band_medCostPrice);
    $("#band_highCostPrice").text(band_highCostPrice);

    // define usage increases, per hour in GB
    var band_eth_scanIncrease = 0.01953125
    var band_eth_tcpIncrease = 1.025390625
    var band_eth_udpIncrease = 6.8
    var band_wifi_scanIncrease = 0.01953125
    var band_wifi_tcpIncrease = 0.171875
    var band_wifi_udpIncrease = 1.3671875

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
    var band_pctLowCostEth = Number($("#band_lc-eth").val());
    var band_pctLowCostWifi = Number($("#band_lc-wifi").val());
    var band_pctMedCostEth = Number($("#band_mc-eth").val());
    var band_pctMedCostWifi = Number($("#band_mc-wifi").val());
    var band_pctHighCostEth = Number($("#band_hc-eth").val());
    var band_pctHighCostWifi = Number($("#band_hc-wifi").val());
    var band_pctTotal = band_pctLowCostEth + band_pctLowCostWifi + band_pctMedCostEth + band_pctMedCostWifi + band_pctHighCostEth + band_pctHighCostWifi;
    $("#band_percent-total").text(band_pctTotal);

    // calculate number of devices
    var band_numLowCostEth = (band_pctLowCostEth / 100) * numDevices;
    var band_numLowCostWifi = (band_pctLowCostWifi / 100) * numDevices;
    var band_numMedCostEth = (band_pctMedCostEth / 100) * numDevices;
    var band_numMedCostWifi = (band_pctMedCostWifi / 100) * numDevices;
    var band_numHighCostEth = (band_pctHighCostEth / 100) * numDevices;
    var band_numHighCostWifi = (band_pctHighCostWifi / 100) * numDevices;
    $("#band_numLowCostEth").text(Math.round(band_numLowCostEth));
    $("#band_numLowCostWifi").text(Math.round(band_numLowCostWifi));
    $("#band_numMedCostEth").text(Math.round(band_numMedCostEth));
    $("#band_numMedCostWifi").text(Math.round(band_numMedCostWifi));
    $("#band_numHighCostEth").text(Math.round(band_numHighCostEth));
    $("#band_numHighCostWifi").text(Math.round(band_numHighCostWifi));

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

    // console.log(band_lcEthIncreasedCost);
    // console.log(band_lcWifiIncreasedCost);
    // console.log(band_mcEthIncreasedCost);
    // console.log(band_mcWifiIncreasedCost);
    // console.log(band_hcEthIncreasedCost);
    // console.log(band_hcWifiIncreasedCost);

    //  cost per hour across all devices
    var band_increasedCostPerHour = band_lcEthIncreasedCost + band_lcWifiIncreasedCost + band_mcEthIncreasedCost + band_mcWifiIncreasedCost + band_hcEthIncreasedCost + band_hcWifiIncreasedCost;

    // console.log(band_increasedCostPerHour);

    var band_roundedIncreasedCostPerHour = band_increasedCostPerHour.toFixed(2)
    $("#band_increasedCostPerHour").text(band_roundedIncreasedCostPerHour);

    var band_subtotal = (band_increasedCostPerHour * duration).toFixed(2);



    // cost totals
    var totalCost = Number(elec_subtotal) + Number(band_subtotal);
    var increasedCostPerDevice = totalCost / numDevices;
    $("#increasedCostPerDevice").text(increasedCostPerDevice.toFixed(2).toLocaleString());
    $("#totalCost").text(totalCost.toLocaleString());

}


// PRESET ATTACK PROFILES

function krebsAttack() {
    $("#numDevices").val("24000");
    $("#duration").val("77");
    $("#attackType").text("TCP");

    $("#elec_lc-cams").val(30);
    $("#elec_lc-dvrs").val(20);
    $("#elec_mc-cams").val(10);
    $("#elec_mc-dvrs").val(15);
    $("#elec_hc-cams").val(15);
    $("#elec_hc-dvrs").val(10);

    $("#band_lc-eth").val(30);
    $("#band_lc-wifi").val(20);
    $("#band_mc-eth").val(10);
    $("#band_mc-wifi").val(15);
    $("#band_hc-eth").val(15);
    $("#band_hc-wifi").val(10);

    calculateTotalCost();
}

function dynAttack() {
    $("#numDevices").val("107000");
    $("#duration").val("6");
    $("#attackType").text("TCP");

    $("#elec_lc-cams").val(30);
    $("#elec_lc-dvrs").val(20);
    $("#elec_mc-cams").val(10);
    $("#elec_mc-dvrs").val(15);
    $("#elec_hc-cams").val(15);
    $("#elec_hc-dvrs").val(10);

    $("#band_lc-eth").val(15);
    $("#band_lc-wifi").val(15);
    $("#band_mc-eth").val(20);
    $("#band_mc-wifi").val(20);
    $("#band_hc-eth").val(15);
    $("#band_hc-wifi").val(15);

    calculateTotalCost();
}


function worstCaseAttack() {
    $("#numDevices").val("600000");
    $("#duration").val("50");
    $("#attackType").text("UDP");

    $("#elec_lc-cams").val(1);
    $("#elec_lc-dvrs").val(4);
    $("#elec_mc-cams").val(3);
    $("#elec_mc-dvrs").val(2);
    $("#elec_hc-cams").val(55);
    $("#elec_hc-dvrs").val(35);

    $("#band_lc-eth").val(5);
    $("#band_lc-wifi").val(5);
    $("#band_mc-eth").val(5);
    $("#band_mc-wifi").val(5);
    $("#band_hc-eth").val(5);
    $("#band_hc-wifi").val(75);

    calculateTotalCost();
}

function raphit () {
    var r = Raphael("holder");

    r.customAttributes.segment = function (x, y, r, a1, a2) {
        var flag = (a2 - a1) > 180,
            clr = (a2 - a1) / 360;
        a1 = (a1 % 360) * Math.PI / 180;
        a2 = (a2 % 360) * Math.PI / 180;
        return {
            path: [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]],
            fill: "hsb(" + clr + ", .75, .8)"
        };
    };

    function animate(ms) {
        var start = 0,
            val;
        for (i = 0; i < ii; i++) {
            val = 360 / total * data[i];
            paths[i].animate({segment: [200, 200, 150, start, start += val]}, ms || 1500, "bounce");
            paths[i].angle = start - val / 2;
        }
    }

    var data = [24, 92, 24, 52, 78, 99, 82, 27],
        paths = r.set(),
        total,
        start,
        bg = r.circle(200, 200, 0).attr({stroke: "#fff", "stroke-width": 4});
    data = data.sort(function (a, b) { return b - a;});

    total = 0;
    for (var i = 0, ii = data.length; i < ii; i++) {
        total += data[i];
    }
    start = 0;
    for (i = 0; i < ii; i++) {
        var val = 360 / total * data[i];
        (function (i, val) {
            paths.push(r.path().attr({segment: [200, 200, 1, start, start + val], stroke: "#fff"}).click(function () {
                total += data[i];
                data[i] *= 2;
                animate();
            }));
        })(i, val);
        start += val;
    }
    bg.animate({r: 151}, 1000, "bounce");
    animate(1000);
    var t = r.text(200, 20, "Click on segments to make them bigger.").attr({font: '100 20px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif', fill: "#fff"});
};
