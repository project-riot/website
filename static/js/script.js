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

  calculateTotalCost();

})(jQuery); // End of use strict

///////////////////
// COST CALCULATOR
//////////////////



function calculateTotalCost() {

    var numDevices = Number($("#numDevices").val());

    // usage increaess per kWh
    const camElectricityIncrease = 0.0001;
    const dvrElectricityIncrease = 0.0001;

    // electricity prices
    const lowCostPrice = 0.1;
    const medCostPrice = 0.2;
    const highCostPrice = 0.3;
    $("#lowCostPrice").text(lowCostPrice);
    $("#medCostPrice").text(medCostPrice);
    $("#highCostPrice").text(highCostPrice);

    // get the device composition
    var pctLowCostCams = Number($("#lc-cams").val());
    var pctLowCostDvrs = Number($("#lc-dvrs").val());
    var pctMedCostCams = Number($("#mc-cams").val());
    var pctMedCostDvrs = Number($("#mc-dvrs").val());
    var pctHighCostCams = Number($("#hc-cams").val());
    var pctHighCostDvrs = Number($("#hc-dvrs").val());
    var pctTotal = pctLowCostCams + pctLowCostDvrs + pctMedCostCams + pctMedCostDvrs + pctHighCostCams + pctHighCostDvrs;
    $("#percent-total").text(pctTotal);

    // calculate number of devices
    var numLowCostCams = (pctLowCostCams / 100) * numDevices;
    var numLowCostDvrs = (pctLowCostDvrs / 100) * numDevices;
    var numMedCostCams = (pctMedCostCams / 100) * numDevices;
    var numMedCostDvrs = (pctMedCostDvrs / 100) * numDevices;
    var numHighCostCams = (pctHighCostCams / 100) * numDevices;
    var numHighCostDvrs = (pctHighCostDvrs / 100) * numDevices;
    $("#numLowCostCams").text(numLowCostCams);
    $("#numLowCostDvrs").text(numLowCostDvrs);
    $("#numMedCostCams").text(numMedCostCams);
    $("#numMedCostDvrs").text(numMedCostDvrs);
    $("#numHighCostCams").text(numHighCostCams);
    $("#numHighCostDvrs").text(numHighCostDvrs);

    // increased usage in kWh
    var lcCamIncreasedUsage = numLowCostCams * camElectricityIncrease;
    var lcDvrIncreasedUsage = numLowCostDvrs * dvrElectricityIncrease;
    var mcCamIncreasedUsage = numMedCostCams * camElectricityIncrease;
    var mcDvrIncreasedUsage = numMedCostDvrs * dvrElectricityIncrease;
    var hcCamIncreasedUsage = numHighCostCams * camElectricityIncrease;
    var hcDvrIncreasedUsage = numHighCostDvrs * dvrElectricityIncrease;

    // increased cost per device and zone
    var lcCamIncreasedCost = lcCamIncreasedUsage * lowCostPrice;
    var lcDvrIncreasedCost = lcDvrIncreasedUsage * lowCostPrice;
    var mcCamIncreasedCost = mcCamIncreasedUsage * medCostPrice;
    var mcDvrIncreasedCost = mcDvrIncreasedUsage * medCostPrice;
    var hcCamIncreasedCost = hcCamIncreasedUsage * highCostPrice;
    var hcDvrIncreasedCost = hcDvrIncreasedUsage * highCostPrice;

    //  cost per hour across all devices
    var increasedCostPerHour = lcCamIncreasedCost + lcDvrIncreasedCost + mcCamIncreasedCost + mcDvrIncreasedCost + hcCamIncreasedCost + hcDvrIncreasedCost;
    var roundedIncreasedCostPerHour = increasedCostPerHour.toFixed(2)
    $("#increasedCostPerHour").text(roundedIncreasedCostPerHour);

    // total cost
    var duration = Number($("#duration").val());
    var totalCost = (increasedCostPerHour * duration).toFixed(2);
    $("#totalCost").text(totalCost);

}


// PRESET ATTACK PROFILES

function krebsAttack() {
    $("#numDevices").val("107000");

    $("#lc-cams").val(30);
    $("#lc-dvrs").val(20);
    $("#mc-cams").val(10);
    $("#mc-dvrs").val(15);
    $("#hc-cams").val(15);
    $("#hc-dvrs").val(10);

    $("#duration").val("8");

    calculateTotalCost();
}

function dynAttack() {
    $("#numDevices").val("180000");

    $("#lc-cams").val(30);
    $("#lc-dvrs").val(20);
    $("#mc-cams").val(10);
    $("#mc-dvrs").val(15);
    $("#hc-cams").val(15);
    $("#hc-dvrs").val(10);

    $("#duration").val("4");

    calculateTotalCost();
}


function worstCaseAttack() {
    $("#numDevices").val("600000");

    $("#lc-cams").val(1);
    $("#lc-dvrs").val(4);
    $("#mc-cams").val(3);
    $("#mc-dvrs").val(2);
    $("#hc-cams").val(55);
    $("#hc-dvrs").val(35);

    $("#duration").val("12");

    calculateTotalCost();
}
