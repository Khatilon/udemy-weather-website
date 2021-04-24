console.log('Client side javascript file is loaded!');

// frontend call the API

fetch('http://puzzle.mead.io/puzzle')
.then((response) => {
    response.json().then((data) => {
        console.log(data);
    })
});

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

// messageOne.textContent = 'From JavaScript';

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault(); // aviod doing original behavior
    const location = search.value;
    console.log(location);

    messageOne.textContent = 'Loading...';
    messageTwo.textContent = '';

    fetch(`http://localhost:3000/weather?address=${location}`)
    .then((response) => {
        response.json().then((data) => {
            // console.log(data);

            if(data.geoErrorMessage) {
                console.log(data.geoErrorMessage);
                messageOne.textContent = data.geoErrorMessage;
            } else {
                console.log(data.location_name);
                console.log(data.weather_descriptions);
                messageOne.textContent = data.location_name;
                messageTwo.textContent = data.weather_descriptions;
            }
        })
    });

});