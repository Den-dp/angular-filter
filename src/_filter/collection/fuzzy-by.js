/**
 * @ngdoc filter
 * @name fuzzyByKey
 * @kind function
 *
 * @description
 * fuzzy string searching by key
 */
angular.module('a8m.fuzzy-by', [])
  .filter('fuzzyBy', ['$parse', function ( $parse ) {
    return function (collection, properties, search, csensitive) {

      var sensitive = csensitive || false;

      collection = isObject(collection) ? toArray(collection) : collection;

      if(!isArray(collection) || isUndefined(properties)
        || isUndefined(search)) {
        return collection;
      }

      if (!isArray(search)) {
        search = [search];
      }

      function compareFn(item, phrase) {
          item = (sensitive) ? item : item.toLowerCase();
          phrase = (sensitive) ? phrase: phrase.toLowerCase();

          return hasApproxPattern(item, phrase) !== false;
      }

      function filterFn(terms, props, elm) {
          if(!isArray(props)) {
              props = [props];
          }

          if(!isArray(terms)) {
              terms = [terms];
          }

          return terms.every(function (searchPhrase) {
              return props.some(function (prop) {
                  var value = $parse(prop)(elm);

                  if(!isString(value) && !isArray(value)) {
                      return false;
                  }

                  if(!isArray(value)) {
                      value = [value];
                  }

                  return value.some(function (item) {
                      return compareFn(item, searchPhrase);
                  });
              });
          })
      }

      return collection.filter(function (elm) {
          return filterFn(search, properties, elm);
      });
    }

 }]);