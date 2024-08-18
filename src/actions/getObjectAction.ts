import { PassThrough } from 'stream'

import { ObjectParser } from '../stream'
import { IRetsObjectOptions, IRetsRequestConfig } from '../types'
import { executeCall } from '../utils'

export const getObjectAction =
  (propsActionConfig: IRetsRequestConfig) =>
  async (userOptions: IRetsObjectOptions): Promise<Array<any>> => {
    const {
      mime,
      resource,
      type,
      contentId,
      id = '*',
      withLocation,
      culture,
    } = {
      ...userOptions,
    }

    const actionConfig = {
      ...propsActionConfig,
    }

    const data = {
      Resource: resource,
      Type: type,
      ID: (Array.isArray(contentId) ? contentId : [contentId])
        .map((contentItem) => `${contentItem}:${id || '*'}`)
        .join(','),
      Location: withLocation ? 1 : 0,
      // Culture: culture,
    }

    const headers = {
      Accept: mime || 'image/jpeg',
    }

    const { stream, headers: responseHeaders } = await executeCall(actionConfig, data, headers)

    const isMultipart = /multipart/.test(responseHeaders['content-type'] || '')
    const boundaryMatches = responseHeaders['content-type']?.match(/boundary=([^;]+);?/)
    const boundary =
      isMultipart && boundaryMatches?.[1] ? Buffer.from(boundaryMatches[1]) : Buffer.from('')
    const boundaryPrefix = Buffer.from('--')

    const objectParser = new ObjectParser({
      boundary,
      boundaryPrefix,
    })
    const outputStream = new PassThrough()

    stream.pipe(objectParser)

    // wait for stream to end before returning collected objects
    await new Promise((fulfill) => objectParser.on('close', fulfill))

    return objectParser.objects
  }
