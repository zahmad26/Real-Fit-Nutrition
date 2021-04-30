const asyncHandler = require("express-async-handler");
const { uploadFile, getFile, deleteFile } = require("../../config/s3");
const fs = require("fs");
const util = require("util");
const unLinkFile = util.promisify(fs.unlink);
const MediaFiles = require("../../models/MediaManagerModels/mediaFileModel");
const { Mongoose } = require("mongoose");

// @desc    test route
// @route   get /api/media/test
// @access  private
const testMediaRoute = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  res.status(200).json({ message: "test success" });
});

// @desc    get image
// @route   get /api/media/getImage
// @access  Private
const getImage = asyncHandler(async (req, res, next) => {
  try {
    const key = req.params.key;
    const readStream = getFile(key);
    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc    upload image
// @route   post /api/media/uploadImage
// @access  Private
const uploadImage = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    const user = req.user;
    console.log(file);
    console.log(user);
    const results = await uploadFile(file);
    await unLinkFile(file.path);
    const f = await MediaFiles.create({
      user: user._id,
      filename: file.originalname,
      filelink: `/media/getImage/${results.Key}`,
      foldername: "images",
    });
    res.status(200).json({ file: f, message: "sucess" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc    upload music
// @route   post /api/media/uploadMusic
// @access  Private
const uploadMusic = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    const user = req.user;
    console.log(file);
    console.log(user);
    const results = await uploadFile(file);
    await unLinkFile(file.path);
    const f = await MediaFiles.create({
      user: user._id,
      filename: file.originalname,
      filelink: `/media/getMusic/${results.Key}`,
      foldername: "musics",
    });
    res.status(200).json({ file: f, message: "sucess" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

const uploadDocument = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    const user = req.user;
    const results = await uploadFile(file);
    await unLinkFile(file.path);
    const f = await MediaFiles.create({
      user: user._id,
      filename: file.originalname,
      filelink: `/media/getDoc/${results.Key}`,
      foldername: "docs",
    });
    res.status(200).json({ file: f, message: "sucess" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc    get document
// @route   get /api/media/getDoc
// @access  Private
const getDoc = asyncHandler(async (req, res, next) => {
  try {
    const key = req.params.key;
    const readStream = getFile(key);

    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc    get music
// @route   get /api/media/getMusic
// @access  Private
const getMusic = asyncHandler(async (req, res, next) => {
  try {
    const key = req.params.key;
    const readStream = getFile(key);

    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc    get video
// @route   get /api/media/getVideo
// @access  Private
const getVideo = asyncHandler(async (req, res, next) => {
  try {
    const key = req.params.key;
    const readStream = getFile(key);

    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc    get voice over
// @route   get /api/media/voiceOver
// @access  Private
const getVoiceOver = asyncHandler(async (req, res, next) => {
  try {
    const key = req.params.key;
    const readStream = getFile(key);

    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc    upload video
// @route   post /api/media/uploadVideo
// @access  Private
const uploadVideo = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    const user = req.user;
    const results = await uploadFile(file);

    await unLinkFile(file.path);
    console.log(results);
    const f = await MediaFiles.create({
      user: user._id,
      filename: file.originalname,
      filelink: `/media/getVideo/${results.Key}`,
      foldername: "videos",
    });
    console.log(f);
    res.status(200).json({ file: f, message: "sucess" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc    upload voice over
// @route   post /api/media/uploadVoiceOver
// @access  Private
const uploadVoiceOver = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    const user = req.user;
    const results = await uploadFile(file);

    await unLinkFile(file.path);
    console.log(results);
    const f = await MediaFiles.create({
      user: user._id,
      filename: file.originalname,
      filelink: `/media/getVoiceOver/${results.Key}`,
      foldername: "voiceOvers",
    });
    console.log(f);
    res.status(200).json({ file: f, message: "sucess" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc   get all vides
// @route   get /api/media/get/videos/all
// @access  private
const getAllVideos = asyncHandler(async (req, res, next) => {
  try {
    const files = await MediaFiles.find({ foldername: "videos" });
    res.status(200).json({ videos: files });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc   get all musics
// @route   get /api/media/get/musics/all
// @access  private
const getAllMusics = asyncHandler(async (req, res, next) => {
  try {
    const files = await MediaFiles.find({ foldername: "musics" });
    res.status(200).json({ musics: files });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc   get all images
// @route   get /api/media/get/images/all
// @access  private
const getAllImages = asyncHandler(async (req, res, next) => {
  try {
    const files = await MediaFiles.find({ foldername: "images" });
    res.status(200).json({ images: files });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route   get api/media/get/docs/all
// @access  private
const getAllDocs = asyncHandler(async (req, res, next) => {
  try {
    const files = await MediaFiles.find({ foldername: "docs" });
    res.status(200).json({ docs: files });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route   get api/media/get/voiceOvers/alll
// @access  private
const getAllVoiceOvers = asyncHandler(async (req, res, next) => {
  try {
    const files = await MediaFiles.find({ foldername: "voiceOvers" });
    res.status(200).json({ voiceOvers: files });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @desc   delete files from s3 and databases
// @route   dete /files
// @access  private
const deleteMediaFiles = asyncHandler(async (req, res, next) => {
  try {
    const files = req.body;

    files &&
      files.map(async (f) => {
        const a = await MediaFiles.deleteOne({ _id: f.id });
        var parts = f.link.split("/");
        var id = parts[parts.length - 1];
        const res = await deleteFile(id);
      });

    res.status(200).send({ status: "success", deleted: req.body });
    //   res.status(200).json({ images: files });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
module.exports = {
  testMediaRoute,
  uploadImage,
  uploadVideo,
  getImage,
  getVideo,
  getAllVideos,
  getAllImages,
  deleteMediaFiles,
  getAllDocs,
  uploadDocument,
  getDoc,
  getAllVoiceOvers,
  uploadVoiceOver,
  getVoiceOver,
  getMusic,
  getAllMusics,
  uploadMusic,
};
