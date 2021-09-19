import {Inject, Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {take} from 'rxjs/operators'

import { isDevOrQA } from '../utils'
import { constants } from '../constants'
import members from '../mocks/members'


@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly membersUrl = 'https://api.hibob.com/v1/people'

  private headers = {
    ...new HttpHeaders({
      'Authorization': constants.hibobToken,
      'Accept': 'application/json'
    }),
  }

  constructor(
    @Inject(HttpClient) private http: HttpClient,
  ) {}

  getMembers(): Observable<any> {
    // this.headers['Authorization'] = constants.hibobToken
    // this.headers['Accept'] = 'application/json'
    console.log(this.headers)

    return this.http.get<any>(this.membersUrl, this.headers).pipe(take(1))
  }

  getMembersMock() {
    return this.filterDevsAndQA(members.employees)
  }

  filterDevsAndQA(members) {
    return members.filter(isDevOrQA)
  }
}
