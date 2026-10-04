import PDFParser from "pdf2json";

const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (error) => {
      console.error("PDF parsing error:", error.parserError);
      reject(error.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        let text = "";

        if (pdfData.Pages) {
          pdfData.Pages.forEach((page) => {
            if (page.Texts) {
              page.Texts.forEach((textItem) => {
                if (textItem.R && textItem.R.length > 0) {
                  textItem.R.forEach((r) => {
                    if (r.T) {
                      // DO NOT use decodeURIComponent()
                      text += r.T + " ";
                    }
                  });
                }
              });
            }

            text += "\n";
          });
        }

        text = text.trim();

        resolve(text);
      } catch (error) {
        console.error("Text extraction error:", error);
        reject(error);
      }
    });

    pdfParser.loadPDF(filePath);
  });
};

export default extractTextFromPDF;
