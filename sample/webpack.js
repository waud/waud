import waudjs from 'waud.js'

Waud.init();
new WaudBase64("assets/sounds.json", function(sounds) {
    sounds.get('test/countdown.mp3').play();
});