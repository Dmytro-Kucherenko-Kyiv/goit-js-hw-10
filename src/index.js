import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './api/fetchCountries';

const countryBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryDescription = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

countryBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function clearMarkup() {
  countryList.innerHTML = '';
  countryDescription.innerHTML = '';
}

function renderCountryList(countries) {
  const markup = countries.map(country =>
      `<li><img src="${country.flags.svg}" alt="${country.name.official} flag"><p>${country.name.official}</p> </li>`
    ).join('');

  countryList.innerHTML = markup;
	countryDescription.innerHTML = '';
}

function renderCountryDescription(country) {
  const languages = Object.values(country.languages).map(el => el).join(', ');

  const markup = `<div class="wrap">
    <img src="${country.flags.svg}" alt="${country.name.official} flag">
    <h1>${country.name.official}</h1></div>
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Population:</strong> ${country.population}</p>
    <p><strong>Languages:</strong> ${languages}</p>`;

	countryList.innerHTML = '';
	countryDescription.innerHTML = markup;
}

function onSearch(event) {
    const searchQuery = event.target.value.trim();

    if (!searchQuery || searchQuery === '') {
        clearMarkup();
        return;
    }

fetchCountries(searchQuery).then(countries => {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  if (countries.length > 1 && countries.length <= 10) {
    renderCountryList(countries);
    return;
  }

  if (countries.length === 1) {
    renderCountryDescription(countries[0]);
    return;
  }
})
.catch(error => {
  clearMarkup();
  Notiflix.Notify.failure('Oops, there is no country with that name');
});
}