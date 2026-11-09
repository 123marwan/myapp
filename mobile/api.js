import axios from "axios";
import { API_URL } from "./config";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export function getErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === "ECONNABORTED") return "انتهت مهلة الاتصال بالسيرفر";
  if (error?.request) {
    return "تعذر الاتصال بالسيرفر، تأكد أن السيرفر شغال والموبايل على نفس الشبكة";
  }
  return "حصل خطأ غير متوقع، حاول تاني";
}
