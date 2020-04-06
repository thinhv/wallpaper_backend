const { after, afterEach, before, beforeEach, describe, it } = require('mocha');
const assert = require('assert');

const { expect } = require('chai');
const { Level } = require('../logger');

describe('Module-level features', () => {
  // TRACE
  describe('when log level isLevel.TRACE', function () {
    it('should have a priority order lower than Level.DEBUG', function () {
      expect(Level.TRACE.priority).to.be.lessThan(Level.DEBUG.priority);
    });
    it('should have outputString value of TRACE', function () {
      expect(Level.TRACE.outputString).to.equal('TRACE');
    });
  });
});
