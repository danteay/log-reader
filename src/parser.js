import geoip from 'geoip-lite';

/**
 * Process raw logs to find value
 *
 * @param {Array} logs Array of raw logs to be extracted
 */
export default (logs) => {
  logs = logs.map((log) => {
    let data = splitLog(log);

    let deviceInfo = detectDevice(data.userAgent);
    let geoInfo = detectGeoLocation(data.ip);

    return {
      ...data,
      ...deviceInfo,
      ...geoInfo
    };
  });

  return logs;
};

/**
 * Log to be extracted
 *
 * @param {string} log single raw log
 */
const splitLog = (log) => {
  log = log.split('"');

  let [ip, date] = log[0].split(" - - ");
  let [method, path, http] = log[1].split(" ");
  let [statusCode, duration] = log[2].trim().split(" ");

  let data = {
    "ip": ip.trim(),
    "date": date.trim().replace("[", "").replace("]", ""),
    "url": log[3],
    "userAgent": log[5],
    method,
    path,
    http,
    statusCode,
    duration
  };

  return data;
};

/**
 * Detect type of device used on the log
 *
 * @param {string} userAgent User Agent information
 */
const detectDevice = (userAgent) => {
  let ua = userAgent,
    browser = /Edge\/\d+/.test(ua) ? 'Edge' : /MSIE 9/.test(ua) ? 'IE9' : /MSIE 10/.test(ua) ? 'IE10' : /MSIE 11/.test(ua) ? 'IE11' : /MSIE\s\d/.test(ua) ? 'IE' : /rv\:11/.test(ua) ? 'IE11' : /Firefox\W\d/.test(ua) ? 'Firefox' : /Chrome\W\d/.test(ua) ? 'Chrome' : /Chromium\W\d/.test(ua) ? 'Chromium' : /\bSafari\W\d/.test(ua) ? 'Safari' : /\bOpera\W\d/.test(ua) ? 'Opera' : /\bOPR\W\d/i.test(ua) ? 'Opera' : typeof MSPointerEvent !== 'undefined' ? 'IE?' : '?',
    os = /Windows NT 10/.test(ua) || /Windows NT 6\.0/.test(ua) || /Windows NT 6\.1/.test(ua) || /Windows NT 6\.\d/.test(ua) || /Windows NT 5\.1/.test(ua) || /Windows NT [1-5]\./.test(ua) ? "Windows" : /Mac/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : /X11/.test(ua) ? "Nix" : "?",
    mobile = /IEMobile|Windows Phone|Lumia/i.test(ua) || /iPhone|iP[oa]d/.test(ua) || /Android/.test(ua) || /BlackBerry|PlayBook|BB10/.test(ua) || /Mobile Safari/.test(ua) || /webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi/i.test(ua) ? true : false,
    tablet = /Tablet|iPad/i.test(ua);

  let data = {
    browser,
    os,
    device: mobile ? "Mobile" : tablet ? "Tablet" : (browser == "?" && os == "?") ? "?" : "Desktop"
  };

  return data;
};

/**
 * Detect country, and state of origin from the request log
 *
 * @param {string} ip IP of the origin request
 */
const detectGeoLocation = (ip) => {
  let geo = geoip.lookup(ip);

  let data = {
    country: geo.country,
    region: geo.region || '?',
    city: geo.city || '?'
  };

  return data;
};