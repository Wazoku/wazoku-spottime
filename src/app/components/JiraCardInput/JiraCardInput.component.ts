import { 
    Component, 
    EventEmitter, 
    Input, 
    Output, 
    ViewChild 
} from '@angular/core';

@Component({
  selector: 'jira-card-input',
  templateUrl: './JiraCardInput.component.html',
  styleUrls: ['./JiraCardInput.component.css']
})

export class JiraCardInputComponent {
  title = 'jira-card-input'

  @Input() memberAvailable: boolean
  @Output() jiraCardAdded = new EventEmitter<string>()
  @ViewChild('newJiraCard') newJiraCard

  addJiraCard(): void {
    this.jiraCardAdded.emit(this.newJiraCard.nativeElement.value)
    this.newJiraCard.nativeElement.value = ''
  }
  addJiraCardByEnter(event: any): void {
    console.log(event.keyCode);
    if (event?.keyCode === 13 || event?.keyCode === 'ENTER') this.addJiraCard()

  }
}
