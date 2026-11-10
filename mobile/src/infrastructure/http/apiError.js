export function getApiErrorMessage(error, fallback = "حصل خطأ غير متوقع، حاول تاني") {
  const serverMessage = error?.response?.data?.message;
  if (typeof serverMessage === "string" && serverMessage.trim()) {
    return serverMessage;
  }

  if (error?.code === "ECONNABORTED") {
    return "انتهت مهلة الاتصال بالسيرفر";
  }

  if (error?.request || error?.message === "Network Error") {
    return "تعذر الاتصال بالسيرفر، تأكد أن السيرفر شغال والموبايل على نفس الشبكة";
  }

  return fallback;
}

export function isUnauthorizedError(error) {
  return error?.response?.status === 401;
}