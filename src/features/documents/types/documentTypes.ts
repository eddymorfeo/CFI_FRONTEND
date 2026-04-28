export interface SourceDocument {
  source_document_id: string;
  original_file_name: string;
  stored_file_name: string;
  file_path: string;
  file_extension: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  uploaded_at: string;
  processing_status: string;
  review_status: string;
  source_origin: string;
  extracted_movements_count: number;
  detected_institution_name?: string | null;
  detected_document_group?: string | null;
  detected_document_type?: string | null;
}

export interface SourceDocumentDetail extends SourceDocument {
  detected_holder_name?: string | null;
  detected_account_number?: string | null;
  document_date_from?: string | null;
  document_date_to?: string | null;
}

export interface ProcessDocumentResponse {
  source_document_id: string;
  parser_code: string;
  movements_count: number;
  status: string;
}
