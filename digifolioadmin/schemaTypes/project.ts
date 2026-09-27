export default {
  name: 'project',
  title: 'Portfolio Project',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Project Name / Title',
      type: 'string',
    },
    {
      name: 'type',
      title: 'Project Type / Field (e.g. Web Application, Machine Learning)',
      type: 'string',
    },
    {
      name: 'status',
      title: 'Status (e.g. COMPLETED, ACTIVE)',
      type: 'string',
    },
    {
      name: 'timeframe',
      title: 'Timeframe / Date',
      type: 'string',
    },
    {
      name: 'bootSequence',
      title: 'Boot Sequence / Abstract (Description)',
      type: 'text',
    },
    {
      name: 'sysSpecs',
      title: 'System Specs / Methodology',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'buildLog',
      title: 'Build Log / Key Findings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'desc', title: 'Description', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'accessPoints',
      title: 'Access Points / Resources (Links)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label (e.g. Web App, GitHub)', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    },
    {
      name: 'images',
      title: 'Project Images / Media',
      type: 'array',
      of: [
        {
          type: 'image',
          name: 'uploadedImage',
          title: 'Upload New Image',
          options: { hotspot: true },
          fields: [
            {
              name: 'filename',
              title: 'Caption / Filename',
              type: 'string',
            },
          ],
        },
        {
          type: 'object',
          name: 'externalMedia',
          title: 'External URL (Cloudinary Video/Image)',
          fields: [
            { name: 'filename', title: 'Caption / Filename', type: 'string' },
            { name: 'url', title: 'Media URL', type: 'url' },
          ],
        },
      ],
    },
  ],
}
