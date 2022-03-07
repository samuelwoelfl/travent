let $banners,
  $cookieBanner,
  $acceptedBanner,
  $deniedBannerlet,
  $welcomeBannerlet,
  $acceptCookiesButtonlet,
  $denieCookiesButtonlet,
  $resetCookiesButtonlet,
  $toggleCookiesButtonlet,
  $bannerCloseButtonlet,
  $cookieToggleModallet;
let hoursBetweenGreetings = 1 / 2;


$(document).ready(function() {

  $banners = $('.start_banner');
  $cookieBanner = $('#cookie_banner');
  $acceptedBanner = $('#accepted_banner');
  $deniedBanner = $('#denied_banner');
  $welcomeBanner = $('#welcome_banner');

  $acceptCookiesButton = $('#accept_cookies');
  $denieCookiesButton = $('#denie_cookies');
  $resetCookiesButton = $('#reset_cookies');
  $toggleCookiesButton = $('#toogle_cookies_button');
  $toggleCookiesButton = $('#toogle_cookies_button');

  $cookieToggleModal = $('.cookie_toggle_modal');
  $bannerCloseButtons = $('.banner_close_button');

  let cookiesAccepted = Cookies.get('cookiesAccepted');
  if (cookiesAccepted === undefined) {
    cookiesAccepted = false;
  } else if (cookiesAccepted == 'true') {
    cookiesAccepted = true;
  }

  let welcomeShown = Cookies.get('welcomeShown');
  if (welcomeShown === undefined) {
    welcomeShown = false;
  } else if (welcomeShown == 'true') {
    welcomeShown = true;
  }

  if (!cookiesAccepted) {
    setTimeout(function() {
      $cookieBanner.fadeIn(100);
    }, 2000);
  } else {
    $toggleCookiesButton.html('Reset cookie choice');
    if (!welcomeShown) {
      showToast($welcomeBanner);
      Cookies.set('welcomeShown', true, {
        expires: ((1 / 24) * hoursBetweenGreetings)
      });
    }
  }


  $acceptCookiesButton.click(function() {
    $cookieBanner.fadeOut(100);
    acceptCookies();
  });

  $denieCookiesButton.click(function() {
    $cookieBanner.fadeOut(100);
    showToast($deniedBanner);
    $toggleCookiesButton.html('Accept Cookies');
  });

  $toggleCookiesButton.click(function() {
    $banners.fadeOut(100);
    cookiesAccepted = Cookies.get('cookiesAccepted');
    if (cookiesAccepted === undefined) {
      acceptCookies();
    } else if (cookiesAccepted == 'true') {
      resetCookies();
    }
  });

  $bannerCloseButtons.click(function() {
    $banners.fadeOut(100);
  });
});


function acceptCookies() {
  Cookies.set('cookiesAccepted', 'true');
  $toggleCookiesButton.html('Reset cookie choice');
  showToast($acceptedBanner);
}

function resetCookies() {
  deleteAllCookies();
  $toggleCookiesButton.html('Accept Cookies');
  showToast($deniedBanner);
}

function showToast($banner) {
  let showDuration = $banner.attr('show-duration');
  $banner.find('.progress-ring_circle').css('animation-duration', `${showDuration / 1000}s`);
  $banner.fadeIn(100);
  setTimeout(function() {
    $banner.fadeOut(100);
  }, showDuration);
}

function deleteAllCookies() {
  let cookies = Cookies.get();
  for (let cookie in cookies) {
    Cookies.remove(cookie);
  }
}