import ffmpeg from "fluent-ffmpeg";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoDuration = (path) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration); // in seconds
    });
  });
};

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const existedUser = await User.findById(userId);
  if (!existedUser) {
    throw new ApiError(404, "User not found");
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const user = await User.aggregate([
    // find the user first
    {
      $match: {
        _id: new mongoose.Schema.Types.ObjectId(userId),
      },
    },
    // Lookup users videos
    {
      $lookup: {
        from: "videos",
        localFeild: "_id",
        foreignFeild: "owner",
        as: "videos",
      },
    },
    {
      $unwind: $videos,
    },
    /*
    Separate the videos like ..

    {
      _id: "userId",
      videos: [video1, video2]
    }

    After Using $unwind

    { _id: "userId", videos: video1 }
    { _id: "userId", videos: video2 }

    */
    {
      $match: query ? { "videos.title": { $regex: query, $options: "i" } } : {},
    },
    // sortBy Time
    {
      $sort: {
        [`videos.${sortBy}`]: sortType === "asc" ? 1 : -1,
      },
    },
    // Pagination — skip and limit
    { $skip: (pageNumber - 1) * limitNumber },
    { $limit: limitNumber },
    // Group videos back into an array
    {
      $group: {
        _id: "$_id", // Group by the user’s _id (or the original document's _id)
        videos: { $push: "$videos" }, // Push each video document back into a new 'videos' array
      },
    },
  ]);

  const videos = user.length !== 0 ? user[0]?.videos : [];

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videos, currentPage: pageNumber, totalVideos: videos.length },
        "Videos Fetched Successfully"
      )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const videoPath = req.files?.video?.[0]?.path;
  const thumbnailPath = req.files?.thumbnail?.[0]?.path;

  if (!videoPath || !thumbnailPath) {
    throw new ApiError(400, "Video and thumbnail are required");
  }

  const duration = await getVideoDuration(videoPath);

  const uploadedVideo = await uploadOnCloudinary(videoPath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);

  if (!uploadedVideo?.url || !uploadedThumbnail?.url) {
    throw new ApiError(500, "Upload failed");
  }

  const video = await Video.create({
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    title,
    description,
    duration,
    isPublished: true,
    owner: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res.status(200).json(new ApiResponse(200, video, "VideoId is Valid"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const { title, description } = req.body;
  const thumbnail = req.file?.path;

  if (!title || !description || !thumbnail) {
    throw new ApiError(400, "Title, thumbnail, and description are required");
  }

  // Upload new thumbnail to Cloudinary
  const newThumbnail = await uploadOnCloudinary(thumbnail);

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: newThumbnail?.url,
      },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(404, "Video not found or already deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted succesfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `Video ${video.isPublished ? "published" : "unpublished"} successfully`
      )
    );
});

export {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
};
