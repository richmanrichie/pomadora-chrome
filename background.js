// TODO: Refactor the code


let pom_setup = {
    pomadora : 2,
    shortbreak: 1,
    longbreak: 2,
    count: 2
}

let interval;

let countLeft = 2;
let pomadoraSoFar = 0;

let shortBreakSoFar = 0;
let longBreakSoFar = 0;

let timeGoneOnCurrent = 0;

let default_message = {
    type: 'POMADORA_TICK',
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message.type === "POMADORA") {
        //  Start the timer
        pomadoraSoFar = 0;
        startPomadora();
        sendResponse({farewell: "goodbye"});
      }

     if(request.message.type  === "POMADORA_STOP") {
        stopPomadora();
        sendResponse({farewell: "goodbye"});
     }
    return true;
});


function startPomadora() {
   
    const pom = pom_setup.pomadora;
    let message = {
        type: 'POMADORA_TICK',
        data: {
            time_left: 0,
            location: 'POMADORA'
        }
    }
    interval = setInterval(() => {
        // do a broadcast to update the UI
        timeGoneOnCurrent += 1;
        message.data.time_left = timeGoneOnCurrent;
        broadcastActivity(message);
        if (timeGoneOnCurrent == pom) {
            runNext('POM');
        }
    }, 1000);
}

function startShorBreak() {
    const pom = pom_setup.shortbreak;

    let message = {
        type: 'POMADORA_TICK',
        data: {
            time_left: 0,
            location: 'POMADORA'
        }
    }
    interval = setInterval(() => {
        // do a broadcast to update the UI
        timeGoneOnCurrent += 1;
        message.data.time_left = timeGoneOnCurrent;
        message.data.location = 'SHORT_BREAK';

        broadcastActivity(message);
        if (timeGoneOnCurrent == pom) {
            runNext('SHTINT');
        }
    }, 1000);
}

function startLongBreak() {
    const pom = pom_setup.longbreak;
    let message = {
        type: 'POMADORA_TICK',
        data: {
            time_left: 0,
            location: 'POMADORA'
        }
    }
    interval = setInterval(() => {
        // do a broadcast to update the UI
        timeGoneOnCurrent += 1;
        message.data.time_left = timeGoneOnCurrent;
        message.data.location = 'LONG_BREAK';

        broadcastActivity(message);
        if (timeGoneOnCurrent == pom) {
            runNext('LONGBRK');
        }
    }, 1000);
}

function stopPomadora() {
    timeGoneOnCurrent = 0;
    if(interval){
        clearTimeout(interval);
    }
}

function broadcastActivity(message) {
    console.log(`broadcasting message`);
    console.log(message);
    if(chrome.runtime.onMessage.hasListeners()){
        chrome.runtime.sendMessage({message: message}, function(response) {
            return true;
        });
    }
}

function runNext(finished) {
    // stop the current pomadora and start the next one if available.
    stopPomadora();    
    if(finished == 'POM') {
        pomadoraSoFar += 1;
        startShorBreak();
    }
    else if(finished == 'SHTINT') {
        startLongBreak();
    }
    else if(finished == 'LONGBRK') {
        console.log(`total count of poms done ${pomadoraSoFar}`);
        if(pomadoraSoFar >= pom_setup.count) {
            let message = {
                type: 'POMADORA_ENDED',
                data: {
                    time_left: 0,
                    location: 'POMADORA'
                }
            }
            // stop
            stopPomadora();
            pomadoraSoFar = 0;
            broadcastActivity(message);
            // broadcast ended

        } else {
            startPomadora();
        }
    }
    console.log('stopped');
}