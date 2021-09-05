import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = 'pk.eyJ1IjoiY2RpY2tpbnNvbjExIiwiYSI6ImNqZThwZGg1dDAyMngzM3Fsdmp0dm82YTcifQ.bjVqusaDZqdZVWunQ0xS7A';

const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9 // starting zoom
})
alert("hello selamat datang!");