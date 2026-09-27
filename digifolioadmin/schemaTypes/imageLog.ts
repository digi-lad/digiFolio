export default {
  name: 'imageLog',
  title: 'Image Log Entry',
  type: 'document',
  fields: [
    {
      name: 'filename',
      title: 'Title / Caption',
      type: 'string',
    },
    {
      name: 'type',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' }
        ],
        layout: 'radio'
      },
      initialValue: 'image'
    },
    {
      name: 'url',
      title: 'External Media URL (Cloudinary)',
      type: 'url',
    },
    {
      name: 'uploadedMedia',
      title: 'Upload New Image (Optional, for future)',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'date',
      title: 'Date Captured',
      type: 'date',
    },
  ],
}
