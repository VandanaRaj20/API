//API KEY = AIzaSyAGRIergv_ApyqaNDf2qPvfF1V_gHakMgY. ENTER THE COORDINATES MANUALLY

let latInput, lngInput;
let submitButton;
let localTime;

function setup() {
  createCanvas(400, 200);
  noLoop(); 

  
  latInput = createInput('');
  latInput.position(10, 10);
  latInput.size(140);
  latInput.attribute('placeholder', 'Latitude');

  
  lngInput = createInput('');
  lngInput.position(10, 40);
  lngInput.size(140);
  lngInput.attribute('placeholder', 'Longitude');

 
  submitButton = createButton('Get Local Time');
  submitButton.position(10, 70);
  submitButton.mousePressed(getTimeZoneData);

  
  drawAbstractCard('Enter latitude and longitude to get the local time.');
}

function drawAbstractCard(displayText) {
  // Generate random background color
  let bgColor = color(random(255), random(255), random(255));
  background(bgColor);

  // Generate a random card color that contrasts with the background
  let cardColor;
  do {
    cardColor = color(random(255), random(255), random(255));
  } while (brightness(bgColor) - brightness(cardColor) < 50); 
  
  fill(cardColor); 
  noStroke();
  rect(50, 75, 300, 100, 20); 

  
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(displayText, width / 2, height / 2);
}

async function getTimeZoneData() {
  let latitude = latInput.value();
  let longitude = lngInput.value();
  let timestamp = Math.floor(Date.now() / 1000);
  let apiKey = 'AIzaSyAGRIergv_ApyqaNDf2qPvfF1V_gHakMgY'; 
  // Validation for latitude and longitude
  if (!latitude || !longitude) {
    drawAbstractCard('Please enter valid latitude and longitude');
    return;
  }

  let requestUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${apiKey}`;

  try {
    let response = await fetch(requestUrl);
    if (response.ok) {
      let data = await response.json();
      processTimeZoneData(data);
    } else {
      throw new Error('Response not OK.');
    }
  } catch (error) {
    console.error('Error fetching time zone data:', error);
    drawAbstractCard('Error fetching time zone data');
  }
}

function processTimeZoneData(data) {
  if (data.status === 'OK') {
    calculateLocalTime(data);
  } else {
    drawAbstractCard('Could not retrieve time zone data');
  }
}

function calculateLocalTime(timeZoneData) {
  let offsets = timeZoneData.dstOffset * 1000 + timeZoneData.rawOffset * 1000;
  let localTimestamp = (new Date()).getTime() + offsets;
  localTime = new Date(localTimestamp).toUTCString();
  drawAbstractCard(localTime);
}
