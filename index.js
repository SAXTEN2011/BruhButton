//https://stackoverflow.com/questions/12168909/blob-from-dataurl
function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }


document.getElementById("start").addEventListener('click', function () {
    navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {
            alert('Pressing OK will begin the one second recording')
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            const audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            setTimeout(() => {
                mediaRecorder.stop();
            }, 3000);

            navigator.mediaDevices.getUserMedia({
                    audio: true
                })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();
                    document.getElementById('indicator').innerHTML = "Recording"

                    const audioChunks = [];
                    mediaRecorder.addEventListener("dataavailable", event => {
                        audioChunks.push(event.data);
                    });

                    mediaRecorder.addEventListener("stop", () => {
                        console.log(audioChunks)
                        const audioBlob = new Blob(audioChunks);
                        const audioUrl = URL.createObjectURL(audioBlob);
                        const audio = new Audio(audioUrl);
                        // console.log(audioBlob.data());
                        var reader = new FileReader();
                        reader.addEventListener("loadend", function () {
                            // reader.result contains the contents of blob as a typed array
                            console.log(reader.result)
                            // let blob2 = new Blob(reader.result, {type:"audio/webm;codecs=opus"});
                            let blob2 = dataURItoBlob(reader.result);
                            
                            let blob2Url = URL.createObjectURL(blob2)
                            let audio2 = new Audio(blob2Url);
                            audio2.play();
                            let linkString = window.location.origin + "/button.html?data=" + reader.result 
                            document.body.innerHTML += "<h2>Give this link to your personal button: <a href='" + linkString +"'>" + linkString + "</a></h2>"
                        });
                        reader.readAsDataURL(audioBlob)
                        // audio2.play();
                        // audio.play();
                    });

                    setTimeout(() => {
                        mediaRecorder.stop();
                        document.getElementById('indicator').innerHTML = "Not Recording"
                    }, 1000);
                });


        });
})


window.onerror = function (msg, url, linenumber) {
    alert('Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
    return true;
}