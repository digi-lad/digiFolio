export default {
  name: 'profile',
  title: 'Profile & Settings',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'education', title: 'Education', type: 'string' },
    { name: 'sat', title: 'SAT', type: 'string' },
    { name: 'ielts', title: 'IELTS', type: 'string' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'avatarUrl', title: 'Avatar URL', type: 'url' },
    { name: 'resumeUrl', title: 'Resume PDF URL (Legacy)', type: 'url' },
    {
      name: 'resumes',
      title: 'Resumes / CVs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'type', title: 'CV Type (e.g., General, SWE, Research)', type: 'string' },
            { name: 'file', title: 'Upload PDF File (Recommended for native viewer)', type: 'file', options: { accept: 'application/pdf' } },
            { name: 'url', title: 'External PDF URL (Fallback, e.g. Google Drive)', type: 'url' }
          ]
        }
      ]
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'filename', title: 'Filename', type: 'string' },
            { name: 'url', title: 'Image/Video URL', type: 'url' }
          ]
        }
      ]
    },
    {
      name: 'contactChannels',
      title: 'Contact Channels',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', title: 'ID', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'icon', title: 'Icon Name', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'type', title: 'Type', type: 'string', options: { list: [{title: 'Copy', value: 'copy'}, {title: 'Link', value: 'link'}] } },
            { name: 'url', title: 'URL', type: 'url' }
          ]
        }
      ]
    },
    {
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', title: 'Year', type: 'string' },
            { name: 'month', title: 'Month', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'awardedBy', title: 'Awarded By', type: 'string' },
            { name: 'tag', title: 'Tag', type: 'string', options: { list: ['National', 'Sub-national', 'Provincial', 'International'] } },
            { name: 'highlighted', title: 'Highlighted', type: 'boolean' }
          ]
        }
      ]
    }
  ]
}
