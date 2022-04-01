'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map;
let type;
let startCoords;
let endCoords;
let markerEnd;
let markerStart;
let speed;
let mashq;
let summary;
let a = 0;
let data;
let marker1;
let marker2;
let line1;

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-8);
  setTavsif() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.tavsif = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  constructor(speed, distance, time, startCoords, endCoords, type) {
    this.speed = speed;
    this.distance = distance;
    this.time = time;
    this.startCoords = startCoords;
    this.endCoords = endCoords;
    this.type = type;
    this.setTavsif();
  }
}

class App {
  mashqlar = [];
  constructor() {
    this.openMap();
    document.addEventListener('keydown', this.showForm.bind(this));
  }
  openMap() {
    navigator.geolocation.getCurrentPosition(
      this.showMap.bind(this),
      function () {
        alert('geolokatsiya ola olmadik. Qayta urinib kurin');
      }
    );
  }
  showMap(e) {
    map = L.map('map').setView([e.coords.latitude, e.coords.longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      map
    );

    markerStart = L.marker([41.34135876767002, 69.28812280297281], {
      draggable: true,
    })
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: 'running--popup__bosh',
        }).setContent('<p>Бошлангич нуктани танланг</p>')
      )
      .openPopup();

    this.getLocalStorage();
  }
  showForm() {
    a++;
    if (!(a == 1 || a == 2)) return;
    if (a == 1) {
      startCoords = markerStart.getLatLng();
      map.removeLayer(markerStart);
      let startMarker = L.marker([startCoords.lat, startCoords.lng], {
        draggable: false,
      })
        .addTo(map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 50,
            autoClose: false,
            closeOnClick: false,
            className: 'running--popup__bosh',
          }).setContent('<p>Старт</p>')
        )
        .openPopup();

      markerEnd = L.marker([startCoords.lat + 0.005, startCoords.lng + 0.005], {
        draggable: true,
      })
        .addTo(map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 50,
            autoClose: false,
            closeOnClick: false,
            className: 'running--popup__tug',
          }).setContent('<p>Борекон жойини танланг</p>')
        )
        .openPopup();
      map.removeLayer(marker1);
      map.removeLayer(marker2);
      map.removeLayer(line1);
    }
    if (a == 2) {
      endCoords = markerEnd.getLatLng();
      map.removeLayer(markerEnd);
      let endMarker = L.marker([endCoords.lat, endCoords.lng], {
        draggable: false,
      })
        .addTo(map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 50,
            autoClose: false,
            closeOnClick: false,
            className: 'running--popup__tug',
          }).setContent('<p>Финиш</p>')
        )
        .openPopup();

      form.classList.remove('hidden');
      this.drawMap();
      // inputDistance.focus();
      this.hiddenForm.call(this);
    }
  }
  hiddenForm() {
    form.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        speed = inputDistance.value;
        type = inputType.value;
        form.classList.add('hidden');
        this.createObj();
        this.setLoaclStorage();
        this.showWorkout(mashq);
      }.bind(this)
    );
  }
  drawMap() {
    L.Routing.control({
      createMarker() {
        return null;
      },
      waypoints: [
        L.latLng(startCoords.lat, startCoords.lng),
        L.latLng(endCoords.lat, endCoords.lng),
      ],
      routeWhileDragging: false,
    })
      .addTo(map)
      .on('routesfound', function (e) {
        summary = e.routes[0].summary.totalDistance;
      });
  }
  redrawMap(obj) {}
  createObj() {
    mashq = new Workout(
      speed,
      summary,
      summary / speed,
      startCoords,
      endCoords,
      type
    );
    console.log(mashq);
    this.mashqlar.push(mashq);
  }

  showWorkout(obj) {
    let html = `<li class="workout workout--${obj.type}" data-id="1234567890">
    <h2 class="workout__title">${obj.tavsif}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        obj.type == 'running' ? '🏃‍♂️' : obj.type == 'cycling' ? '🚴‍♂️' : '🚗'
      }</span>
      <span class="workout__value">${(obj.distance / 1000).toFixed(2)}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${obj.time.toFixed(0)}</span>
      <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${obj.speed}</span>
      <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${((obj.speed / 60 / 1000) * 75).toFixed(
        0
      )}</span>
      <span class="workout__unit">spm</span>
    </div>
  </li>`;
    form.insertAdjacentHTML('afterend', html);
  }
  setLoaclStorage() {
    localStorage.setItem('workout', JSON.stringify(this.mashqlar));
  }

  getLocalStorage() {
    data = JSON.parse(localStorage.getItem('workout'));
    localStorage.getItem('workout');
    if (!data) return;
    this.mashqlar = data;
    this.mashqlar.forEach(element => {
      this.showWorkout(element);
    });
    marker2 = L.marker(
      [
        this.mashqlar.at(-1).startCoords.lat,
        this.mashqlar.at(-1).startCoords.lng,
      ],
      {
        draggable: false,
      }
    )
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: 'running--popup__bosh',
        }).setContent('<p>Охирги борган жойинг</p>')
      )
      .openPopup();
    marker1 = L.marker(
      [this.mashqlar.at(-1).endCoords.lat, this.mashqlar.at(-1).endCoords.lng],
      {
        draggable: false,
      }
    )
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: 'running--popup__tug',
        }).setContent('<p>Охирги борган жойинг</p>')
      )
      .openPopup();
    line1 = L.Routing.control({
      createMarker() {
        return null;
      },
      waypoints: [
        L.latLng(
          this.mashqlar.at(-1).startCoords.lat,
          this.mashqlar.at(-1).startCoords.lng
        ),
        L.latLng(
          this.mashqlar.at(-1).endCoords.lat,
          this.mashqlar.at(-1).endCoords.lng
        ),
      ],
      routeWhileDragging: false,
    }).addTo(map);

    map.addLayer(marker1, marker2, line1);
  }
  removeLocalStorage() {
    localStorage.removeItem('workout');
    location.reload();
  }
}

const magicMap = new App();
// magicMap.removeLocalStorage();
