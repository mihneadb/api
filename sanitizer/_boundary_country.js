const check = require('check-types');
const iso3166 = require('../helper/iso3166');

function _sanitize(raw, clean) {
  // error & warning messages
  var messages = { errors: [], warnings: [] };

  // target input param
  var country = raw['boundary.country'];

  // param 'boundary.country' is optional and should not
  // error when simply not set by the user
  if (check.assigned(country)){

    // must be valid string
    if (!check.nonEmptyString(country)) {
      messages.errors.push('boundary.country is not a string');
    }

    // must be a valid ISO 3166 code
    else if (!containsIsoCode(country)) {
      messages.errors.push(country + ' is not a valid ISO2/ISO3 country code');
    }

    // valid ISO 3166 country code, set alpha3 code on 'clean.boundary.country'
    else {
      // the only way for boundary.country to be assigned is if input is
      //  a string and a known ISO2 or ISO3
      clean['boundary.country'] = iso3166.iso3Code(country);
    }
  }

  return messages;
}

function containsIsoCode(isoCode) {
  return iso3166.isISO2Code(isoCode) || iso3166.isISO3Code(isoCode);
}

function _expected(){
  return [{ name: 'boundary.country' }];
}

module.exports = () => ({
  sanitize: _sanitize,
  expected: _expected
});
