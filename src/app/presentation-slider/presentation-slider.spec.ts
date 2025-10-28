import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationSlider } from './presentation-slider';

describe('PresentationSlider', () => {
  let component: PresentationSlider;
  let fixture: ComponentFixture<PresentationSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
