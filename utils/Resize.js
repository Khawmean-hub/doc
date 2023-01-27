// Resize.js

const sharp = require('sharp');
const uuid = require('uuid');

class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = Resize.filename();
    await sharp(buffer)
      .resize(800, 800, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      }).rotate()
      .toFile(process.env.IMG_PATH+'/'+filename);
    
    return filename;
  }
  static filename() {
    return `${uuid.v4()}.png`;
  }

}
module.exports = Resize;