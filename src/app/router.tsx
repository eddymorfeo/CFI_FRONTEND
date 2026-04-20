import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/appLayout";
import { DocumentDetailPage } from "../features/documents/pages/documentDetailPage";
import { DocumentsPage } from "../features/documents/pages/documentsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <DocumentsPage />
      </AppLayout>
    ),
  },
  {
    path: "/documents/:sourceDocumentId",
    element: (
      <AppLayout>
        <DocumentDetailPage />
      </AppLayout>
    ),
  },
]);