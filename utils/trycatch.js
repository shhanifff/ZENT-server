export const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (err) {
    console.error(`Error found: ${err}`);
    if (!res.headersSent) {
      // Check if response is already sent
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
};
