export const fetchCountries = countryName => fetch(
        `https://restcountries.com/v3.1/name/${countryName}?fields=name,flags,capital,population,languages`).then(
            response => {
                if (!response.ok) {
                    throw new Error('Country not found');
                }

                return response.json();
            }
        ).then(data => {
            const filteredData = data.filter(country => country.name.common !== 'Russia' && country.name.common !== 'Belarus');
            return filteredData;
  });
