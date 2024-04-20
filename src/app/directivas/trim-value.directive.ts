import { Directive } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive({ //TODO: 🤓 Usaremos en un input del formulario reactivo
  selector: '[appTrimValue]'
})
export class TrimValueDirective {

  constructor(private ngControl: NgControl) {
    this.trimValueAccess(this.ngControl.valueAccessor)
  }

  private trimValueAccess(valueAccessor: any | ControlValueAccessor): void {
    const original = valueAccessor.registerOnChange
    valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
      return original.call(valueAccessor, (value: unknown) => {
        return fn((typeof value === 'string') ? value.trim() : value)
      })
    }
  }

}