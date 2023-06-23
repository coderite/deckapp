import PptxGenJS from 'pptxgenjs';
import axios from 'axios';

const sendDataToFirebaseFunction = payload => {
  return new Promise(async (resolve, reject) => {
    const endpoint =
      'https://us-central1-presentationcreator.cloudfunctions.net/operations-api/api/urlToBase64';
    try {
      const response = await axios.post(endpoint, payload);
      resolve(response.data);
    } catch (error) {
      console.error(
        `Error sending data to Firebase Function: ${error.message}`
      );
      reject(error);
    }
  });
};

// Maintain aspect ratio of images while resizing them to fit within a given width and height
function getAspectRatio(originalWidth, originalHeight, maxWidth, maxHeight) {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
  const newWidth = originalWidth * ratio;
  const newHeight = originalHeight * ratio;
  return { w: pixelsToInches(newWidth), h: pixelsToInches(newHeight) };
}

// convert the image dimensions from points to inches
function pointsToInches(points, pointsPerInch = 72) {
  return points / pointsPerInch;
}

// convert the image dimensions from pixels to points
function pixelsToPoints(value, pixelsPerInch = 96, pointsPerInch = 72) {
  return (value / pixelsPerInch) * pointsPerInch;
}

function pixelsToInches(value, pixelsPerInch = 96) {
  return value / pixelsPerInch;
}

export function createPresentation(title) {
  // Create a new presentation
  const pptx = new PptxGenJS();
  // Set presentation properties
  pptx.author = 'Lucas Sadilek';
  pptx.title = 'Sample Presentation';

  return pptx;
}

// Create a presentation with images and a bulleted list with aspect ratio maintained for the images
export async function createSlide(pptx, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const { tester, video, payment, widget, security, merchant, location } =
        data;

      console.log(`slot: ${JSON.stringify(data, null, 2)}`);

      const image1Url = payment;
      const image2Url = widget;
      const image3Url = security;

      console.log(image1Url, image2Url, image3Url);

      // Download the images and get their dimensions in pixels and aspect ratio in inches for PptxGenJS to use when adding the images to the slide
      console.log('downloading images...');
      const [image1, image2, image3] = await Promise.all([
        sendDataToFirebaseFunction({ image_url: image1Url }),
        sendDataToFirebaseFunction({ image_url: image2Url }),
        sendDataToFirebaseFunction({ image_url: image3Url }),
      ]);
      //const image1 = await downloadImageAsBase64(image1Url);
      console.log(`image1: ${image1.width} x ${image1.height}`);
      console.log(
        'image1: ' +
          JSON.stringify(
            getAspectRatio(
              image1.width,
              image1.height,
              image1.width,
              image1.height
            )
          )
      );
      //const image2 = await downloadImageAsBase64(image2Url);
      console.log(`image2: ${image2.width} x ${image2.height}`);
      console.log(
        'image2: ' +
          JSON.stringify(
            getAspectRatio(
              image2.width,
              image2.height,
              image1.width,
              image1.height
            )
          )
      );
      //const image3 = await downloadImageAsBase64(image3Url);
      console.log(`image3: ${image3.width} x ${image3.height}`);
      console.log(
        'image3: ' +
          JSON.stringify(
            getAspectRatio(
              image3.width,
              image3.height,
              image1.width,
              image1.height
            )
          )
      );

      // Specify the maximum dimensions for the images
      const maxWidth = 200;
      const maxHeight = 800;

      // Create a new slide
      const slide = pptx.addSlide();
      // Add images to the slide while maintaining their aspect ratios
      slide.addImage({
        data: image1.base64_image,
        x: pointsToInches(5),
        y: pointsToInches(5),
        ...getAspectRatio(image1.width, image1.height, maxWidth, maxHeight),
      });
      slide.addImage({
        data: image2.base64_image,
        x: pixelsToInches(maxWidth) + pointsToInches(10),
        y: pointsToInches(5),
        ...getAspectRatio(image2.width, image2.height, maxWidth, maxHeight),
      });
      slide.addImage({
        data: image3.base64_image,
        x: pixelsToInches(maxWidth) * 2 + pointsToInches(15),
        y: pointsToInches(5),
        ...getAspectRatio(image3.width, image3.height, maxWidth, maxHeight),
      });

      // Add a bulleted list
      const list = [
        { text: 'Merchant: ', options: { bold: true } },
        { text: merchant + '\n', options: { bold: false } },
        { text: 'Platform: ', options: { bold: true } },
        { text: 'Mobile iOS\n', options: { bold: false } },
        { text: 'State: ', options: { bold: true } },
        { text: location + '\n', options: { bold: false } },
        { text: 'Auditor: ', options: { bold: true } },
        { text: tester + '\n', options: { bold: false } },
      ];

      slide.addText(list, {
        x: pointsToInches(480),
        y: pointsToInches(91),
        w: pointsToInches(225),
        h: pointsToInches(150),
        fontSize: 14,
      });

      // EX: Hyperlink: Web
      slide.addText(
        [
          {
            text: 'video link',
            options: {
              hyperlink: {
                url: video,
                tooltip: 'see video',
              },
            },
          },
        ],
        {
          x: pointsToInches(5),
          y: pointsToInches(350),
          w: pointsToInches(500),
          h: pointsToInches(50),
        }
      );

      resolve(slide);
    } catch (error) {
      console.log(
        'there is an error in createSlide: ',
        error.message,
        'data: ',
        data
      );
      reject(error);
      //throw error;
    }
  });
}

export function writePresentiationToFile(pptx) {
  console.log('writing presentation to file...');
  // Save the presentation
  pptx.writeFile({ fileName: 'slides.pptx' }).then(blob => {
    //saveAs(blob, 'slides.pptx');
    console.log('PPTX file with images and aspect ratio maintained created!');
  });
}
