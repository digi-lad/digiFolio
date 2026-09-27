export default {
  name: 'leadershipProject',
  title: 'Leadership Project',
  type: 'document',
  fields: [
    { name: 'project', title: 'Project Name', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'status', title: 'Status', type: 'string' },
    { name: 'timeframe', title: 'Timeframe', type: 'string' },
    { name: 'directives', title: 'Directives (Description)', type: 'text' },
    {
      name: 'kernelLog',
      title: 'Kernel Log / Timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', title: 'Date', type: 'string' },
            { name: 'action', title: 'Action / Title', type: 'string' },
            { name: 'desc', title: 'Description', type: 'text' }
          ]
        }
      ]
    },
    {
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'accessPoints',
      title: 'Access Points (Links)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' }
          ]
        }
      ]
    },
    {
      name: 'images',
      title: 'Images / Media',
      type: 'array',
      of: [
        {
          type: 'image',
          name: 'uploadedImage',
          title: 'Upload New Image',
          options: { hotspot: true },
          fields: [{ name: 'filename', title: 'Caption / Filename', type: 'string' }],
        },
        {
          type: 'object',
          name: 'externalMedia',
          title: 'External URL (Cloudinary)',
          fields: [
            { name: 'filename', title: 'Caption / Filename', type: 'string' },
            { name: 'url', title: 'Media URL', type: 'url' },
          ],
        },
      ],
    }
  ]
}
