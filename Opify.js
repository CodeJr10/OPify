const EXTENSION_NAME = chrome.runtime.getManifest().name;
const CLASS_NAME = EXTENSION_NAME.toLowerCase().replace(/\s+/g, "-"); // "opify"
const IMAGES_FOLDER = "images/";
const luffyArray = [
  "luffy1.png",
  "luffy2.png",
  "luffy3.png",
  "luffy4.png",
  "luffy5.png",
  "luffy6.png",
  "luffy7.png",
  "luffy8.png",
  "luffy9.png",
];
const Luffy_IMAGES_PATH = luffyArray.map((file) => IMAGES_FOLDER + file);
// fetch thumbnails
function getThumbnails() {
  // Get all thumbnail images from the Main YouTube page
  const getThumbnailImages = document.querySelectorAll(
    "ytd-thumbnail a > yt-image > img.yt-core-image"
  );
  console.log("getThumbnailImages", getThumbnailImages);

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
  overlayImage.style.bottom = "5px";
  overlayImage.style.right = "5px";
  overlayImage.style.width = "auto";
  overlayImage.style.height = "auto";
  overlayImage.style.maxWidth = "25%";
  overlayImage.style.maxHeight = "25%";
  overlayImage.style.zIndex = "2";

  const parent = thumbnailElement.parentElement;
  parent.style.position = "relative";

  thumbnailElement.parentElement.insertBefore(
    overlayImage,
    thumbnailElement.nextSibling
  );
}

// Looks for thumbnails to apply overlay
function applyOverlayOverThumbnails() {
  const thumbnailElements = getThumbnails();
  console.log("Thumbnails found:", thumbnailElements.length);

  thumbnailElements.forEach((thumbnailElement) => {
    // select a random image from the Luffy images array
    const randomImage =
      Luffy_IMAGES_PATH[Math.floor(Math.random() * Luffy_IMAGES_PATH.length)];

    // generate the full URL for the random image
    // using chrome.runtime.getURL to ensure the correct path is used
    const randomImageURL = chrome.runtime.getURL(randomImage);
    applyOverlay(thumbnailElement, randomImageURL);
  });
}

// async function lookForImage(filename) {
//   const testUrl = getImageURL(filename);

//   return fetch(testUrl)
//     .then(() => {
//       return true;
//     })
//     .catch((error) => {
//       return false;
//     });
// }

// only run the script if the extension is enabled
chrome.storage.local.get({ isExtensionEnabled: true }, (data) => {
  if (data.isExtensionEnabled) {
    setTimeout(() => {
      applyOverlayOverThumbnails();
    }, 1500);
  } else {
    console.log("Opify is disabled");
  }
});

//  What are we doing here?
// We observe every element (thumbnail container) and find the target thumbnail container (intersection observer)
// 1. We are observing the last thumbnail container for new videos loaded by infinite scroll.
// 2. When the last container is intersected (enters the viewport), we will apply the overlay to new thumbnails that are loaded.
// 3. We will readjust the last container to the new last container after applying the overlay.
// 4. We will repeat the process.
// prettier-ignore
const getContainer = () => 
document.querySelectorAll("ytd-rich-item-renderer");

// to find the last container element on page load
const getLastContainer = () => {
  if (getContainer.length > 0) {
    return getContainer[getContainer.length - 1];
  }
};

const observerOptions = {
  root: null,
  rootMargin: "0px 0px 300px 0px",
  threshold: 0.1,
};

function observeContainer(entries) {
  entries.forEach((entry) => {
    // browser checks if the intersectionRatio (predefined by browser) is greater than threshold defined by you and if it surpasses it, isIntersecting will be true.
    if (entry.isIntersecting) {
      applyOverlayOverThumbnails();

      console.log("New thumbnails loaded, applying overlay...");

      // After applying the overlay, we need to observe the next container
      observer.unobserve(entry.target);

      setTimeout(() => {
        const newLastContainer = getLastContainer();
        // when the scroll is too fast or the dom hasn't loaded yet, the newLastContainer can be null
        if (newLastContainer) {
          observer.observe(newLastContainer);
        }
      }, 500);
    }
  });
}

const observer = new IntersectionObserver(observeContainer, observerOptions);

// to observe the last container on first page load is a must
observer.observe(getLastContainer());

// Problems to solve:
// 1. Some images don't render properly. They appear in the center, sometimes too big.
// 2. To save the current charcter option and only apply that to the new thumnnail
// 3. Overlays don't render on new videos loaded by infinite scroll.
