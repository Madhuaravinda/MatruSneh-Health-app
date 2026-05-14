/**
 * Robust file downloader utility for WebViews and standard browsers.
 * Replaces direct window.open or doc.save() which can fail in certain mobile wrappers.
 */
export async function downloadFile(blob: Blob, filename: string) {
  try {
    // 1. Primary Method: Standard anchor download (The "WhatsApp" way - direct to storage)
    // This is what triggers the native download manager on Android Chrome and most WebViews.
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup with a slight delay for mobile browsers
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      // Revoke later to ensure the browser has finished starting the download
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    }, 500);

    console.log("Direct download triggered for:", filename);
  } catch (error) {
    console.error("Direct download failed:", error);
    
    // Fallback: If direct method fails, try navigator.share if available
    if (navigator.share) {
      try {
        const file = new File([blob], filename, { type: blob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: filename,
            text: 'Report'
          });
        }
      } catch (shareError) {
        console.warn("Silent share fallback failed", shareError);
      }
    }
  }
}
