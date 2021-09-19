import {Inject, Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {take} from 'rxjs/operators'

import { isDevOrQA } from '../utils'
import timeoff from '../mocks/timeoff'

import members from '../mocks/members'
import {constants} from '../constants/index'


@Injectable({
  providedIn: 'root',
})
export class TimeOffService {
  private timeoffUrl = 'https://api.hibob.com/v1/timeoff/whosout'

  private readonly headers = {
    headers: new HttpHeaders(),
  }

  constructor(
    @Inject(HttpClient) private http: HttpClient,
  ) {}

  ngOnInit(): void {
      this.headers['Authentication'] = constants.hibobToken
  }

  getTimeOff(startDate, endDate): Observable<any> {
    this.timeoffUrl += `?from=${startDate}&to=${endDate}`
    return this.http.get<any>(this.timeoffUrl, this.headers).pipe(take(1))
  }

  getTimeOffMock = (startDate, endDate) => {
    // getSprintDaysDates(startDate, sprintDays) first //e.g. '2021-09-08', 20
    // console.log('--> ', getDateAfterSpecificDays('2021-09-08', 20))
    return this.getMembersIdsAndDaysOffMap(timeoff.outs)
  }

  getSprintEndDate = (startDate, sprintDays) => this.getStringFromDate(this.getDateAfterSpecificDays('2021-09-08', 20))


  filterDevsAndQAByID = (timeoffList) => {
    return timeoffList.filter(dayOff => {
        return members.employees.findIndex(member => (
            member.id == dayOff.employeeId
            && isDevOrQA(member)
        )) !== -1
    })
  }


  getMembersIdsAndDaysOffMap = (timeoffList) => {
    const map = {}
    this.filterDevsAndQAByID(timeoffList).forEach(x => map[x.employeeId] = (map[x.employeeId] || 0) + 1 )

    return map
  }

  isWeekend = (date) => {
    const dt = new Date(date)
         
    return dt.getDay() == 6 || dt.getDay() == 0
  }

  getStringFromDate = (date) => typeof date === 'object' ? date.toISOString().split('T')[0] : ''

  getNextDate = date => {
    date.setDate(new Date(date).getDate() + 1)

    return date
  }

  getSprintDaysDates = (startDate, sprintDays) => {
    let date = new Date(startDate)
    let sprintDaysCounter = 0
    let dates = []

    do {
        if (!this.isWeekend(date)) {
            dates.push(this.getStringFromDate(date))
            sprintDaysCounter++
        }
        date = this.getNextDate(date)
    } while(sprintDaysCounter < sprintDays)

    return dates
  }

  getDateAfterSpecificDays = (date, days) => {
    const allSprintDates = this.getSprintDaysDates(date, days)

    return allSprintDates[allSprintDates.length - 1]
  }

}
