   var i2c = require('i2c-bus'),
  i2cBus = i2c.openSync(1),
  oled = require('oled-i2c-bus');
  var font = require('oled-font-5x7');

var opts = {
  width: 128,
  height: 32,
  address: 0x3C
};

var oled = new oled(i2cBus, opts);
oled.turnOnDisplay();

function updateText(String text){
  oled.clearDisplay();
// sets cursor to x = 1, y = 1
oled.setCursor(1, 1);
oled.writeString(font, 1, 'Cats and dogs are really cool animals, you know.', 1, true);
}

module.exports = {updateText}