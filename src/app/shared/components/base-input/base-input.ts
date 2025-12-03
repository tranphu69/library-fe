import {
  Component,
  input,
  Optional,
  Self,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  ReactiveFormsModule,
  NgControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-base-input',
  standalone: true,
  imports: [
    MatInputModule,
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  template: `
    <div class="width-full" [class]="containerClass()">
      <label class="text-label">
        {{ label() }}
        @if (label() && isRequired) {
        <span class="color-required">*</span>
        }
      </label>
      <div>
        <input
          style="outline: none"
          class="style-input width-full"
          [ngClass]=""
          [type]="type()"
          [attr.aria-invalid]="invalid"
          [attr.maxlength]="maxlength()"
          [placeholder]="placeholder()"
          [matAutocomplete]="matAutocomplete()"
          [disabled]="isDisabled"
          [value]="value"
          (keydown)="onKeyDown($event)"
          (paste)="onPaste($event)"
          (beforeinput)="onBeforeInput($event)"
          (input)="onChange($event)"
          (blur)="onTouched()"
        />
      </div>
      @if (hint()) {
      <mat-hint class="text-hint">{{ hint() }}</mat-hint>
      }
    </div>
  `,
  styles: [
    `
      .width-full {
        width: 100%;
      }
      .color-required {
        color: red;
      }
      .text-label {
        display: block;
        color: #475467;
        font-size: 14px;
        font-weight: 500;
        margin-left: 10px;
        margin-bottom: 5px;
      }
      .style-input {
        border: 1px solid #d0d5dd;
        border-radius: 12px;
        height: 44px;
        padding: 10px 14px;
      }
      .text-hint {
        font-style: italic;
        font-size: 12px;
        color: #475467;
      }
      .style-input:hover:not(:disabled) {
        border-color: rgba(204, 0, 51, 0.3);
      }
      .style-input:focus:not(:disabled) {
        border-color: #cc0033;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseInput implements OnInit, ControlValueAccessor {
  private propagateChange = (_: any) => {};

  constructor(@Optional() @Self() private ngControl: NgControl, private cd: ChangeDetectorRef) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  hint = input<string>('');
  maxlength = input<string>('');
  containerClass = input<string>('');
  isDisabled: any = false;
  numberType = input<'integer' | 'decimal'>('decimal');
  matAutocomplete = input<any>(null);
  allowNegative = input<boolean>(false);
  value: any = '';

  get invalid(): boolean {
    const c = this.ngControl?.control;
    if (!c) return false;
    return c.invalid && (c.touched || c.dirty);
  }

  get isRequired(): boolean {
    const c = this.ngControl?.control as any;
    if (!c) return false;
    if (typeof c.hasValidator === 'function') {
      return c.hasValidator(Validators.required);
    }
    const v = c.validator?.({} as any);
    return !!v?.['required'];
  }

  ngOnInit() {
    const c = this.ngControl?.control;
    if (!c) return;
    c.statusChanges.subscribe(() => this.cd.markForCheck());
    const origMarkAsTouched = c.markAsTouched.bind(c);
    c.markAsTouched = (...args) => {
      origMarkAsTouched(...args);
      this.cd.markForCheck();
    };
  }

  onBeforeInput = (event: InputEvent) => {
    if (!this.maxlength()) return;
    const input = event.target as HTMLInputElement;
    const maxLen = Number(this.maxlength());
    if (isNaN(maxLen)) return;
    const selectionLength = (input.selectionEnd || 0) - (input.selectionStart || 0);
    const dataLength = event.data?.length || 0;
    const newLength = input.value.length - selectionLength + dataLength;
    if (newLength > maxLen) {
      event.preventDefault();
    }
  };

  onKeyDown(event: KeyboardEvent): void {
    if (this.type() !== 'number') {
      return;
    }
    const key = event.key;
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const cursorPosition = input.selectionStart || 0;
    if (
      event.ctrlKey ||
      event.metaKey ||
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'Tab' ||
      key === 'Escape' ||
      key === 'Enter' ||
      key.startsWith('Arrow') ||
      key === 'Home' ||
      key === 'End'
    ) {
      return;
    }
    if (key === '-' && this.allowNegative()) {
      if (cursorPosition === 0 && !currentValue.includes('-')) {
        return;
      }
    }
    if (key === '.' && this.numberType() === 'decimal') {
      if (!currentValue.includes('.')) {
        return;
      }
    }
    if (key >= '0' && key <= '9') {
      return;
    }
    event.preventDefault();
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const paste = (event.clipboardData || (window as any).clipboardData).getData('text');
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const cursorPosition = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    let cleanedPaste = paste;
    if (this.type() === 'number') {
      cleanedPaste = paste.replace(/[^0-9.\-,]/g, '');
      if (!this.allowNegative()) {
        cleanedPaste = cleanedPaste.replace(/-/g, '');
      } else {
        cleanedPaste = cleanedPaste.replace(/-/g, '');
        if (paste.includes('-') && cursorPosition === 0 && !currentValue.includes('-')) {
          cleanedPaste = '-' + cleanedPaste;
        }
      }
      if (this.numberType() === 'integer') {
        cleanedPaste = cleanedPaste.replace(/[.,]/g, '');
      } else {
        cleanedPaste = cleanedPaste.replace(/,/g, '.');
        if (cleanedPaste.split('.').length > 2) {
          const parts = cleanedPaste.split('.');
          cleanedPaste = parts[0] + '.' + parts.slice(1).join('');
        }
        if (currentValue.includes('.') && cleanedPaste.includes('.')) {
          cleanedPaste = cleanedPaste.replace(/\./g, '');
        }
      }
    }
    const newValue =
      currentValue.slice(0, cursorPosition) + cleanedPaste + currentValue.slice(selectionEnd);
    const maxLen = Number(this.maxlength());
    let finalValue = newValue;
    if (!isNaN(maxLen) && maxLen > 0 && newValue.length > maxLen) {
      const availableSpace = maxLen - (currentValue.length - (selectionEnd - cursorPosition));
      cleanedPaste = cleanedPaste.slice(0, Math.max(0, availableSpace));
      finalValue =
        currentValue.slice(0, cursorPosition) + cleanedPaste + currentValue.slice(selectionEnd);
    }
    if (this.type() === 'number') {
      finalValue = this.cleanNumberValue(finalValue);
    }
    input.value = finalValue;
    this.value = finalValue;
    const newCursorPos = cursorPosition + cleanedPaste.length;
    input.setSelectionRange(newCursorPos, newCursorPos);
    this.propagateChange(this.value === '' ? null : this.value);
  }

  cleanNumberValue(value: string): string {
    if (!value) return '';
    let cleaned = value;
    if (!this.allowNegative()) {
      cleaned = cleaned.replace(/-/g, '');
    } else {
      if (cleaned.includes('-')) {
        cleaned = cleaned.replace(/-/g, '');
        if (value.startsWith('-')) {
          cleaned = '-' + cleaned;
        }
      }
    }
    if (this.numberType() === 'integer') {
      cleaned = cleaned.replace(/[.,]/g, '');
    } else {
      cleaned = cleaned.replace(/,/g, '.');
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
      }
    }
    return cleaned;
  }

  onChange = (event: any) => {
    let newValue = event.target.value;
    const maxLen = Number(this.maxlength());
    if (!isNaN(maxLen) && maxLen > 0 && newValue.length > maxLen) {
      newValue = newValue.slice(0, maxLen);
      event.target.value = newValue;
    }
    if (this.type() === 'number') {
      if (newValue !== '' && newValue !== null && newValue !== undefined) {
        const cleaned = this.cleanNumberValue(String(newValue));
        if (cleaned !== String(newValue)) {
          event.target.value = cleaned;
          newValue = cleaned;
        }
        if (cleaned !== '') {
          const numValue = parseFloat(cleaned);
          if (isNaN(numValue) && cleaned !== '-' && cleaned !== '.') {
            event.target.value = this.value || '';
            newValue = this.value || '';
          }
        }
      }
    }
    this.value = newValue;
    this.propagateChange(this.value === '' || this.value === null ? null : this.value);
  };

  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      this.value = String(value);
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  onTouched = () => {
    this.ngControl?.control?.markAsTouched();
  };

  registerOnTouched(fn: any): void {
    this.onTouched = () => {
      this.ngControl?.control?.markAsTouched();
      fn();
    };
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
