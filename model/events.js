var mongoose = require('mongoose');  
var eventSchema = new mongoose.Schema({
  name: String,
  eventDate: { type: Date, default: Date.now },
  type: String,
  info: String,

 matches:
        [
            {
                team1: String,
                team2: String,
                result1: Number,
                result2: Number,
            }
        ]

});
mongoose.model('Event', eventSchema);