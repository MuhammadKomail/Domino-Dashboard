import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import HistoryTable from './HistoryTable';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const HistoryPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleBack = () => {
    const params = new URLSearchParams(searchParams as any);
    params.delete('view');
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(url);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Button size="small" startIcon={<ArrowBackIcon />} onClick={handleBack}>Back</Button>
      </Box>
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #EAECF0', backgroundColor: '#fff' }}>
        <HistoryTable />
      </Paper>
    </Box>
  );
};

export default HistoryPage;
