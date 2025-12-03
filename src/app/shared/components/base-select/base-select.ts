import { Component, input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-base-select',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  template: `
    <div class="width-full" [class]="containerClass()">
      <label class="text-label">
        {{ label() }}
        @if (label() && isRequired) {
        <span class="color-required">*</span>
        }
      </label>
      <ng-select
        class="width-full"
        [class.ng-invalid]="invalid"
        [class.ng-touched]="touched"
        [bindLabel]="bindLabel()"
        [bindValue]="bindValue()"
        [items]="options()"
        [placeholder]="placeholder()"
        [searchable]="searchable()"
        [clearable]="clearable()"
        [multiple]="multiple()"
        [closeOnSelect]="!multiple()"
        [hideSelected]="multiple()"
        [disabled]="isDisabled"
        [(ngModel)]="value"
        (ngModelChange)="onModelChange($event)"
        (open)="showDropdown = true"
        (close)="showDropdown = false"
        [isOpen]="showDropdown"
        (clickOutside)="showDropdown = false"
        (click)="open()"
        (blur)="onTouched()"
      >
        @if (multiple()) {
        <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
          <div class="ng-value-container-custom">
            @for (item of items; track item; let isLast = $last) {
            <span class="ng-value-label">{{ item[bindLabel()] }}@if (!isLast) {, }</span>
            }
          </div>
        </ng-template>
        }
      </ng-select>
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
      ::ng-deep .ng-select.ng-select-multiple .ng-select-container.ng-has-value .ng-placeholder {
        display: none !important;
      }
      ::ng-deep .ng-select.ng-select-single .ng-select-container.ng-has-value .ng-placeholder {
        display: none !important;
      }
      :host ::ng-deep .ng-select .ng-select-container {
        border: 1px solid;
        border-color: #d0d5dd !important;
        border-radius: 12px;
        min-height: 44px;
        height: auto;
        padding: 10px 14px;
        opacity: 1 !important;
      }
      ::ng-deep .ng-select .ng-select-container .ng-value-container .ng-placeholder {
        color: #757575 !important;
        opacity: 1 !important;
      }
      :host ::ng-deep .ng-value-container-custom {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0;
      }
      :host ::ng-deep .ng-value-label {
        color: #344054;
        font-size: 14px;
        line-height: 20px;
      }
      :host ::ng-deep .ng-select.ng-select-multiple .ng-value-container .ng-value {
        display: none;
      }
      :host ::ng-deep .ng-dropdown-panel {
        background-color: #ffffff !important;
        border: 1px solid #d0d5dd !important;
        border-radius: 12px !important;
        box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03),
          0px 12px 16px -4px rgba(16, 24, 40, 0.08) !important;
        margin-top: 8px !important;
        overflow: hidden !important;
      }
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items {
        max-height: 280px !important;
        padding: 8px !important;
        background-color: #ffffff !important;
      }
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {
        padding: 10px 14px !important;
        font-size: 14px !important;
        color: #344054 !important;
        line-height: 20px !important;
        border-radius: 8px !important;
        margin: 2px 0 !important;
        background-color: #ffffff !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
      }
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items .ng-option:hover,
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {
        background-color: gray !important;
        color: #fff !important;
      }
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected {
        background-color: #eff8ff !important;
        color: #1570ef !important;
        font-weight: 500 !important;
      }
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-disabled {
        color: #98a2b3 !important;
        background-color: #ffffff !important;
        cursor: not-allowed !important;
        opacity: 0.5 !important;
      }
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items::-webkit-scrollbar {
        width: 6px !important;
      }
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items::-webkit-scrollbar-track {
        background: #f9fafb !important;
        border-radius: 3px !important;
      }
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items::-webkit-scrollbar-thumb {
        background: #d0d5dd !important;
        border-radius: 3px !important;
      }
      :host ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items::-webkit-scrollbar-thumb:hover {
        background: #98a2b3 !important;
      }
    `,
  ],
})
export class BaseSelect implements ControlValueAccessor, OnInit {
  private propagateChange = (_: any) => {};

  constructor(@Optional() @Self() private ngControl: NgControl) {
    if (this.ngControl) this.ngControl.valueAccessor = this as any;
  }

  label = input<string>('');
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);
  hint = input<string>('');
  searchable = input<boolean>(false);
  clearable = input<boolean>(false);
  multiple = input<boolean>(false);
  bindLabel = input<string>('label');
  bindValue = input<string>('value');
  containerClass = input<string>('');
  iconCheck = input<boolean>(false);
  showDropdown: boolean = false;
  value: any = null;
  isDisabled = false;

  get isRequired(): boolean {
    const c = this.ngControl?.control as any;
    if (!c) return false;
    if (typeof c.hasValidator === 'function') return c.hasValidator(Validators.required);
    const v = c.validator?.({} as any);
    return !!v?.['required'];
  }

  get invalid(): boolean {
    const c = this.ngControl?.control;
    return !!c && c.invalid;
  }

  get touched(): boolean {
    const c = this.ngControl?.control;
    return !!c && (c.touched || c.dirty);
  }

  open() {
    return (this.showDropdown = !this.showDropdown);
  }

  ngOnInit() {
    if (this.multiple() && !this.value) this.value = [];
  }

  onModelChange = (val: any) => {
    this.value = val;
    this.propagateChange(val);
  };

  onTouched = () => {
    this.ngControl?.control?.markAsTouched();
  };

  writeValue(value: any): void {
    this.value = value || (this.multiple() ? [] : null);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

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
