const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const Store = require('../lib/Store');


describe('Store', () => {
  let store = null;

  beforeAll(done => {
    mkdirp('./testData/store', done);
  });

  beforeEach(() => {
    store = new Store('./testData/store');
  });

  afterEach(done => {
    store.drop(done);
  });

  afterAll(done => {
    rimraf('./testData', done);
  });
  //works
  it('creates an object in my store', () => {
    store.create({ name: 'ryan' })
      .then(data => expect(data).toEqual({ name: 'ryan', _id: expect.any(String) }));
  });

  //works
  it('finds an object by id', () => {
    store.create({ name: 'uncle bob' })
      .then((data) => {
        store.findById(data._id, (err, foundUncle) => {
          expect(err).toBeFalsy();
          expect(foundUncle).toEqual({ name: 'uncle bob', _id: data._id });
        });
      });
  });


  //works
  it('find all bojects tracket by the store', () => {
    const undefinedArray = [...Array(5)];
    const arrayOfItems = undefinedArray.map((_, index) => ({ 'item': index }));
    console.log(arrayOfItems);
    return Promise.all(
      arrayOfItems.map(item => store.create(item))
    )
      .then(([item1, item2, item3, item4, item5]) => {
        store.find()
          .then((listOfItems) => {
            expect(listOfItems).toContainEqual(item1);
            expect(listOfItems).toContainEqual(item2);
            expect(listOfItems).toContainEqual(item3);
            expect(listOfItems).toContainEqual(item4);
            expect(listOfItems).toContainEqual(item5);
          });
      });
  });



  it.only('deletes an object with an id', done => {
    store.create({ item: 'I am going to delete' }, (err, createdItem) => {
      store.findByIdAndDelete(createdItem._id, (err, result) => {
        expect(err).toBeFalsy();
        expect(result).toEqual({ deleted: 1 });
        store.findById(createdItem._id, (err, foundItem) => {
          expect(err).toBeTruthy();
          expect(foundItem).toBeFalsy();
          done();
        });
      });
    });
  });

  it('updates an existing object', done => {
    store.create({ name: 'rayn' }, (err, typoCreated) => {
      store.findByIdAndUpdate(typoCreated._id, { name: 'ryan' }, (err, updatedWithoutTypo) => {
        expect(err).toBeFalsy();
        expect(updatedWithoutTypo).toEqual({ name: 'ryan', _id: typoCreated._id });
        store.findById(typoCreated._id, (err, foundObj) => {
          expect(foundObj).toEqual(updatedWithoutTypo);
          done();
        });

      });
    });
  });
});
