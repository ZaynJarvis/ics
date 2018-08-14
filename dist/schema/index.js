'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateEvent;

var _joiBrowser = require('joi-browser');

var _joiBrowser2 = _interopRequireDefault(_joiBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dateTimeSchema = _joiBrowser2.default.array().min(3).max(7).ordered(_joiBrowser2.default.number().integer(), _joiBrowser2.default.number().integer().min(1).max(12), _joiBrowser2.default.number().integer().min(1).max(31), _joiBrowser2.default.number().integer().min(0).max(23), _joiBrowser2.default.number().integer().min(0).max(60), _joiBrowser2.default.number().integer().min(0).max(60));

var durationSchema = _joiBrowser2.default.object().keys({
  before: _joiBrowser2.default.boolean(), //option to set before alaram
  weeks: _joiBrowser2.default.number(),
  days: _joiBrowser2.default.number(),
  hours: _joiBrowser2.default.number(),
  minutes: _joiBrowser2.default.number(),
  seconds: _joiBrowser2.default.number()
});

var contactSchema = _joiBrowser2.default.object().keys({
  name: _joiBrowser2.default.string(),
  email: _joiBrowser2.default.string().email(),
  rsvp: _joiBrowser2.default.boolean()
});

var organizerSchema = _joiBrowser2.default.object().keys({
  name: _joiBrowser2.default.string(),
  email: _joiBrowser2.default.string().email()
});

var alarmSchema = _joiBrowser2.default.object().keys({
  action: _joiBrowser2.default.string().regex(/audio|display|email/).required(),
  trigger: _joiBrowser2.default.any().required(),
  description: _joiBrowser2.default.string(),
  duration: durationSchema,
  repeat: _joiBrowser2.default.number(),
  attach: _joiBrowser2.default.string(),
  attachType: _joiBrowser2.default.string(),
  summary: _joiBrowser2.default.string(),
  attendee: contactSchema,
  'x-prop': _joiBrowser2.default.any(),
  'iana-prop': _joiBrowser2.default.any()
});

var schema = _joiBrowser2.default.object().keys({
  timestamp: _joiBrowser2.default.any(),
  title: _joiBrowser2.default.string(),
  productId: _joiBrowser2.default.string(),
  method: _joiBrowser2.default.string(),
  uid: _joiBrowser2.default.string().required(),
  start: dateTimeSchema.required(),
  duration: durationSchema,
  startType: _joiBrowser2.default.string(),
  end: dateTimeSchema,
  description: _joiBrowser2.default.string(),
  url: _joiBrowser2.default.string().uri(),
  geo: _joiBrowser2.default.object().keys({ lat: _joiBrowser2.default.number(), lon: _joiBrowser2.default.number() }),
  location: _joiBrowser2.default.string(),
  status: _joiBrowser2.default.string().regex(/TENTATIVE|CANCELLED|CONFIRMED/),
  categories: _joiBrowser2.default.array().items(_joiBrowser2.default.string()),
  organizer: organizerSchema,
  attendees: _joiBrowser2.default.array().items(contactSchema),
  alarms: _joiBrowser2.default.array().items(alarmSchema)
}).xor('end', 'duration');

function validateEvent(candidate) {
  var _Joi$validate = _joiBrowser2.default.validate(candidate, schema),
      error = _Joi$validate.error,
      value = _Joi$validate.value;

  return { error: error, value: value };
}