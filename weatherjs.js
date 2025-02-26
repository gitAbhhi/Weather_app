const apiKey = "ca6556d2d9e9dbb71256d2dc2b97d4bf";
const cityInput = document.querySelector(".cityinput");
const searchBtn = document.querySelector(".searchBtn");
const citynotfound = document.querySelector('.not-found')
const searchagain = document.querySelector(".searchagain")
const weathercontainer = document.querySelector("#weather-container")
const cityname = document.querySelector("#city-name")
const tempvalue = document.querySelector(".temp")
const tempdesc = document.querySelector(".description")
const humidityvalue = document.querySelector(".humidity-value")
const windvalue = document.querySelector(".wind-speed")
const weatherimg = document.querySelector(".weatherimg")
const todaydate = document.querySelector(".time")
const comingdaycontainer = document.querySelector('.coming-day')


// document.addEventListener("DOMContentLoaded", function () {
    //     searchagain.innerText = "Weather App - Search Your City Weather"; // Add heading
    // });
    
        // searchagain.style.display = "flex"; // Hide weather section
// weathercontainer.style.display = "none";
// const heading = document.createElement("h2");
// heading.innerText = "Weather App - Search Your City Weather";
// heading.style.textAlign = "center";
// heading.style.color = "white";
// heading.style.marginBottom = "10px";
// const container = document.querySelector(".container");
// container.insertBefore(heading, container.firstChild);


searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() != "") {
        updateweatherinfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }
});
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != "") {
        updateweatherinfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }
})

function getweathericon(id) {
    if (id <= 232) return 'thunderstrom.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getcurrentdata() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function getFetchData(endpoint, city) {
    const url = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&units=metric&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    return response.json()
}
async function updateweatherinfo(city) {
    const weatherdata = await getFetchData('weather', city)
    console.log(weatherdata)
    if (weatherdata.cod != 200) {
        showdisplaysection(citynotfound);
        console.log("are ye chla toh tha")
        return;
    }
    const {
        name: country,
        main: { temp, humidity},
        weather: [{ id, main }],
        wind: { speed }
    } = weatherdata

    cityname.textContent = country
    tempvalue.textContent = Math.round(temp) + '°C'
    tempdesc.textContent = main
    humidityvalue.textContent = humidity + '%'
    windvalue.textContent = speed + 'M/s'
    weatherimg.src = `assets/weather/${getweathericon(id)}`
    todaydate.textContent = getcurrentdata();

    await updateforecastsinfo(city)
    showdisplaysection(weathercontainer)
}
function showdisplaysection(section) {
    [weathercontainer, searchagain, citynotfound]
        .forEach(section => section.style.display = "none")
console.log("city toh dikhana chahiye")
    section.style.display = "block"
}

function updateforcastitems(weatherdata) {
    console.log("hi hihi hi")
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherdata

    const dateTaken=new Date(date)
    const dateOption={
        day:'2-digit',
        month:'short'
    }
    const dateResult=dateTaken.toLocaleDateString('en-US',dateOption)
    const forcastitem = `
                 <div class="days">
                    <div class="date">${dateResult}</div>
                    <div ><img class="tempIcon" src="assets/weather/${getweathericon(id)}" alt=""></div>
                    <div class="temperature">${Math.round(temp)} °C</div>
                </div>`

    comingdaycontainer.insertAdjacentHTML('beforeend',forcastitem)
}
async function updateforecastsinfo(city) {
    console.log("mujhe bhi cal nhi aayy")
    const forecastdata = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const presentday = new Date().toISOString().split('T')[0]

    comingdaycontainer.innerHTML = ''
    forecastdata.list.forEach(forecastweather => {
        if (forecastweather.dt_txt.includes(timeTaken) &&
            !forecastweather.dt_txt.includes(presentday)) {
            updateforcastitems(forecastweather);
        }

    })
}