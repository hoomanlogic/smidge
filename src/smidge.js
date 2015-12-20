(function (factory) {
	module.exports = exports = factory();
}(function () {
	
	var Smidge = function (context, lower, upper, lean) {
		this.context = context;
		this.lower = lower; 
		this.upper = upper;
		this.lean = lean;
	};

	Smidge.prototype = {
		decide: function () {
			return this.lower;
		},
		variance: function () {
			var varies = Math.abs(this.lower - this.upper);
			if (varies < this.context.chunk) {
				varies = 0
			} else {
				varies -= this.context.chunk;
			}
			return varies;
		}
	};

	var getContext = function (kind, chunk) {
		return {
			kind: kind, // the kind of data
			chunk: chunk // the relative specificity of this data
		}
	};

	var LEAN = {
		LOWER: -1,
		NONE: 0,
		UPPER: 1
	};

	var TIME_CHUNK = {
		MILLI: 1,
		SECOND: 1000,
		MINUTE: 60000,
		HOUR: 3600000,
		DAY: 3600000 * 24,
		WEEK: 3600000 * 24 * 7,
		MONTH: 3600000 * 24 * 30,
		YEAR: 3600000 * 24 * 365,
		DECADE: 3600000 * 24 * 365 * 10,
		CENTURY: 3600000 * 24 * 365 * 100,
		MILLENIUM: 3600000 * 24 * 365 * 1000
	};

	var TIME_KIND = {
		EVENT: 'event',
		DURATION: 'duration'
	};

	return {
		TIME_CHUNK: TIME_CHUNK,
		TIME_KIND: TIME_KIND,
		// absolute points in time
		time: function (token, context) {
			var lower, upper, lean;
			
			// context for the smidge data
			context = context || {};
			
			if  (token === 'today') {
				
				// Only EVENT kind supported for this token
				context.kind = TIME_KIND.EVENT;
				// Today is a time chunk of a DAY
				context.chunk = TIME_CHUNK.DAY;
				
				var eventDate = new Date();
				eventDate.setHours(0,0,0,0);
				
				lower = new Date(eventDate.getTime());
				eventDate.setHours(23,59,59,999);
				upper = new Date(eventDate.getTime());
				lean = LEAN.NONE;
				return new Smidge(context, lower, upper, lean);
			}
			else if  (token === 'about an hour') {
				// Determine HOUR chunk
				// Determine 'about' is a close 'hug' if the CHUNK
				// Previous CHUNK is MINUTE, lower is 25% of smaller chunks in the CHUNK less than HOUR
				// and upper is %25 more
				// lean is none
				
				context.kind = context.kind || TIME_KIND.DURATION;
				context.chunk = TIME_CHUNK.MINUTE;
				
				if (context.kind === TIME_KIND.DURATION) {
					lower = new babble.Duration();
					upper = new babble.Duration();
				}
				else {
					lower = new Date();
					upper = new Date();
				}
				
				lean = LEAN.NONE;
				
				return new Smidge(context, lower, upper, lean);
			}
			
			
		},
	};
}));