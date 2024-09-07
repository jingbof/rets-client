# Typescript RETS Client

A **RETS (Real Estate Transaction Standard) Client** written in TypeScript, providing seamless access to real estate data. This repo is **forked from [aeq/rets-client](https://github.com/aequilibrium/rets-client)** and extended to support **REBGV (Real Estate Board of Greater Vancouver)** along with additional features like object location retrieval and handling multiple objects in a single request.

## Installation

Install via Yarn:

```bash
yarn add jingbof/rets-client
````

Or install via NPM:

```bash
npm i jingbof/rets-client
````
## New Features
**1. REBGV Compatibility**

Extended support for Real Estate Board of Greater Vancouver (REBGV), ensuring seamless integration for this region's data.

**2. Location Support for Objects**

The getObject method now includes location support, allowing for direct retrieval of location data when available.

**3. Multiple Objects in Single Request**

You can now request multiple objects (e.g., multiple images) in a single request for better performance and easier handling.

## Usage

```typescript
import { getClient, RetsMetadataType, ReturnType } from 'jingbof/rets-client';

const config = {
  url: 'my-rets-url',
  username: 'my-rets-username',
  password: 'my-rets-password',
}

await getClient(config, async ({ search, getMetadata, getDataMap, getObject }) => {

  // Retrieve Metadata
  const resources = await getMetadata({ type: RetsMetadataType.Resource });
  console.log('Metadata - Resources:', resources);

  const classes = await getMetadata({ type: RetsMetadataType.Class });
  console.log('Metadata - Classes:', classes);

  // Build a Datamap of the RETS Data Structure
  const dataMap = await getDataMap();
  console.log('Data Map:', dataMap);

  // Search for listings
  const listings = await search({
    query: '(Status=A)',
    limit: 5,
    searchType: 'Property',
    className: 'ResidentialProperty',
    culture: DdfCulture.EN_CA,
  });
  console.log('Listings:', listings);

  // Stream data for large searches
  let count = 0;
  const searchStream = (
    (await search({
      query: '(Status=A)',
      limit: 5,
      searchType: 'Property',
      className: 'ResidentialProperty',
      culture: DdfCulture.EN_CA,
      returnType: ReturnType.Stream,
    })) as Readable
  )
    .pipe(new Writable({
      objectMode: true,
      write: (data, _, done) => {
        count += 1;
        done();
      },
    }));

  await new Promise((resolve) => searchStream.on('close', resolve));
  console.log('Total Count:', count);

  // Retrieve photos or objects, with location support and handling multiple objects
  const objects = await getObject({
    resource: 'Property',
    type: 'Photo',
    contentId: '262937723',
    withLocation: true,
  });

  const dir = 'tests';
  fs.mkdirSync(dir, { recursive: true });
  objects.forEach((obj) => {
    if (obj.contentType === 'image/jpeg') {
      fs.writeFileSync(`${dir}/${obj.objectId}.jpg`, obj.data);
    } else if (obj.contentType === 'text/xml') {
      console.log('Object Location:', obj.location);
    }
  });
});
```

## Development/Configuration

For development, you can test the client by configuring the environment variables in your `.env` file:

```env
RETS_TEST_URL=http://example-rets-url.com
RETS_TEST_USERNAME=your-username
RETS_TEST_PASSWORD=your-password
```
Run the test file with: 
```bash
yarn start
```

## Acknowledgements

Forked from: [aeq/rets-client](https://github.com/aeq/rets-client)
