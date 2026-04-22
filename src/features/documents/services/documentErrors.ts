import axios from "axios";

export type ApiErrorPayload = {
  success?: false;
  error_code?: string;
  message?: string;
  detail?: string;
  context?: Record<string, unknown>;
};

export function getDocumentErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;

    switch (payload?.error_code) {
      case "FILE_MISSING":
        return "Debes seleccionar un archivo antes de subirlo.";

      case "INVALID_FILE_TYPE":
        return "Solo puedes subir archivos PDF, XLSX, XLS o CSV.";

      case "FILE_TOO_LARGE":
        return payload.detail ?? "El archivo supera el tamaño máximo permitido.";

      case "DOCUMENT_ALREADY_EXISTS":
        return payload.detail ?? "Este archivo ya fue cargado anteriormente.";

      case "DOCUMENT_NOT_FOUND":
        return payload.message ?? "No encontramos el documento solicitado.";

      case "UNSUPPORTED_DOCUMENT_FORMAT":
        return payload.message ?? "No pudimos reconocer el formato de esta cartola.";

      case "DOCUMENT_PROCESSING_FAILED":
        return payload.message ?? "El archivo se cargó, pero falló su procesamiento.";

      case "INTERNAL_SERVER_ERROR":
        return "Ocurrió un error interno del servidor. Intenta nuevamente.";

      default:
        return payload?.message || payload?.detail || "Ocurrió un error inesperado.";
    }
  }

  return "Ocurrió un error inesperado.";
}