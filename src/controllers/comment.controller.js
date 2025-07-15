import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  // 1. Validate videoId parameter
  // 2. Parse and validate pagination parameters (page, limit)
  // 3. Query the Comment model for comments matching the videoId
  // 4. Apply pagination (skip, limit)
  // 5. Optionally, sort comments (e.g., by createdAt descending)
  // 6. Count total comments for the video
  // 7. Return comments and pagination info in the response
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export { addComment, deleteComment, getVideoComments, updateComment };
