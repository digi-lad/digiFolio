export default {
  name: 'researchProject',
  title: 'Research Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Paper Title / Name', type: 'string' },
    { name: 'field', title: 'Field of Study', type: 'string' },
    { name: 'date', title: 'Date / Year', type: 'string' },
    { name: 'abstract', title: 'Abstract', type: 'text' },
    {
      name: 'methodology',
      title: 'Methodology',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'keyFindings',
      title: 'Key Findings',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'resources',
      title: 'Resources (Links)',
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
