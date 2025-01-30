const APIKEY = "b2ab4cdaf082cf2fb521126c7743bb8c";
let bodyElem = document.querySelector("body");
let temperatura = document.getElementById("temperatura");
let ciudad = document.getElementById("ciudad");
let fecha = document.getElementById("fecha");
let ciudadInput = document.getElementById("ciudadInput");
let tempMaxMin = document.getElementById("temp-max-min");
let descripcion = document.getElementById("descripcion");
let proximosDias = document.getElementById("proximos-dias");
let body = document.getElementById("body");


const iconoNube = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
</svg>
`;

const iconoSol = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
</svg>

`;


ciudadInput.addEventListener("keypress",(event) => {
	if(event.key == "Enter"){
		mostrarClima();
	}
})

window.addEventListener("load", async () => {
	let randNum = Math.ceil(Math.random() * 4);
	bodyElem.style.backgroundImage = `url('img/fondo${randNum}.jpg')`;
	ciudadInput.value = "new york";
	await mostrarClima();
	ciudadInput.value = "";

	if(randNum == 4 ){
		
	}

});

async function consultaApiHoy(){

	let url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudadInput.value}&appid=${APIKEY}&units=metric`

	try {
		const response = await fetch(url);
		const result = await response.json();
		return result
	} catch (error) {
		console.error(error);
	}
	
}

//devuelve los proximos 40 dias
async function pronostico(){
	const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudadInput.value}&appid=${APIKEY}&units=metric`;
	try {
		const response = await fetch(url);
		const result = await response.json();
		return result.list;
	} catch (error) {
		console.error(error);
	}
	
}

function fechaHoy(){
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    return fechaFormateada;
}

async function mostrarClima(){
	
	const resultado  = await consultaApiHoy();
	const resultadoPronostico = await pronostico();

	while((lis = proximosDias.getElementsByTagName("li")).length > 0) {
		proximosDias.removeChild(lis[0]);
	}
	console.log(resultado)
	ciudad.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>`+resultado.name;
	fecha.innerHTML =  fechaHoy();
	temperatura.innerText = resultado.main.temp +"°";
	tempMaxMin.innerText = "Max: " + resultado.main.temp_max + "/Min: "+ resultado.main.temp_min;
	descripcion.innerText = resultado.weather[0].description;


	for(let i = 0; i < 5; i++){
		const item = document.createElement("li");
		item.classList.add("flex");
		item.classList.add("mb-2");
		item.classList.add("self-start");
		item.classList.add("drop-shadow-[1px_1px_2px_white]");
		if (resultadoPronostico[i].weather[0].main == "Clouds"){
			item.innerHTML = iconoNube +"Max: " + resultadoPronostico[i].main.temp_max + "/Min: "+ resultadoPronostico[i].main.temp_min;
		}else{
			item.innerHTML = iconoSol +"Max: " + resultadoPronostico[i].main.temp_max + "/Min: "+ resultadoPronostico[i].main.temp_min;
	
		}
				
		proximosDias.appendChild(item);
	}	
}

