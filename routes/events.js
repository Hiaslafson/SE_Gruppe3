var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method
      }
}));

//build the REST operations at the base for events
//this will be accessible from http://127.0.0.1:3000/events if the default route for / is left unchanged
router.route('/')
    //GET all events
    .get(function(req, res, next) {
        //retrieve all events from Monogo
        console.log("I recived a get request");
        mongoose.model('Event').find({}, function (err, events) {

              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({

                    //JSON response will show all events in JSON format
                    json: function(){
                        console.log(events);
                        res.json(events);
                    }
                });
              }
        });
    })

    //POST a new event
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var eventDate = req.body.eventDate;
        var info = req.body.info;
        var type = req.body.type;

        //call the create function for our database
        mongoose.model('Event').create({
            name : name,
            eventDate : eventDate,
            type : type,
            info : info
        }, function (err, event) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Event has been created
                  console.log('POST creating new event: ' + event);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing

                    //JSON response will show the newly created event
                    json: function(){
                        res.json(event);
                    }
                });
              }
        })
    });

/* GET New Event page. */
router.get('/new', function(req, res) {
    res.render('events/new', { title: 'Add New Event' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Event').findById(id, function (err, event) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404);
            err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(event);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
      console.log('TEST1234');
    mongoose.model('Event').findById(req.id, function (err, event) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + event._id);
        try {
            var eventeventDate = event.eventDate.toString();
        } catch (err) {
            eventeventDate = '';
        }

        eventeventDate = eventeventDate.substring(0, eventeventDate.indexOf('T'))
        res.format({
          html: function(){
              res.render('events/show', {
                "eventeventDate" : eventeventDate,
                "event" : event
              });
          },
          json: function(){
              console.log(event.matches);
              res.json(event);
          }
        });
      }
    });
  });

router.route('/:id')
//PUT to update a event by ID
.put(function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var eventDate = req.body.eventDate;
    var info = req.body.info;
    var type = req.body.type;
    //TODO gleich als liste übergeben
    var team1 = req.body.team1;
    var team2 = req.body.team2;
    var result1= req.body.result1;
    var result2= req.body.result2;
    var points1= req.body.points1;
    var points2= req.body.points2;

    //TODO derzeit nur 1 match
    var matches = [{
        team1: team1,
        team2: team2,
        result1: result1,
        result2: result2,
        points1: points1,
        points2: points2}
    ];

    //find the document by ID
    mongoose.model('Event').findById(req.id, function (err, event) {
        //update it
        event.update({
            name : name,
            eventDate : eventDate,
            type : type,
            info : info,
            matches : matches
        }, function (err, eventID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function(){
                        res.redirect("/events/" + event._id);
                    },
                    //JSON responds showing the updated values
                    json: function(){
                        res.json(event);
                    }
                });
            }
        })
    });
});

//TODO delete by id vom match is ned gaunga
router.route('/:id/deleteMatches')
    .post(function (req, res){
        //find by id event --> find by id match --> delete
        console.log("delete matches backend called, match: " + req.id);
        console.log('find event by ID:' + req.body.eventId);

        mongoose.model('Event').findById(req.body.eventId, function (err, event) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                event.matches.id(req.id).remove();
                event.save(function (err) {
                    console.log(err);
                    if (err) {
                        return err;
                    }else {
                        //Event has been created
                        console.log('the sub-doc was removed');
                        res.format({
                            //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing

                            //JSON response will show the newly created event
                            json: function(){
                                res.json(event);
                            }
                        });
                    }

                });
            }
        });

});

router.route('/:id/matches')
    //add match
    .post(function (req, res){
        //find by id event --> find by id match --> delete
        console.log("post matches backend called, matchID:" + req.id);

        var team1 = req.body.team1;
        var team2 = req.body.team2;
        var result1= req.body.result1;
        var result2= req.body.result2;

        var matches = [{
            team1: team1,
            team2: team2,
            result1: result1,
            result2: result2}
        ];

        //find the document by ID
        mongoose.model('Event').findById(req.id, function (err, event) {
            //update it
            event.matches.push({
                team1: team1,
                team2: team2,
                result1: result1,
                result2: result2
            });
            event.save(function (err) {
                if (err)  {
                    console.error('error:' + err)
                } else {
                    //Event has been created
                    console.log('the sub-doc was removed');
                    res.format({
                        //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing

                        //JSON response will show the newly created event
                        json: function(){
                            res.json(event);
                        }
                    });
                }
            });

        })
    })

    //PUT to update a event by ID
    .put(function(req, res) {
        console.log("put matches backend called");

        var team1 = req.body.team1;
        var team2 = req.body.team2;
        var result1= req.body.result1;
        var result2= req.body.result2;

        var matches = [{
            team1: team1,
            team2: team2,
            result1: result1,
            result2: result2}
        ];

        //find the document by ID
        mongoose.model('Event').findById(req.body.eventId, function (err, event) {
            //update it
            event.update({
                matches : matches
            }, function (err, eventID) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                }
                else {
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.format({
                        html: function(){
                            res.redirect("/events/" + event._id);
                        },
                        //JSON responds showing the updated values
                        json: function(){
                            res.json(event);
                        }
                    });
                }
            })
        });
    });

router.route('/:id')
//DELETE a Event by ID
    .delete(function (req, res){
        console.log('find event by ID:' + req.id);
        mongoose.model('Event').findById(req.id, function (err, event) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                event.remove(function (err, event) {
                    if (err) {
                        return console.error(err);
                    } else {
                        //Returning success messages saying it was deleted
                        console.log('DELETE removing ID: ' + event._id);
                        res.format({
                            //HTML returns us back to the main page, or you can create a success page
                            html: function(){
                                res.redirect("/events");
                            },
                            //JSON returns the item with the message that is has been deleted
                            json: function(){
                                res.json({message : 'deleted',
                                    item : event
                                });
                            }
                        });
                    }
                });
            }
        });
    });

router.route('/:id/edit')
	//GET the individual event by Mongo ID
	.get(function(req, res) {
	    //search for the event within Mongo
	    mongoose.model('Event').findById(req.id, function (err, event) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the event
	            console.log('GET Retrieving ID: ' + event._id);
              var eventeventDate = event.eventDate.toISOString();
              eventeventDate = eventeventDate.substring(0, eventeventDate.indexOf('T'))
	            res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
	                       res.render('events/edit', {
	                          title: 'Event' + event._id,
                            "eventeventDate" : eventeventDate,
	                          "event" : event
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(event);
	                 }
	            });
	        }
	    });
	});


module.exports = router;
