'use strict';

import errors from '../errors';
import deserializeInteger from './integer';
import tokenizeInstructions from '../tokenize_instructions';

export default function delta(delta, position) {

  let targetWindowLength, dataLength, instructionsLength, addressesLength;

  // parentheses are needed for assignment destructuring
  ({ value: targetWindowLength, position } = deserializeInteger(delta, position));

  // Delta_Indicator byte
  if (delta[position] !== 0) {
    throw new errors.NotImplemented(
      'VCD_DECOMPRESS is not supported, Delta_Indicator must be zero at byte ' + position + ' and not ' + delta[position]
    );
  }
  position++;

  ({ value: dataLength, position } = deserializeInteger(delta, position));
  ({ value: instructionsLength, position } = deserializeInteger(delta, position));
  ({ value: addressesLength, position } = deserializeInteger(delta, position));

  let dataNextPosition = position + dataLength;
  let data = delta.slice(position, dataNextPosition);

  let instructionsNextPosition = dataNextPosition + instructionsLength;
  let instructions = delta.slice(dataNextPosition, instructionsNextPosition);
  let deserializedInstructions = tokenizeInstructions(instructions);

  let addressesNextPosition = instructionsNextPosition + addressesLength;
  let addresses = delta.slice(instructionsNextPosition, addressesNextPosition);

  position = addressesNextPosition;

  let window = {
    targetWindowLength,
    position,
    data,
    instructions: deserializedInstructions,
    addresses
  };

  return window;
}
