import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelReservationComponentComponent } from './hotel-reservation-component.component';

describe('HotelReservationComponentComponent', () => {
  let component: HotelReservationComponentComponent;
  let fixture: ComponentFixture<HotelReservationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelReservationComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelReservationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
