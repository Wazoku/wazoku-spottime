import { 
    Component, 
    EventEmitter, 
    Input, 
    Output 
} from '@angular/core';
import { Member } from 'src/app/models/member';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'member-card',
  templateUrl: './MemberCard.component.html',
  styleUrls: ['./MemberCard.component.css']
})

export class MemberCardComponent {
  constructor(private toastr: ToastrService) { }

  title = 'member-card'

  @Input() member: Member
  @Output() memberRemoved = new EventEmitter<string>()

  jiraCards = ['IS-12121', 'IS-12939','IS-12121']
  estimatedFor: number = 0
  onPs: boolean = false
  popoverTitle = 'ACTION?'
  popoverMessage = 'Are you sure you want to remove the member from the board ?'
  confirmClicked = false
  cancelClicked = false

  get isMemberAvailable(): boolean {
    return this.member.availableDays !== 0 && !this.member.onPs
  }

  addJiraCard(value): void {
    // Make the request to get the card estimate here,
    // mocking the estimate to 5 days for now
    this.estimatedFor = 5
    this.jiraCards.push(value)
    this.member.availableDays -= this.estimatedFor
  }

  removeMember(): void {
    if (!this.jiraCards.length) {
      this.memberRemoved.emit(this.member.id)
    } else {
      // TODO: handle if member is assigned with an error message
      this.toastr.warning("You can't remove a member already assigned to cards.");
      //alert("You can't remove a member already assigned to cards.");
    }
  }

  removeJiraCard(cardNumber): void {
    this.jiraCards = this.jiraCards.filter(x => x !== cardNumber)
  }

  onPsChecked(value): void {
    this.onPs = value
    this.member.onPs = this.onPs
  }
}
