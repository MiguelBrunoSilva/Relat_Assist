import { ChangeEvent, FC } from 'react';

// Mui components.
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import MuiTypography from '@mui/material/Typography';

// Mui icons.
import CloseIcon from '@mui/icons-material/Close';

// Base components.
import { Box, Typography, EditableText } from '../../components/base';

// Hooks.
import { useGenerator } from '../../hooks/useGenerator';

// Utilities.
// import { formatRupiah } from '../../utils/currency';

// Interfaces
import { useInvoice } from '../../hooks';

// Utils
import { calculateAmount } from '../../utils/invoice';
import { ITempo } from '@/interfaces/tempo';
import EditableDatePicker from '../base/editable-date-picker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField } from '@mui/material';
import { DesktopDateTimePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import 'dayjs/locale/en-gb';


// dayjs.extend(utc);
// dayjs.extend(timezone);

// Styles.
const colStyles = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const textStyles = {
  marginLeft: '12px',
};

interface Props {
  item: ITempo;
  index: number;
  lastItem: boolean;
  onChange?: (index: number, property: keyof ITempo, value: Date|string) => void;
  dispatchAlert?: (item: ITempo) => void;
}

const IInvoiceLineItem: FC<Props> = ({ item, index, lastItem, onChange, dispatchAlert }) => {
  const { editable } = useGenerator();
  const { remove } = useInvoice();

  const handleChange1 = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if(onChange != undefined) onChange(index, e.target.name as keyof ITempo, e.target.value);
  };
  
  const handleChangeInicio = (d: string | null): void => {
    console.log(d)
    if(d != undefined && onChange != undefined)   onChange(index, "inicio" as keyof ITempo, new Date(d));
  };

  const handleChangeFim = (d: string | null): void => {
    console.log(d)
    if(d != undefined && onChange != undefined)   onChange(index, "fim" as keyof ITempo, new Date(d));
  };
     

  /**
   * Handle remove item.
   */
  const handleRemoveItem = (): void => { 
    remove(index);
    if(dispatchAlert != undefined) dispatchAlert(item);
  };

  return (
    
    <Box
      style={{
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        position: 'relative',
        borderBottomLeftRadius: lastItem ? 3 : 0,
        borderBottomRightRadius: lastItem ? 3 : 0,
        padding: editable ? '10px 18px' : '7px 16px',
        backgroundColor: index % 2 === 0 ? '#fff' : '#F6F9FC',
        '&:hover': {
          '& .remove-button': {
            transform: 'scale(1)',
          },
        },
      }}
    > 
    {/* <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale='de'> */}
      
      
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
      <Box style={{ width: '40%', ...colStyles }}>
        <EditableText
          name="nota"
          multiline
          minRows={1}
          maxRows={3}
          value={item.nota}
          onChange={handleChange1}
        />
      </Box>
      <Box style={{ width: '30%', ...colStyles }}>
        <DesktopDateTimePicker
          value={item.inicio}         
          ampm={false}
          onChange={(newValue) => handleChangeInicio(newValue)}
        /> 
      </Box>
      <Box style={{ width: '30%', ...colStyles }}>
      <DesktopDateTimePicker
          value={item.fim}         
          ampm={false}
          onChange={(newValue) => handleChangeFim(newValue)}
        /> 
      </Box>

      {editable && (
        <Fab
          onClick={handleRemoveItem}
          size="small"
          color="error"
          className="remove-button"
          sx={{
            minHeight: 26,
            height: 26,
            width: 26,
            position: 'absolute',
            top: 10,
            right: -12,
            transform: 'scale(0)',
            borderRadius: '20px',
            transition: (theme) => theme.transitions.create(['transform', 'width']),
            '&:hover': {
              width: 85,
              '& h6': {
                display: 'inline-flex',
                transform: 'scale(1)',
              },
            },
          }}
        >
          {/* Remove button */}
          <Tooltip title="Remove item" placement="top">
            <>
              <CloseIcon sx={{ fontSize: 20 }} />
              <MuiTypography
                sx={{ transform: 'scale(0)', display: 'none', textTransform: 'capitalize', ml: 0.5 }}
                variant="subtitle2"
              >
                Remover
              </MuiTypography>
            </>
          </Tooltip>
        </Fab>
      )}
      </LocalizationProvider>
    </Box>
  );
};

export default IInvoiceLineItem;
