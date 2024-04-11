import fs from 'fs';

const deleteFiles = (files:UploadedFile | UploadedFile[]) => {
  // @ts-ignore
  const dirname:string = global.dirname;
  if (Array.isArray(files)) {
    files.forEach((file) => {
      fs.unlink(`${dirname}/files/${file.fileName}`, () => { });
      return null;
    });
  } else {
    fs.unlink(`${dirname}/files/${files.fileName}`, () => { });
  }
};

export default deleteFiles;
