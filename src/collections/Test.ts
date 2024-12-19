import type { CollectionConfig, FilterOptionsProps } from 'payload'
import type { Test as TestCollection } from '@payload-types'

interface TestCollectionWithFilter extends TestCollection {
  filter: 'users'
}

export const Test: CollectionConfig = {
  slug: 'test',
  access: {
    read: () => true,
  },
  hooks: {
    // enrich the document with a filter property
    // reproduce with: select user, select again until filter is undefined
    afterRead: [
      ({ doc }) => {
        return {
          ...doc,
          filter: 'users',
        }
      },
    ],
    // beforeRead fails as well
    // beforeRead: [
    //   ({ doc }) => {
    //     return {
    //       ...doc,
    //       filter: 'users',
    //     }
    //   },
    // ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: ({ data, relationTo }: FilterOptionsProps<TestCollectionWithFilter>) => {
        // filter is undefined after saving the document
        console.log('DATA FILTER', data.filter)

        return relationTo === data.filter

        // works:
        //return relationTo === 'users'
      },
    },
  ],
}
