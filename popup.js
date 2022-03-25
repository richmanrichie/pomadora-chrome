const pomadora = document.getElementById('pomadora');
const shortbreak = document.getElementById('shortbreak');
const longbreak = document.getElementById('longbreak');
const count = document.getElementById('count');



document.getElementById('pomad-button-click')
.addEventListener('click', function(ev) {

    let message = {
        type: 'POMADORA',
        data: {
            pomadora : pomadora.value,
            shortbreak: shortbreak.value,
            longbreak: longbreak.value,
            count: count.value
        }
    }

    chrome.runtime.sendMessage({message: message}, function(response) {
        console.log(response);
    });
})

document.getElementById('pomad-button-stop')
.addEventListener('click', function(ev) {

    let message = {
        type: 'POMADORA_STOP',
    }

    chrome.runtime.sendMessage({message: message}, function(response) {
        console.log(response);
    });
})


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message.type === "POMADORA_TICK"){
          setTime(request.message.data.time_left);
      }
      return true;
});

function setTime(time_left) {
    time_left = Number(time_left);
    var h = Math.floor(time_left / 3600);
    var m = Math.floor(time_left % 3600 / 60);
    var s = Math.floor(time_left % 3600 % 60);

    fixHour(h);
    fixMin(m);
    fixSeconds(s);

}

function fixHour(hr){
    const arr = hr.toString().padStart(2, '0').split('');
    document.getElementById('hr_1').innerHTML = arr[0];
    document.getElementById('hr_2').innerHTML = arr[1];
    console.log(arr[0]);
}

function fixMin(min){
    const arr = min.toString().padStart(2, '0').split('');
    document.getElementById('min_1').innerHTML = arr[0];
    document.getElementById('min_2').innerHTML = arr[1];
    console.log(arr[0]);
};

function fixSeconds(sec){
    console.log(sec);
    const arr = sec.toString().padStart(2, '0').split('');
    document.getElementById('sec_1').innerHTML = arr[0];
    document.getElementById('sec_2').innerHTML = arr[1];
    console.log(arr);

};