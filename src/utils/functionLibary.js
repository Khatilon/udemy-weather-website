import request from 'request'; // from npm instsll

export const geoCode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiY293NDc4ODc0MDAwIiwiYSI6ImNrbXJnaHBpcTA3bzEyeG5zMTM5dTl6YWQifQ.INJIXY7FeTzOlQwkatnqAQ&limit=1`;
    
    request({url: url, json: true}, (error, response) => {
        if (error) {
            callback('Unable to connent to geo service!', undefined);
        } else if (response.body.features.length === 0) {
            callback('Unable to find location. Try another search', undefined);
        } else {
            callback(undefined, {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            });
        }
    })
};

export const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=e57d63e8281e240e6a95e728a52c8639&query=${latitude},${longitude}`;

    request({url: url, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined);
        } else if (body.error) {
            callback('Unable to find the location', undefined);
        } else {
            console.log(body);
            callback(undefined, {
                location_name: `${body.location.name}, ${body.location.country}`,
                weather_descriptions: body.current.weather_descriptions[0],
                temperature: body.current.temperature,
                country: body.location.country
            });
        }
    });
}