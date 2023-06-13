const path = require('path');
const os = require('os');
const fs = require('fs');
const sharp = require('sharp');
const FormData = require('form-data');
const form = new FormData();
const fetch = require('node-fetch');
const Busboy = require('busboy');

const API_URL = '';
const DESIRED_RESIZE_OUTPUTS = [1024, 800];

const _generateResizedImages = async (originalImage, uploadedFilePath, form) => {
  const originalFileName = uploadedFilePath.split('.')[0];
  const imageFormat = uploadedFilePath.split('.')[1];
  let resizedImagePaths = [];
  for(let desiredOutput of DESIRED_RESIZE_OUTPUTS) {
    const resizedImagePath = `${os.tmpdir()}/${originalFileName}-${desiredOutput}.${imageFormat}`;
    await sharp(originalImage).resize(desiredOutput).toFile(resizedImagePath);
    resizedImagePaths.append(resizedImagePath);
    form.append('images', fs.createReadStream(resizedImagePath));
  }
  return resizedImagePaths;
}

exports.resizeImage = async (req, res) => {
  if (req.method !== 'POST') {
    // Return a "method not allowed" error
    return res.status(405).end();
  }
  const busboy = Busboy({headers: req.headers});
  const tmpdir = os.tmpdir();

  const fields = {};

  let uploadedFilePath = '';

  const fileWrites = [];

  busboy.on('field', (fieldname, val) => {
    fields[fieldname] = val;
  });

  busboy.on('file', async (fieldname, file, {filename}) => {
    uploadedFilePath = path.join(tmpdir, filename);
    const writeStream = fs.createWriteStream(uploadedFilePath);
    file.pipe(writeStream);

    const promise = new Promise((resolve, reject) => {
      file.on('end', () => {
        writeStream.end();
      });
      writeStream.on('close', resolve);
      writeStream.on('error', reject);
    });
    fileWrites.push(promise);
  });

  busboy.on('close', async () => {
    await Promise.all(fileWrites);

    form.append('taskId', fields['taskId']);
    const uploadedImage = fs.readFileSync(uploadedFilePath); 
    const resizedImagePaths = await _generateResizedImages(uploadedImage, uploadedFilePath, form);
    
    // This fetch should send the resized images to the api
    fetch(`${API_URL}/task/resized-images`, { method: 'POST', body: form })
    .then(() => {
      fs.unlinkSync(uploadedFilePath);
      for(let resizedImagePath of resizedImagePaths) {
        fs.unlinkSync(resizedImagePath);
      }
      res.status(201).send();
    })
    .catch((err) => {
      console.error('error sending resized images', { err });
      fs.unlinkSync(uploadedFilePath);
      for(let resizedImagePath of resizedImagePaths) {
        fs.unlinkSync(resizedImagePath);
      }
      res.status(500).send();
    });   
  });

  busboy.end(req.rawBody);
};