"use strict";

module.exports.serialiseAndDeserialise = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

module.exports.clone = function (obj) {
  if (obj) {
    if (typeof obj.clone === 'function') {
      return obj.clone();
    }

    return serialiseAndDeserialise(obj);
  }

  return obj;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJzZXJpYWxpc2VBbmREZXNlcmlhbGlzZSIsIm9iaiIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImNsb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZUMsdUJBQWYsR0FBeUMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hELFNBQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLFNBQUwsQ0FBZUgsR0FBZixDQUFYLENBQVA7QUFDRCxDQUZEOztBQUlBSCxNQUFNLENBQUNDLE9BQVAsQ0FBZU0sS0FBZixHQUF1QixVQUFDSixHQUFELEVBQVM7QUFDOUIsTUFBSUEsR0FBSixFQUFTO0FBQ1AsUUFBSSxPQUFPQSxHQUFHLENBQUNJLEtBQVgsS0FBcUIsVUFBekIsRUFBcUM7QUFDbkMsYUFBT0osR0FBRyxDQUFDSSxLQUFKLEVBQVA7QUFDRDs7QUFDRCxXQUFPTCx1QkFBdUIsQ0FBQ0MsR0FBRCxDQUE5QjtBQUNEOztBQUNELFNBQU9BLEdBQVA7QUFDRCxDQVJEIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMuc2VyaWFsaXNlQW5kRGVzZXJpYWxpc2UgPSAob2JqKSA9PiB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpXG59XG5cbm1vZHVsZS5leHBvcnRzLmNsb25lID0gKG9iaikgPT4ge1xuICBpZiAob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBvYmouY2xvbmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvYmouY2xvbmUoKVxuICAgIH1cbiAgICByZXR1cm4gc2VyaWFsaXNlQW5kRGVzZXJpYWxpc2Uob2JqKVxuICB9XG4gIHJldHVybiBvYmpcbn1cbiJdfQ==