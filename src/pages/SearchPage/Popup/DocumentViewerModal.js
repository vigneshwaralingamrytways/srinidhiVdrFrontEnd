import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import {
  Popupcard,
  PopupSimpleCard,
  Button,
  classes
} from "../../../Components/CommonImports/CommonImports";

const DocumentViewerModal = ({
  fileUrl,
  fileType,
  fileName,
  onClose,
  onDownload
}) => {

  console.log("DocumentViewerModal loaded");
  console.log("File URL:", fileUrl);
  console.log("File Type:", fileType);

  // ? Normalize file type
  const getViewerType = (type) => {
    if (!type) return "pdf";

    const t = type.toLowerCase();

    if (t === "pdf") return "pdf";
    if (["jpg", "jpeg", "png"].includes(t)) return "image";
    if (["doc", "docx"].includes(t)) return "docx";
    if (["xls", "xlsx"].includes(t)) return "xlsx";
    if (["txt"].includes(t)) return "txt";

    return "pdf"; // fallback
  };

  const docs = [
    {
      uri: fileUrl,
      fileType: getViewerType(fileType),
      fileName: fileName
    }
  ];

  return (
    <div className={classes.container}>
      <Popupcard title={fileName || "Document Viewer"}>

        {/* HEADER ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginBottom: "10px"
          }}
        >
          <Button onClick={onDownload} variant="success">
            Download
          </Button>

          {/* <Button onClick={onClose} variant="danger">
            Close
          </Button> */}
        </div>

        {/* VIEWER */}
        <PopupSimpleCard>
          <div style={{ height: "75vh" }}>
            <DocViewer
              key={fileUrl} // ? force re-render
              documents={docs}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: {
                  disableHeader: true
                }
              }}
              style={{ height: "100%" }}
            />
          </div>
        </PopupSimpleCard>

      </Popupcard>
    </div>
  );
};

export default DocumentViewerModal;