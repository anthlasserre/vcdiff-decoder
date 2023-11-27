'use strict';

export default class SameCache {
  constructor(size) {
    this.size = size;
    this.same = new Array(this.size * 256).fill(0);
  }

  update(address) {
    if (this.same.length > 0) {
      this.same[address % (this.size * 256)] = address;
    }
  };

  get(m, offset) {
    let address = this.same[m * 256 + offset];
    return address;
  };
}
