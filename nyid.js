import fetch from 'node-fetch'
import dateFormat from 'dateformat';
import { setTimeout } from "timers/promises";

async function findSchedule() {
    const requestHeaders = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "ackrefid": "",
        "browser_token": "ZTVlNDhlOGU5OWJlMGY2ZTAxOTZlOWQxOWMxMDFiYjA=",
        "content-type": "application/json",
        "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "userid": "ZjQzYWQ4MzYtZjI3Zi00NzcxLWI3NTItNjNiMzZjYWI3MDE0",
        "x-idnyc-recaptchav3-token": "",
        "x-idnyc-user-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFkbWluIiwicm9sZSI6IlB1YmxpYyIsIm5iZiI6MTY2OTEwMDYzOSwiZXhwIjoxNjY5MTA0MjM5LCJpYXQiOjE2NjkxMDA2MzksImlzcyI6ImEwNjktaWRueWNvbmxpbmVwb3J0YWwubnljLmdvdiIsImF1ZCI6Imh0dHBzOi8vbXNwd3ZhLWhyYW1pcDEwLmNzYy5ueWNuZXQvSU9QV2ViU2VydmljZVNlY3VyaXR5LyJ9.oyPxftCjmjxdAGp3bjleHGrDVBqT2BvJgXZ_gvPyg9Y",
        "cookie": "RT=\"z=1&dm=nyc.gov&si=cfpulrtuuio&ss=larv7nnv&sl=0&tt=0\"; WT_FPC=id=979903de-ac26-4720-8181-d77e1fad3bb8:lv=1669100633324:ss=1669100281802",
        "Referer": "https://a069-idnyconlineportal.nyc.gov/IOPWeb/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }

    const date = new Date();

    const startTimes = [
        'Morning','Afternoon','Evening',
        '8:00 AM','8:20 AM','8:40 AM','9:00 AM','9:20 AM','9:40 AM','10:00 AM',
        '10:20 AM','10:40 AM','11:00 AM','11:20 AM','11:40 AM','12:00 PM','12:20 PM',
        '12:40 PM','1:00 PM','1:20 PM','1:40 PM','2:00 PM','2:20 PM','2:40 PM','3:00 PM',
        '3:20 PM','3:40 PM','4:00 PM','4:20 PM','4:40 PM','5:00 PM',
    ]

    const numOfDays = 60
    for (let dayIndex = 0; dayIndex < numOfDays; dayIndex++) {

        date.setDate(date.getDate() + dayIndex);

        const requestBody = JSON.parse("{\"boroughs\":[\"1\",\"2\",\"3\",\"4\",\"5\"],\"enrollmentCenters\":[\"995\",\"3191\",\"3197\",\"3150\",\"3201\",\"3213\",\"3179\",\"3223\",\"3199\",\"3245\",\"3253\",\"3217\",\"3264\",\"999\"],\"opRequestId\":\"\"}")
        
        requestBody["startDate"] = dateFormat(date, "mm/dd/yyyy").toString();

        for (let startTime of startTimes) {
            requestBody["startTime"] = startTime

            const resp = await fetch("https://a069-idnyconlineportal.nyc.gov/IOPWebServices/api/AppointmentApi/GetAvailableTimeSlots", {
                "headers": requestHeaders,
                "body": JSON.stringify(requestBody),
                "method": "POST"
            });

            const data = await resp.json();

            if (data.responseStatusDto && data.responseStatusDto.message && data.responseStatusDto.message == "Many Request From this Client") {
                console.log("Too many requests to server, stopping script!")
                return;
            }
            
            if (data.responseDataDto && data.responseDataDto.data && data.responseDataDto.data['$values'] && data.responseDataDto.data['$values'].length > 0) {
                console.log("--------> Found a date for " + requestBody["startDate"] + " at " + requestBody["startTime"])
            } else {
                // console.log("Nothing found for " + requestBody["startDate"] + " at " + requestBody["startTime"])
            }
            
            // Wait 5 seconds after checking a day for all times
            await setTimeout(5000);
        }
    }
}

findSchedule();