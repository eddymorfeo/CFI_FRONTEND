import { apiClient } from "../../../lib/axios";
import type {
  ProcessDocumentResponse,
  SourceDocument,
  SourceDocumentDetail,
} from "../types/documentTypes";

export async function uploadDocument(file: File): Promise<SourceDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<SourceDocument>("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getDocuments(): Promise<SourceDocument[]> {
  const response = await apiClient.get<SourceDocument[]>("/documents");
  return response.data;
}

export async function getDocumentById(sourceDocumentId: string): Promise<SourceDocumentDetail> {
  const response = await apiClient.get<SourceDocumentDetail>(`/documents/${sourceDocumentId}`);
  return response.data;
}

export async function processDocument(
  sourceDocumentId: string,
): Promise<ProcessDocumentResponse> {
  const response = await apiClient.post<ProcessDocumentResponse>(
    `/documents/${sourceDocumentId}/process`,
  );
  return response.data;
}

export async function deleteDocument(sourceDocumentId: string): Promise<void> {
  await apiClient.delete(`/documents/${sourceDocumentId}`);
}

export function exportCartolaBancaria(sourceDocumentId: string): string {
  return `${apiClient.defaults.baseURL}/documents/${sourceDocumentId}/export/cartola-bancaria`;
}