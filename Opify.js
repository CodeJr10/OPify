// find thumbnail
// add overlay
// add overlay to that thumbnail
const EXTENSION_NAME = chrome.runtime.getManifest().name;
const CLASS_NAME = EXTENSION_NAME.toLowerCase().replace(/\s+/g, "-"); // "opify"

function getThumbnails() {
  // Get all thumbnail images from the Main YouTube page
  const getThumbnailImages = document.querySelectorAll(
    "ytd-thumbnail a > yt-image > img.yt-core-image"
  );

  const allImages = [...Array.from(getThumbnailImages)];

  const targetAspectRatio = [16 / 9, 4 / 3];

  const allowErrorMargin = 0.02;

  // to avoid overlay on profile pictures, icons, reels etc and only focus on video thumbnails
  const filteredThumbnails = allImages.filter((image) => {
    // skip broken images
    if (image.height === 0) return false;

    const aspectRatio = image.width / image.height;

    // calculate to see whether the aspect ratio of image is within the target range of 16:9 or 4:3
    let isCorrectAspectRatio =
      Math.abs(aspectRatio - targetAspectRatio[0]) < allowErrorMargin ||
      Math.abs(aspectRatio - targetAspectRatio[1]) < allowErrorMargin;

    return isCorrectAspectRatio;
  });

  return filteredThumbnails.filter((image) => {
    const parent = image.parentElement;

    // check for video preview image
    const isVideoPreview =
      parent.closest("#video-preview") !== null ||
      parent.tagName == "YTD-MOVING-THUMBNAIL_RENDERER";

    // check for chapter thumbnail
    const isChapter = parent.closest("#endpoint") !== null;
  });
}
