import { 
    Component, 
    EventEmitter, 
    Output, 
    ViewChild
} from '@angular/core';
import { constants } from 'src/app/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'sprint-start-date',
  templateUrl: './SprintStartDate.component.html',
  styleUrls: ['./SprintStartDate.component.css']
})

export class SprintStartDateComponent {
  constructor(private toastr: ToastrService) { }

  title = 'sprint-start-date'

  sprintDays: number

  @Output() dateApplied = new EventEmitter()
  @ViewChild('sprintStartDate') sprintStartDate

  ngOnInit(): void {
    this.sprintDays = constants.AVAILABLE_DAYS
  }

  applyStartDate(): void {
    if (!this.sprintStartDate.nativeElement.value || this.sprintDays < 1) this.toastr.error("Please select valid date OR valid days before proceeding.");

    this.dateApplied.emit({
      sprintStartDate: this.sprintStartDate.nativeElement.value,
      sprintDays: this.sprintDays,
    })
  }

  incrementDays(): void {
    this.sprintDays += 1
  }

  decrementDays(): void {
    this.sprintDays -= 1
  }
}
