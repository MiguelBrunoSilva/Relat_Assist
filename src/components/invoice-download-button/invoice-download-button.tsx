import { FC, useCallback, useEffect, useMemo } from 'react';

// React Pdf.
import { Document, Page, Text, usePDF } from '@react-pdf/renderer';

// Mui components.
import { Box, Button, IconButton, Typography } from '@mui/material';

// Context.
import { generatorContext } from '../../context/generator-context';

// Faker
// import { faker } from '@faker-js/faker';

// Components.
import { InvoicePdf } from '../invoices';
// import { StyledButton } from '../../components/base';

/** Mui icons. */
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

// date fns
import { format } from 'date-fns';
// Interfaces.
import { useAppSelector } from '../../store';
import { IInvoice } from '../../interfaces/invoice';
import { ISetInvoice } from '../../store/invoice/invoice-actions';
import { useInvoice } from '../../hooks';
import { ArrowDownward } from '@mui/icons-material';
import { wait } from '@testing-library/user-event/dist/utils';

interface PdfDocumentProps {
  invoice: IInvoice;
}
const PdfDocument: FC<PdfDocumentProps> = ({ invoice }) => <InvoicePdf invoice={invoice} />;


const BUTTON_SIZE = 50;

interface Props {
  setInvoice: (invoice: IInvoice) => ISetInvoice;
}
const InvoiceDownloadButton: FC<Props> = ({ setInvoice }) => {
  const { invoice_data: persistedInvoice } = useAppSelector((state) => state.invoice);
  const { invoice } = useInvoice();

  const [pdfInstance, updatePdfInstance] = usePDF({
    document: persistedInvoice ? (
      <PdfDocument invoice={invoice} />
    ) : (
      <Document>
        <Page>
          <Text>Opss...</Text>
        </Page>
      </Document>
    ),
  });
 
  useEffect(() => {
    const intervalAutoSaveInvoice = setInterval(() => {
      setInvoice(invoice);
      updatePdfInstance(<PdfDocument invoice={invoice} />);
    }, 2000);
    return () => clearInterval(intervalAutoSaveInvoice);
  }, [invoice]);

  const handleDownloadPdf = (): void => {    

    setInvoice(invoice);

    wait(5000);

    updatePdfInstance(<PdfDocument invoice={invoice} />);

    wait(5000);

    fetch(String(pdfInstance.url), {
      method: 'GET',
      headers: { 'Content-Type': pdfInstance.blob?.type || 'application/pdf' },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;

        const invoiceFileName = persistedInvoice.fileName
          ? `${persistedInvoice.fileName}_${format(new Date(persistedInvoice.date), 'dd/MM/yyyy')} + .pdf`
          : `invoice_${format(new Date(persistedInvoice.date), 'dd/MM/yyyy')}.pdf`;

        // Set attribute link download
        link.setAttribute('download', invoiceFileName);

        // Append link to the element;
        document.body.appendChild(link);

        // Finally download file.
        link.click();

        // Clean up and remove it from dom
        link.parentNode?.removeChild(link);
      });
  };
  /** Set persisted invoice */
  useEffect(() => {
    if (!persistedInvoice) setInvoice(invoice);
  }, [persistedInvoice]);

  return (
    <generatorContext.Provider value={{ editable: false, debug: true }}>
      <Box
        sx={{
          ml: 0, flex: 1, position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        flexDirection: 'column',        
        // zIndex: 2,
        top: -BUTTON_SIZE-100,
        }}
      >
        {!pdfInstance.error ? (
          !pdfInstance.loading && (
            <div>
            <IconButton
              sx={{
                backgroundColor: 'secondary.main',
                border: '3px solid #fff',
                height: BUTTON_SIZE,
                width: BUTTON_SIZE,
                borderRadius: `${BUTTON_SIZE}px`,
                transition: (theme) => theme.transitions.create(['width']),
                textAlign: 'center',
                overflow: 'hidden',
                '& .MuiTypography-root': {
                  transform: 'translateX(150px)',
                  transition: (theme) => theme.transitions.create(['transform', 'width']),
                  fontSize: 0,
                },
                '&:hover': {
                  backgroundColor: 'secondary.main',
                  width: 180,
                  '& .MuiTypography-root': {
                    transform: 'translateX(0px)',
                    fontSize: 13,
                  },
                  '& svg': {
                    mr: 2,
                  },
                },
              }}
              onClick={handleDownloadPdf}
            >
              <DownloadIcon sx={{ color: 'secondary.contrastText', fontSize: 26 }} />
              <Typography sx={{ color: 'secondary.contrastText', fontWeight: 'bold' }}>Download PDF</Typography>
            </IconButton>
            <br></br>
            <br></br>
            <IconButton
              sx={{
                backgroundColor: '#7fa91b',
                border: '3px solid #fff',
                height: BUTTON_SIZE,
                width: BUTTON_SIZE,
                borderRadius: `${BUTTON_SIZE}px`,
                transition: (theme) => theme.transitions.create(['width']),
                textAlign: 'center',
                overflow: 'hidden',
                '& .MuiTypography-root': {
                  transform: 'translateX(150px)',
                  transition: (theme) => theme.transitions.create(['transform', 'width']),
                  fontSize: 0,
                },
                '&:hover': {
                  backgroundColor: '#7fa91b',
                  width: 180,
                  '& .MuiTypography-root': {
                    transform: 'translateX(0px)',
                    fontSize: 13,
                  },
                  '& svg': {
                    mr: 2,
                  },
                },
              }}
              onClick={handleDownloadPdf}
            >
              <SendIcon sx={{ color: 'secondary.contrastText', fontSize: 26 }} />
              <Typography sx={{ color: 'secondary.contrastText', fontWeight: 'bold' }}>Enviar Registo</Typography>
            </IconButton>
            </div>
          )
        ) : (
          <Button color="error" startIcon={<CloseIcon />}>
            Erro 
            <br></br>
            {pdfInstance.error.toString()}
          </Button>
        )}
      </Box>
    </generatorContext.Provider>
  );
};

export default InvoiceDownloadButton;
