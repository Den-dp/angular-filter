'use strict';

describe('fuzzyByFilter', function() {
  var filter,
    collection = [
      { title: 'The DaVinci Code', author: 'F. Scott Fitzgerald' },
      { title: 'The Great Gatsby', author: 'Dan Browns' },
      { title: 'Angels & Demons',  author: 'Dan Louis' },
      { title: 'The Lost Symbol',  author: 'David Maine' },
      { title: 'Old Man\'s War',   author: 'Rob Grant' }
    ];

  beforeEach(module('a8m.fuzzy-by'));

  beforeEach(inject(function ($filter) {
    filter = $filter('fuzzyBy');
  }));

  it('should get array as collection, property, search, and filter by fuzzy searching', function() {

    expect(filter(collection, 'title', 'tha')).toEqual([collection[0], collection[1]]);
    expect(filter(collection, 'title', 'thesy')).toEqual([collection[1], collection[3]]);
    expect(filter(collection, 'title', 'omwar')).toEqual([collection[4]]);


  });

  it('should be case sensitive if set to true', function() {

    expect(filter(collection, 'title', 'tha', true)).toEqual([]);
    expect(filter(collection, 'title', 'thesy', true)).toEqual([]);
    expect(filter(collection, 'title', 'omwar', true)).toEqual([]);

    expect(filter(collection, 'title', 'TDC', true)).toEqual([collection[0]]);
    expect(filter(collection, 'title', 'ThLSy', true)).toEqual([collection[3]]);
    expect(filter(collection, 'title', 'OldWar', true)).toEqual([collection[4]]);

  });

  it('should support nested properties', function() {

    var deepCollection = [
      { details: { title: 'The DaVinci Code' } },
      { details: { title: 'The Great Gatsby' } },
      { details: { title: 'Angels & Demons'  } },
      { details: { title: 'The Lost Symbol'  } },
      { details: { title: 'Old Man\'s War'   } }
    ];

    expect(filter(deepCollection, 'details.title', 'tha')).toEqual([deepCollection[0], deepCollection[1]]);
    expect(filter(deepCollection, 'details.title', 'thesy')).toEqual([deepCollection[1], deepCollection[3]]);
    expect(filter(deepCollection, 'details.title', 'omwar')).toEqual([deepCollection[4]]);

  });

  it('should not get a property and return the collection as-is', function() {

    var array = [{ name: 'foo' }];

    expect(filter(array)).toEqual(array);

  });

  it('should get a !collection and return it as-is', function() {

    expect(filter(!1)).toBeFalsy();
    expect(filter(1)).toEqual(1);
    expect(filter('string')).toEqual('string');

  });

  it('should support properties passed in array', function() {
    expect(filter(collection, ['author'], 'David')).toEqual([collection[3]]);
    expect(filter(collection, ['title', 'author'], 'davi')).toEqual([collection[0], collection[3]]);
    expect(filter(collection, ['title', 'author'], 'tha')).toEqual([collection[0], collection[1]]);
    expect(filter(collection, ['title', 'author'], 'thesy')).toEqual([collection[1], collection[3]]);
  });

  it('should support nested properties passed in array', function() {
    var deepCollection = [
      { details: { title: 'The DaVinci Code', author: 'F. Scott Fitzgerald' } },
      { details: { title: 'The Great Gatsby', author: 'Dan Browns'          } },
      { details: { title: 'Angels & Demons' , author: 'Dan Louis'           } },
      { details: { title: 'The Lost Symbol' , author: 'David Maine'         } },
      { details: { title: 'Old Man\'s War'  , author: 'Rob Grant'           } }
    ];
    expect(filter(deepCollection, ['details.title'], 'omwar')).toEqual([deepCollection[4]]);
    expect(filter(deepCollection, ['details.title'], 'thesy')).toEqual([deepCollection[1], deepCollection[3]]);
  });

  var array = [
      { title: 'The DaVinci Code', author: 'Dan Brown',           genre: ['Mystery', 'Thriller']          },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: ['Novel']                        },
      { title: 'Angels & Demons',  author: 'Dan Brown',           genre: ['Novel']                        },
      { title: 'The Lost Symbol',  author: 'Dan Brown',           genre: ['Crime', 'Thriller', 'Mystery'] },
      { title: 'Old Man\'s War',   author: 'John Scalzi',         genre: ['Military science fiction']     }
  ];

  it('should support basic search in arrays', function() {
    expect(filter(array, 'genre', 'Mstr')).toEqual([array[0], array[3]]);
  });

  it('should support multiple search in arrays', function() {
      expect(filter(array, 'genre', ['thrlr', 'mstr'])).toEqual([array[0], array[3]]);
  });

  it('should support multiple search in arrays by many passed properties', function() {
      expect(filter(array, 'genre', ['thrlr', 'mstr'])).toEqual([array[0], array[3]]);
      expect(filter(array, ['genre'], 'mstr')).toEqual([array[0], array[3]]);
      expect(filter(array, ['genre'], ['thrlr', 'mstr'])).toEqual([array[0], array[3]]);
      expect(filter(array, ['genre'], ['thrlr', 'mstr', 'drama'])).toEqual([]);
      expect(filter(array, ['genre', 'title', 'author'], ['Thriller', 'Dan', 'Mystery', 'The DaVinci Code'])).toEqual([array[0]]);
  });


});
