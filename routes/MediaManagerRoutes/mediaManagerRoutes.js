const express = require("express");
const router = express.Router();
const multer = require("multer");

// image upload folder
const uploadImg = multer({ dest: "uploads/images" });
const uploadVid = multer({ dest: "uploads/videos" });
const uploadDoc = multer({ dest: "uploads/docs" });
const uploadVo = multer({ dest: "uploads/voiceOvers" });
const uploadMu = multer({ dest: "uploads/musics" });

const {
  testMediaRoute,
  uploadImage,
  getImage,
  uploadVideo,
  uploadDocument,
  getVideo,
  getAllVideos,
  getAllImages,
  getAllDocs,
  deleteMediaFiles,
  getDoc,
  uploadVoiceOver,
  getAllVoiceOvers,
  getVoiceOver,
  getMusic,
  getAllMusics,
  uploadMusic,
} = require("../../controllers/MediaControllers/mediaController");

const {
  protect,
  admin,
  trainer,
  blogger,
  nutrist,
  shopManager,
} = require("../../middlewares/authMiddleware");

router.route("/").get(protect, testMediaRoute);

router.route("/get/videos/all").get(protect, getAllVideos);
router.route("/get/images/all").get(protect, getAllImages);
router.route("/get/docs/all").get(protect, getAllDocs);
router.route("/get/voiceOvers/all").get(protect, getAllVoiceOvers);
router.route("/get/musics/all").get(protect, getAllMusics);
// route to upload image to s3
router
  .route("/uploadImage")
  .post(protect, admin, uploadImg.single("image"), uploadImage);
// route to upload video to s3
router
  .route("/uploadVideo")
  .post(protect, admin, uploadVid.single("video"), uploadVideo);
// route to upload docs to s3
router
  .route("/uploadDoc")
  .post(protect, admin, uploadDoc.single("doc"), uploadDocument);

// route to upload voiceOvers to s3
router
  .route("/uploadVoiceOver")
  .post(protect, admin, uploadVo.single("voiceOver"), uploadVoiceOver);

// route to upload music to s3
router
  .route("/uploadMusic")
  .post(protect, admin, uploadMu.single("music"), uploadMusic);

// route to get image from s3
router.route("/getImage/:key").get(getImage);
// route to get videos from s3
router.route("/getVideo/:key").get(getVideo);
// route to get docu from s3
router.route("/getDoc/:key").get(getDoc);
// route to get voiceOver from s3
router.route("/getVoiceOver/:key").get(getVoiceOver);
// route to get music from s3
router.route("/getMusic/:key").get(getMusic);

// route to delete files from s3
router.route("/files").delete(protect, admin, deleteMediaFiles);

module.exports = router;
