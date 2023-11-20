'use strict';

export default class NearCache {
  constructor(size) {
    this.size = size;
    this.near = new Array(this.size).fill(0);
    this.nextSlot = 0;
  }

  update(address) {
    if (this.near.length > 0) {
      this.near[this.nextSlot] = address;
      this.nextSlot = (this.nextSlot + 1) % this.near.length;
    }
  }

  get(m, offset) {
    let address = this.near[m] + offset;
    return address;
  };
}
