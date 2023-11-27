'use strict';

import deserializeInteger from './deserialize/integer';
import * as TypedArray from './typed_array_util';

class ADD {
  constructor(size) {
    this.size = size;
  }

  name = 'ADD';

  execute(delta) {
    for (let i = 0; i < this.size; i++) {
      delta.U.set(delta.UTargetPosition + i, delta.data[delta.dataPosition + i]);
    }
    delta.dataPosition += this.size;
    delta.UTargetPosition += this.size;
  };
}

class COPY {
  constructor(size, mode) {
    this.size = size;
    this.mode = mode;
  }

  name = 'COPY';

  execute(delta) {
    let address, m, next, method;

    if (this.mode === 0) {
      address = delta.getNextAddressInteger();
    }
    else if (this.mode === 1) {
      next = delta.getNextAddressInteger();
      address = delta.UTargetPosition - next;
    }
    else if ((m = this.mode - 2) >= 0 && (m < delta.nearCache.size)) {
      next = delta.getNextAddressInteger();
      address = delta.nearCache.get(m, next);
      method = 'near';
    }
    // same cache
    else {
      m = this.mode - (2 + delta.nearCache.size);
      next = delta.getNextAddressByte();
      address = delta.sameCache.get(m, next);
      method = 'same';
    }

    delta.nearCache.update(address);
    delta.sameCache.update(address);

    for (let i = 0; i < this.size; i++) {
      delta.U.set(delta.UTargetPosition + i, delta.U.get(address + i));
    }

    delta.UTargetPosition += this.size;
  }
};

class RUN {
  constructor(size) {
    this.size = size;
  }

  name = 'RUN';

  execute(delta) {
    for (let i = 0; i < this.size; i++) {
      // repeat single byte
      delta.U.set(delta.UTargetPosition + i, delta.data[delta.dataPosition]);
    }
    // increment to next byte
    delta.dataPosition++;
    delta.UTargetPosition += this.size;
  };
}

let instructions = {
  ADD,
  COPY,
  RUN
};

export default instructions;
