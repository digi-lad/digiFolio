interface MediaItem {
  filename: string;
  url: string;
  type?: 'image' | 'video';
}

// Helper function to detect media type from file extension
export const detectMediaType = (item: MediaItem): 'image' | 'video' => {
  if (item.type) {
    return item.type;
  }
  
  const urlLower = (item.url || '').toLowerCase();
  const filenameLower = (item.filename || '').toLowerCase();
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.avi'];
  
  const hasVideoExtension = videoExtensions.some(ext => 
    urlLower.endsWith(ext) || filenameLower.endsWith(ext)
  );
  
  return hasVideoExtension ? 'video' : 'image';
};