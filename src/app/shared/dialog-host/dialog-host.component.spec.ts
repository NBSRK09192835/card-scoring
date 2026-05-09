/// <reference types="jest" />
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { DialogHostComponent } from "./dialog-host.component";

describe("DialogHostComponent", () => {
  let component: DialogHostComponent;
  let fixture: ComponentFixture<DialogHostComponent>;
  let mockDialogRef: { close: jest.Mock; componentInstance: { data: any } };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
      componentInstance: { data: {} }
    };

    await TestBed.configureTestingModule({
      declarations: [DialogHostComponent],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            type: 'prompt',
            title: 'Test',
            message: 'Test message'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe('confirm method', () => {
    it('should close with value for prompt type', () => {
      component.value = 'test input';
      component.data.type = 'prompt';
      component.confirm();
      expect(mockDialogRef.close).toHaveBeenCalledWith('test input');
    });

    it('should close with undefined for prompt type with empty value', () => {
      component.value = '';
      component.data.type = 'prompt';
      component.confirm();
      expect(mockDialogRef.close).toHaveBeenCalledWith(undefined);
    });

    it('should close with true for confirm type', () => {
      component.data.type = 'confirm';
      component.confirm();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
  });

  describe('cancel method', () => {
    it('should close with undefined', () => {
      component.cancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith(undefined);
    });
  });
});