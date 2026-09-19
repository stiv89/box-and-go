export const USER_ERROR_GENERIC = "Something went wrong. Please try again.";
export const USER_ERROR_UPLOAD = "We couldn’t use that file. Please try a PNG or JPG under 2 MB.";
export const USER_ERROR_EXPORT = "Export failed. Please try again.";
export const USER_ERROR_SHARE = "We couldn’t share that box. Please try again.";
export const USER_ERROR_QUOTE = "We couldn’t save this quote request. Please try again.";
export const USER_ERROR_SHARE_LINK = "This share link isn’t valid. Starting from your current box.";
export const USER_ERROR_BOX_FULL = "Your box is full. Remove a piece or clear the box to add more.";
export const USER_ERROR_PAYMENT = "Payment isn’t connected. Request a quote instead.";

export function toUserFacingError(error: unknown, fallback = USER_ERROR_GENERIC): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes("logo") || message.includes("image") || message.includes("file")) {
      return USER_ERROR_UPLOAD;
    }
    if (
      message.includes("export") ||
      message.includes("download") ||
      message.includes("print") ||
      message.includes("pdf")
    ) {
      return USER_ERROR_EXPORT;
    }
  }
  return fallback;
}
