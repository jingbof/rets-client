import parser from 'fast-xml-parser'
import { RetsKeys } from 'types/RetsKeys'

const parseOptions = {
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: false,
  cdataTagName: '__cdata', // default is 'false'
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false, // "strict"
}

export const parseRetsResponse = (data: any, headers?: any) => {
  // console.log('parseRetsResponse')

  const parsed = parser.parse(data, parseOptions)
  // console.log('parsed', parsed)
  // console.log('data', parsed.RETS['METADATA-TABLE'])
  // if (parsed[RetsKeys.Rets][RetsKeys.Status]) {
  //   throw new Error(`${parsed[RetsKeys.Rets][RetsKeys.Status]['@_ReplyText']}::${parsed[RetsKeys.Rets][RetsKeys.Status]['@_ReplyText']}`)
  // }

  return parsed
}
