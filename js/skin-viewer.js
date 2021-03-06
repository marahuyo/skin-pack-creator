import alertModal from './alert-modal.js';

/**
 * Generate the front-view of the right/left arm.
 *
 * @ignore
 * @param {HTMLImageElement} image
 * @param {CanvasRenderingContext2D} context
 * @param {number} resolutionFactor
 * @param {number} armWidth
 * @param {boolean} isLowRes
 * @param {boolean} isRight
 */
function generateArm(
  image,
  context,
  resolutionFactor,
  armWidth,
  isLowRes,
  isRight,
) {
  const sh = 24 * resolutionFactor;
  const dx = isRight ? 0 : 16 * resolutionFactor + armWidth;
  const dy = 16 * resolutionFactor;

  isRight = isRight || isLowRes;

  context.drawImage(
    image,
    (isRight ? 88 : 72) * resolutionFactor,
    (isRight ? 40 : 104) * resolutionFactor,
    armWidth,
    sh,
    dx,
    dy,
    armWidth,
    sh,
  );

  context.drawImage(
    image,
    (isRight ? 88 : 104) * resolutionFactor,
    (isRight ? 72 : 104) * resolutionFactor,
    armWidth,
    sh,
    dx,
    dy,
    armWidth,
    sh,
  );
}

/**
 * Generate the front-view of the right/left leg.
 *
 * @ignore
 * @param {HTMLImageElement} image
 * @param {CanvasRenderingContext2D} context
 * @param {number} resolutionFactor
 * @param {number} armWidth
 * @param {boolean} isLowRes
 * @param {boolean} isRight
 */
function generateLeg(
  image,
  context,
  resolutionFactor,
  armWidth,
  isLowRes,
  isRight,
) {
  const sw = 8 * resolutionFactor;
  const sh = 24 * resolutionFactor;
  const dx = armWidth + (isRight ? 0 : sw);
  const dy = 40 * resolutionFactor;

  isRight = isRight || isLowRes;

  context.drawImage(
    image,
    (isRight ? 8 : 40) * resolutionFactor,
    (isRight ? 40 : 104) * resolutionFactor,
    sw,
    sh,
    dx,
    dy,
    sw,
    sh,
  );

  context.drawImage(
    image,
    8 * resolutionFactor,
    (isRight ? 72 : 104) * resolutionFactor,
    sw,
    sh,
    dx,
    dy,
    sw,
    sh,
  );
}

/**
 * Generates the front-view of a Minecraft skin.
 *
 * @static
 * @class SkinViewer
 */
class SkinViewer {
  /**
   * Retrieves image format of a Minecraft skin.
   *
   * @static
   * @param {HTMLImageElement} image
   * @return {'HD'|'SD'|'LD'|''}
   * @memberof SkinViewer
   */
  static getImageFormat(image) {
    if (image.width === 64 && image.height === 32) {
      return 'LD';
    } else if (image.width === 128 && image.height === 128) {
      return 'HD';
    } else if (image.width === 64 && image.height == 64) {
      return 'SD';
    }

    return '';
  }

  /**
   * Generates the front-view of a Minecraft skin.
   *
   * @static
   * @param {string} address
   * @param {string} type
   * @return {Promise<string|Error>}
   * @memberof SkinViewer
   */
  static generate(address, type) {
    const image = new Image();
    image.src = address;

    return new Promise((resolve, reject) => {
      image.addEventListener("load", () => {
        const format = this.getImageFormat(image);

        if (!format) {
          return reject(new Error('Invalid skin format.'));
        }

        const canvas = document.createElement("canvas");
        const resolutionFactor = format === 'HD' ? 1 : 0.5;
        const armWidth = (type === "slim" ? 6 : 8) * resolutionFactor;
        const resized40 = 40 * resolutionFactor;
        const resized24 = 24 * resolutionFactor;
        const resized16 = 16 * resolutionFactor;

        canvas.width = resized16 + armWidth * 2;
        canvas.height = 24 * 2 * resolutionFactor + resized16;

        const context = canvas.getContext("2d");
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        // Front-view of head
        context.drawImage(
          image,
          resized16,
          resized16,
          resized16,
          resized16,
          armWidth,
          0,
          resized16,
          resized16,
        );

        context.drawImage(
          image,
          80 * resolutionFactor,
          resized16,
          resized16,
          resized16,
          armWidth,
          0,
          resized16,
          resized16,
        );

        // Front-view of torso
        context.drawImage(
          image,
          resized40,
          resized40,
          resized16,
          resized24,
          armWidth,
          resized16,
          resized16,
          resized24,
        );

        context.drawImage(
          image,
          resized40,
          72 * resolutionFactor,
          resized16,
          resized24,
          armWidth,
          resized16,
          resized16,
          resized24,
        );

        // Other parts
        const isLowRes = format === 'LD';

        generateArm(image, context, resolutionFactor, armWidth, isLowRes, true);

        generateArm(
          image,
          context,
          resolutionFactor,
          armWidth,
          isLowRes,
          false,
        );

        generateLeg(image, context, resolutionFactor, armWidth, isLowRes, true);

        generateLeg(
          image,
          context,
          resolutionFactor,
          armWidth,
          isLowRes,
          false,
        );

        resolve(canvas.toDataURL());
      });
    });
  }
}

export default SkinViewer;
