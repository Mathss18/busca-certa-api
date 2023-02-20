import { validateSync } from 'class-validator';

export class Validator {
  public validate() {
    const errors = validateSync(this, { stopAtFirstError: false });
    if (errors.length) {
      for (const error of errors) {
        throw new Error(JSON.stringify(error.constraints));
      }
    }
  }
}
