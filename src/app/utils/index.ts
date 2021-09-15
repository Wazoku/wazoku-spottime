import { from } from 'rxjs'
import { constants } from '../constants';


export const makeRequest = (url) => from(fetch(url, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Authorization': constants.hibobToken,
        // mode: 'no-cors',
        // 'Access-Control-Allow-Origin': 'https://api.hibob.com/v1',
    }
}));

export const isDevOrQA = member => {
    const { work: {department, title} } = member

    return (
        (department === 'Development' && !title.includes('Director'))
        || title.includes('QA')
    )
}

export const isDev = member => {
  const { work: {department, title} } = member

  return department === 'Development' && !title.includes('Director')
}

export const isQA = member => {
  const { work: {department, title} } = member

  return title.includes('QA')
}
