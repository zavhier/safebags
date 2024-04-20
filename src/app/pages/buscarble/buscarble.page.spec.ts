import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarblePage } from './buscarble.page';

describe('BuscarblePage', () => {
  let component: BuscarblePage;
  let fixture: ComponentFixture<BuscarblePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuscarblePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
