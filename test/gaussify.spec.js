import { expect } from 'chai';
import Gauss from '../src/gaussify';


/**
 * @todo: should resolve jQuery node
 * @todo: should resolve document.querySelector node
 * @todo: should resolve node from string
 * @todo: should throw error if node not exist
 */
describe('Blur', () => {
  it('should blur images', async (done) => {
    try {
      expect(await Gauss.blur()).to.be.a('');
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should return a promise', (done) => {
    expect(Gauss.background()).to.be.a('promise');
    done();
  });
});
