const EXTENSION_NAME = chrome.runtime.getManifest().name;
const CLASS_NAME = EXTENSION_NAME.toLowerCase().replace(/\s+/g, "-"); // "opify"
const IMAGES_PATH = "images/";

// fetch thumbnails
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
      parent.tagName == "YTD-MOVING-THUMBNAIL-RENDERER";

    // check for chapter thumbnail
    const isChapter = parent.closest("#endpoint") !== null;
    // check if the thumbnail has already been processed
    const isAlreadyProcessed = Array.from(parent.children).filter((child) => {
      const alreadyHasAOverlay = child.classList.contains(CLASS_NAME);

      return alreadyHasAOverlay || isVideoPreview || isChapter;
    });

    return isAlreadyProcessed.length == 0;
  });
}

function applyOverlay(thumbnailElement, overlayImageURL) {
  const overlayImage = document.createElement("img");
  overlayImage.classList.add(CLASS_NAME);
  overlayImage.src = overlayImageURL;

  // styling
  overlayImage.style.position = "absolute";
  overlayImage.style.top = overlayImage.style.left = "50%";
  overlayImage.style.width = "100%";
  overlayImage.style.transform = `translate(-50%, -50%)`;
  overlayImage.style.zIndex = "0";

  const parent = thumbnailElement.parentElement;
  parent.style.position = "relative";

  // insert the parent thumbnail img before the overlay
  thumbnailElement.parentElement.insertBefore(
    overlayImage,
    thumbnailElement.nextSibling
  );
}

function getImageURL(filename) {
  return chrome.runtime.getURL(`${IMAGES_PATH}${filename}`);
}
// Looks for thumbnails to apply overlay
function applyOverlayOverThumbnails() {
  const thumbnailElements = getThumbnails();

  thumbnailElements.forEach((thumbnailElement) => {
    // const loops = Math.random() > 0.001 ? 1 : 20;
    const overlayImageURL = getImageURL("luffy1.png");
    applyOverlay(thumbnailElement, overlayImageURL);
  });
}
// Run when page has fully loaded
window.addEventListener("load", applyOverlayOverThumbnails);
