mapboxgl.accessToken = 'pk.eyJ1IjoicnVwc2FjaG8iLCJhIjoiY2xnaXI5bWJqMHliazNlcG5xNXA1cm4wOCJ9.B_2JC_ZGMgAZ4SJCW9UBjA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground, // starting position [lng, lat]
    zoom: 9, // starting zoom
});
new mapboxgl.Marker()
    .setLngLat(campground)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${title}</h3><p>${l}</p>`
            )
    )
    .addTo(map)
