var mraa = require('mraa');

const MIN_PULSE_WIDTH     = 600.0;
const MAX_PULSE_WIDTH     = 2300.0;

const MIN_ANGLE           = 0.0;
const MAX_ANGLE           = 2.96705972839; // 175deg

const NEUTRAL_PULSE_WIDTH = 1500.0;

function mapValue(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function mapAngle(value) {
  return mapValue(value, MIN_ANGLE, MAX_ANGLE, MIN_PULSE_WIDTH, MAX_PULSE_WIDTH);
}

function Servo() {
  this._uSecs = mapAngle(1.57); // 90deg
  this.pin = 0;
  this.minAngle = MIN_ANGLE;
  this.maxAngle = MAX_ANGLE;
  
  this.attach = function(pin) {
    this.pin = pin;
    this._pwm = new mraa.Pwm(pin);
    this._pwm.period_us(20000);
    this._pwm.enable(true);
  }

  this.writeMicroseconds = function(uSecs) {
    this.uSecs = Math.max(Math.min(uSecs, MAX_PULSE_WIDTH),MIN_PULSE_WIDTH);
    this._pwm.pulsewidth_us(this.uSecs);
  }

  this.write = function(angle) {
    angle = Math.max(Math.min(angle, this.maxAngle),this.minAngle);
    
    var write_ms = mapAngle(angle);
    //console.log(`Servo pin: ${this.pin} angle: ${Number(angle).toFixed(4)} ms: ${Math.round(write_ms)}`);
    this.writeMicroseconds(write_ms);
  }
}

module.exports = {
  Servo: Servo,
  MIN_ANGLE: MIN_ANGLE,
  MAX_ANGLE: MAX_ANGLE
};
