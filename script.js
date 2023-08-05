
document.addEventListener('DOMContentLoaded', function() {



let ipElement = document.getElementById("ip");
let ipElement2 = document.getElementById("ip2");
let latitude = document.getElementById('lat');
let longitude = document.getElementById('long');
let city = document.getElementById('city');
let region = document.getElementById('region');
let organisation = document.getElementById('organisation');
let hostName = document.getElementById('hostname');

$.getJSON("https://api.ipify.org?format=json", function(data) {
    ipElement.innerText = data.ip;
    ipElement2.innerText = data.ip;
    // latitude.innerText = data.lat;
    

    let ip = data.ip;
    let apiKey = '9692db051c452b'; // Replace with your actual API token
    let url = `http://ip-api.com/json/${ip}?key=${apiKey}`;

    setTimeout(async function() {
        try {
            const response = await fetch(url);
            const data = await response.json();
            // console.log(data);
            latitude.innerText = data.lat;
            longitude.innerText = data.lon;
            city.innerText = data.city;
            region.innerText =`${data.region} (${data.regionName})`;
            organisation.innerText = data.org;
            hostName.innerText = window.location.hostname;

            let map = document.createElement("iframe");
            map.src = `https://maps.google.com/maps?q=${latitude.innerText},${longitude.innerText}&output=embed`;
            map.setAttribute("class" , "map");
            let mapDiv = document.getElementById('mapDiv');
            mapDiv.append(map);
            showDateAndTime(data.timezone);
            document.getElementById("timeZone").innerText = data.timezone;
            document.getElementById("pincode").innerText = data.zip;
            showPostOffice(data.zip);
            // Handle the geolocation data
        } catch (error) {
            console.error("Error fetching geolocation data:", error);
        }
    }, 200); // Wait for 1 second before making the request
});

let startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click' , (event)=>{
  document.getElementById('mainDiv').style.display = "none";
  document.getElementById("innerMainDiv").style.display = "block";
});

function showDateAndTime(data){
  // current datetime string in America/Chicago timezone
let dateStore = new Date().toLocaleString("en-US", { timeZone: `${data}` });

// create new Date object
let currDate = new Date(dateStore);

// year as (YYYY) format
let year = currDate.getFullYear();

// month as (MM) format
let month = ("0" + (currDate.getMonth() + 1)).slice(-2);

// date as (DD) format
let date = ("0" + currDate.getDate()).slice(-2);

// date time in YYYY-MM-DD format
let date_time = date + "/" + month + "/" + year;

var d = new Date();
var currTime = d.toLocaleTimeString();

document.getElementById("date").innerText = `${date_time} & ${currTime}`;
}


async function showPostOffice(pincode){
 let url2 =  `https://api.postalpincode.in/pincode/${pincode}`;

 try{
  const res = await fetch(url2);
  const result = await res.json();
  // console.log(result);
  for(let x=0;x<result.length;x++){
    document.getElementById('numOfPincode').innerText  = result[x].Message;
    let offices = result[x].PostOffice;
    showCurrOffice(offices);
    console.log(offices)
   
  }
  
 }
 catch (error){
  console.log(error);
 }
}

function showCurrOffice(office){
  for(let x=0;x<office.length;x++){
    // console.log(office[x]);
    let postOffices = document.getElementById("postOffices");
    let info = office[x];
  
    let officeDiv = document.createElement("div");
    officeDiv.setAttribute("class" , "officeDiv");

    let name = document.createElement("p");
    name.textContent = `Name: `;
    name.setAttribute("class" , "name");
    let innerName = document.createElement("span");
    innerName.textContent = `${info.Name}`;
    name.appendChild(innerName);

    let branch = document.createElement("p");
    branch.textContent = `Branch Type: `;
    branch.setAttribute("class" , "branch");
    let innerbranch = document.createElement("span");
    innerbranch.textContent = `${info.BranchType}`;
    branch.appendChild(innerbranch);

    let delivery = document.createElement("p");
    delivery.textContent = `Delivery Status: `;
    delivery.setAttribute("class" , "delivery");
    let innerdelivery = document.createElement("span");
    innerdelivery.textContent = `${info.DeliveryStatus}`;
    delivery.appendChild(innerdelivery);

    let district = document.createElement("p");
    district.textContent = `District: `;
    district.setAttribute("class" , "district");
    let innerdistrict = document.createElement("span");
    innerdistrict.textContent = `${info.District}`;
    district.appendChild(innerdistrict);

    let division = document.createElement("p");
    division.textContent = `Division: `;
    division.setAttribute("class" , "division");
    let innerdivision = document.createElement("span");
    innerdivision.textContent = `${info.Division}`;
    division.appendChild(innerdivision);
    
    officeDiv.append(name , branch , delivery , district , division);
    postOffices.appendChild(officeDiv);
    
        
  }
}

let searchInput = document.getElementById('search');
let debounceTimer;

searchInput.addEventListener('keyup', function(event) {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(function() {
    handleSearch(event);
  }, 300); // Adjust the delay as needed (in milliseconds)
});

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const officeDivs = document.querySelectorAll('.officeDiv');

  officeDivs.forEach(officeDiv => {
    const name = officeDiv.querySelector('.name').textContent.toLowerCase();
    const branchType = officeDiv.querySelector('.branch').textContent.toLowerCase();
    if (name.includes(searchTerm) || branchType.includes(searchTerm)) {
      officeDiv.style.display = 'block';
    } else {

      officeDiv.style.display = 'none';
    }
  });
}

});