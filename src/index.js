import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetch-countries';

const countries = {}


const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info')


searchBox.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
 
function handleInput(e) {
    const searchQuery = e.target.value.trim();
    if (searchQuery.length === 0) {
        clearResults();
        return;
    }

    fetchCountries(searchQuery)
        .then(countries => {
            if (countries.length > 10) {
                clearResults()
                showTooManyResults();
            } else if (countries.length > 1) {
                clearResults();
                renderCountryList(countries);
                
            } else if (countries.length === 1) {
                clearResults()
                renderCountryCard(countries[0]);
            } else {
                clearResults()
                noResults();
            }
        })
        .catch(error => {
            if (error.message === 'Country not found') {
                noResults();
            }
    });
}

function renderCountryList(countries) {
    const markup = countries.map(({ flags, name }) => {
        return `<div class="image__wrapper"><img class="flag_item" src='${flags.svg}', height = 50, alt=${name.common}><h2>${name.common}</h2></div>`  
    }).join(' ');
    countryList.innerHTML = markup;
}


function renderCountryCard(country) {
    const { flags, name, capital, population, languages } = country;
    const cardMarkup = `
        <div class="country__card">
        <div class="image__wrapper">
            <img class="flag_item" src='${flags.svg}' alt="${name.common}">
            <h2 class="country-name">${name.common}</h2>
            </div>
            <ul class="country-info">
                <li class="capital">
                    <p class="capital__info"><span class="info_bold">Capital:</span> ${capital}</p>
                </li>
                <li class="population">
                    <p class="population__info"><span class="info_bold">Population:</span> ${population}</p>
                </li>
                <li class="language">
                    <p class="language__info"><span class="info_bold">Languages:</span> ${Object.values(languages).join(', ')}</p>
                </li>
            </ul>
        </div>`;
    countryInfo.innerHTML = cardMarkup;
}

function clearResults() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function showTooManyResults() {
    clearResults();
    Notify.warning('Too many matches found. Please enter a more specific name.');
}

function noResults() {
    clearResults();
    Notify.failure("Oops, there is no country with that name")
}
