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
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-base-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="width-full" [class]="containerClass()">
      <label class="text-label">
        {{ label() }}
        @if (label() && isRequired) {
        <span class="color-required">*</span>
        }
      </label>
      <div>
        <mat-select
          class="style-select width-full"
          [ngClass]=""
          [attr.aria-invalid]="invalid"
          [placeholder]="placeholder()"
          [disabled]="isDisabled"
          [multiple]="multiple()"
          [value]="value"
          (selectionChange)="onChange($event)"
          (blur)="onTouched()"
          [panelClass]="'custom-select-panel'"
        >
          @if (showEmptyOption()) {
          <mat-option [value]="null">{{ emptyOptionLabel() }}</mat-option>
          } @for (option of options(); track option.value) {
          <mat-option [value]="option.value" [disabled]="option.disabled">
            {{ option.label }}
          </mat-option>
          }
        </mat-select>
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
      .style-select {
        border: 1px solid #d0d5dd;
        border-radius: 12px;
        min-height: 44px;
        height: auto !important;
        font-size: 14px;
        padding: 0px 14px;
        display: flex;
        align-items: center;
      }
      .style-select:hover:not(.mat-select-disabled) {
        border-color: rgba(204, 0, 51, 0.3);
      }
      .style-select.mat-select-focused:not(.mat-select-disabled) {
        border-color: #cc0033;
      }
      .text-hint {
        font-style: italic;
        font-size: 12px;
        color: #475467;
        margin-left: 10px;
        margin-top: 5px;
        display: block;
      }
      ::ng-deep .style-select .mat-select-trigger {
        height: 100%;
        display: flex;
        align-items: center;
      }
      ::ng-deep .style-select .mat-select-value {
        color: #101828;
      }
      ::ng-deep .style-select .mat-select-placeholder {
        color: #98a2b3;
      }
      ::ng-deep .style-select .mat-select-arrow {
        color: #667085;
      }
      ::ng-deep .custom-select-panel {
        border-radius: 8px;
        margin-top: 4px;
      }
      ::ng-deep .mat-mdc-select-value-text {
        white-space: normal !important;
        line-height: 1.4 !important;
        word-break: break-word !important;
      }
      ::ng-deep .mat-mdc-select-trigger {
        height: auto !important;
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        white-space: normal !important;
        align-items: start !important;
      }
      ::ng-deep .mdc-list-item__primary-text {
        white-space: normal !important;
        line-height: 1.4 !important;
        word-break: break-word !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseSelect implements OnInit, ControlValueAccessor {
  private propagateChange = (_: any) => {};

  constructor(@Optional() @Self() private ngControl: NgControl, private cd: ChangeDetectorRef) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  label = input<string>('');
  placeholder = input<string>('Chọn...');
  hint = input<string>('');
  containerClass = input<string>('');
  options = input<SelectOption[]>([]);
  multiple = input<boolean>(false);
  showEmptyOption = input<boolean>(false);
  emptyOptionLabel = input<string>('-- Không chọn --');

  isDisabled: any = false;
  value: any = null;

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

  onChange = (event: any) => {
    this.value = event.value;
    this.propagateChange(this.value);
  };

  writeValue(value: any): void {
    this.value = value;
    this.cd.markForCheck();
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
    this.cd.markForCheck();
  }
}
