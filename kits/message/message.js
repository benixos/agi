'use strict';

var Message = {
    cloudEventsVersion : "0.1",
    eventType : "com.example.someevent",
    eventTypeVersion : "1.0",
    source : "/mycontext",
    eventID : "C234-1234-1234",
    eventTime : "2018-04-05T17:31:00Z",
    extensions : {
      comExampleExtension : "value"
    },
    contentType : "application/json",
    data : {}
};
