import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { By } from '@angular/platform-browser';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBarComponent ],
      imports: [ FormsModule ]  
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChanged event when onSearch is called', () => {
    spyOn(component.searchChanged, 'emit');
    component.searchQuery = 'test query';
    component.onSearch();
    expect(component.searchChanged.emit).toHaveBeenCalledWith('test query');
  });

  it('should call onSearch when input value changes', () => {
    spyOn(component, 'onSearch');
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'new query';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.onSearch).toHaveBeenCalled();
  });

  it('should update searchQuery when input value changes', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'new query';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchQuery).toBe('new query');
  });
});
