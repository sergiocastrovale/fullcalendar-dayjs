import dayjs from 'dayjs'
import { createPlugin, CalendarApi } from '@fullcalendar/common'

export function toMoment(date, calendar) {
  if (!(calendar instanceof CalendarApi)) {
    throw new Error('must supply a CalendarApi instance')
  }

  let { dateEnv } = calendar.getCurrentData()

  return convertToMoment(
    date,
    dateEnv.timeZone,
    null,
    dateEnv.locale.codes[0],
  )
}

export function toMomentDuration(fcDuration) {
  // moment accepts all the props that fc.Duration already has!
  return dayjs.duration(fcDuration)
}

function formatWithCmdStr(cmdStr, arg) {
  let cmd = parseCmdStr(cmdStr)

  if (arg.end) {
    let startMom = convertToMoment(
      arg.start.array,
      arg.timeZone,
      arg.start.timeZoneOffset,
      arg.localeCodes[0],
    )
    let endMom = convertToMoment(
      arg.end.array,
      arg.timeZone,
      arg.end.timeZoneOffset,
      arg.localeCodes[0],
    )
    return formatRange(
      cmd,
      createMomentFormatFunc(startMom),
      createMomentFormatFunc(endMom),
      arg.defaultSeparator,
    )
  }

  return convertToMoment(
    arg.date.array,
    arg.timeZone,
    arg.date.timeZoneOffset,
    arg.localeCodes[0],
  ).format(cmd.whole)
}

export default createPlugin({
  cmdFormatter: formatWithCmdStr,
})

function createMomentFormatFunc(mom) {
  return (cmdStr) => (
    // because calling with blank string results in ISO8601 :(
    cmdStr ? mom.format(cmdStr) : ''
  )
}

function convertToMoment(input, timeZone, timeZoneOffset, locale) {
  let mom;

  if (timeZone === 'local') {
    mom = dayjs(input)
  } else if (timeZone === 'UTC') {
    mom = dayjs.utc(input)
  } else if ((moment).tz) {
    mom = (moment).tz(input, timeZone)
  } else {
    mom = dayjs.utc(input)

    if (timeZoneOffset != null) {
      mom.utcOffset(timeZoneOffset)
    }
  }
console.log('convertToMoment');
  mom.locale(locale)

  return mom
}

function parseCmdStr(cmdStr) {
  let parts = cmdStr.match(/^(.*?)\{(.*)\}(.*)$/)

  if (parts) {
    let middle = parseCmdStr(parts[2])

    return {
      head: parts[1],
      middle,
      tail: parts[3],
      whole: parts[1] + middle.whole + parts[3],
    }
  }

  return {
    head: null,
    middle: null,
    tail: null,
    whole: cmdStr,
  }
}

function formatRange(cmd, formatStart, formatEnd, separator) {
  if (cmd.middle) {
    let startHead = formatStart(cmd.head)
    let startMiddle = formatRange(cmd.middle, formatStart, formatEnd, separator)
    let startTail = formatStart(cmd.tail)

    let endHead = formatEnd(cmd.head)
    let endMiddle = formatRange(cmd.middle, formatStart, formatEnd, separator)
    let endTail = formatEnd(cmd.tail)

    if (startHead === endHead && startTail === endTail) {
      return startHead +
        (startMiddle === endMiddle ? startMiddle : startMiddle + separator + endMiddle) +
        startTail
    }
  }

  let startWhole = formatStart(cmd.whole)
  let endWhole = formatEnd(cmd.whole)

  if (startWhole === endWhole) {
    return startWhole
  }

  return startWhole + separator + endWhole
}
