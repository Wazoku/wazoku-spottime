import { Component, Inject, Input, OnChanges } from '@angular/core';
import { Member } from 'src/app/models/member';
import { constants } from '../../constants';
import { MembersService } from '../../services/members.service';
import { TimeOffService } from '../../services/timeoff.service';
import {isDev, isQA} from '../../utils';

@Component({
  selector: 'members-list',
  templateUrl: './MembersList.component.html',
  styleUrls: ['./MembersList.component.css'],
})

export class MembersListComponent implements OnChanges {
  title = 'members-list'

  @Input() sprintStartDate: string
  @Input() sprintDays: number

  allDevsAndQA: []
  membersWithTimeOff: Member[] = []
  departments: string[]

  developersShown: boolean = true
  qasShown: boolean = true

  constructor(
    @Inject(MembersService) public membersService: MembersService,
    @Inject(TimeOffService) public timeoffService: TimeOffService,
  ) {}

  ngOnInit(): void {
    // the next line should be removed, just for mocking
    this.allDevsAndQA = this.membersService.getMembersMock()
    this.departments = ['All', 'Development', 'QA']

    // the next 2 lines should be removed as well
    const devsAndQAWithDaysOffMap = this.timeoffService.getTimeOffMock('2021-09-08', 20)

    this.setMembersWithTimeOff(this.allDevsAndQA, devsAndQAWithDaysOffMap)

    this.membersService.getMembers().subscribe(
      (members) => {
        console.log('--> ', members)
        this.allDevsAndQA = this.membersService.filterDevsAndQA(members.employees)
      },
      error => {
        console.log(error)
      },
      () => {

      }
    )
  }

  ngOnChanges(changes): void {
    if ((changes.sprintStartDate && this.sprintStartDate)
      || (changes.sprintDays && this.sprintDays)) {
        // the next 2 lines should be removed
      const devsAndQAWithDaysOffMap = this.timeoffService.getTimeOffMock(this.sprintStartDate, this.sprintDays)

      this.setMembersWithTimeOff(this.allDevsAndQA, devsAndQAWithDaysOffMap)


      const sprintEndDate = this.timeoffService.getSprintEndDate(this.sprintStartDate, this.sprintDays)

      // this.timeoffService.getTimeOff(this.sprintStartDate, sprintEndDate).subscribe(
      //   (timeoff) => {
      //     const devsAndQAWithDaysOffMap = this.timeoffService.getMembersIdsAndDaysOffMap(timeoff)

      //     this.setMembersWithTimeOff(this.allDevsAndQA, devsAndQAWithDaysOffMap)
      //   },
      //   error => {
      //     console.log(error)
      //   },
      //   () => {

      //   }
      // )
    }
  }

  get developersList(): Array<{}> {
    return this.membersWithTimeOff.filter(x => x.department === 'Development')
  }

  get qasList(): Array<{}> {
    return this.membersWithTimeOff.filter(x => x.department === 'Product')
  }

  setMembersWithTimeOff(allDevsAndQA, devsAndQAWithDaysOffMap): void {
    this.membersWithTimeOff = allDevsAndQA.map(member => ({
      id: member.id,
      email: member.email,
      displayName: member.displayName,
      title: member.work.title,
      department: member.work.department,
      avatarUrl: member.avatarUrl,
      isManager: member.work.isManager,
      daysOff: devsAndQAWithDaysOffMap[member.id] || 0,
      availableDays: constants.AVAILABLE_DAYS - (devsAndQAWithDaysOffMap[member.id] || 0)
    }))
  }

  memberRemoved(memberId): void {
    this.membersWithTimeOff = this.membersWithTimeOff.filter(x => x.id !== memberId)
  }

  filterBy(department): void {
    const devsAndQAWithDaysOffMap = this.timeoffService.getTimeOffMock('2021-09-08', 20)

    if (department === 'Development') {
      this.setMembersWithTimeOff(this.allDevsAndQA.filter(isDev), devsAndQAWithDaysOffMap)
    } else if (department === 'QA') {
      this.setMembersWithTimeOff(this.allDevsAndQA.filter(isQA), devsAndQAWithDaysOffMap)
    } else {
      this.setMembersWithTimeOff(this.allDevsAndQA, devsAndQAWithDaysOffMap)
    }
  }
}
